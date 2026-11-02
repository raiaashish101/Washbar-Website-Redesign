# Final Launch Execution

29 October 2026. Continue LAUNCH-02; do not redesign or rebuild the backend.

## Approved Method Update: 2 November

The owner approved File Manager for the first launch and deferred Git deployment
automation. Follow [FILE-MANAGER-LAUNCH.md](FILE-MANAGER-LAUNCH.md) for the current
backup, private staging, final approval, manual cutover and rollback sequence.
The Git/Python/Terminal/approval.json steps below describe the retained automation
plan, NOT prerequisites for this manual method. No server software installation.
Protected email delivery remains passed; complete root .htaccess was supplied
and reviewed on 2 November. Fresh backup passed local archive/recovery checks.
The owner explicitly approved and completed the manual cutover. Independent
public GET checks confirm all 13 pages/58 static hashes, eight redirects,
available:true, protected 401 and Google verification. Real production enquiry
receipt/Reply-To is still pending; local automated browser launch was blocked,
so live visual/console checks are not marked passed. No production writes or
email submissions were performed by the assistant.

## Current Gate

Owner verified PHP 8.3, max_execution_time=60, and saved private info@ credentials
and hash. Do not change PHP settings or apply the conditional 30-second patch.
Current update, 30 October: the owner supplied a screenshot of the actual
protected response showing available:true. Readiness is restored on that
reported request. The owner has now also confirmed that the protected form works,
the real enquiry arrived at BOTH info@wash-bar.com.au and devald84@gmail.com,
and Reply targets the customer's email. This is owner-confirmed end-to-end
delivery evidence, not an independently observed SMTP transcript. The protected
delivery gate is PASSED. Do not repeat readiness changes or reset credentials.
Current manual-launch gate: the site is serving V4; complete ONE real production
enquiry and confirm both inbox receipts/customer Reply-To. Do not repeat setup.

Historical diagnosis: the protected GET previously returned available:false.
The owner's 30 October protected diagnostic reports ONE failed check:
enquiry_service_matches_reviewed_source. The config/SMTP adapter fingerprints,
private configuration, PHP capabilities, PHPMailer and storage probes all pass.
This confirmed protected service-file drift; the exact older code was not
captured. The latest actual readiness response, not the diagnostic alone,
establishes the readiness checkpoint. The later owner-confirmed receipts above
also resolve the new-mailbox delivery checkpoint.

The diagnostic intentionally skips actual_configuration_bootstrap when the
source fingerprint is unreviewed. The one-file update below was the prescribed
correction; do not keep replacing files now that real readiness is restored.
Do not alter credentials, permissions, libraries, timeouts, DNS or .htaccess
to repeat readiness troubleshooting. The separately reviewed production
root-rule merge below remains required for the cutover.

The current LOCAL service already uses the confirmed lowercase private path,
expects info@ as username and fixes From/To to info@. The October 15 source
instead requires mail@; that exact old file would reject a private info@ config.
The readiness endpoint itself is byte-identical between those two local versions.
This proves the incompatibility, not which source is deployed on cPanel.

## 1. Identify the Deployed Version

The named protected diagnostic already confirms a mismatch. The read-only check
below is optional if the exact older revision needs identifying; it is not an
additional prerequisite to applying the reviewed protected-only service update.
No private config is loaded:

```sh
/usr/local/bin/ea-php83 -r '
$h = @hash_file("sha256", "/home1/washbarc/public_html/v4-enquiry-test/api/enquiry-service.php");
printf("service_readable: %s\n", $h !== false ? "PASS" : "FAIL");
printf("current_info_version: %s\n", $h === "2116debcfbe8faa708f5646c68ad2817cc312774d787fddf8e44ff0f9af5af38" ? "PASS" : "FAIL");
printf("previous_mail_version_detected: %s\n", $h === "c192a615045434eb3ccc1b2fd695ee52bdeeb3d5f7eb7155a6a391a72d7bbe3f" ? "PASS" : "FAIL");
'
```

- Service fingerprint mismatch (as reported): replace ONLY the protected
  api/enquiry-service.php with the current canonical file. Keep a private source backup first. Do not
  touch config.php, PHPMailer, storage, UI or Directory Privacy .htaccess.
- Current version detected but still false: do not re-upload blindly. Run the
  previously reviewed protected readiness diagnostic, return only named checks,
  then remove that temporary diagnostic. Check effective config override,
  file/library/storage access and strict values, not the verified execution limit.
- File absent/unreadable: stop only this file operation and correct the actual
  protected API location/access before changing any unrelated component.

Minimal source update archive (one member, not a production deployment):
`/Users/raiaashish/Documents/Codex/washbar-final-launch-2026-10-29/protected-info-service-update.zip`.
Extract ONLY in /home1/washbarc/public_html/v4-enquiry-test/, never public_html.
It contains api/enquiry-service.php, no credentials or .htaccess. The earlier
30-second update archive is NOT authorised for this regression.

## 2. Protected Delivery: Passed, 30 October

The owner confirms both destination receipts and correct customer Reply-To.
The steps below describe the completed protected delivery check; do not repeat
it merely to restart this checklist. A separate production enquiry is still
required after cutover because it tests the final /api/ installation.

Require GET /v4-enquiry-test/api/enquiry-config.php to return HTTP 200 and
available:true. The form must then enable Send enquiry and hide the unavailable
warning. Keep initial/pre-submit gating and relative api/ paths unchanged.
Check four enquiry types, the Airbnb Commercial journey and mobile Enquiry.
Existing local browser evidence remains valid for byte-identical public files;
it is not proof of the hosted PHP result.

Submit ONE fresh General test using an authorised test email and a unique
time-labelled message. Confirm actual SMTP acceptance, To receipt at info@,
CC receipt at the approved Gmail and correct customer Reply-To. No fake success
or stored old-mailbox acceptance may substitute. Stop/check inboxes before any
retry if uncertain; preserve hash/reference/storage. No secret re-entry is needed.

## 3. Existing Host PHP Checks

Lint the four protected API files using /usr/local/bin/ea-php83. The existing
failure-only suite can be uploaded privately as host-php-tests.zip, extracted
under /home1/washbarc/private/washbar-enquiry/launch-qa/ (create a NEW private
0700 directory). It contains only api/enquiry-service.php,
docs/enquiry-config.example.php and tests/enquiry-service-test.php. It does NOT
contain or overwrite private config.php, PHPMailer or submission storage.

From that PRIVATE launch-qa directory, run:

```sh
/usr/local/bin/ea-php83 tests/enquiry-service-test.php
python3 --version
```

The suite uses separate temporary fixtures, restores its process-only config
override, never connects to SMTP and never invents accepted delivery. PHP is
absent locally, so these host results must not be marked passed in advance.
Python 3.9+ must already exist for the approved Git recipe; do not install it
or switch to a manual website deployment without separate approval.

## 4. Existing Release and Cutover

Reuse the 13-route/62-file LAUNCH-02 allowlist and its completed visual QA. Refresh
the source manifest only as required by source cleanup; compare all public bytes
with the existing candidate. No new content/routes/design work is authorised.
Keep Netlify noindex; generated production copies must remain indexable with
HTTPS non-www canonical, social/schema URLs, robots and the 13-route sitemap.

Review the COMPLETE live root .htaccess and prepare its privately approved merge.
Keep index.php/includes and unrelated files in place; the scoped V4 rules select
index.html. Preserve .well-known, Google verification and the protected test.
The old downloaded archive remains the disaster copy. Take/check the fresh
private current-webroot snapshot immediately before cutover as in LAUNCH-02.

Only after the protected mail test, host tests, private root-rule review and
backup preparation: review the intended staged set, commit/push GitHub main,
then cPanel Update from Remote and verify SHA/clean tree. Obtain EXPLICIT final
cutover approval before Deploy HEAD Commit. Keep approval flags false until
their named evidence actually exists. Do not push directly to the cPanel repo.
Run live route/redirect/SEO/form receipt checks after cutover; use the existing
selective rollback plan on critical failure, never delete legacy files.

## 5. Tonight's Operator Steps

Status: protected email delivery PASSED; NOT YET READY FOR PRODUCTION CUTOVER.
The current website must remain unchanged until the final approval step.

### Step 1: Check the server tools without changing anything

In cPanel, search for Terminal and open it. Run each line separately:

```sh
/usr/local/bin/ea-php83 -v
python3 --version
git -C /home1/washbarc/repositories/WashbarV2 status --short --branch
```

Expected: PHP 8.3, Python 3.9 or newer, and the existing main checkout.
Return only versions and Git status, never environment variables or config.php.
If Terminal is absent, a path is missing, or the checkout has local changes,
stop this step and report it. Do not reset files, install software or click Deploy.

### Step 2: Review the existing routing file

In File Manager, open public_html, enable Settings > Show Hidden Files, and
DOWNLOAD the current root .htaccess for review. Do not edit or replace its live
copy. Do not open/share .htpasswd, private config.php or account backups.
If .htaccess contains embedded credentials, arrange a private review rather
than attaching those values. Otherwise provide the complete root file, not
only its PHP handler or a screenshot of a few lines.

The developer must merge config/production-apache.conf into that complete file,
preserving required original rules. Save the reviewed result privately as:

`/home1/washbarc/private/washbar-release/root.htaccess.approved`

Use directory mode 0700 and file mode 0600. This PRIVATE preparation does not
change the live site. Never use the fragment alone as the entire replacement.
Keep index.php and its PHP includes in place. The reviewed rules select the new
index.html; no global DirectoryIndex change or legacy-file deletion is needed.

### Step 3: Run the existing host PHP checks

Upload the prepared host-php-tests.zip from the final-launch artifact folder
to a NEW private directory, not public_html:

`/home1/washbarc/private/washbar-enquiry/launch-qa/`

Extract there and keep its directory mode 0700. This archive contains only
api/enquiry-service.php, the empty example, and the failure-only test. It must
not overwrite config.php, PHPMailer or storage. Run:

```sh
/usr/local/bin/ea-php83 -l /home1/washbarc/public_html/v4-enquiry-test/api/enquiry.php
/usr/local/bin/ea-php83 -l /home1/washbarc/public_html/v4-enquiry-test/api/enquiry-config.php
/usr/local/bin/ea-php83 -l /home1/washbarc/public_html/v4-enquiry-test/api/enquiry-service.php
/usr/local/bin/ea-php83 -l /home1/washbarc/public_html/v4-enquiry-test/api/enquiry-smtp.php
cd /home1/washbarc/private/washbar-enquiry/launch-qa
/usr/local/bin/ea-php83 tests/enquiry-service-test.php
```

Expected: four syntax checks pass and the suite reports all assertions passed.
It sends no email and does not use/reset live submission state. Return PASS/FAIL
results only. A failure blocks the release, not a reason to bypass its guard.

### Step 4: Review the release and send it to GitHub

Developer action: review the complete staged set, include these updated delivery
notes, run diff/secret checks, then commit and push ONLY to GitHub main. Record
the exact final commit. Do not push directly to cPanel, which can auto-deploy.
The existing recipe packages only the approved public files, not the whole repo.
The private SMTP config and PHPMailer stay where they already work.

Check the resulting Netlify staging build separately: it must retain noindex
and must not expose PHP/docs/private files. Its static form is not a cPanel
SMTP test. Do not remove staging controls to prepare production.

### Step 5: Pull the reviewed commit into cPanel, without deploying

Open Git Version Control > Manage for WashbarV2 > Pull or Deploy.
Confirm its repository is /home1/washbarc/repositories/WashbarV2 and its remote
is the approved GitHub repository. Click ONLY Update from Remote. Verify:

```sh
git -C /home1/washbarc/repositories/WashbarV2 rev-parse HEAD
git -C /home1/washbarc/repositories/WashbarV2 status --short
```

The full commit must match the reviewed GitHub commit; short status must be
empty. Stop on disagreement. Do NOT click Deploy HEAD Commit yet.

### Step 6: Prepare the fresh backup and exact approval

Check cPanel quota and follow LAUNCH-02.md section 10's complete fresh-snapshot
commands and private restore check. Keep the October download as an additional
disaster copy, not tonight's rollback source. Do not modify live files while
taking the snapshot. Record its actual SERVER path and SHA-256.

Privately copy docs/launch-approval.example.json to
/home1/washbarc/private/washbar-release/approval.json, mode 0600. Enter the exact
final commit, tested production manifest source_digest, fresh snapshot path/hash,
and original/reviewed .htaccess hashes. The three mail evidence flags may now
be true based on the owner's receipt/Reply-To confirmation. Set remaining flags
true ONLY after their named checks pass. Never add SMTP credentials to this file.

The developer reviews these non-secret identifiers and evidence. Only then
declare READY FOR PRODUCTION CUTOVER and request explicit final approval.

### Step 7: Deploy once approved, then verify immediately

After explicit approval, click Deploy HEAD Commit once. The checked-in guard
verifies the commit, private approval, backups, PHP and package before writing.
Record its deployed commit and private rollback directory. If it fails, stop;
do not bypass checks or repeatedly redeploy with invented approval flags.

Open the production homepage, Story, Blog and all six locations. Check images,
mobile navigation, contact intents and the production readiness endpoint:

`https://wash-bar.com.au/api/enquiry-config.php`

Require available:true. Submit ONE clearly labelled production test and confirm
both inbox receipts and Reply-To again. Check the HTTPS/non-www and legacy
Story/tips redirects, canonical URLs, robots/sitemap and absence of production
noindex headers/meta. Verify the Google verification file still works and the
protected test still returns 401 in a signed-out browser.

If a critical check fails, use LAUNCH-02.md section 10's targeted rollback:
restore overwritten files/root rules and quarantine the NEW root index.html
and verified new release paths. Preserve legacy files, private mail state,
.well-known and Directory Privacy. Do not restore the entire old account.

Official workflow reference:
https://docs.cpanel.net/knowledge-base/web-services/guide-to-git-deployment/

## Security Reconciliation

The local example contained populated password/hash fields and enabled flags.
They were removed from that EXAMPLE only; actual private cPanel config was not
read, overwritten, regenerated or copied. Known sensitive values were absent
from the scanned 273 reachable Git blobs up to 2 MiB and existing public ZIP.
This is a scoped known-value check, not a claim about all possible past secrets.
The screenshot/chat's redacted status is owner-reported. If any genuinely live
value was previously shared elsewhere, treat it as exposed and have the owner
remediate privately; never reset working credentials automatically or clear
idempotency state. Do not request the values again.

## Progress Recording

Record only named PASS/FAIL evidence and commit/package identifiers. Do not
record messages, headers, passwords, hash secrets or private config contents.
Pending host access/results must remain pending, not inferred from local tests.
