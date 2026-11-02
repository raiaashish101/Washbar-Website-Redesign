# LAUNCH-02: Production Release Preparation

## Current Method: File Manager

2 November: the owner approved a manual first launch through cPanel File Manager.
Use [FILE-MANAGER-LAUNCH.md](FILE-MANAGER-LAUNCH.md). The automation steps retained
below are deferred, not mandatory manual-launch gates. Terminal, server Python
and private approval.json are not required for this approved alternative.
Protected To/CC delivery and Reply-To passed by owner confirmation. The supplied
root .htaccess is reviewed; the fresh owner-supplied webroot ZIP passed local
integrity/coverage/recovery checks. The owner explicitly approved and completed
the File Manager cutover. Independent public checks confirm V4 pages/static hashes,
redirects and ready PHP; one real production enquiry remains pending. Automated
live visual/console checks were not completed because local Chrome could not start.
Do not click Deploy HEAD Commit; automation remains deferred.

Prepared 29 October 2026. **PREPARED LOCALLY / NO-GO FOR CUTOVER YET.**
No production deployment, Git commit/push, DNS, DMARC, mailbox reset or hosting
configuration change was performed. The old website remains live.

```text
CURRENT: old live website + protected SMTP test + uncommitted V4 source
PREPARED: info@ backend contract + separate staging/production packages
NEXT: host checks + root/backup review -> reviewed Git commit
      -> cPanel Update from Remote -> separate cutover approval -> Deploy HEAD Commit
```

## 1. Readiness and Evidence

| Item | Finding | Classification |
| --- | --- | --- |
| Existing live website | Legacy site still served at wash-bar.com.au | Runtime observed, read-only |
| New mailbox | 30 October: owner confirms the protected form enquiry reached info@ and Gmail CC, with correct customer Reply-To | Protected end-to-end delivery PASSED, owner-confirmed |
| Earlier protected SMTP test | Owner reports available:true and an actual submission with the former mailbox | Historical; not proof for info@ |
| Current unauthenticated protected API | HTTP 401 | Directory Privacy challenge observed; not a readiness result |
| V4 production package | 13 routes, 62 public files, 41 referenced assets (~9.3 MB) | Prepared, not deployed |
| Netlify | Current root is noindex,follow and still direct-contact-only, script v18 | Deployment drift; source form/script v22 remains authoritative |
| Netlify README | /README.md currently returns 200 | Existing exposure; new static publish allowlist excludes docs/PHP/prototypes |
| cPanel root contents | Supplied root .htaccess reviewed; fresh ZIP confirms known inventory and no new-release target conflicts in the snapshot | No live filesystem comparison; recheck just before cutover |
| Historical cPanel backup | Owner downloaded the 9 October archive; local gzip integrity and legacy webroot coverage passed | Confirmed disaster copy; not a fresh snapshot or restore rehearsal |
| Fresh current-webroot snapshot | 2 November: 35,545,372-byte ZIP passes CRC, known inventory, exact root-rule match and 92-file private recovery check | Passed locally; actual restore prefix public_html/; not a full server restore rehearsal |
| PHP 8.3 | Owner-confirmed; no local PHP executable | Host syntax/runtime tests still required |
| Web execution limit | Owner verified 60 seconds in final launch brief | Existing time gate passes; do not apply the conditional 30-second patch |

Final-launch execution follows [FINAL-LAUNCH.md](FINAL-LAUNCH.md). The configured
private password/hash must remain untouched. Protected service-file drift was
identified and readiness restored. The owner now confirms both actual new-mailbox
receipts and customer Reply-To; do not restart readiness/SMTP troubleshooting.
Host tests, complete root-rule review and fresh backup evidence remain required.

The current repository remains authoritative for business facts. Legacy HTML
was inspected only for routes, historical structure and migration compatibility.
No old prices, hours, phones, amenities or service claims were copied into V4.
No new Story/Community factual conflict was found; preserve the existing approval
reconciliation in CONTENT-STATUS.md rather than inventing a new content blocker.

## 2. Current Email Contract

| Setting | Required value |
| --- | --- |
| SMTP host | mail.wash-bar.com.au (hostname, NOT info@wash-bar.com.au) |
| Port / encryption | Integer 465 / ssl, PHPMailer implicit SMTPS |
| SMTP username | info@wash-bar.com.au |
| Fixed From / envelope sender / To | info@wash-bar.com.au |
| Fixed CC | devald84@gmail.com, backend only |
| Reply-To | Validated customer email/name only |
| Private config | /home1/washbarc/private/washbar-enquiry/config.php |
| PHPMailer | /home1/washbarc/private/washbar-enquiry/PHPMailer |
| Storage | /home1/washbarc/private/washbar-enquiry/storage |

The PHP bootstrap now explicitly checks the approved hostname and new username.
The old username is present only in a rejection fixture and historical notes.
The repository example has empty password/hash fields and disabled activation
flags. Its origin is https://wash-bar.com.au, with no slash or folder suffix.
Never copy an empty example over the configured private file.

Do not reset/modify the former mailbox or change mail authentication/DNS.
The code still has server validation, four allowed types, honeypot, locked-file
rate limits, request-size limits, safe formatting, TLS/name verification,
timeouts, duplicate/uncertain-submission guards and the Australian phone fallback.
No Resend, Turnstile, SQLite, mail() fallback or new analytics was added.

## 3. Protected SMTP Test (Owner-Confirmed Passed, 30 October)

The owner confirms the hosted form works, both info@ and Gmail received the
real enquiry, and Reply targets the customer's email. The procedure below is
retained as the record/retest method, not a request to repeat successful setup.

These are developer/operator actions, not tests already performed by Codex:

1. In cPanel Email Accounts, confirm info@wash-bar.com.au exists and can sign in.
   Enter its password privately. Never request/share it in chat or screenshots.
2. Update only the protected test's four public overlay files: index.html,
   style.css, script.js and api/enquiry-service.php. Keep its other three API
   files and Directory Privacy .htaccess. Remove the uploaded ZIP after extraction.
3. Edit the existing private config: username info@wash-bar.com.au, host
   mail.wash-bar.com.au, integer port 465, encryption ssl, real new-mailbox
   password, lowercase dependency/storage paths and approved origin. Preserve
   the current hash_secret and storage; do not clear prior acceptance/unknown records.
4. Keep config.php at 0600 and private directories/storage at 0700. Check PHP
   OpenSSL/json/hash, SSL transport, flock/fsync/rename and a finite web execution
   limit of at least 40 seconds. Set enabled/smtp_confirmed true only for this
   authorised protected attempt. These flags are not delivery evidence.
5. After authenticating, GET /v4-enquiry-test/api/enquiry-config.php. Require
   HTTP 200 and {"available":true}. GET /v4-enquiry-test/api/enquiry.php should
   return 405 / Allow: POST. Neither GET sends mail.
6. Reload /v4-enquiry-test/index.html#enquiry. The warning should hide and Send
   enquiry should enable only after readiness. Network requests must remain
   under /v4-enquiry-test/api/, never the production-root /api/.
7. Submit ONE fresh General enquiry, with your own name and an email you
   control. Leave phone blank. Use a unique message such as
   `LAUNCH-02 info@ SMTP test 2026-10-29 CURRENT-TIME - no customer action required`.
   Use the actual current time, not that literal placeholder. A fresh UUID AND
   distinct content avoid replaying the old test's stored acceptance.
8. Verify provider acceptance, actual To receipt at info@wash-bar.com.au,
   actual CC receipt at devald84@gmail.com (including spam), and Reply-To to
   your entered email. Check type/body/timestamp/reference and the two required
   recipient headers. Record only the non-sensitive result, not message headers
   containing personal data. Do not claim inbox receipt from HTTP success alone.
9. If the result is uncertain, stop. Check both inboxes/Track Delivery before
   any resend. Never rotate hash_secret, clear storage or change the message to
   evade an unresolved pending/unknown attempt. Local failure fixtures test UI
   error paths; no real account was deliberately broken to manufacture a failure.

Run PHP lint and the existing failure-only suite from a private repository copy
outside public_html before release:

```sh
/usr/local/bin/ea-php83 -l api/enquiry.php
/usr/local/bin/ea-php83 -l api/enquiry-config.php
/usr/local/bin/ea-php83 -l api/enquiry-service.php
/usr/local/bin/ea-php83 -l api/enquiry-smtp.php
/usr/local/bin/ea-php83 -l docs/enquiry-config.example.php
/usr/local/bin/ea-php83 tests/enquiry-service-test.php
python3 --version
```

The release tool requires an ALREADY AVAILABLE Python 3.9+ CLI, with no packages
or installation step. If the host lacks it, stop this Git recipe and review a
manual prebuilt-package cutover separately; do not install hosting software or
change PHP/global settings as part of this preparation. Confirm the PHP CLI
path/version rather than guessing an alternative executable.

## 4. Form Routing and Navigation

| Journey | Destination / intent |
| --- | --- |
| Header/footer Contact, mobile sticky Enquiry | Homepage #enquiry, General enquiry |
| Commercial | #contact-commercial, Commercial laundry |
| Franchise | #contact-franchise, Franchise enquiry |
| Community | #contact-community, Community partnership |
| Airbnb guide | ../../index.html#contact-commercial, Commercial laundry |
| Wash & Fold booking | #locations -> store -> its confirmed phone |
| Production submission | POST https://wash-bar.com.au/api/enquiry.php |
| Protected submission | POST https://wash-bar.com.au/v4-enquiry-test/api/enquiry.php |

The same page-relative action/data-config serve both environments. No production
request points at Netlify or hardcodes the protected test prefix. Success still
means SMTP acceptance only, not guaranteed inbox delivery. East Windsor retains
no phone/hours/Call/phone-booking action.

Blog was explicitly requested after Our Story and added in commit 37efce2 on
3 October. Preserve the current eight-item desktop order: Services, Reviews,
Commercial, Our Story, Blog, Franchise, Locations, Contact. Mobile keeps the
approved dropdown/sticky structure; do not restore an older list by assumption.

## 5. Git and Recoverable Work

Base: local main and read-only verified GitHub main at 128e683cd003ae76ae1b23867959cbf33bc80b9a. The current worktree
contains both the previously uncommitted LAUNCH-01 backend/form and LAUNCH-02.
Nothing was discarded, staged, committed or pushed. Full current status is
saved with the local release artifacts as GIT-STATUS.txt, not published.

Pre-task preservation (outside Git/public_html):

`/Users/raiaashish/Documents/Codex/washbar-backups/launch-02-before-preparation-2026-10-29-89nK9q/`

This contains working-files.tar.gz and tracked-changes.patch. SMTP password and
hash in the repository template were checked to be empty before preservation.
This is a local source backup, not proof of a usable legacy hosting restoration.
Review ALL intended modified/untracked files, not just the visible HTML diff.
Do not stage generated ZIPs, private config, state, credentials or backup data.

## 6. Public Allowlist and Exclusions

Production: 13 exact HTML routes, style.css, script.js, four api/ PHP adapters,
41 image files actually referenced by those pages, robots.txt and sitemap.xml.
The manifest lists all 62 public paths and SHA-256 checksums. Only a separately
reviewed root .htaccess is added by the guarded cPanel cutover, not the ZIP.

Excluded: docs/, content/, tests/, scripts/, config/, .git/, .gitignore,
.cpanel.yml, README.md, AGENTS.md, design-qa.md, both prototypes, unused/source
assets, ZIP archives, manifests, private config, PHPMailer and runtime storage.
The private runtime stays outside public_html. Do not copy the whole repository
or recursively sync/delete the live root. Existing .well-known and protected
test files are never in the deployment write set.

## 7. Deterministic SEO Packaging

From the repository, use a NEW/EMPTY output directory:

```sh
python3 scripts/prepare_release.py --environment production --output /ABSOLUTE/PRIVATE/EMPTY/OUTPUT
python3 scripts/prepare_release.py --environment staging --output .netlify-site
python3 tests/release-test.py
```

The packager uses only Python's standard library. HTML tokens and JSON are parsed;
approved body markup is preserved byte-for-byte. Production copies receive
index,follow, one HTTPS non-www canonical/og:url each, final-domain social images,
Organization identity, separate location IDs/URLs/images, absolute breadcrumbs
and BlogPosting references. No new location facts/ratings/prices are inferred.
The 13-URL sitemap has no fabricated lastmod. robots.txt allows customer pages
and excludes API/protected test paths.

Staging source remains noindex,follow. netlify.toml builds only the static
staging allowlist and publishes .netlify-site/public, with an additional noindex
response header. No PHP or internal documents are uploaded as static source.
It is not a PHP host. No Netlify build/deploy/settings update was executed here.

Production artifacts: production-final/public, manifest.json and the reproducible
production-public.zip under the local washbar-launch-02-2026-10-29 folder.
The ZIP is NOT a complete, approved root .htaccess or permission to deploy.

## 8. Legacy Website and Essential Redirects

Read-only HTTP observations on 29 October:

| URL | Current result | Proposed release behavior |
| --- | --- | --- |
| http://wash-bar.com.au/ | 200, no redirect | 301 -> https://wash-bar.com.au/ |
| http://www.wash-bar.com.au/ | 200, no redirect | 301 -> https://wash-bar.com.au/ |
| https://www.wash-bar.com.au/ | 200, valid TLS, no redirect | 301 -> HTTPS non-www |
| https://wash-bar.com.au/ | 200, legacy homepage | V4 homepage after approval |
| /index.php | Existing 301 -> / | Preserve equivalent canonical redirect |
| /story.php | 200, legacy Story | 301 -> /our-story/ |
| /tips.php | 200, legacy laundry tips | 301 -> /blog/ |
| /robots.txt, /sitemap.xml | 404 | Generated production files |

Only those verified legacy routes and explicit index.html variants are included
in config/production-apache.conf. No guessed location/WordPress redirects or
blanket redirects to the homepage were added. Unknown old URLs should retain
proper behavior/404s until there is evidence for a relevant mapping.

The owner subsequently confirmed the actual File Manager inventory, with hidden
files visible. Directories: .well-known/, cgi-bin/, css/, img/, js/, preview-v2/,
smart/, user/ and v4-enquiry-test/. Files: .DS_Store, .ftpquota, .htaccess,
.htaccess.phpupgrader.7afcb769, .htaccess.phpupgrader.initial, .htaccess_old,
dpindex.php, favicon.ico, footer.php, google4cba3a7518b65e43.html, header.php,
header2.php, index.php, story.php, test.php and tips.php. No root index.html was
shown. This is owner-confirmed inventory, not an independent read of server rules.

Keep index.php, header/header2/footer PHP includes and all listed legacy files
in place. Do not rename or disable them during preparation. The scoped Apache
proposal routes ONLY the root and known V4 directories to their static index
files. It does not change DirectoryIndex globally, which could break smart/user
PHP apps. The new index.html will be added alongside the original index.php;
the reviewed root rewrite selects V4 after cutover. Explicit /index.php retains
its existing redirect to /. Restoring the old rules restores the old entry path.

The first managed RewriteRule, conditioned on the immutable original THE_REQUEST,
skips exactly the ten following V4 rules for the listed legacy directories,
verification file, includes and other preserved files, even through internal rewrites.
It then falls through to the ORIGINAL rules instead of terminating them. A unit
test checks that skip count; do not insert rules without updating/retesting it.
Place the managed block before legacy rewrite catch-alls, retaining PHP handlers
and required auth rules. Review the actual complete .htaccess before doing so;
its contents, proxy behavior and other index/rewrite directives are still unknown.
No WordPress installation or obsolete-rule removal is assumed.

The .well-known directory, Google verification file and protected test are outside
the deployment write set. Do not delete, move, overwrite or assume these are
unnecessary. Existing diagnostics/backup-looking file names are not proof of a
vulnerability; review their purpose separately without exposing their contents.

Legacy #section01-#section06 fragments were observed. They are browser-side,
not server-visible redirect paths. Old pricing anchors do not authorise a V4
pricing page. A compatible fragment alias plan is P1 follow-up, not a guessed
rewrite or permission to restore old prices/claims.

## 9. Proposed cPanel Git Recipe and Private Approval

The prepared .cpanel.yml contains only:

```yaml
---
deployment:
  tasks:
    - /bin/bash /home1/washbarc/repositories/WashbarV2/scripts/deploy-production.sh
```

It is uncommitted and was NOT executed. The guard requires the exact cPanel
repository path, main, a clean tree, PHP lint/unit/readiness checks, a verified
fresh webroot snapshot with matching SHA-256, and private approval for this commit.
It makes no public writes if those checks fail. Do not push directly to the
cPanel repository: cPanel push hooks can auto-run deployment. Use GitHub main
and cPanel's manual pull/deploy flow.

After actual verification, the operator may create (privately, 0600):

- /home1/washbarc/private/washbar-release/approval.json, based on the disabled
  docs/launch-approval.example.json. Set each evidence flag true only after its
  named check passed; use the FINAL reviewed Git commit, never the old base SHA.
  Copy source_digest from the tested production manifest. The cPanel package
  must match it before any public file is written.
- /home1/washbarc/private/washbar-release/root.htaccess.approved: the reviewed
  COMPLETE root file, retaining required cPanel PHP/auth rules and including
  the exact managed block. This is not a copy of the fragment alone unless the
  actual root audit proves that no other rules are required.

Record the existing root-file SHA-256 and approved replacement SHA-256 in
approval.json. The owner confirms .htaccess exists here; do NOT use ABSENT.
Read-only example commands:

```sh
sha256sum /home1/washbarc/public_html/.htaccess
sha256sum /home1/washbarc/private/washbar-release/root.htaccess.approved
```

No SMTP password belongs in that approval file. It records non-secret evidence,
commit/hash and a real private backup path, not credentials. For compatibility,
the keys remain legacy_backup_path and legacy_backup_verified: they now refer
to the FRESH server snapshot described below, not the historical Mac archive.
Set legacy_backup_sha256 to that snapshot's verified SHA-256. The guard streams
the archive to recompute this hash before any public write; changed, missing,
publicly readable, symlink or public_html backup files block deployment.
The checksum verifies the selected bytes, not archive completeness or a successful
restore: those require the manual checks below. Changed live .htaccess also
blocks deployment. Approval is consumed before public writes; reruns need review.

production_indexability_reviewed must remain false until the complete merged
rules/headers have been reviewed for the V4 routes. Do not remove legitimate
conditional noindex/auth rules for preview-v2 or the protected test just to clear
a text search. The tool does not pretend to parse every Apache context; manual
review plus the exact approved-file hash is the gate, followed by live header checks.

During an APPROVED later deployment, packaging happens privately, exact target
files are checked for path/symlink conflicts, overwritten files are snapshotted,
and only allowlisted files are copied. Homepage and reviewed .htaccess are last.
New directories use 0755 and public files 0644. No obsolete file is deleted.
Per-file writes are atomic, not an atomic whole-site cutover; use a short staffed
cutover window and smoke-test immediately. A failed copy stops and prints the
private rollback snapshot location; it does not pretend rollback happened.

## 10. Backups and Minimal Rollback

### Confirmed historical disaster copy

Owner-confirmed archive: backup-10.9.2026_12-17-48_washbarc.tar.gz, dated
9 October 2026. The downloaded copy found locally has a normal duplicate-download
suffix: `/Users/raiaashish/Documents/Washbar/backup-10.9.2026_12-17-48_washbarc (1).tar.gz`.
It is 494,215,658 bytes. Read-only checks passed gzip integrity, readable tar
headers and coverage of index.php, .htaccess, header.php, header2.php, footer.php,
story.php, tips.php, css/, img/, js/, .well-known and the Google verification file.
No account files or credentials were extracted or printed.

```text
SHA-256: 2aafe8f56a0eb85efab15296d15b80fde15167bfe1ef4fbcc9dd00744004c00b
Actual webroot prefix: backup-10.9.2026_12-17-48_washbarc/homedir/public_html/
```

The archive predates preview-v2 and v4-enquiry-test: neither appears in its
webroot. Other public_html-like paths are opcache/password-directory entries,
NOT the restore source. No restore rehearsal or match against the original
server archive hash was performed. Keep this full account copy offline as
disaster recovery; do not restore the October account over current mail, private
SMTP config, website or Directory Privacy. No full-account restore is required
for a V4 website rollback.

### Fresh snapshot immediately before cutover

**Not executed on cPanel.** This is the required current-site rollback source.
After the new-mailbox test and rule review, use cPanel Terminal (or ask the host
to run the same commands). These commands read live files and create PRIVATE
backup/restore-check files only; they do not deploy, delete or rename live files.

First check cPanel disk quota plus `df -h /home1/washbarc` and
`du -sh /home1/washbarc/public_html`. Allow room for the archive, restore-check,
release candidate and targeted deployment backup. Do not proceed on low quota.
Avoid uploads/content changes during the snapshot; tar warnings or a nonzero
exit status mean STOP and take a new consistent copy, not ignore the warning.

```sh
(
  set -eu
  umask 077
  RELEASE=/home1/washbarc/private/washbar-release
  WEBROOT=/home1/washbarc/public_html
  mkdir -p "$RELEASE"
  chmod 700 "$RELEASE"
  STAMP=$(date -u +%Y%m%dT%H%M%SZ)
  SNAPSHOT="$RELEASE/pre-v4-webroot-$STAMP.tar.gz"
  test ! -e "$SNAPSHOT"
  tar -czf "$SNAPSHOT" -C "$WEBROOT" .
  chmod 600 "$SNAPSHOT"
  gzip -t "$SNAPSHOT"
  tar -tzf "$SNAPSHOT" > "$RELEASE/pre-v4-webroot-$STAMP.members.txt"
  CHECK=$(mktemp -d "$RELEASE/restore-check-$STAMP-XXXXXX")
  tar -xzf "$SNAPSHOT" -C "$CHECK" \
    ./index.php ./.htaccess ./header.php ./header2.php ./footer.php \
    ./story.php ./tips.php ./css ./img ./js \
    ./google4cba3a7518b65e43.html ./v4-enquiry-test/.htaccess
  for NAME in index.php .htaccess header.php header2.php footer.php story.php tips.php \
    google4cba3a7518b65e43.html v4-enquiry-test/.htaccess
  do
    cmp "$WEBROOT/$NAME" "$CHECK/$NAME"
  done
  sha256sum "$SNAPSHOT"
  printf 'Snapshot: %s\nPrivate restore check: %s\n' "$SNAPSHOT" "$CHECK"
)
```

The source `.` includes hidden files and ALL current webroot directories,
including .well-known, the verification file and the entire protected test.
The archive lives outside the source, so it cannot recursively include itself.
Tar does not dereference symlinks by default: record any external symlink targets
separately; the snapshot does not claim to back up files outside public_html.

Review the private member list for every owner-confirmed directory, including
.well-known and v4-enquiry-test with its original .htaccess. The private extraction
checks legacy PHP includes/assets and the protected auth file without changing
their live copies. Verify legacy local asset/include paths in the restore-check.
Record path, UTC time, size, SHA-256, verified member list, original permissions
and restore-check path privately; optionally download this fresh archive too.
If the current site changes afterwards, recreate/reverify the snapshot before
cutover. Set legacy_backup_verified true ONLY after these checks; put this SERVER
archive path and hash in legacy_backup_path / legacy_backup_sha256. Do not enter
the Mac path or October archive checksum in those fields.

### Targeted rollback after an authorised deployment

The deployment ALSO creates a private rollback-TIMESTAMP-COMMIT folder containing
overwritten-files.tar.gz, new-files.json, release-manifest.json and approval.used.json.
This smaller archive covers only overwritten deployment targets; it is NOT a
substitute for the full fresh webroot snapshot. No rollback/deployment ran here.

On a critical failure, with the operator present:

1. Stop new submissions using the existing private enabled flag if necessary.
   It also affects the protected test. Preserve storage/hash_secret and reconcile
   uncertain messages; never force resends or restore old enquiry state.
2. Record the failing commit and corresponding private rollback folder. Inspect
   its archive privately before extraction. Restore only overwritten paths from
   that archive to the same relative paths under public_html; use a private
   extraction directory first, never a whole-account restore.
3. In the same staffed rollback window, restore the original root .htaccess and
   move the NEW root index.html to a private quarantine folder. The original
   index.php/includes were never removed. Removing V4's index.html from selection
   is essential: restoring old rules alone may still prefer the HTML file.
   Expect a brief transition; this is not an atomic whole-site switch.
4. Quarantine the other newly added paths listed in new-files.json, but only
   after matching each against release-manifest.json and confirming it has not
   since changed. Move files to private quarantine; do not delete them or remove
   whole existing directories. Stop for manual reconciliation if checks differ.
   Restore overwritten robots/sitemap/assets/API files if the archive records
   them; otherwise quarantine their newly created counterparts too.
5. Leave .well-known, google4cba3a7518b65e43.html, v4-enquiry-test (including its
   Directory Privacy .htaccess), preview-v2, smart, user, cgi-bin and legacy
   CSS/images/JS/PHP files untouched. Never recursively restore or delete the
   entire root. Use the full fresh snapshot for selective recovery only if the
   targeted archive is insufficient; its `./` prefix maps directly to webroot.
6. Recheck old homepage/Story/tips/assets, original HTTPS behavior, verification
   file and unauthenticated protected-test 401. Verify original .htaccess hash.
   Record rollback results and obtain a new commit-specific approval before retry.

## 11. Release QA

- Twelve packaging/routing/backup checks: production/staging separation, 13 routes, unchanged page
  bodies, links/ARIA, sitemap/schema, East Windsor omissions, 41-asset allowlist,
  deterministic ZIP/checksums, unsafe-path rejection, non-cPanel deploy refusal
  preservation of the owner-confirmed legacy inventory in scoped rewrite rules,
  and private snapshot/checksum refusal tests. Backup fixtures are local only,
  not a simulated host restore, deployment approval or email success.
- Chromium: 13 routes x 320/390/768/1440 = 52 route/viewports. Navigation order,
  no overflow/console failures, menus/Escape/focus, six galleries, contact
  preselection, Airbnb commercial journey and mobile Enquiry passed.
- All 13 routes passed no-JS readability checks; form is disabled with a useful
  phone alternative. Reduced-motion mode was used. There is no screen-reader,
  Safari/Firefox or real-device claim.
- Existing browser regression suite checks failed readiness/recovery, exact
  root and protected API paths, validation, pending locks, unknown/duplicate
  protection and phone formatting. It never fabricates accepted SMTP delivery.
- PHP lint/runtime and new identity's real send are NOT RUN locally: PHP is
  unavailable and no private credentials were accessed. Apache redirects are
  a reviewed proposal, not a tested live rewrite. Production remains unchanged.

## 12. Remaining P0 / P1 / P2

**Passed, owner-confirmed 30 October:** protected readiness, real enquiry receipt
at info@ and Gmail CC, and customer Reply-To. Production must be retested later.

**P0 before cutover:** host PHP syntax/unit checks; available Python 3.9+ CLI for
this recipe; complete root
.htaccess/rewrite/proxy audit; reviewed index/HTTPS/legacy rules; a verified fresh
current-webroot snapshot/restore-check (the downloaded October disaster copy is
confirmed); complete reviewed Git commit/main push; clean cPanel checkout;
matching private approval. Production noindex is prevented in the generated
copy, but live headers/redirects/API behavior must be checked at cutover.

**P1 clean launch:** publish the allowlisted noindex staging build to remove the
currently exposed developer documentation; reconcile old hash-only links and
any additional legacy URL evidence; run browser/device spot checks the owner
requires. Do not remove Blog without reconciling its explicit approval.

**P2 after launch:** additional Search Console legacy URL inventory, monitoring,
analytics activation and optional performance/editorial improvements. No new
feature, new article, DMARC task or preview-subdomain work belongs to LAUNCH-02.

## 13. Exact Manual Order

1. Retain the owner-confirmed protected info@ delivery/Reply-To evidence above.
   Do not repeat setup or change either mailbox merely to restart the checklist.
2. Run host PHP lint/failure tests and confirm Python 3.9+ is already available.
3. Retain the confirmed public_html inventory. Inspect the COMPLETE .htaccess;
   retain the downloaded October backup and review the private restore instructions.
   Preserve the original PHP entry/includes, managed directories and verification files.
4. Review the generated candidate, full Git status and secret scan. Commit all
   intended LAUNCH-01/02 source/docs/tests/tool files and push ONLY GitHub main
   after approval. Do not publish generated packages/private config to Git.
5. Verify Netlify's new static staging deployment remains noindex, excludes
   PHP/docs/prototypes, and is NOT being mistaken for the production backend.
6. cPanel Git -> WashbarV2 -> Pull or Deploy -> Update from Remote. Verify the
   remote is raiaashish101/Washbar-Website-Redesign, main, final SHA and clean tree.
   Do NOT click Deploy HEAD Commit during preparation.
7. Privately prepare the fully reviewed root.htaccess.approved and approval.json
   for that exact SHA. Immediately before cutover take/check the fresh webroot
   snapshot above; record its path/hash and genuine evidence flags/current root hashes.
8. Only in a separately authorised cutover window, click Deploy HEAD Commit.
   The guard packages/copies the allowlist and preserves rollback material.
9. Immediately verify all 13 routes, canonical/robots/sitemap, all hostname
   redirects, /story.php and /tips.php redirects, assets/galleries/nav, root
   /api/enquiry-config.php, a fresh production enquiry and BOTH receipts.
   Verify the protected test still challenges unauthenticated access. Roll back
   on a critical failure; do not claim launch from file-copy success alone.

## Primary Technical References

- [cPanel deployment requirements and pull workflow](https://docs.cpanel.net/knowledge-base/web-services/guide-to-git-deployment/)
- [cPanel Git clean-tree requirements](https://docs.cpanel.net/cpanel/files/git-version-control/)
- [Apache DirectoryIndex behavior](https://httpd.apache.org/docs/2.4/mod/mod_dir.html#directoryindex)
- [Apache redirect/proxy considerations](https://httpd.apache.org/docs/2.4/rewrite/remapping.html)
- [Netlify publish configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/)
- [Netlify build-time Python availability](https://docs.netlify.com/build/configure-builds/available-software-at-build-time/)
