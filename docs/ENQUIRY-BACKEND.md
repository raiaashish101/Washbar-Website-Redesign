# LAUNCH-01C: Simplified Enquiry Backend and cPanel Setup

Prepared on 15 October 2026. Supersedes the local LAUNCH-01B delivery architecture,
not its validated form UI. Hosting evidence was reconciled on 15 October 2026.
Codex made no hosting/DNS changes, deployment, commit or Git push.

LAUNCH-02 identity update, 29 October 2026: use info@wash-bar.com.au for SMTP
username, fixed From and To; keep mail.wash-bar.com.au as the SMTP hostname.
The old mail@ mailbox's successful protected SMTP submission is OWNER REPORTED
in the new brief, not independently observed here. It does not verify info@.
Do not reset the old mailbox. Fresh info@ authentication, both inbox receipts
and Reply-To are required before cutover. See [LAUNCH-02.md](LAUNCH-02.md).

Final launch brief, 29 October: the owner verified web max_execution_time is
60 seconds. The existing 40-second check passes that value and is NOT the
reported regression. Do not apply the earlier conditional 40-to-30 proposal.
Compare the protected deployment's service source with the current info@ source
first. Existing private credentials/hash are configured; do not replace or
regenerate them. See [FINAL-LAUNCH.md](FINAL-LAUNCH.md) for the exact source check.

Owner direction, 15 October 2026: retain the form. The next gate is one real
form submission received by both fixed recipients, followed by production
packaging and cPanel Git deployment preparation. Do not deploy before that
receipt check. No preview subdomain, DNS work or additional backend services.
Follow [the minimum SMTP test checklist](ENQUIRY-SMTP-TEST.md) for this step;
the longer reference and earlier verification records below remain available.

## Thirty-Second Status

```text
Before: Form -> Turnstile -> SQLite -> Resend
Now:    Form -> validation + private locked file -> PHPMailer / SMTP
                                                    To: info@wash-bar.com.au
                                                    CC: devald84@gmail.com

Confirmed: PHP 8.3 + SMTP host/port + owner-reported old-mailbox submission
Pending:   New info@ mailbox existence/authentication + both inbox receipts
SMTP acceptance != confirmed delivery to either inbox
```

On 28 October 2026 the owner first requested an active button, then clarified
that enablement and removal of the warning must depend on real PHP readiness.
The current implementation follows that later direction: submission starts
disabled, checks readiness on load and again before POST, and provides a retry
for unavailable service. The warning hides only when available is true. The
owner reconfirmed lowercase private on 29 October 2026; bootstrap, dependency
paths and documentation now match `/home1/washbarc/private/washbar-enquiry/`.
This supersedes the 28 October uppercase-directory assumption. The earlier
available:false response does not identify which readiness check failed; a
directory mismatch is not an established root cause. Private/runtime checks
still need to pass. See the minimum test guide for exact cPanel actions. Netlify
remains noindex,follow with submission disabled. No email success was simulated.

## Preserved Work and Owner Decisions

All 30 pre-simplification modified/untracked files were saved and archive entries
verified before editing. Recoverable local backup, outside the repository:

```text
/Users/raiaashish/Documents/Codex/washbar-backups/launch-01b-before-smtp-2026-10-15/
  working-files.tar.gz
  tracked-changes.patch
  manifest.json
```

Base commit: 128e683cd003ae76ae1b23867959cbf33bc80b9a, main.
The archive includes the previous backend guide and both test files. It is not a
hosting/private-runtime backup. To recover, extract into a separate empty local
folder, review its manifest and selectively restore; do not overwrite current
work or public_html blindly. Keep older runtime data if any previous backend was
ever enabled; reconcile uncertain attempts before changing transports.

The owner's LAUNCH-02 update on 29 October specifies the current contract:

| Setting | Fixed server-side value |
| --- | --- |
| SMTP username / From / envelope sender | info@wash-bar.com.au (Wash Bar Enquiries) |
| To | info@wash-bar.com.au |
| CC | devald84@gmail.com |
| Reply-To | Customer's validated email and name |
| Subject | New Wash Bar Enquiry followed by an em dash and the allowlisted type |

The former mailbox's manual Webmail send/receive and later protected SMTP
submission are owner-reported historical evidence. The new info@ mailbox must
be verified separately; neither its authentication nor form delivery is established.
Gmail remains backend-only. No new public email links or Organization email were
added. The Australian phone remains 0430 455 920 / tel:+61430455920. East Windsor
still has no phone/hours/Call/phone-booking controls. Story/Community approvals
and other business content are unchanged.

## Hosting Readiness Checklist

Evidence below was supplied by the owner on 15 October 2026, including cPanel
and Webmail screenshots. It was not independently re-tested against the host
by Codex. No password or DKIM private key was requested, accessed or recorded.

| Component | Evidence / status | Remaining check |
| --- | --- | --- |
| Hosting | cPanel/Apache; https://wash-bar.com.au/; /home1/washbarc/public_html/ | No production changes authorised |
| PHP selection | Inherited PHP 8.3, ea-php83, owner-confirmed | Meets code's PHP 8.2 minimum; check web/CLI modules and runtime limits |
| SMTP parameters | mail.wash-bar.com.au, port 465, implicit TLS/SMTPS, authentication required | Configured in the disabled template; actual PHP connection/authentication pending |
| SMTP username / From / To | info@wash-bar.com.au, owner-confirmed in LAUNCH-02 | New mailbox must exist; enter its password privately, never in Git |
| Business mailbox | Former mailbox manual send/receive and old SMTP submission owner-reported | Does not establish info@ authentication or delivery |
| CC | devald84@gmail.com, approved backend-only copy recipient | Actual form receipt in this inbox is NOT tested |
| cPanel forwarders | None configured, per owner | No cPanel forwarder conflict found; still test actual To/CC delivery |
| SPF / DKIM / PTR | VALID in supplied cPanel evidence | Check authentication/alignment on actual form-generated mail |
| DMARC / DNS authority | Problems Exist; authoritative DNS at Digital Pacific | Separate DNS investigation/correction before final deliverability sign-off |
| PHP extensions / filesystem / CA trust | Not yet checked on the hosting account | OpenSSL, json/hash, TLS streams, private permissions, flock/fsync/rename and limits |
| Private PHPMailer / configuration | Owner reports installed and ready under the former identity | Retain installation/storage; update private username/password and retest new identity |
| Certificate / authenticated send | NOT tested through PHPMailer | Validate mail.wash-bar.com.au against certificate chain/name; never bypass TLS checks |
| Real form / both inboxes / Reply-To | NOT tested | Run four enquiry types and obtain both receipt confirmations |

Before this evidence update, the existing 31-file working tree was preserved at:
/Users/raiaashish/Documents/Codex/washbar-backups/launch-01c-before-confirmed-hosting-2026-10-15/
The archive contains working files, a tracked diff and manifest; all 31 archive
entries were verified. Earlier backups/history above remain preserved.

## Architecture

| File | Role |
| --- | --- |
| index.html | Existing native labelled form, four types, optional phone, honeypot, errors/status and phone alternative |
| script.js | Intent preselection, inline validation, sending state, one pending request and truthful accepted/failure states; no captcha script |
| api/enquiry.php | Existing JSON POST adapter; size/origin checks and safe responses |
| api/enquiry-config.php | GET readiness; returns only available, never SMTP settings or addresses |
| api/enquiry-service.php | Existing validation adapted to private locked JSON rate/duplicate metadata and fixed notification content |
| api/enquiry-smtp.php | PHPMailer authenticated TLS SMTP; both recipients required before DATA; acceptance tracking and timeouts |
| docs/enquiry-config.example.php | Empty, disabled template; real password belongs only in a private server copy |
| tests/enquiry-service-test.php | Failure-only PHP validation, rate, recipient, duplicate, state-permission and corrupt-state checks |
| tests/enquiry-browser-test.cjs | Local-only failure fixtures; retry/phone regression checks, never SMTP acceptance simulation |

Removed runtime dependencies: Resend API/key/domain setup, Cloudflare
Turnstile/widget/token verification, SQLite/PDO and cURL.
PHPMailer is the one explicitly requested mail library, installed privately
during setup. It is not vendored into this static repository. No Composer/build
tool, framework, queue, PHP mail() fallback, analytics or background job was added.

## Contact Journeys and Accessibility

| Journey | Destination/type |
| --- | --- |
| Header/footer Contact; mobile sticky Enquiry | #enquiry -> General enquiry |
| Commercial section/option | #contact-commercial or #enquiry-form -> Commercial laundry |
| Airbnb guide | ../../index.html#contact-commercial -> Commercial laundry |
| Franchise | #contact-franchise -> Franchise enquiry |
| Community | #contact-community -> Community partnership |
| Wash & Fold booking | #locations -> specific store -> phone booking, not an online booking |

Only the four exact types are accepted, including an allowlisted enquiry query
parameter. Selection stays editable. Native labels/select, error-summary focus,
associated inline errors, live status and the existing visible focus/reduced-motion
styling remain. Without JavaScript, submission is disabled and the Australian
phone link is an explicit accessible alternative.

The button reads Send enquiry, then Sending... during submission's readiness recheck/POST, and
Enquiry submitted only after a verified SMTP acceptance response. It is disabled
while readiness is pending/unavailable, an attempt is pending or after acceptance
(until input changes). Initial readiness gates the button; unavailable service
keeps its warning and exposes Check availability again. Readiness is also checked
afresh for each valid attempt. A failed readiness check does
not mark a new enquiry as possibly sent; uncertainty from a prior POST is retained.
Values remain after errors. No timer, click or validation result generates success.

## Exact Configuration Requirements

The confirmed inherited PHP 8.3 (ea-php83) satisfies the code's PHP 8.2 minimum.
No PHP upgrade or handler change is required by this task. Required runtime
capabilities remain unverified: OpenSSL/TLS streams, core json/hash, secure CA
trust, writable private files, working flock/fsync and atomic rename on the
hosting filesystem. No SQLite, PDO, cURL or mbstring requirement. A selected PHP
version does not establish that these extensions/functions are enabled.

A finite PHP execution limit must be at least 40 seconds; 60 recommended.
SMTP connection/command timeouts are five seconds, with a 25-second command
budget. These are not an inbox-delivery deadline. Slow socket operations can
extend that budget; the browser aborts after 45 seconds and treats a lost response
as uncertain. Host/proxy limits must allow normal completion.

| Private setting | Required value / how to obtain |
| --- | --- |
| enabled | false until an approved protected test copy is ready |
| smtp_confirmed | false in Git; enable only for authorised protected testing after private setup/capability checks; not proof of authentication or receipt |
| smtp_host | mail.wash-bar.com.au, owner-confirmed |
| smtp_port | 465, owner-confirmed; other ports rejected by this candidate |
| smtp_encryption | ssl in private config; PHPMailer::ENCRYPTION_SMTPS in the adapter; implicit TLS, not STARTTLS |
| smtp_username | Full mailbox address info@wash-bar.com.au, not the former mailbox |
| smtp_password | Actual mailbox password, entered only into private server config |
| phpmailer_dir | /home1/washbarc/private/washbar-enquiry/PHPMailer |
| hash_secret | Private random value, at least 64 characters |
| storage_dir | /home1/washbarc/private/washbar-enquiry/storage |
| allowed_origins | Exact approved HTTPS origins, no trailing slash; initially the protected test origin |

The non-secret host/port/encryption/username are now populated from owner evidence.
Password and hash_secret remain intentionally empty, allowed_origins contains
the approved same-domain origin, and both template activation flags are false.
Authentication stays required; TLS peer/name checks
stay enabled with peer_name set to mail.wash-bar.com.au through the private host
setting. No password was inferred or stored in Git.
The fixed From/To/CC cannot be overridden through config or browser fields.
Readiness checks configuration/library/storage, NOT a live SMTP login or inbox receipt.

## Beginner-Friendly cPanel Setup

These are manual instructions for a separately authorised setup, not actions
performed by Codex in this task. Do not alter the public homepage, DNS or global
PHP settings while checking capabilities.

### 1. Check the remaining runtime capabilities

The mailbox, manual Webmail test, PHP selection and SMTP parameters are already
owner-confirmed. Do not reset the mailbox, change inherited PHP or repeat these
as unresolved facts. Check the missing runtime pieces instead.

In an authorised cPanel Terminal session, the documented version-specific CLI
path is /usr/local/bin/ea-php83. First confirm it exists and reports PHP 8.3:

```sh
/usr/local/bin/ea-php83 -v
/usr/local/bin/ea-php83 -m
/usr/local/bin/ea-php83 -r '
foreach (["openssl", "json", "hash"] as $name) {
    printf("extension %s: %s\n", $name, extension_loaded($name) ? "available" : "MISSING");
}
foreach (["stream_socket_client", "flock", "fsync", "rename", "random_bytes", "hash_hmac"] as $name) {
    printf("function %s: %s\n", $name, function_exists($name) ? "available" : "MISSING");
}
echo "SSL transport: ", in_array("ssl", stream_get_transports(), true) ? "available" : "MISSING", "\n";
echo "Execution limit: ", ini_get("max_execution_time"), "\n";
'
```

These checks do not read secrets or send mail. If the CLI path is absent, ask
the host for its PHP 8.3 CLI path; do not install packages or alter PHP settings.
CLI capabilities can differ from the web handler: confirm the protected copy
also inherits ea-php83 and passes backend readiness under the actual web account.
The existing PHP test suite/private readiness then exercises filesystem access.
Do not publish phpinfo or a new public diagnostic endpoint.

During authorised integration, check the SMTP certificate from the host:

```sh
openssl s_client -connect mail.wash-bar.com.au:465 \
  -servername mail.wash-bar.com.au -verify_hostname mail.wash-bar.com.au \
  -verify_return_error </dev/null
```

This optional TLS-only connection does not authenticate or submit a message.
It is not a replacement for PHPMailer's actual PHP trust-store/SMTP test. If
hostname, chain or certificate dates fail, stop and ask the host; do not disable
peer verification or silently substitute the Mail HELO/PTR hostname. Confirm
outbound authenticated SMTP and account sending limits with the host as needed.

Do not paste the mailbox password into chat, GitHub or a screenshot.

### 2. Prepare private code/config/storage

1. With owner approval, use File Manager outside public_html to create:
   /home1/washbarc/private/washbar-enquiry/ and its storage/ folder.
   Set private directories to 0700, owned/readable by the site's PHP account.
2. Download the official PHPMailer v7.1.1 release ZIP. Extract it and upload the
   PHPMailer folder privately at the path above, keeping src/Exception.php,
   src/PHPMailer.php, src/SMTP.php and its LICENSE. Do not copy examples/debug
   scripts into public_html. This integration was source-reviewed against 7.1.1;
   review and retest when updating. Older versions are rejected.
3. Copy docs/enquiry-config.example.php to that private folder as config.php.
   Set config.php to 0600 and edit ONLY that private copy with confirmed SMTP
   settings and password. The repository template now includes non-secret
   confirmed settings; keep its password/hash secret blank and flags disabled.
4. Generate hash_secret privately, for example with:
```sh
/usr/local/bin/ea-php83 -r 'echo bin2hex(random_bytes(32)), PHP_EOL;'
```
   Keep that output private. Runtime metadata/lock files are created with 0600.
   Do not relax permissions if PHP cannot access them; ask the host instead.
5. The default private config path is used automatically. A server-controlled
   WASHBAR_ENQUIRY_CONFIG may select another private path, never a URL/request field.

### 3. Test without replacing the live website

1. With approval, create a separate password-protected test folder using cPanel
   Directory Privacy. No preview subdomain or DNS change is needed.
2. Copy the candidate homepage/CSS/JS/assets and four api/ PHP files to that
   protected copy, retaining noindex,follow. Do not upload docs, tests, Git,
   backup archives, passwords, private config/storage or PHPMailer publicly.
3. The form uses relative API paths, so it works within the protected folder.
   Set allowed_origins to its exact HTTPS origin. Basic authentication must
   protect the API too. A same-host Origin is not a substitute for authentication.
4. Complete the runtime/TLS/private setup checks, then authorise only this test
   copy through private enabled/smtp_confirmed. These readiness switches permit
   the integration attempt; they do not record successful authentication or
   email delivery. They stay false in the repository. No production approval.
5. First send one clearly identified General enquiry TEST, using an email the
   owner controls. Check both inboxes/spam folders and Reply-To; obtain client
   receipt confirmation. Verify From/To/CC, customer Reply-To, type, body, UTC
   timestamp and one reference. Record separate To received / CC received /
   Reply-To correct results, not merely SMTP accepted. This first real receipt
   is the owner's gate for release preparation; the existing regression checks
   still cover all four allowed enquiry types before deployment.
6. Keep production untouched. If integration fails, set enabled false and retain
   phone contact. A later approved release must use an explicit public-file allowlist.

Netlify is static and could serve PHP source/docs as downloads. Before any future
push/deploy, the publish allowlist must exclude api/, docs/, tests/, content/,
private files and archives. The Netlify hostname guard is not source-access
control. No deployment configuration was changed in this task.

## DMARC Is Separate

The supplied cPanel evidence shows SPF, DKIM and PTR VALID and a DMARC problem.
It does not show a broken DKIM setup or prove the exact current DMARC TXT value.
No authoritative DNS lookup or record modification was performed here.

Digital Pacific is authoritative for this domain. Under a separate authorised
DNS task, inspect the existing _dmarc.wash-bar.com.au TXT record first, then
review/correct the single DMARC policy without adding a duplicate. Do not use
cPanel's Install The Suggested Record button as an authoritative-DNS fix here.
The suggested v=DMARC1; p=none; requests no quarantine/reject enforcement; without
an approved rua it does not request aggregate reports. Do not publish the private
Gmail address as a DNS reporting destination without separate approval.

This warning does not block code preparation or controlled integration testing.
Resolve/recheck it before final production deliverability sign-off, including
authentication/alignment on real form-generated mail. Valid domain records alone
are not proof of message-level authentication or receipt. Do not view/share the
DKIM private key, regenerate keys, change SPF/MX/PTR or modify DNS in this task.

## Security, Rate Limits and Duplicate Handling

- Same-origin HTTPS JSON POST only; 16 KiB request limit, depth limit, exact type
  allowlist and unknown-field rejection. From/To/CC/Reply-To/subject browser
  overrides are rejected. Reply-To is only the validated customer email.
- Limits: type 40, name 100, email 254, phone 32, message 4000 bytes. Optional
  phone accepts ordinary formatting but needs six digits if supplied.
  UTF-8/control/header injection checks remain. Nonempty honeypot is rejected.
- Email is plain text with UTF-8/base64 formatting. No customer HTML is rendered.
  SMTPAuth is always enabled, TLS peer/name checks stay on, debug stays off.
  No unauthenticated mail() fallback exists.
- Both SMTP recipient commands must succeed before the message body is sent.
  Success requires final DATA acceptance, not connection/authentication alone.
  Later bounces/filtering/quota problems can still prevent inbox delivery.
- Basic rate limiting: five attempts per IP and 100 total per ten-minute fixed
  window. Rejected IP retries do not consume other visitors' global quota.
  REMOTE_ADDR is used, never untrusted forwarding headers. Verify any real
  reverse-proxy arrangement with the host before release.
- One private lock file protects read/modify/write metadata. State is written to
  a flushed/synced temporary file then atomically renamed under the lock. No lock is held over
  SMTP. Corrupt/unwritable/non-private/oversized state fails closed, never resets.
- Only HMAC digests, counts, timestamps, UUIDs and states are stored, not customer
  name/email/phone/message or raw IP. State is bounded to 1 MiB/2,000 submissions.
  Ordinary records age out after 24 hours; unknown records require reconciliation.
- One browser request at a time; pending records have a 120-second lease.
  Expired pending records become unknown. Identical content within the retained
  window uses its original reference. Previously accepted records return their
  real stored acceptance without a second SMTP send.
- SMTP has no Resend-style idempotency API. A stable Message-ID is NOT a delivery
  deduplication guarantee. A known failure before DATA is retryable; uncertain
  DATA/acknowledgement failures are blocked from automatic resend, even with a
  fresh UUID for identical content. Ask the business to check before retrying.
- Frontend uncertainty persists through later validation/rate errors. Changing
  details cannot silently clear it. A refresh loses browser state; changed
  content/new references can bypass content matching, so do not present perfect
  exactly-once delivery. Use the phone fallback to resolve uncertainty.
- Honeypot/rate limits are a lightweight launch baseline, not CAPTCHA-equivalent
  bot identification or a guarantee of no spam. Monitor inboxes, disk/state,
  SMTP quotas, bounces and shared-network false positives.

Error responses do not expose SMTP passwords, connection details, raw mailer
errors or customer content. No personal data is logged by application code.
Review hosting/mailbox logs, retention and authorised access before live collection.

## Endpoint and Testing

GET api/enquiry-config.php returns only available. POST api/enquiry.php accepts
enquiryType, name, email, optional phone, message, empty website, UUID reference.
There is no token field. Success is HTTP 200, ok true, status accepted, reference.
This is a contract, not evidence of a test delivery. No 202/durable queue claim.

Failures: 400 malformed/unknown fields, 403 origin, 405 method, 413 size, 415 type,
422 validation/honeypot, 429 rate (Retry-After 600), 409 duplicate/changed/uncertain,
503 unavailable/SMTP failure. Values remain; errors announce accessibly.

Local PHP is absent: syntax/runtime/file-lock/PHPMailer tests remain NOT RUN.
PHP 8.3 is confirmed on the host, but no host runtime suite has run in this task.
From a private QA copy of the repository outside public_html, use its PHP 8.3 CLI:

```sh
/usr/local/bin/ea-php83 -l api/enquiry-service.php
/usr/local/bin/ea-php83 -l api/enquiry-smtp.php
/usr/local/bin/ea-php83 -l api/enquiry.php
/usr/local/bin/ea-php83 -l api/enquiry-config.php
/usr/local/bin/ea-php83 -l docs/enquiry-config.example.php
/usr/local/bin/ea-php83 tests/enquiry-service-test.php
```

The PHP suite uses temporary private files and rejected-send fixtures. It never
opens SMTP or fabricates accepted delivery. Live integration tests must additionally
check both recipient rejection paths, auth/TLS failure, DATA timeout/lost reply,
concurrent requests and the real four-type mailbox/Reply-To experience.
Also check invalid email, blank required fields, nonempty honeypot, sixth-IP
attempt/429, controlled authentication failure, retained values and one pending
request. Run failure scenarios only in the isolated copy with owner approval;
never interrupt the live mailbox or edit production credentials to create an error.

The local-only browser suite uses the existing QA runtime, no new project
dependencies. In one terminal from the repository:

```sh
python3 -m http.server 4190 --bind 127.0.0.1
```

In another terminal:

```sh
env PLAYWRIGHT_MODULE=/Applications/ChatGPT.app/Contents/Resources/cua_node/lib/node_modules/playwright \
  CHROME_PATH='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' \
  /Applications/ChatGPT.app/Contents/Resources/cua_node/bin/node tests/enquiry-browser-test.cjs
```

Stop the local server with Ctrl+C afterward. Equivalent existing QA runtimes may
be used on other machines. The suite rejects non-local origins; every email
request is intercepted with failure, never a simulated successful email.

## Verification and Remaining Gates

Earlier SMTP-simplification browser evidence: /private/tmp/washbar-smtp-qa/report.json.
Responsive captures: contact-320.png, contact-390.png, contact-768.png,
contact-1440.png. These are local Chrome/fixture checks, not live PHP or inbox tests.
This hosting-evidence update does not change HTML, CSS, JavaScript or browser tests;
the earlier responsive run is preserved, not reported as a new host integration run.

| Check | Status |
| --- | --- |
| Browser retry/phone regression suite | PASSED; no SMTP or accepted response simulated |
| Full responsive/contact/keyboard/no-JS regression | PASSED: 13 routes x 320/390/768/1440px; six contact journeys including Airbnb/sticky, error-summary focus, retained values, double click, menus/galleries and 48 internal targets |
| PHP syntax/runtime/private file tests | NOT RUN: PHP executable unavailable locally |
| PHP selection / former business mailbox | OWNER CONFIRMED: PHP 8.3; historical manual send/receive and old protected SMTP submission |
| Host modules / private setup / new PHPMailer identity / certificate | Fresh info@ identity test NOT RUN; old-mailbox evidence does not transfer |
| Real info@ / CC receipts and Reply-To | NOT VERIFIED; both new-message inbox receipts remain required |
| SPF / DKIM / PTR / DMARC | cPanel evidence: first three VALID; DMARC Problems Exist, Digital Pacific follow-up separate |
| Staging noindex / static Git checks | PASSED: all 13 customer routes retain noindex,follow; JS syntax and git diff --check pass; no normal-route console errors or horizontal overflow |
| Production / hosting / DNS / deployment | UNCHANGED |

No screen-reader, real-device dialler or Safari/Firefox claim is made.
No generate_lead or analytics infrastructure was added. A future accepted-reference
event is SMTP acceptance, not inbox delivery; never include customer fields or
internal references in analytics.

## Handover, Rollback and Sources

The business and client receive the same notification body, with the type in its
subject, customer fields, UTC timestamp and internal reference. Reply uses the
customer email. CC is visible in these internal notification headers as requested.
For missing mail, check both inboxes/spam and cPanel Track Delivery/bounce records;
SMTP acceptance is not delivery proof. Do not share customer messages publicly.

On an outage, disable private enabled and keep phone contact. Retain state while
reconciling unknown attempts. Do not delete state or rotate hash_secret to force
retries. Restore only approved release files from a reviewed backup, never hosting
credentials or unrelated changes. This task did not deploy anything.

Primary references checked on 15 October 2026:
- [PHPMailer documentation](https://github.com/PHPMailer/PHPMailer).
- [PHPMailer v7.1.1 release](https://github.com/PHPMailer/PHPMailer/releases/tag/v7.1.1).
- [SMTP implementation reviewed](https://github.com/PHPMailer/PHPMailer/blob/v7.1.1/src/SMTP.php).
- [cPanel Connect Devices / secure settings](https://docs.cpanel.net/cpanel/email/set-up-mail-client/).
- [cPanel PHP CLI paths](https://docs.cpanel.net/ea4/basics/easyapache-4-file-system-layout/).
- [cPanel deliverability and external DNS](https://docs.cpanel.net/cpanel/email/email-deliverability-in-cpanel/).
- [DMARC policy/reporting tags](https://www.rfc-editor.org/rfc/rfc7489.html#section-6.3).

## Historical 15 October Changed Files

Historical hosting-evidence reconciliation: only the seven files below changed.
The other 24 already-dirty files, including HTML, CSS, JavaScript and tests, are
unchanged from the verified 31-file pre-update backup. Cumulative Git state:
23 modified tracked files + 8 untracked files, all unstaged/uncommitted.
No new files were introduced by this reconciliation; no push/deploy occurred.

| File | Current lines | Change in this update |
| --- | --- | --- |
| api/enquiry-service.php | 55 | Require the confirmed port 465 / ssl combination |
| api/enquiry-smtp.php | 69; 73-76 | Explicit PHPMailer SMTPS constant; retain peer checks and set certificate peer_name to the private SMTP host |
| docs/enquiry-config.example.php | 5-8 | Confirmed mail.wash-bar.com.au:465 / ssl values, with activation flags off and password still empty |
| docs/ENQUIRY-BACKEND.md | 1-453 | Reconcile owner evidence, PHP 8.3/runtime checklist, private setup, protected tests, DMARC separation and honest verification status |
| README.md | 162; 166-170 | Manual mailbox/PHP/SMTP evidence distinguished from pending form integration |
| docs/CONTENT-STATUS.md | 25; 27-29 | Record confirmed hosting, manual email and DNS evidence without claiming PHPMailer/CC receipt |
| docs/QA-CHECKLIST.md | 31-37; 43-46 | PHP runtime, SMTPS hostname and real-message/deliverability gates |

The earlier SMTP-simplification change inventory and code are preserved in the
pre-confirmation backup's guide. The older LAUNCH-01B implementation also remains
recoverable from the separate pre-simplification backup; neither was reverted.
