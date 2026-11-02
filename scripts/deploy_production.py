#!/usr/bin/env python3
"""Guarded cPanel-only deployment. Do not execute during release preparation."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tarfile
import tempfile

from prepare_release import API, ROOT, ReleaseError, digest, package

REPOSITORY = Path("/home1/washbarc/repositories/WashbarV2")
DESTINATION = Path("/home1/washbarc/public_html")
PRIVATE = Path("/home1/washbarc/private/washbar-release")
PHP = Path("/usr/local/bin/ea-php83")


def run(arguments, cwd=ROOT):
    result = subprocess.run(arguments, cwd=cwd, capture_output=True, text=True)
    if result.returncode:
        # Never forward private configuration, provider responses or credentials.
        raise ReleaseError("Preflight command failed: " + Path(str(arguments[0])).name)
    return result.stdout.strip()


def private_file(path):
    if path.is_symlink() or not path.is_file() or path.stat().st_mode & 0o077:
        raise ReleaseError("Missing or non-private release approval input")
    if DESTINATION in path.resolve().parents:
        raise ReleaseError("Release approval inputs must be outside public_html")
    return path.read_bytes()


def destination_file(name):
    path = DESTINATION / name
    if Path(name).is_absolute() or ".." in Path(name).parts:
        raise ReleaseError("Unsafe deployment path")
    for item in (path, *path.parents):
        if item == DESTINATION:
            break
        if item.is_symlink():
            raise ReleaseError("Destination symlink blocks deployment: " + name)
    if path.exists() and not path.is_file():
        raise ReleaseError("Destination file/directory conflict: " + name)
    return path


def verify_backup(approval):
    backup = Path(approval.get("legacy_backup_path", ""))
    if not backup.is_absolute() or not backup.is_file() or backup.is_symlink() or not backup.stat().st_size:
        raise ReleaseError("A verified fresh server webroot snapshot must be retained")
    if DESTINATION in backup.resolve().parents or backup.stat().st_mode & 0o077:
        raise ReleaseError("Webroot snapshot must be private and outside public_html")
    expected = approval.get("legacy_backup_sha256", "")
    if not re.fullmatch(r"[a-f0-9]{64}", expected):
        raise ReleaseError("Approval must include the verified webroot snapshot SHA-256")
    checksum = hashlib.sha256()
    with backup.open("rb") as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b""):
            checksum.update(block)
    if checksum.hexdigest() != expected:
        raise ReleaseError("Webroot snapshot changed since its verification")


def preflight():
    if ROOT != REPOSITORY or ROOT.is_symlink() or DESTINATION.is_symlink():
        raise ReleaseError("Deployment is restricted to the approved cPanel repository and root")
    if not DESTINATION.is_dir() or run(["git", "branch", "--show-current"]) != "main":
        raise ReleaseError("Expected production document root and main branch")
    if run(["git", "status", "--porcelain"]):
        raise ReleaseError("cPanel Git working tree must be clean")
    commit = run(["git", "rev-parse", "HEAD"])
    approval = json.loads(private_file(PRIVATE / "approval.json"))
    if approval.get("commit") != commit or approval.get("smtp_identity") != "info@wash-bar.com.au":
        raise ReleaseError("Approval must name this exact commit and the new mailbox")
    expected_source = approval.get("source_digest", "")
    if not re.fullmatch(r"[a-f0-9]{64}", expected_source):
        raise ReleaseError("Approval must include the tested local manifest source_digest")
    if approval.get("cc") != "devald84@gmail.com" or not all(approval.get(key) is True for key in (
            "smtp_to_received", "smtp_cc_received", "reply_to_verified", "php_runtime_verified",
            "legacy_files_reviewed", "legacy_backup_verified", "production_indexability_reviewed")):
        raise ReleaseError("Fresh SMTP receipts, PHP, legacy audit and backup approval are required")
    verify_backup(approval)
    candidate = private_file(PRIVATE / "root.htaccess.approved")
    if digest(candidate) != approval.get("approved_root_htaccess_sha256"):
        raise ReleaseError("Reviewed root .htaccess does not match its approval hash")
    current = destination_file(".htaccess")
    current_hash = digest(current.read_bytes()) if current.exists() else "ABSENT"
    if current_hash != approval.get("existing_root_htaccess_sha256"):
        raise ReleaseError("Live .htaccess changed since review; stop and reconcile")
    fragment = (ROOT / "config/production-apache.conf").read_bytes().strip()
    if candidate.count(fragment) != 1:
        raise ReleaseError("Reviewed .htaccess must include the exact managed block")
    if not PHP.is_file():
        raise ReleaseError("Confirmed PHP 8.3 CLI path must be available before deployment")
    for name in API:
        run([str(PHP), "-d", "display_errors=0", "-d", "log_errors=0", "-l", name])
    run([str(PHP), "tests/enquiry-service-test.php"])
    # This readiness check does not authenticate or send. Receipt approval above is separate.
    check = (
        'ini_set("display_errors", "0"); ini_set("log_errors", "0"); '
        'try { $_SERVER["DOCUMENT_ROOT"]="/home1/washbarc/public_html"; '
        'require "api/enquiry-service.php"; $c=enquiryConfig(); '
        'if (!in_array("https://wash-bar.com.au", $c["allowed_origins"], true)) { exit(1); } '
        'new WashBarEnquiry($c); echo "ready"; } catch (Throwable $e) { exit(1); }'
    )
    if run([str(PHP), "-r", check]) != "ready":
        raise ReleaseError("Private new-mailbox configuration is not ready")
    return commit, candidate, expected_source


def install_file(source, target):
    missing = []
    parent = target.parent
    while not parent.exists():
        missing.append(parent)
        parent = parent.parent
    for directory in reversed(missing):
        directory.mkdir()
        directory.chmod(0o755)
    descriptor, temporary = tempfile.mkstemp(prefix=".washbar-", suffix=target.suffix, dir=target.parent)
    try:
        with os.fdopen(descriptor, "wb") as output:
            output.write(source.read_bytes())
            output.flush()
            os.fsync(output.fileno())
        os.chmod(temporary, 0o644)
        os.replace(temporary, target)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def deploy():
    os.umask(0o077)
    commit, htaccess, expected_source = preflight()  # No public write before every approval/check passes.
    candidate = Path(tempfile.mkdtemp(prefix="candidate-", dir=PRIVATE))
    manifest = package(ROOT, candidate, "production")
    if manifest["source_digest"] != expected_source:
        raise ReleaseError("cPanel source does not match the tested local production manifest")
    public = candidate / "public"
    (public / ".htaccess").write_bytes(htaccess)
    names = sorted(manifest["files"])
    names = [name for name in names if name != "index.html"] + ["index.html", ".htaccess"]
    targets = {name: destination_file(name) for name in names}
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    rollback = PRIVATE / ("rollback-" + timestamp + "-" + commit[:12])
    rollback.mkdir(mode=0o700)
    created = []
    with tarfile.open(rollback / "overwritten-files.tar.gz", "w:gz") as archive:
        for name, target in targets.items():
            if target.exists():
                archive.add(target, arcname=name, recursive=False)
            else:
                created.append(name)
    (rollback / "new-files.json").write_text(json.dumps(created, indent=2) + "\n")
    (rollback / "release-manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    # Consume approval before the first public write; reruns require a fresh review.
    (PRIVATE / "approval.json").rename(rollback / "approval.used.json")
    try:
        for name in names:
            install_file(public / name, targets[name])
        for name, expected in manifest["files"].items():
            if digest(targets[name].read_bytes()) != expected:
                raise ReleaseError("Post-copy checksum failure")
        if digest(targets[".htaccess"].read_bytes()) != digest(htaccess):
            raise ReleaseError("Post-copy server-configuration checksum failure")
    except Exception:
        raise ReleaseError("Cutover stopped. Restore reviewed overwritten files from " + str(rollback)) from None
    print(json.dumps({"deployed_commit": commit, "rollback": str(rollback),
                      "public_files": len(names), "next": "Run live route, redirect and real-form smoke tests"}, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--execute", action="store_true", help="cPanel only; also requires private commit-specific approval")
    args = parser.parse_args()
    if not args.execute:
        parser.error("No deployment without --execute and private approval. Preparation is not deployment.")
    try:
        deploy()
    except (ReleaseError, OSError, ValueError) as error:
        sys.exit("Deployment stopped: " + str(error))
