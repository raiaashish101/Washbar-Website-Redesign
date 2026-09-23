# SEO-00: V4 SEO Baseline

Audit date: 23 September 2026. Evidence: current working tree, Netlify project/deploy
metadata and direct HTTPS responses. No domain migration or deployment performed.

## Authority Correction and Runtime Recheck

The current repository is authoritative for V4 business facts, routes, content
decisions and implementation state. A deployed Netlify page is evidence of what
is publicly served at audit time, not permission to overwrite newer repository
decisions. Any difference between them is deployment drift.

The legacy `wash-bar.com.au` site may be inspected only for legacy URL inventory,
migration planning, redirect mapping, historical content structure and
search-equity preservation. It is not a source for current prices, hours,
service promises, contact details, amenities, commercial offers or community
claims.

Runtime recheck: 23 September 2026 at approximately 20:10 AEST.

- `washbarlaundromat.netlify.app` and `main--washbarlaundromat.netlify.app`
  returned HTTP 200 for all eight V4 routes and both prototypes.
- Neither mutable alias returned an HTML robots directive or an
  `X-Robots-Tag` header.
- The six deployed location pages still use the earlier titles and contain no
  `DryCleaningOrLaundry` or `BreadcrumbList` JSON-LD.
- Both mutable aliases returned root ETag
  `"0ed5853558881024d50bb03b911b4616-ssl"`, matching the previously recorded
  immutable deployment hostname.
- The repository contains the newer noindex protection and SEO-01 location
  work. Repository decisions remain authoritative; Netlify requires a reviewed
  deployment and post-deploy reconciliation.

The detailed route records below preserve the point-in-time SEO-00 snapshot.
Where later work differs, inspect the current source and its current governance
documents rather than treating the snapshot as current fact.

> **REMOVE STAGING NOINDEX DURING SEO-05 DOMAIN MIGRATION.**
> Remove only from approved production pages. Retain staging protection and keep
> prototypes excluded/noindexed. Local source protection is NOT proof of live protection.

## Status Legend

- **PASS**: verified within the explicitly stated scope.
- **NEEDS WORK**: technical gap or pending deployment/verification.
- **CLIENT INPUT**: missing confirmation/access, not permission to invent facts.
- **LAUNCH ONLY**: deferred domain/migration change, not part of SEO-00.

## At a Glance

| Check | SEO-00 starting state | Current repository / runtime status |
| --- | --- | --- |
| HTML inventory | 8 V4 pages + 2 public prototypes | Same 10 pages |
| Robots meta | Absent on all 10 | Repository: `noindex,follow` on all 10. Mutable Netlify aliases: still absent |
| Main Netlify indexing eligibility | Allowed by observed responses | NEEDS WORK: runtime recheck still finds mutable aliases eligible for indexing |
| Titles/descriptions | One each, all 10 unique across distinct pages | Repository: six location pages updated by SEO-01. Netlify: earlier metadata remains deployed |
| H1 | Exactly one on every page | Preserved |
| Canonicals | None | LAUNCH ONLY: intentionally not added |
| robots.txt / sitemap.xml | Absent locally; live 404 | Not added |
| Structured data | None on any page | Repository: six location pages now use `DryCleaningOrLaundry` and `BreadcrumbList`. Netlify: absent |
| Visible breadcrumbs | None on location pages | Repository: present on all six location pages. Netlify: absent |
| Open Graph / Twitter metadata | None on any page | NEEDS WORK: future scoped metadata |
| Internal file/fragment references | 371 occurrences, zero broken | SEO-00 snapshot preserved; later scoped verification is recorded with its task |
| Body/layout code | Existing V4 | SEO-00 was head-only; later SEO-01 location-page work is now in source |
| Publication | Live deploy predates task | Runtime recheck confirms deployment drift remains |

Titles are distinct but the homepage title is brand-only. Story H1 is evocative
rather than descriptive. These are future content/SEO review opportunities,
not missing-heading failures, and were not rewritten.

## Hosting and Indexability Evidence

Netlify project: `washbarlaundromat`, site ID
`7dbeadae-9295-47d0-a345-33d8ed2feb87`. The SEO-00 connector record identified
deploy `6aa96456ba94c800082e1e4f`, branch `main`, published 15 September 2026.
The runtime recheck above verifies the served responses rather than assuming
that recorded deployment metadata remains current.
Netlify labels its context "production"; the owner uses it as staging.
There is no site password/SSO configured in returned project metadata.

| Public hostname discovered | Root response | Robots observation | Status |
| --- | --- | --- | --- |
| washbarlaundromat.netlify.app | 200 | No robots meta or X-Robots-Tag | NEEDS WORK: eligible for indexing |
| main--washbarlaundromat.netlify.app | 200 | No robots meta or X-Robots-Tag | NEEDS WORK: eligible for indexing |
| 6aa96456ba94c800082e1e4f--washbarlaundromat.netlify.app | 200 | X-Robots-Tag: noindex; no HTML robots meta | PASS: this immutable deployment root is protected by Netlify |

These are all hostnames returned by the connected project/current-deployment
records, with their roots checked directly. The connector did not provide a
complete historical deploy/PR-preview inventory. Do not infer that older deploy
hostnames do not exist or that they share these headers. Audit any remaining
historical previews through Netlify before declaring complete host coverage.

On the main hostname all eight V4 routes and both prototypes returned HTTP 200
with no robots meta, no X-Robots-Tag and no canonical/Link header.
`/index.html` and `/our-story/index.html` also return 200 without redirecting,
alongside their directory routes. These are confirmed duplicate URL variants.
The other six explicit index.html files exist and are linked internally; their
directory variants also return 200. Normalisation is a migration dependency.

Indexing eligibility is not evidence that Google has indexed these URLs.
Search Console/index coverage was not available. No search-result removal is
claimed. A crawler must revisit a page to process noindex.

## Route Inventory (SEO-00 Snapshot)

All pages below have exactly one title, description and H1, no canonical and no
Open Graph/Twitter metadata. Their detailed text at SEO-00 audit time is
preserved here; it is not a replacement for current repository inspection.
The future production destinations are in [SEO-URL-MAP.md](SEO-URL-MAP.md).

### `/`

- Source: `index.html`
- Classification: Homepage with service, review, commercial, community, franchise and contact sections.
- H1: Fresh, spotless laundry. Six places to find us.
- Title: Wash Bar Laundromat
- Meta description: Wash Bar Laundromat. Self-service laundry, phone-booked Wash and Fold, commercial laundry, and six locations in Melbourne and the USA.
- Index status: **PASS (source only)**: `noindex,follow`; **NEEDS WORK (live)**: deploy/recheck. Before: no robots meta.
- Structured data: **NEEDS WORK**: absent; no JSON-LD, Microdata or RDFa detected.
- Breadcrumbs: **PASS**: no breadcrumb required for homepage/prototype inventory.
- Content risk: **CLIENT INPUT**: creative collaboration and franchise launch approval; form has no delivery backend.
- Future work: **LAUNCH ONLY**: canonical/URL normalisation and production noindex removal under SEO-05; review social metadata and structured data in later scoped work.

### `/locations/ascot-vale/`

- Source: `locations/ascot-vale/index.html`
- Classification: Location/service information.
- H1: Ascot Vale
- Title: Ascot Vale laundry - Ascot Vale Road | Wash Bar
- Meta description: Visit Wash Bar Ascot Vale at 142 Ascot Vale Road, Flemington. Self-service laundry and Wash & Fold by advance booking.
- Index status: **PASS (source only)**: `noindex,follow`; **NEEDS WORK (live)**: deploy/recheck. Before: no robots meta.
- Structured data: **NEEDS WORK**: absent; no JSON-LD, Microdata or RDFa detected.
- Breadcrumbs: **NEEDS WORK**: no semantic breadcrumb; assess during later SEO architecture.
- Content risk: **PASS**: confirmed store details and photographs in canonical location records.
- Future work: **LAUNCH ONLY**: canonical/URL normalisation and production noindex removal under SEO-05; review social metadata and structured data in later scoped work.

### `/locations/east-windsor/`

- Source: `locations/east-windsor/index.html`
- Classification: Location/service information.
- H1: East Windsor
- Title: East Windsor laundry - 370 US-130 | Wash Bar
- Meta description: Visit Wash Bar East Windsor at 370 US-130, East Windsor, NJ 08520, United States. Self-service laundry and Wash & Fold by advance booking.
- Index status: **PASS (source only)**: `noindex,follow`; **NEEDS WORK (live)**: deploy/recheck. Before: no robots meta.
- Structured data: **NEEDS WORK**: absent; no JSON-LD, Microdata or RDFa detected.
- Breadcrumbs: **NEEDS WORK**: no semantic breadcrumb; assess during later SEO architecture.
- Content risk: **CLIENT INPUT**: phone/hours missing; safely omitted. Photos are now CLIENT CONFIRMED.
- Future work: **LAUNCH ONLY**: canonical/URL normalisation and production noindex removal under SEO-05; review social metadata and structured data in later scoped work.

### `/locations/fitzroy/`

- Source: `locations/fitzroy/index.html`
- Classification: Location/service information.
- H1: Fitzroy
- Title: Fitzroy laundry - Brunswick Street | Wash Bar
- Meta description: Visit Wash Bar Fitzroy at 461 Brunswick Street, Fitzroy. Self-service laundry and Wash & Fold by advance booking.
- Index status: **PASS (source only)**: `noindex,follow`; **NEEDS WORK (live)**: deploy/recheck. Before: no robots meta.
- Structured data: **NEEDS WORK**: absent; no JSON-LD, Microdata or RDFa detected.
- Breadcrumbs: **NEEDS WORK**: no semantic breadcrumb; assess during later SEO architecture.
- Content risk: **PASS**: confirmed store details and photographs in canonical location records.
- Future work: **LAUNCH ONLY**: canonical/URL normalisation and production noindex removal under SEO-05; review social metadata and structured data in later scoped work.

### `/locations/flemington/`

- Source: `locations/flemington/index.html`
- Classification: Location/service information.
- H1: Flemington
- Title: Flemington laundry - Racecourse Road | Wash Bar
- Meta description: Visit Wash Bar Flemington at 262 Racecourse Road, Flemington. Self-service laundry and Wash & Fold by advance booking.
- Index status: **PASS (source only)**: `noindex,follow`; **NEEDS WORK (live)**: deploy/recheck. Before: no robots meta.
- Structured data: **NEEDS WORK**: absent; no JSON-LD, Microdata or RDFa detected.
- Breadcrumbs: **NEEDS WORK**: no semantic breadcrumb; assess during later SEO architecture.
- Content risk: **PASS**: confirmed store details and photographs in canonical location records.
- Future work: **LAUNCH ONLY**: canonical/URL normalisation and production noindex removal under SEO-05; review social metadata and structured data in later scoped work.

### `/locations/north-melbourne/`

- Source: `locations/north-melbourne/index.html`
- Classification: Location/service information.
- H1: North Melbourne
- Title: North Melbourne laundry - Peel Street | Wash Bar
- Meta description: Visit Wash Bar North Melbourne at 138 Peel Street, Melbourne. Self-service laundry and Wash & Fold by advance booking.
- Index status: **PASS (source only)**: `noindex,follow`; **NEEDS WORK (live)**: deploy/recheck. Before: no robots meta.
- Structured data: **NEEDS WORK**: absent; no JSON-LD, Microdata or RDFa detected.
- Breadcrumbs: **NEEDS WORK**: no semantic breadcrumb; assess during later SEO architecture.
- Content risk: **PASS**: confirmed store details and photographs in canonical location records.
- Future work: **LAUNCH ONLY**: canonical/URL normalisation and production noindex removal under SEO-05; review social metadata and structured data in later scoped work.

### `/locations/west-melbourne/`

- Source: `locations/west-melbourne/index.html`
- Classification: Location/service information.
- H1: West Melbourne
- Title: West Melbourne laundry - Spencer Street | Wash Bar
- Meta description: Visit Wash Bar West Melbourne at 501 Spencer Street, Melbourne. Self-service laundry and Wash & Fold by advance booking.
- Index status: **PASS (source only)**: `noindex,follow`; **NEEDS WORK (live)**: deploy/recheck. Before: no robots meta.
- Structured data: **NEEDS WORK**: absent; no JSON-LD, Microdata or RDFa detected.
- Breadcrumbs: **NEEDS WORK**: no semantic breadcrumb; assess during later SEO architecture.
- Content risk: **PASS**: confirmed store details and photographs in canonical location records.
- Future work: **LAUNCH ONLY**: canonical/URL normalisation and production noindex removal under SEO-05; review social metadata and structured data in later scoped work.

### `/our-story/`

- Source: `our-story/index.html`
- Classification: Brand/story (not a service or blog page).
- H1: The Journey Continues
- Title: Our Story | Wash Bar
- Meta description: The Wash Bar founders’ journey from international students in Melbourne to a growing laundromat brand across Australia and the United States.
- Index status: **PASS (source only)**: `noindex,follow`; **NEEDS WORK (live)**: deploy/recheck. Before: no robots meta.
- Structured data: **NEEDS WORK**: absent; no JSON-LD, Microdata or RDFa detected.
- Breadcrumbs: **NEEDS WORK**: no semantic breadcrumb; assess during later SEO architecture.
- Content risk: **CLIENT INPUT**: rendered narrative is PROJECT APPROVED, not final client sign-off.
- Future work: **LAUNCH ONLY**: canonical/URL normalisation and production noindex removal under SEO-05; review social metadata and structured data in later scoped work.

### `/prototype-location-gallery.html`

- Source: `prototype-location-gallery.html`
- Classification: Prototype/demo (not a service or blog page).
- H1: Choose a Wash Bar location
- Title: Location Photo Experience Prototype | Wash Bar
- Meta description: A client-review prototype for exploring Wash Bar location photographs.
- Index status: **PASS (source only)**: `noindex,follow`; **NEEDS WORK (live)**: deploy/recheck. Before: no robots meta.
- Structured data: **NEEDS WORK**: absent; no JSON-LD, Microdata or RDFa detected.
- Breadcrumbs: **PASS**: no breadcrumb required for homepage/prototype inventory.
- Content risk: **NEEDS WORK**: public review/demo copy; not a production destination.
- Future work: Exclude from public production output or retain noindex; reconcile stale demo facts if retained for review.

### `/prototype-locations.html`

- Source: `prototype-locations.html`
- Classification: Prototype/demo (not a service or blog page).
- H1: Location Experience Concepts
- Title: Location Experience Concepts | Wash Bar
- Meta description: Location Experience Concepts for comparing two ways to explore Wash Bar Fitzroy store information.
- Index status: **PASS (source only)**: `noindex,follow`; **NEEDS WORK (live)**: deploy/recheck. Before: no robots meta.
- Structured data: **NEEDS WORK**: absent; no JSON-LD, Microdata or RDFa detected.
- Breadcrumbs: **PASS**: no breadcrumb required for homepage/prototype inventory.
- Content risk: **NEEDS WORK**: public review/demo copy; not a production destination.
- Future work: Exclude from public production output or retain noindex; reconcile stale demo facts if retained for review.

## Links, Headings and Images (SEO-00 Snapshot)

- **PASS**: 371 local HTML href/src occurrences resolve to existing files and,
  for internal HTML fragment links, an existing ID/name. No broken internal
  references found. This is not an exhaustive external-link availability audit.
- **PASS**: no missing or multiple H1s; no duplicate titles or descriptions
  across the ten distinct HTML documents.
- **NEEDS WORK**: URL aliases and staging hostnames duplicate the same content.
  Do not confuse this with duplicate metadata across separate page purposes.
- **PASS**: all 85 static img elements have alt attributes. 29 use empty alt.
  These are logos with parent link names, homepage location-card images with
  adjacent area/street labels, or decorative prototype logos. Empty alt in
  those contexts is intentional, not automatically a failure.
- Informative images generally describe the real store, equipment or setting.
  Some descriptions are broad, e.g. "Interior view inside Wash Bar Spencer
  Street" and the Story hero's generic Melbourne description. **NEEDS WORK**:
  refine only if a future image review establishes useful missing detail;
  do not keyword-stuff or fabricate what the photo shows.
- Runtime gallery code copies the selected photo's alt to the large image.
  Generated thumbnail images are decorative within explicitly named buttons.
- Location pages provide an "All locations" back link, not a semantic breadcrumb
  trail. Story has no breadcrumb. No breadcrumb schema exists.
- Services, Reviews, Commercial, Franchise, Community and Contact are homepage
  anchors, not additional standalone pages. No service landing pages, pricing
  pages or blog routes exist in this inventory.

## Public Prototypes and Documentation

**NEEDS WORK (high priority):** both prototype HTML routes are directly public
with HTTP 200, even if not in primary navigation. They contain review/demo
copy and older location presentations. The prototype gallery still represents
East Windsor through its earlier placeholder content; live V4 uses confirmed
East Windsor photos. Protect both prototypes now, then exclude them from the
production publish set or retain noindex. Do not treat prototype facts as the
canonical store source.

Direct requests also returned HTTP 200, `text/markdown`, with no X-Robots-Tag for:
- `/README.md`
- `/content/founder-story.md`

The latter is a source-content document, not a public story-page design.
This confirms documentation exposure, not merely an inferred risk.
HTML robots tags do not protect these Markdown responses. **NEEDS WORK**:
review the public publish boundary and exclude internal documentation/source
notes, or apply appropriate host response protection in a separately reviewed
deployment change. Do not publish the new audit documents accidentally with
unrestricted indexing. Noindex is not access control or confidentiality.

## Genuine Content and Launch Dependencies

| Area | Status | Required decision/work |
| --- | --- | --- |
| East Windsor photos | PASS | Client confirmed 15 September; do not revert to placeholder based on stale instructions |
| East Windsor phone/hours | CLIENT INPUT | Obtain confirmed details; preserve graceful omission meanwhile |
| East Windsor booking | CLIENT INPUT | No local phone booking CTA until phone confirmed; no invented online booking |
| Our Story narrative | CLIENT INPUT | Source email confirmed, but final rendered copy remains PROJECT APPROVED for prototype use |
| Creative collaborations | CLIENT INPUT | Final client sign-off pending in content register |
| Franchise | CLIENT INPUT | Confirm details/support and required publication review; do not expand claims |
| Cancer Council Victoria copy | PASS | Current register confirms naming and fundraising wording; do not treat older blanket Community hold as current |
| Commercial client names | PASS | Text naming permitted; logo permissions are separate |
| Reviews | NEEDS WORK | Register describes seven published reviews, rendered carousel has six; reconcile inventory later without inventing/removing quotes here |
| Enquiry form | NEEDS WORK | Current JS prevents actual sending and shows Details ready; delivery integration is a separate launch dependency |
| Existing domain/legacy URLs | CLIENT INPUT | Domain access and authoritative legacy route inventory needed before redirects |
| Production canonicals/sitemap | LAUNCH ONLY | No wash-bar.com.au canonicals or submission sitemap added now |
| Staging deployment | NEEDS WORK | Deploy the reviewed source change, then re-fetch all routes and mutable staging aliases |

Canonical factual references: [CONTENT-STATUS.md](CONTENT-STATUS.md),
[location records](../content/locations.md), [V4 IA](V4-IA.md).
Confirmed Ascot Vale address remains 142 Ascot Vale Road, Flemington; the
area label is not grounds to invent a different postal address.

## Implementation and Migration Guard

The SEO-00 implementation added only a comment and the following directive to
each of the ten HTML heads:
`<meta name="robots" content="noindex,follow">`.

SEO-00 introduced no robots.txt crawl block, no nofollow, no canonical, no
sitemap, no analytics and no verification tokens. Later SEO-01 work added
location-page structured data, breadcrumbs and local content in the current
repository. See [SEO-LOCAL-ACTIONS.md](SEO-LOCAL-ACTIONS.md). This historical
scope statement must not be used to erase later repository changes.

At SEO-05:
1. Confirm launch copy and final legacy redirect map.
2. Remove staging noindex from the eight production pages only.
3. Keep prototypes excluded/noindexed and internal docs out of public output.
4. Separate staging/preview host protection from production domain responses.
5. Introduce approved canonicals/redirects and sitemap in that migration scope.
6. Verify raw HTTP responses on production and every still-public staging host.

Google's documentation explains why crawlers need access to noindex:
[Block indexing with noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing).

## Verification Record (SEO-00 Snapshot + Runtime Recheck)

The original checks below record SEO-00 at completion. Later scoped work changed
location-page bodies and is governed by the current repository and its own
verification record.

- **PASS**: all ten local HTML files contain exactly one
  `noindex,follow` robots meta directive and retain no canonical.
- **PASS**: all ten routes returned HTTP 200 from the local server.
- **PASS**: 371 local HTML href/src occurrences resolve; no missing files or
  internal HTML fragments were found.
- **PASS**: pre/post body hashes match for every HTML file. The SEO-00 HTML
  edits are head-only; no layout or visible page content changed.
- **PASS**: Chrome rendered the local homepage at its 440px mobile emulation
  breakpoint. DevTools reported `0 messages in console`.
- **PASS**: one H1, one title and one description remain on each page. All ten
  titles and all ten descriptions remain unique across distinct documents.
- **PASS**: `git diff --check` completed with no whitespace errors.
- **PASS (runtime recheck)**: on 23 September 2026, both mutable Netlify aliases
  returned HTTP 200 for all ten audited routes with the earlier deployed titles.
- **NEEDS WORK**: the mutable Netlify aliases still expose no HTML robots meta,
  no `X-Robots-Tag`, and none of the SEO-01 location schema or breadcrumbs.
  Deploy the reviewed repository, then repeat the raw-response audit.
