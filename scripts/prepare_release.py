#!/usr/bin/env python3
"""Prepare static staging/production copies with Python 3.9+; never deploy them."""
import argparse
import hashlib
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.parse import quote, unquote, urljoin, urlsplit, urlunsplit
import xml.etree.ElementTree as ET
import zipfile

if sys.version_info < (3, 9):
    sys.exit("Python 3.9+ is required for release packaging; no files changed.")

ROOT = Path(__file__).resolve().parents[1]
PRODUCTION = "https://wash-bar.com.au"
STAGING = "https://washbarlaundromat.netlify.app"
ROUTES = (
    "index.html", "our-story/index.html",
    "locations/north-melbourne/index.html", "locations/flemington/index.html",
    "locations/west-melbourne/index.html", "locations/fitzroy/index.html",
    "locations/ascot-vale/index.html", "locations/east-windsor/index.html",
    "blog/index.html", "blog/how-to-remove-common-laundry-stains/index.html",
    "blog/self-service-vs-wash-and-fold/index.html",
    "blog/airbnb-laundry-turnover-guide/index.html",
    "blog/how-often-to-wash-sheets-towels-gym-clothes/index.html",
)
API = tuple("api/" + name for name in (
    "enquiry.php", "enquiry-config.php", "enquiry-service.php", "enquiry-smtp.php",
))
STATIC = ("style.css", "script.js")
TOOL_INPUTS = (
    "scripts/prepare_release.py", "scripts/deploy_production.py", "scripts/deploy-production.sh", ".cpanel.yml",
    "config/production-apache.conf", "tests/enquiry-service-test.php",
    "docs/enquiry-config.example.php",
)


class ReleaseError(ValueError):
    pass


def digest(data):
    return hashlib.sha256(data).hexdigest()


def source_file(root, name):
    path = root / name
    if Path(name).is_absolute() or ".." in Path(name).parts:
        raise ReleaseError("Unsafe relative file name")
    for part in (path, *path.parents):
        if part == root:
            break
        if part.is_symlink():
            raise ReleaseError("Symlink is not a release input: " + name)
    if not path.is_file() or root not in path.resolve().parents:
        raise ReleaseError("Missing or unsafe release file: " + name)
    return path


def route_url(name, origin=PRODUCTION):
    return origin + "/" + name.removesuffix("index.html")


class Page(HTMLParser):
    """Locate semantic HTML tokens without reserializing approved page bodies."""
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.text = text
        self.lines = [0]
        for line in text.splitlines(keepends=True):
            self.lines.append(self.lines[-1] + len(line))
        self.tags, self.scripts, self.comments = [], [], []
        self.pending_script = None
        self.in_title = False
        self.title_parts = []
        self.titles = []
        self.head_end = None
        self.feed(text)
        self.close()

    def position(self):
        line, column = self.getpos()
        return self.lines[line - 1] + column

    def handle_starttag(self, tag, attrs):
        start = self.position()
        end = start + len(self.get_starttag_text())
        attrs = dict(attrs)
        self.tags.append((tag, attrs, start, end))
        if tag == "title":
            self.in_title = True
            self.title_parts = []
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.pending_script = end

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
            self.titles.append("".join(self.title_parts))
        if tag == "head":
            self.head_end = self.position()
        if tag == "script" and self.pending_script is not None:
            end = self.position()
            self.scripts.append((self.pending_script, end,
                                 json.loads(self.text[self.pending_script:end])))
            self.pending_script = None

    def handle_data(self, data):
        if self.in_title:
            self.title_parts.append(data)

    def handle_comment(self, data):
        if "REMOVE STAGING NOINDEX" in data:
            start = self.position()
            self.comments.append((start, self.text.index("-->", start) + 3))

    def metadata(self, key):
        return [a.get("content", "") for t, a, _, _ in self.tags
                if t == "meta" and (a.get("name") == key or a.get("property") == key)]


def production_url(value):
    if not isinstance(value, str):
        return value
    parts = urlsplit(value)
    if parts.hostname == urlsplit(STAGING).hostname:
        return urlunsplit(("https", "wash-bar.com.au", parts.path, parts.query, parts.fragment))
    if value.startswith("/") and not value.startswith("//"):
        return PRODUCTION + value
    return value


def schema_urls(value):
    if isinstance(value, dict):
        return {key: schema_urls(item) for key, item in value.items()}
    if isinstance(value, list):
        return [schema_urls(item) for item in value]
    return production_url(value)


def transform_page(text, name):
    page = Page(text)
    canonical = route_url(name)
    images = page.metadata("og:image")
    if page.head_end is None or len(page.metadata("robots")) != 1 or len(images) != 1:
        raise ReleaseError("Unexpected head structure: " + name)
    changes = []
    for tag, attrs, start, end in page.tags:
        if tag == "meta" and attrs.get("name") == "robots":
            changes.append((start, end, '<meta name="robots" content="index,follow" />'))
        elif tag == "meta" and attrs.get("property") == "og:url":
            changes.append((start, end, ""))
        elif tag == "link" and attrs.get("rel") == "canonical":
            changes.append((start, end, ""))
        elif tag == "meta" and attrs.get("content", "").startswith(STAGING + "/"):
            updated = dict(attrs, content=production_url(attrs["content"]))
            attributes = " ".join(f'{key}="{html.escape(value, quote=True)}"'
                                  for key, value in updated.items())
            changes.append((start, end, "<meta " + attributes + " />"))
    for start, end, data in page.scripts:
        data = schema_urls(data)
        entities = data if isinstance(data, list) else [data]
        for entity in entities:
            kind = entity.get("@type")
            if kind == "Organization":
                entity.update({"@id": PRODUCTION + "/#organization", "url": PRODUCTION + "/"})
            elif kind == "DryCleaningOrLaundry":
                entity.update({"@id": canonical + "#laundromat", "url": canonical,
                               "image": production_url(images[0])})
            elif kind == "BlogPosting":
                entity.update({"@id": canonical + "#article", "url": canonical,
                               "mainEntityOfPage": canonical})
                entity["publisher"]["@id"] = PRODUCTION + "/#organization"
            elif kind == "BreadcrumbList":
                entity["itemListElement"][-1].setdefault("item", canonical)
        changes.append((start, end, "\n" + json.dumps(data, indent=2, ensure_ascii=True) + "\n    "))
    changes.extend((start, end, "") for start, end in page.comments)
    changes.append((page.head_end, page.head_end,
                    f'<link rel="canonical" href="{canonical}" />\n    '
                    f'<meta property="og:url" content="{canonical}" />\n  '))
    for start, end, replacement in sorted(changes, reverse=True):
        text = text[:start] + replacement + text[end:]
    return text


def local_reference(value, name, root):
    parts = urlsplit(value)
    if parts.scheme in ("mailto", "tel", "data", "javascript"):
        return None
    if parts.netloc and parts.hostname not in (urlsplit(PRODUCTION).hostname, urlsplit(STAGING).hostname):
        return None
    base = urljoin(PRODUCTION + "/", name)
    absolute = urlsplit(urljoin(base, value))
    path = unquote(absolute.path).lstrip("/")
    if not path or path.endswith("/"):
        path += "index.html"
    if "\n" in path or "\r" in path or ".." in Path(path).parts:
        raise ReleaseError("Unsafe URL path")
    return path, unquote(absolute.fragment)


def collect_assets(root, pages):
    assets = set()
    for name, text in pages.items():
        for _, attrs, _, _ in Page(text).tags:
            values = [attrs[key] for key in ("src", "href", "content") if attrs.get(key)]
            if attrs.get("srcset"):
                values.extend(item.strip().split()[0] for item in attrs["srcset"].split(","))
            for value in values:
                reference = local_reference(value, name, root)
                if reference and reference[0].startswith("assets/"):
                    if Path(reference[0]).suffix.lower() not in (".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg", ".ico"):
                        raise ReleaseError("Unapproved asset file type: " + reference[0])
                    source_file(root, reference[0])
                    assets.add(reference[0])
    # Current galleries derive every image from HTML. Refuse an undeclared CSS/JS asset source.
    for name in STATIC:
        text = source_file(root, name).read_text()
        if "url(" in text or re.search(r"[\"'](?:\.?\.?/)?assets/", text):
            raise ReleaseError("Declare new CSS/JS asset references before packaging: " + name)
    return sorted(assets)


def validate_pages(pages, files, environment):
    titles, descriptions = set(), set()
    parsed = {name: Page(text) for name, text in pages.items()}
    for name, page in parsed.items():
        text = pages[name]
        title = page.titles
        description = page.metadata("description")
        if len(title) != 1 or len(description) != 1 or not description[0]:
            raise ReleaseError("Missing metadata: " + name)
        if title[0] in titles or description[0] in descriptions:
            raise ReleaseError("Duplicate metadata: " + name)
        titles.add(title[0]); descriptions.add(description[0])
        if sum(tag == "h1" for tag, _, _, _ in page.tags) != 1:
            raise ReleaseError("Expected one H1: " + name)
        ids = [attrs["id"] for _, attrs, _, _ in page.tags if "id" in attrs]
        if len(ids) != len(set(ids)):
            raise ReleaseError("Duplicate HTML ID: " + name)
        expected_robots = "index,follow" if environment == "production" else "noindex,follow"
        if page.metadata("robots") != [expected_robots]:
            raise ReleaseError("Incorrect index control: " + name)
        canonicals = [attrs.get("href") for tag, attrs, _, _ in page.tags
                      if tag == "link" and attrs.get("rel") == "canonical"]
        if environment == "production":
            if canonicals != [route_url(name)] or page.metadata("og:url") != [route_url(name)]:
                raise ReleaseError("Incorrect canonical/OG URL: " + name)
            if STAGING in text:
                raise ReleaseError("Staging origin in production HTML: " + name)
        elif canonicals:
            raise ReleaseError("Staging must not publish production canonicals")
        if "devald84@gmail.com" in text:
            raise ReleaseError("Internal CC address exposed in customer HTML")
        for tag, attrs, _, _ in page.tags:
            if tag == "img" and not all(key in attrs for key in ("alt", "width", "height")):
                raise ReleaseError("Missing image attributes: " + name)
            for key in ("aria-controls", "aria-labelledby", "aria-describedby"):
                if any(value not in ids for value in attrs.get(key, "").split()):
                    raise ReleaseError("Broken ARIA reference: " + name)
            for key in ("href", "src", "action"):
                if not attrs.get(key):
                    continue
                reference = local_reference(attrs[key], name, None)
                if not reference:
                    continue
                target, fragment = reference
                if target not in files:
                    # Static Netlify deliberately has no executable PHP endpoint.
                    if environment == "staging" and target in API:
                        continue
                    raise ReleaseError("Broken public reference: " + name + " -> " + target)
                if fragment and target in parsed:
                    target_ids = {a.get("id") for _, a, _, _ in parsed[target].tags}
                    if fragment not in target_ids:
                        raise ReleaseError("Broken fragment: " + name + " -> " + attrs[key])
        if name == "locations/east-windsor/index.html":
            for _, _, data in page.scripts:
                if data.get("@type") == "DryCleaningOrLaundry" and any(
                        key in data for key in ("telephone", "openingHours", "openingHoursSpecification")):
                    raise ReleaseError("Unconfirmed East Windsor facts")
    home = parsed["index.html"]
    forms = [a for t, a, _, _ in home.tags if t == "form"]
    if len(forms) != 1 or forms[0].get("action") != "api/enquiry.php" or forms[0].get("data-config") != "api/enquiry-config.php":
        raise ReleaseError("Form must use page-relative API URLs")


def package(root, output, environment):
    if environment not in ("staging", "production"):
        raise ReleaseError("Unknown release environment")
    root, output = Path(root).resolve(), Path(output).resolve()
    if output == root or output in root.parents or "public_html" in output.parts:
        raise ReleaseError("Never package directly into a source or hosting document root")
    if output.exists() and any(output.iterdir()):
        raise ReleaseError("Output must be new or empty; existing files are never deleted")
    template = source_file(root, "docs/enquiry-config.example.php").read_text()
    for key in ("smtp_password", "hash_secret"):
        if not re.search(r"['\"]" + key + r"['\"]\s*=>\s*(['\"])\1\s*,", template):
            raise ReleaseError("Repository config template contains a secret/nonempty value: " + key)
    for key in ("enabled", "smtp_confirmed"):
        if not re.search(r"['\"]" + key + r"['\"]\s*=>\s*false\s*,", template):
            raise ReleaseError("Repository config template must remain disabled: " + key)
    originals = {name: source_file(root, name).read_text() for name in ROUTES}
    assets = collect_assets(root, originals)
    names = list(ROUTES) + list(STATIC) + assets
    if environment == "production":
        names += list(API)
    pages = {name: transform_page(text, name) if environment == "production" else text
             for name, text in originals.items()}
    validate_pages(pages, set(names), environment)
    output.mkdir(parents=True, exist_ok=True)
    public = output / "public"
    public.mkdir()
    for name in names:
        target = public / name
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(pages[name].encode() if name in pages else source_file(root, name).read_bytes())
        target.chmod(0o644)
    robots = "User-agent: *\nAllow: /\n"
    if environment == "production":
        robots += "Disallow: /api/\nDisallow: /v4-enquiry-test/\nSitemap: " + PRODUCTION + "/sitemap.xml\n"
        ET.register_namespace("", "http://www.sitemaps.org/schemas/sitemap/0.9")
        sitemap = ET.Element("{http://www.sitemaps.org/schemas/sitemap/0.9}urlset")
        for name in ROUTES:
            item = ET.SubElement(sitemap, "url")
            ET.SubElement(item, "loc").text = route_url(name)
        (public / "sitemap.xml").write_bytes(ET.tostring(sitemap, encoding="utf-8", xml_declaration=True))
    else:
        (public / "_headers").write_text("/*\n  X-Robots-Tag: noindex, follow\n  X-Content-Type-Options: nosniff\n")
    (public / "robots.txt").write_text(robots)
    inputs = sorted(set(ROUTES + STATIC + API + TOOL_INPUTS + tuple(assets)))
    hashes = {name: digest(source_file(root, name).read_bytes()) for name in inputs}
    published = {str(path.relative_to(public)): digest(path.read_bytes())
                 for path in sorted(public.rglob("*")) if path.is_file()}
    manifest = {"environment": environment, "origin": PRODUCTION if environment == "production" else STAGING,
                "routes": list(ROUTES), "inputs": hashes, "files": published,
                "source_digest": digest(json.dumps(hashes, sort_keys=True).encode())}
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2, sort_keys=True) + "\n")
    if environment == "production":
        with zipfile.ZipFile(output / "production-public.zip", "w", zipfile.ZIP_DEFLATED) as archive:
            for name in sorted(published):
                info = zipfile.ZipInfo(name, date_time=(1980, 1, 1, 0, 0, 0))
                info.external_attr = 0o100644 << 16
                info.compress_type = zipfile.ZIP_DEFLATED
                archive.writestr(info, (public / name).read_bytes())
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--environment", choices=("staging", "production"), required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()
    manifest = package(ROOT, args.output, args.environment)
    print(json.dumps({"environment": args.environment, "routes": len(ROUTES),
                      "public_files": len(manifest["files"]), "source_digest": manifest["source_digest"],
                      "output": str(args.output.resolve()), "deployed": False}, indent=2))


if __name__ == "__main__":
    try:
        main()
    except (ReleaseError, OSError, json.JSONDecodeError) as error:
        sys.exit("Packaging stopped: " + str(error))
