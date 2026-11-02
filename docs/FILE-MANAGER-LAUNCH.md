# First Launch: cPanel File Manager

Approved method, 2 November 2026. Git deployment automation is deferred.
No Terminal, server Python, .cpanel.yml deployment or private approval.json is
required for THIS manual method. Do not click either Git deployment button.
The existing Git deployment scripts remain unchanged for later work.

## Current State

| Item | Evidence |
| --- | --- |
| Protected enquiry | Owner confirms actual info@ and Gmail receipt and correct customer Reply-To |
| Root rules | Owner saved the approved merge; eight independent live redirect checks passed |
| Production package | 13 pages, 62 public files; same source_digest as the previously tested candidate |
| Fresh backup | PASSED 2 November: owner-supplied 35.5 MB ZIP, CRC/known inventory/root rules and private 92-file recovery check verified; public_html/ restore prefix |
| Actual live-root Apache/PHP | HTTP PASSED: 13 pages, 58 static file hashes, redirects, readiness available:true, protected 401 and Google verification; real production delivery still pending |
| CLI PHP lint/unit tests | Not run on cPanel; no local PHP executable. Do not label these passed |
| Production deployment | Owner explicitly approved and completed File Manager cutover; independently observed V4 serving. Local automated browser could not start; visual/console checks remain unverified |

The successful protected test is retained; do not reset credentials, libraries,
hash_secret, storage, PHP settings or working form code. No DNS/DMARC work.

## Files Prepared on the Mac

Release folder:
`/Users/raiaashish/Documents/Codex/washbar-file-manager-launch-2026-11-02/`

- `production/production-public.zip`: ONLY the 62 public website files.
- `root.htaccess.approved`: exact V4 block followed by all original eight lines.
- `production/manifest.json`: exact payload list and hashes; keep private/local.
- `VERIFICATION.json`: non-secret evidence and checks; keep private/local.

The ZIP contains index.html, style.css, script.js, robots.txt, sitemap.xml and
the assets/, api/, blog/, locations/ and our-story/ directories. No wrapper folder.
It excludes .htaccess, private config, PHPMailer, storage, docs, tests, Git,
prototypes and backups. PHP source is included only for the four public APIs.
The password and hash remain outside public_html in the existing private config.

Production HTML is index,follow with production canonicals and a 13-route
sitemap. Source/Netlify staging stays noindex. Do not upload the raw repository.

## Phase 1: Back Up, Without Changing the Website

1. Open File Manager. Enable Settings > Show Hidden Files.
2. Check available hosting disk quota. Stop if there is not enough room for
   a full current-webroot archive plus the small release. Do not delete files
   merely to clear space; ask the host if quota is uncertain.
3. Create `/home1/washbarc/private/washbar-release/` if absent. Use permissions
   0700. Do NOT change or rename `/private/washbar-enquiry/`.
4. Open `/home1/washbarc/`. Select the WHOLE `public_html` folder, not just its
   visible contents. Choose Compress > Zip Archive. Set the output to:
   `/home1/washbarc/private/washbar-release/pre-v4-webroot-2026-11-02-01.zip`
   If that name exists, use a new suffix. Never overwrite an earlier backup.
   If the dialog cannot save privately, stop; do not leave a backup in webroot.
5. Require a completed compression operation with no errors. Set archive mode
   0600, note its size, and download it to the Mac. Do not attach it to chat:
   provide only its local path so its integrity can be checked without extraction
   into the live website or printing private file contents.
6. Verify ZIP integrity and member coverage locally. It must include the original
   index.php, .htaccess, header.php, header2.php, footer.php, story.php, tips.php,
   css/, img/, js/, .well-known/, the Google verification file, legacy apps and
   v4-enquiry-test/ including its separate .htaccess. Do not assume an archive
   prefix; identify whether paths begin with public_html/ or another root.
7. Privately extract the old homepage/includes, original .htaccess, assets and
   protected auth file on the Mac and confirm the recovery files are readable.
   Record the archive path, size, checksum and actual restore prefix. This is
   an archive/recovery check, not a claim of a full hosting restore rehearsal.

The original October full-account download remains an extra disaster copy.
The new backup is tonight's current-file recovery source. External symlink
targets and files outside public_html are not covered by this webroot snapshot.
If live files change after the snapshot, refresh/reverify it before cutover.

## Phase 2: Stage Privately, Still No Live Change

1. Create a NEW empty folder:
   `/home1/washbarc/private/washbar-release/manual-2026-11-02/`
   Use mode 0700. If already used, choose a new suffix and report the actual path.
2. Inside it create an empty `payload/` folder. Upload production-public.zip
   into the manual release folder, NOT public_html and NOT the Git checkout.
3. Select the ZIP > Extract. Set extraction destination to the full private
   `.../manual-2026-11-02/payload/` path. Require successful extraction.
4. Confirm payload/ directly contains index.html, style.css, script.js, robots.txt,
   sitemap.xml and the five directories listed above. There must not be an
   accidental extra public/ or production/ wrapper. Keep the uploaded ZIP private.
5. Upload root.htaccess.approved beside payload/, not inside it. Keep it private.
   Do not rename it to the live .htaccess or activate it yet.
6. Inspect CURRENT public_html with hidden files visible. For this simple move
   procedure, these targets must all be ABSENT: assets/, api/, blog/, locations/,
   our-story/, index.html, style.css, script.js, robots.txt and sitemap.xml.
   The original inventory showed none, but do not assume that remains true.
   If ANY exists, stop and reconcile that target; never blindly merge/overwrite.
7. Confirm the fresh backup's root .htaccess matches the reviewed eight-line
   source (SHA-256 in VERIFICATION.json). If changed, review the new rules first.

STOP HERE. Report backup verification, staged paths and target conflicts.
Only after these pass request explicit final production cutover approval.
There is no automatic deployment script on this manual path.

## Phase 3: Approved Cutover Only

This section changes the live website. Do not perform it without final approval.
Keep File Manager and an independent browser open. This is a short staffed
copy-and-switch operation, not an atomic whole-site deployment.

1. Confirm the old site and protected test are still as expected, the backup is
   current, and no one is uploading/editing site files during cutover.
2. In private payload/, select ONLY the five NEW directories assets, api, blog,
   locations and our-story. Use Move to `/home1/washbarc/public_html/`.
   If a target appeared since Phase 2, stop before overwriting it.
3. Move ONLY style.css, script.js, robots.txt and sitemap.xml to the same root.
   Keep payload/index.html private until all support files are in place.
4. Check moved public directories are 0755 and files 0644. Change only release
   paths if necessary, never recursively change the whole account/webroot or
   existing protected/private folders. Stop on any failed/incomplete move.
5. Move payload/index.html into public_html. This MAY immediately select the
   new homepage, depending on Apache's inherited default. Treat it as cutover,
   not a harmless upload. Do the next step immediately in the same window.
6. Open the EXISTING root public_html/.htaccess in the text Edit action.
   Replace its contents with the exact prepared root.htaccess.approved and Save.
   Keep the cPanel-generated comments exactly. Do not use HTML Editor, rename
   index.php or delete any old PHP/includes. Retain the original backup privately.
7. Do not upload manifest/evidence/docs, release ZIPs, config.php or PHPMailer
   into public_html. Do not touch v4-enquiry-test/.htaccess, .well-known,
   google4cba3a7518b65e43.html, legacy apps/assets or private enquiry storage.

## Phase 4: Immediate Live Checks

Use a fresh private browser window and a mobile viewport. These checks are
required even though local checks and protected email delivery passed.

- Homepage displays V4, without missing CSS/images or horizontal overflow.
- Story, Blog, four articles and all six locations open through their links.
- Navigation/mobile menu, Commercial/Franchise/Community intents and sticky
  Enquiry work. Wash & Fold still routes through locations for store booking.
- `/api/enquiry-config.php` returns available:true; form readiness enables Send.
- Submit ONE uniquely labelled production enquiry with a customer email you
  control. Confirm BOTH info@ and Gmail receipt and customer Reply-To.
  If delivery is uncertain, check inboxes before retrying; preserve duplicate state.
- HTTP/www variants redirect to HTTPS non-www without loops. `/index.php`,
  `/story.php` and `/tips.php` reach their approved destinations.
- Production HTML is index,follow with production canonical URLs; no unintended
  X-Robots-Tag noindex on public HTML. API noindex is intentional. robots.txt
  and sitemap.xml load and list only production routes.
- Google verification still loads; signed-out v4-enquiry-test access still gives
  HTTP 401. Netlify staging retains its separate noindex protection.

File-copy success is not launch sign-off. Record the actual live check results.
CLI tests and production SMTP receipt cannot be inferred from local packaging.

## Rollback If a Critical Check Fails

1. Stop the cutover and note which moves/edits completed. If email delivery is
   uncertain, do not resend, clear storage or rotate the hash. Disable the existing
   private enabled flag only if needed to stop new attempts; it also affects tests.
2. Create a NEW private quarantine folder under washbar-release/.
3. Restore the exact original eight-line root .htaccess from the verified fresh
   backup using File Manager Edit. In the same window MOVE the NEW root
   index.html into private quarantine. Do not delete or rename original index.php.
   Restoring rules alone may still leave the new HTML selected by DirectoryIndex.
4. Verify the old homepage works. Quarantine only the other confirmed NEW release
   paths, using manifest.json and the Phase 2 absent-target record. Do not remove
   entire folders if they existed before launch or changed after release.
5. If any existing target was deliberately reconciled/overwritten, restore only
   that recorded path from its backup. Never extract the full archive directly
   over public_html or restore the whole account/mailbox for a website rollback.
6. Check old Story/tips/assets, Google verification and protected-test 401.
   Use a fresh browser to avoid cached 301 redirects. Leave private SMTP config,
   libraries, state, .well-known and all legacy apps untouched.

## Official File Manager Reference

https://docs.cpanel.net/cpanel/files/file-manager/
