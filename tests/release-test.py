#!/usr/bin/env python3
"""Release-only checks; no hosting writes, authentication or SMTP connections."""
import json
from pathlib import Path
import re
import sys
import tempfile
import unittest
import xml.etree.ElementTree as ET
import zipfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
import prepare_release as release
import deploy_production as deployment


class ReleaseTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temporary = tempfile.TemporaryDirectory(prefix="washbar-release-tests-")
        cls.directory = Path(cls.temporary.name)
        cls.source_hashes = {name: release.digest((ROOT / name).read_bytes()) for name in release.ROUTES}
        cls.production = cls.directory / "production"
        cls.staging = cls.directory / "staging"
        cls.prod = release.package(ROOT, cls.production, "production")
        cls.stage = release.package(ROOT, cls.staging, "staging")

    @classmethod
    def tearDownClass(cls):
        cls.temporary.cleanup()

    def test_all_routes_and_source_unchanged(self):
        self.assertEqual(len(self.prod["routes"]), 13)
        for name, expected in self.source_hashes.items():
            self.assertEqual(release.digest((ROOT / name).read_bytes()), expected)
            source = (ROOT / name).read_text()
            produced = (self.production / "public" / name).read_text()
            self.assertEqual(produced.split("<body>", 1)[1], source.split("<body>", 1)[1])

    def test_environment_metadata(self):
        for name in release.ROUTES:
            production = release.Page((self.production / "public" / name).read_text())
            staging = release.Page((self.staging / "public" / name).read_text())
            self.assertEqual(production.metadata("robots"), ["index,follow"])
            self.assertEqual(staging.metadata("robots"), ["noindex,follow"])
            self.assertEqual(production.metadata("og:url"), [release.route_url(name)])
            self.assertTrue(production.metadata("og:image")[0].startswith(release.PRODUCTION + "/assets/"))
            for _, _, schema in production.scripts:
                self.assertNotIn("netlify.app", json.dumps(schema))

    def test_allowlist_and_no_private_or_prototype_files(self):
        for name in self.prod["files"]:
            self.assertNotIn(name.split("/")[0], ("docs", "content", "tests", "scripts", ".git", "private"))
            self.assertNotIn("prototype", name)
            self.assertNotIn(name, ("README.md", "config.php", ".htaccess", ".cpanel.yml"))
        self.assertTrue(set(release.API).issubset(self.prod["files"]))
        self.assertFalse(set(release.API).intersection(self.stage["files"]))
        self.assertEqual(len([name for name in self.prod["files"] if name.startswith("assets/")]), 41)

    def test_canonical_sitemap_and_robots(self):
        xml = ET.parse(self.production / "public/sitemap.xml")
        urls = [node.text for node in xml.findall(".//{*}loc")]
        self.assertEqual(urls, [release.route_url(name) for name in release.ROUTES])
        self.assertIn(release.PRODUCTION + "/sitemap.xml", (self.production / "public/robots.txt").read_text())
        self.assertFalse((self.staging / "public/sitemap.xml").exists())
        self.assertIn("X-Robots-Tag: noindex, follow", (self.staging / "public/_headers").read_text())

    def test_location_facts_unchanged(self):
        for name in release.ROUTES:
            if not name.startswith("locations/"):
                continue
            before = next(data for _, _, data in release.Page((ROOT / name).read_text()).scripts
                          if data.get("@type") == "DryCleaningOrLaundry")
            after = next(data for _, _, data in release.Page((self.production / "public" / name).read_text()).scripts
                         if data.get("@type") == "DryCleaningOrLaundry")
            for key in before:
                self.assertEqual(after[key], before[key])
            if "east-windsor" in name:
                self.assertFalse(any(key in after for key in ("telephone", "openingHours", "openingHoursSpecification")))

    def test_reproducible_zip_and_checksums(self):
        other = self.directory / "production-again"
        again = release.package(ROOT, other, "production")
        self.assertEqual(again, self.prod)
        self.assertEqual((other / "production-public.zip").read_bytes(), (self.production / "production-public.zip").read_bytes())
        with zipfile.ZipFile(self.production / "production-public.zip") as archive:
            self.assertEqual(set(archive.namelist()), set(self.prod["files"]))
            for name, expected in self.prod["files"].items():
                self.assertEqual(release.digest(archive.read(name)), expected)

    def test_existing_output_and_unsafe_paths_rejected(self):
        with self.assertRaises(release.ReleaseError):
            release.package(ROOT, self.production, "production")
        with self.assertRaises(release.ReleaseError):
            release.package(ROOT, ROOT, "production")
        with self.assertRaises(release.ReleaseError):
            release.package(ROOT, self.directory / "public_html", "production")
        with self.assertRaises(release.ReleaseError):
            release.source_file(ROOT, "../outside.txt")

    def test_deployment_refuses_non_cpanel_checkout(self):
        # This is a refusal test, not a deployment or an approval simulation.
        with self.assertRaises(release.ReleaseError):
            deployment.preflight()

    def test_snapshot_requires_private_file_and_verified_checksum(self):
        with tempfile.TemporaryDirectory() as directory:
            backup = Path(directory) / "snapshot-test.tar.gz"
            backup.write_bytes(b"Local checksum fixture, not a real hosting backup or delivery test.")
            backup.chmod(0o600)
            approval = {"legacy_backup_path": str(backup),
                        "legacy_backup_sha256": release.digest(backup.read_bytes())}
            deployment.verify_backup(approval)
            for invalid in ("", "0" * 64):
                with self.assertRaises(release.ReleaseError):
                    deployment.verify_backup(dict(approval, legacy_backup_sha256=invalid))
            backup.write_bytes(b"Changed after verification")
            with self.assertRaises(release.ReleaseError):
                deployment.verify_backup(approval)
            backup.chmod(0o644)
            with self.assertRaises(release.ReleaseError):
                deployment.verify_backup(approval)

    def test_snapshot_rejects_missing_relative_and_symlink_paths(self):
        with tempfile.TemporaryDirectory() as directory:
            backup = Path(directory) / "snapshot.tar.gz"
            backup.write_bytes(b"Local refusal fixture")
            backup.chmod(0o600)
            link = Path(directory) / "link.tar.gz"
            link.symlink_to(backup)
            for invalid in ("", "relative.tar.gz", str(link), str(backup.parent / "missing.tar.gz")):
                with self.assertRaises(release.ReleaseError):
                    deployment.verify_backup({"legacy_backup_path": invalid})

    def test_approved_identity_and_private_paths(self):
        service = (ROOT / "api/enquiry-service.php").read_text()
        template = (ROOT / "docs/enquiry-config.example.php").read_text()
        self.assertIn("$config['smtp_host'] !== 'mail.wash-bar.com.au'", service)
        self.assertIn("$config['smtp_username'] !== 'info@wash-bar.com.au'", service)
        self.assertIn("'from' => 'info@wash-bar.com.au', 'to' => 'info@wash-bar.com.au'", service)
        self.assertNotIn("/washbarc/Private/", service + template)

    def test_scoped_apache_rules_preserve_legacy_inventory(self):
        text = (ROOT / "config/production-apache.conf").read_text()
        rules = [line for line in text.splitlines() if line.startswith("RewriteRule ")]
        skip = int(re.search(r"\[S=(\d+)\]", rules[0]).group(1))
        self.assertEqual(skip, len(rules) - 1, "Legacy bypass must skip only the managed V4 rules.")
        self.assertFalse(any(line.startswith("DirectoryIndex ") for line in text.splitlines()))
        self.assertIn("RewriteRule ^$ index.html [END]", text)
        preserved = next(line.split(" ", 2)[2] for line in text.splitlines()
                         if line.startswith("RewriteCond %{THE_REQUEST}") and "google4cba" in line)
        directories = (".well-known", "smart", "user", "preview-v2", "cgi-bin", "v4-enquiry-test")
        for name in directories + ("google4cba3a7518b65e43.html", "header.php", "footer.php"):
            self.assertIsNotNone(re.search(preserved, "GET /" + name + ("/child" if name in directories else "") + " HTTP/1.1"))
        self.assertIsNone(re.search(preserved, "GET /blog/ HTTP/1.1"))


if __name__ == "__main__":
    unittest.main(verbosity=2)
