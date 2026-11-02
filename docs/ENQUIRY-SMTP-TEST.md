# Minimum cPanel SMTP Test

Owner-approved next step, 15 October 2026. Keep the existing enquiry form.
No preview subdomain, DNS investigation, new service or production deployment.

LAUNCH-02 update, 29 October: the current SMTP username/From/To is
info@wash-bar.com.au. The SMTP hostname remains mail.wash-bar.com.au:465 (ssl).
The owner reports that the former mail@ identity passed a protected SMTP
submission and readiness returned true. That historical result does not verify
the new identity. Fresh info@ authentication, both inbox receipts and Reply-To
must pass. Keep the old mailbox intact. Release preparation: [LAUNCH-02.md](LAUNCH-02.md).

Final launch brief, 29 October: PHP 8.3 and web max_execution_time=60 are owner
verified. The time limit is not the readiness regression; do not upload the
conditional 30-second candidate. The private password/hash are already saved
and must not be overwritten or requested again. First compare the deployed
api/enquiry-service.php with the current info@ version using the no-secret
source check in [FINAL-LAUNCH.md](FINAL-LAUNCH.md). Replace only that protected
API file if the previous mail@ implementation is confirmed. Do not reinstall
PHPMailer or re-upload the full test website for a source-only mismatch.

```text
Private PHPMailer/config + protected same-domain test copy
  -> one real form submission
  -> business inbox AND client Gmail AND correct Reply-To
  -> production packaging / cPanel Git preparation
```

PHP 8.3, SMTP settings and manual Webmail send/receive are already confirmed.
That does not yet verify the website form or PHPMailer. No SMTP password belongs
in chat, screenshots, Git or public_html.

## 29 October: confirmed lowercase private directory

The owner reconfirmed that the actual private installation uses **private**
with a lowercase p. This supersedes the uppercase-directory assumption recorded
on 28 October. Linux paths are case-sensitive; use the confirmed path everywhere.

```text
Private config:     /home1/washbarc/private/washbar-enquiry/config.php
                    -> align config, PHPMailer and storage paths
                    -> GET protected readiness endpoint
                    -> enable Send enquiry only on available: true
                    -> one real SMTP test, then verify both inboxes
```

During the 28 October audit, the authenticated readiness page returned
{"available":false} and an unauthenticated GET returned HTTP 401. The generic
health response does not identify the failing check; the earlier claim that
lowercase casing caused the failure is withdrawn. Hosted readiness has not been
retested after this correction. No private password was read or SMTP send made.

### Exact cPanel changes (protected copy only)

1. Keep `/home1/washbarc/public_html/v4-enquiry-test/.htaccess` untouched.
   Do not rename the existing private directory or create a second installation.
2. Re-upload these local files into `/home1/washbarc/public_html/v4-enquiry-test/`,
   preserving their relative paths: `index.html`, `script.js`, `style.css`,
   `api/enquiry-service.php`. The first three must be updated together: CSS v55
   and JavaScript v22 restore actual readiness-gated enablement. Keep the other
   three existing API files in place. Do not upload docs, tests or private config.
   The 15 October ZIPs predate this correction. Do not re-extract the old private
   pack over an already configured installation.
3. Privately check `/home1/washbarc/private/washbar-enquiry/config.php`. Preserve
   the existing password and hash. Ensure phpmailer_dir and storage_dir match
   the table below; leave already-correct values unchanged. Do not replace a
   configured file with the empty template.
4. If a server environment override WASHBAR_ENQUIRY_CONFIG is already set, it
   must also point to the lowercase config.php path. The override takes precedence
   over the default. Do not add a public .htaccess credential setting.
5. Check the private keys, files, permissions and PHP capabilities below, then
   set enabled and smtp_confirmed to true for the protected test only. These
   flags permit a test; they are not evidence that SMTP authentication worked.

| Private config key | Required protected-test value |
| --- | --- |
| enabled | true, only after protected setup is complete |
| smtp_confirmed | true, permits the authorised SMTP attempt |
| smtp_host | mail.wash-bar.com.au |
| smtp_port | 465 (integer, not a quoted string) |
| smtp_encryption | ssl (implicit TLS / SMTPS) |
| smtp_username | info@wash-bar.com.au |
| smtp_password | The new info@ mailbox password, entered privately; never print or share |
| phpmailer_dir | /home1/washbarc/private/washbar-enquiry/PHPMailer |
| hash_secret | Existing private random value, at least 64 characters |
| storage_dir | /home1/washbarc/private/washbar-enquiry/storage |
| allowed_origins | ['https://wash-bar.com.au'] (no folder or trailing slash) |

PHPMailer must have `src/Exception.php`, `src/PHPMailer.php` and `src/SMTP.php`
directly under that PHPMailer directory, with version 7.1.1 or newer. Check that
extracting the ZIP did not introduce a second enclosing directory. Private
directories/storage must be 0700; config.php must be 0600 and readable by the
hosting account. Keep the existing storage files; do not reset duplicate records.

### Non-secret health and URL verification

After authenticating in the same browser, open:

- `https://wash-bar.com.au/v4-enquiry-test/api/enquiry-config.php`: expect HTTP
  200, JSON content and {"available":true}. False/503 means keep submission
  disabled. A 401 means Directory Privacy authentication is needed, not that
  SMTP failed. A 404 or HTML response means deployment/path/handler is wrong.
- `https://wash-bar.com.au/v4-enquiry-test/api/enquiry.php`: a normal browser GET
  must return HTTP 405, Allow: POST, with code method. This checks PHP routing
  without sending email. Never put form data in the URL.

The readiness response checks the PHP/config/library/private-storage path, NOT
SMTP login, certificate negotiation or inbox delivery. It deliberately gives
no secrets or diagnostic paths. If false persists, privately check both flags,
all path casing, file permissions, required extensions, fsync/SSL transport and
a finite web max_execution_time of at least 40 seconds. Do not relax checks or
publish phpinfo/debug scripts. CLI and web PHP settings can differ.

Reload `https://wash-bar.com.au/v4-enquiry-test/index.html#enquiry` and inspect
the browser Network panel:

| Request | Correct path |
| --- | --- |
| Initial readiness and pre-submit recheck | /v4-enquiry-test/api/enquiry-config.php |
| Valid enquiry POST, only after readiness | /v4-enquiry-test/api/enquiry.php |

The form's action and data-config intentionally stay relative (`api/...`, no
leading slash), so the same source works both in the protected folder and at
the production root later. Do not hardcode `/api/` or `/v4-enquiry-test/` in the
shared source, and do not add a root-level base element. An address opened via
file:// cannot run PHP; test only on the authenticated HTTPS test URL.

Send enquiry starts disabled while checking. On a genuine available:true
response it enables and the warning disappears. On false, timeout, non-JSON or
failed HTTP response it stays disabled and the phone alternative remains.
Check availability again retries without posting customer details. Successful
recovery returns keyboard focus to Send enquiry. Submission checks readiness
again and locks the controls while pending. Input must not bypass the gate.

Only after these checks pass, follow steps 4-5 below for one real submission.
SMTP acceptance alone is not proof of either inbox receiving it. Record both
receipts and Reply-To before preparing production deployment.

## 1. Protect the empty test folder first

In cPanel File Manager, create only this new folder; do not overwrite existing files:

`/home1/washbarc/public_html/v4-enquiry-test/`

In Directory Privacy, password-protect that folder and create its test login
yourself. Protect only the new folder, not public_html. In a private browser
window, confirm both of these require the login before uploading the test files:

- https://wash-bar.com.au/v4-enquiry-test/
- https://wash-bar.com.au/v4-enquiry-test/api/enquiry-config.php

An unauthenticated request must be challenged, not serve the test page/API.
Do not change the existing site, inherited PHP handler or DNS.

## 2. Install the private pack outside public_html

Use `/home1/washbarc/private/washbar-enquiry/` in File Manager. Upload and
extract `private-install.zip` there, not into a publicly accessible folder.
The finished structure must be:

```text
/home1/washbarc/private/washbar-enquiry/
  config.php
  PHPMailer/
    LICENSE
    src/Exception.php
    src/PHPMailer.php
    src/SMTP.php
  storage/
```

The pack contains official PHPMailer v7.1.1 and the existing disabled config
template, not real credentials. Set private directories to 0700 and config.php
to 0600. Keep ownership with the hosting account. Never relax TLS verification.

In cPanel Terminal, run these read-only capability checks:

```sh
/usr/local/bin/ea-php83 -v
/usr/local/bin/ea-php83 -m
```

Confirm PHP 8.3, openssl, json and hash. If that CLI path is absent, report it;
do not change PHP versions or install another runtime. Web capabilities are
checked again through the existing readiness endpoint in step 4.

Generate the private hash locally on the server:

```sh
/usr/local/bin/ea-php83 -r 'echo bin2hex(random_bytes(32)), PHP_EOL;'
```

Keep its output private. Edit only the private config.php:

| Key | Value |
| --- | --- |
| smtp_password | Existing business mailbox password; enter privately |
| hash_secret | The generated 64-character value |
| allowed_origins | ['https://wash-bar.com.au'] |
| enabled | Keep false until step 3 is complete |
| smtp_confirmed | Keep false until step 3 is complete |

Leave the confirmed host mail.wash-bar.com.au, integer port 465, encryption ssl,
username and private paths unchanged. Keep valid PHP quoting when entering the
password; do not share the resulting file. The origin contains no folder path
or trailing slash; it is not the Directory Privacy login or access protection.

## 3. Upload only the test copy

Upload `protected-form-test.zip` into the already protected v4-enquiry-test
folder and extract it there. index.html, style.css, script.js, assets/ and api/
must sit directly inside that folder. Do not overwrite its Directory Privacy
.htaccess. Remove the uploaded public ZIP after extraction because it contains
PHP source. No docs, Git, credentials, PHPMailer or private runtime files belong
in this public copy.

This is a minimal form-integration copy, not a complete website release. Store,
Story and Blog destination pages are intentionally not included in this pack.
The homepage retains noindex,follow; live root files remain unchanged.

## 4. Enable the protected attempt and submit once

Once privacy and private setup are checked, set enabled and smtp_confirmed to
true in the private config.php only. These switches permit testing; they do
not prove SMTP authentication or delivery.

After logging into the protected folder, open:

https://wash-bar.com.au/v4-enquiry-test/api/enquiry-config.php

Proceed only if it returns {"available":true}. This confirms local readiness,
NOT a successful SMTP login. If false, stop and report only the HTTP status
and available result. PHP web execution limits must be at least 40 seconds
when finite; module, private-path and permission checks must also pass. Do not
publish diagnostic scripts, turn on SMTP debug, or disable certificate checks.

Open https://wash-bar.com.au/v4-enquiry-test/index.html#enquiry and use:

- Type: General enquiry
- Name: your own name
- Email: an inbox you control, so Reply-To can be checked
- Phone: leave blank for this test
- Message: TEST - Wash Bar V4 SMTP integration. No customer action required.

Submit once. A submitted state means SMTP accepted the message; it does not
prove either recipient received it. On error or uncertain status, keep the
details/reference and report the visible error; do not keep resubmitting.

## 5. Record actual receipt, then hand back

| Check | Result |
| --- | --- |
| Form showed Enquiry submitted after SMTP acceptance | Pending |
| TO info@wash-bar.com.au actually received the new-identity test | Pending |
| CC devald84@gmail.com actually received the same test | Pending |
| Reply in either inbox targets your form email | Pending |
| Type, name, email, message, UTC timestamp and reference correct | Pending |

Check spam as well. Do not count acceptance or Webmail's earlier manual test
as receipt of this new form message. If either inbox is missing the message,
pause release preparation and report that result without passwords or full
headers. No DMARC investigation is part of this task.

After all rows pass, continue directly with production packaging, existing
regression checks and a reviewed cPanel Git deployment recipe. Do not click
Deploy HEAD Commit yet. Private credentials/library/storage stay outside Git
and public_html. Noindex remains on Netlify and this protected test copy.

## Official References

- [Pinned PHPMailer release](https://github.com/PHPMailer/PHPMailer/releases/tag/v7.1.1)
- [cPanel Directory Privacy](https://docs.cpanel.net/cpanel/files/directory-privacy/)

## Historical Local Verification and Changed Files (28 October)

The browser results below were recorded on 28 October, not rerun for the
29 October path-only correction. On 29 October, all 20 repository Markdown files
were checked for stale uppercase installation paths; none remain. The regenerated
four-file ZIP matches source byte-for-byte, its three frontend files are unchanged
from the prior package, and git diff --check passes. PHP is still absent locally.

Passed: JavaScript syntax; failure-only Playwright regressions; exact API URL
assertions at /, /index.html, /v4-enquiry-test/ and /v4-enquiry-test/index.html;
initial and pre-submit readiness gates; recovery/focus; required-field validation;
duplicate/uncertain-request guards; HTML, network, failed HTTP and non-boolean
readiness rejection; no-JS phone fallback; noindex; git diff --check.

Screenshots and checks at 320, 390, 768 and 1440px passed in ready/unavailable
readiness fixtures, with no overflow, broken assets or console errors. Touch
targets were at least 44px and reduced-motion mode was exercised. These are
local UI tests, not a live PHP or SMTP success simulation. PHP is not installed
locally, so PHP lint/runtime tests and real host delivery remain outstanding.
The 28 October authenticated remote response was false; that day's unauthenticated
probe returned 401. These are historical observations, not a 29 October runtime
check. No hosting file, private config, .htaccess or DNS was changed.

The four-file protected overlay is regenerated for the current lowercase/info@ contract at:

`/Users/raiaashish/Documents/Codex/washbar-protected-test-fix-2026-10-29/protected-test-update.zip`

The existing 28 October ZIP link was refreshed with identical corrected contents
to prevent accidental reuse of the uppercase bootstrap. Its superseded version
was preserved separately in the local backups folder, not for upload.

It contains only index.html, script.js, style.css and api/enquiry-service.php;
its archive integrity was checked. Extract only inside the protected test folder,
never public_html itself. Remove the uploaded ZIP after extraction; do not leave
an archive containing PHP source on the host. It contains no .htaccess, private
config, library, storage, credentials, docs or tests. It does not update private
config paths for you: the developer must make those edits privately.

| Protected-test implementation file | Current line(s) | Purpose |
| --- | --- | --- |
| api/enquiry-service.php | 34 | Lowercase config bootstrap, corrected 29 October |
| index.html | 33, 830-833, 938 | Availability/retry markup, disabled state and asset versions |
| script.js | 124-127, 182-184, 237, 270, 309-341 | Readiness gating, relative URL resolution, recovery/focus |
| style.css | 2793, 2809-2822 | Existing text hierarchy and accessible retry treatment |
| docs/enquiry-config.example.php | 11, 13 | Correct private dependency/storage paths; no secrets |
| README.md | 160-168 | Current readiness contract and private directory |
| docs/QA-CHECKLIST.md | 27-33 | Gate, recovery and folder-path checks |
| docs/ENQUIRY-BACKEND.md | 27-38, 140-145, 173, 175, 242 | Reconcile later owner direction and case-sensitive paths |
| docs/ENQUIRY-SMTP-TEST.md | 17-121, 141, 146; this appendix | Activation instructions, evidence, limits and re-upload list |
| tests/enquiry-browser-test.cjs | 8-52, 76-149, 160, 173-175, 222 | Readiness-only enablement, root/subfolder URLs, failure/no-JS regressions |

All unrelated pre-existing working-tree changes were preserved. No commit,
push, production deployment, real enquiry submission or inbox verification
was performed in this correction.
