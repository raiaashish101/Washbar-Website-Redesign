# SEO-00: V4 Future Production URL Map

Updated 25 September 2026. Target domain: `https://wash-bar.com.au/`.
This is an inventory, not a declaration that these routes are already deployed
on that domain.

> **REMOVE STAGING NOINDEX DURING SEO-05 DOMAIN MIGRATION.**
> Only approved production pages should become indexable. Staging and retained
> prototypes must remain protected.

| Current V4 route | Future production URL | Page purpose | Indexable at launch? | Redirect dependency | Notes |
| --- | --- | --- | --- | --- | --- |
| `/` | https://wash-bar.com.au/ | Main discovery, services and conversion | Yes, after launch approval and SEO-05 | Legacy URL mapping awaits access; normalise explicit index.html/directory aliases in SEO-05 | Current local staging source is noindex; production canonical intentionally deferred |
| `/locations/ascot-vale/` | https://wash-bar.com.au/locations/ascot-vale/ | Ascot Vale store information | Yes, after launch approval and SEO-05 | Legacy URL mapping awaits access; normalise explicit index.html/directory aliases in SEO-05 | Current local staging source is noindex; production canonical intentionally deferred |
| `/locations/east-windsor/` | https://wash-bar.com.au/locations/east-windsor/ | East Windsor store information | Yes, after launch approval and SEO-05 | Legacy URL mapping awaits access; normalise explicit index.html/directory aliases in SEO-05 | Current local staging source is noindex; production canonical intentionally deferred |
| `/locations/fitzroy/` | https://wash-bar.com.au/locations/fitzroy/ | Fitzroy store information | Yes, after launch approval and SEO-05 | Legacy URL mapping awaits access; normalise explicit index.html/directory aliases in SEO-05 | Current local staging source is noindex; production canonical intentionally deferred |
| `/locations/flemington/` | https://wash-bar.com.au/locations/flemington/ | Flemington store information | Yes, after launch approval and SEO-05 | Legacy URL mapping awaits access; normalise explicit index.html/directory aliases in SEO-05 | Current local staging source is noindex; production canonical intentionally deferred |
| `/locations/north-melbourne/` | https://wash-bar.com.au/locations/north-melbourne/ | North Melbourne store information | Yes, after launch approval and SEO-05 | Legacy URL mapping awaits access; normalise explicit index.html/directory aliases in SEO-05 | Current local staging source is noindex; production canonical intentionally deferred |
| `/locations/west-melbourne/` | https://wash-bar.com.au/locations/west-melbourne/ | West Melbourne store information | Yes, after launch approval and SEO-05 | Legacy URL mapping awaits access; normalise explicit index.html/directory aliases in SEO-05 | Current local staging source is noindex; production canonical intentionally deferred |
| `/our-story/` | https://wash-bar.com.au/our-story/ | Brand/founder narrative | Yes, after launch approval and SEO-05 | Legacy URL mapping awaits access; normalise explicit index.html/directory aliases in SEO-05 | Current local staging source is noindex; production canonical intentionally deferred |
| `/blog/` | https://wash-bar.com.au/blog/ | Laundry advice and guide discovery | Yes, after launch approval and SEO-05 | Legacy URL mapping awaits access; normalise explicit index.html/directory aliases in SEO-05 | SEO-03 route; current local staging source is noindex |
| `/blog/how-to-remove-common-laundry-stains/` | https://wash-bar.com.au/blog/how-to-remove-common-laundry-stains/ | Laundry-care guidance | Yes, after launch approval and SEO-05 | Legacy URL mapping awaits access; normalise explicit index.html/directory aliases in SEO-05 | SEO-03 route; current local staging source is noindex |
| `/blog/self-service-vs-wash-and-fold/` | https://wash-bar.com.au/blog/self-service-vs-wash-and-fold/ | Consumer service-choice guidance | Yes, after launch approval and SEO-05 | Legacy URL mapping awaits access; normalise explicit index.html/directory aliases in SEO-05 | SEO-03 route; current local staging source is noindex |
| `/blog/airbnb-laundry-turnover-guide/` | https://wash-bar.com.au/blog/airbnb-laundry-turnover-guide/ | Short-stay and Commercial guidance | Yes, after launch approval and SEO-05 | Legacy URL mapping awaits access; normalise explicit index.html/directory aliases in SEO-05 | SEO-03 route; current local staging source is noindex |
| `/blog/how-often-to-wash-sheets-towels-gym-clothes/` | https://wash-bar.com.au/blog/how-often-to-wash-sheets-towels-gym-clothes/ | Everyday laundry schedule guidance | Yes, after launch approval and SEO-05 | Legacy URL mapping awaits access; normalise explicit index.html/directory aliases in SEO-05 | SEO-03 route; current local staging source is noindex |
| `/prototype-location-gallery.html` | None: internal prototype only | Design/client-review prototype | No | Exclude from production; no invented redirect | Keep noindex if still public |
| `/prototype-locations.html` | None: internal prototype only | Design/client-review prototype | No | Exclude from production; no invented redirect | Keep noindex if still public |

## Route Variants and Dependencies

- Current internal links intentionally use explicit `index.html` so direct
  file previews work. Preserve them in SEO-00; canonical route notation above
  uses the directory URL for the future web deployment.
- `/index.html` and `/our-story/index.html` currently return HTTP 200 on Netlify
  as do `/` and `/our-story/`, without normalising redirects.
- Each `/locations/<confirmed-slug>/index.html` is the source file for its
  corresponding directory route above. No new store slugs are invented.
- SEO-05 must reconcile explicit index.html, trailing-slash and hostname
  variants through reviewed redirects/canonicals, with no redirect loops.
- Existing production-domain URL history is not available yet. Do not invent
  legacy URLs, redirect every old URL to the homepage, or assume no old pages
  have traffic/backlinks. Obtain a crawl/export and client domain access.
- There is no standalone `/locations/` overview page. Homepage discovery is
  `/#locations`. There is no separate service, commercial, franchise or
  pricing page in this V4 inventory. The Blog index and four articles were
  added in SEO-03.
- Homepage anchors include `#services`, `#reviews`, `#commercial`,
  `#community`, `#franchise`, `#locations` and `#enquiry`. They are not
  separately indexable HTML documents or additional canonical URLs.
- No production canonical tags, redirects, sitemap or domain settings changed.

## Content Gates

- East Windsor phone/hours remain client input; their omission does not block
  the reduced-information page. Photos are now client confirmed.
- Final Our Story and creative collaboration copy need client sign-off;
  franchise publication details/review remain unresolved.
- Review [SEO-BASELINE.md](SEO-BASELINE.md) for metadata, host evidence, public
  prototype/documentation exposure and all launch dependencies.
