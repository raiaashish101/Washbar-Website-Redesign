# Local SEO Actions

Last updated: 23 September 2026

This file tracks local-search information that cannot be safely inferred from an address. The six location pages remain `noindex,follow` on staging until the SEO-05 domain migration.

## Authority and runtime verification

The current V4 repository is authoritative for location facts, content status,
routes, imagery, services and implementation decisions. Use sources in this
order:

1. Client-confirmed decisions recorded in the current repository.
2. `content/locations.md`.
3. `docs/CONTENT-STATUS.md`.
4. Current V4 page content in this repository.
5. The legacy `wash-bar.com.au` site for URL migration and historical reference only.

Do not use the legacy site as a source for current prices, hours, phone numbers,
service promises, amenities, commercial offers, Wash & Fold turnaround claims,
community claims or location-specific features. If authoritative repository
sources conflict, hold only the affected field and continue unaffected SEO work.

Runtime recheck: 23 September 2026.

- Both mutable Netlify aliases returned HTTP 200 for all six location routes.
- They still serve the earlier location titles with no HTML robots directive,
  `DryCleaningOrLaundry` JSON-LD or `BreadcrumbList` JSON-LD.
- Their East Windsor pages correctly publish all seven confirmed images and
  omit a phone number, opening-hours row and Call CTA.
- Their East Windsor pages still contain the older "Book ahead by phone" and
  "Call ahead" wording. The current repository removes that phone-specific
  booking language while the local number remains unconfirmed.

These differences are deployment drift. Do not restore the deployed snapshot
over the repository; deploy the reviewed source and repeat the runtime audit.

## Google Business Profile links

| Location | Exact listing status | Current page action | Follow-up |
| --- | --- | --- | --- |
| North Melbourne / Peel Street | Confirmed in `content/reviews.md` | `View on Google Maps` links to the confirmed Peel Street listing; `Directions` retains the address-search link | Recheck the listing destination during SEO-05 |
| Flemington / Racecourse Road | Missing | Address-based `Directions` link only | Client to provide the exact Google Business Profile or Maps place URL |
| West Melbourne / Spencer Street | Missing | Address-based `Directions` link only | Client to provide the exact Google Business Profile or Maps place URL |
| Fitzroy / Brunswick Street | Missing | Address-based `Directions` link only | Client to provide the exact Google Business Profile or Maps place URL |
| Ascot Vale / Ascot Vale Road | Missing | Address-based `Directions` link only | Client to provide the exact Google Business Profile or Maps place URL |
| East Windsor / 370 US-130 | Missing | Address-based `Directions` link only | Client to provide the exact Google Business Profile or Maps place URL |

Do not convert an address-search URL into a claimed Google Business Profile link. Add a listing action only after the exact destination has been confirmed.

## SEO-05 production URL migration

The location structured data intentionally omits final-domain `url`, `@id` and `image` values while staging is blocked from indexing. During SEO-05:

1. Add the final canonical URL to each `DryCleaningOrLaundry` entity.
2. Add a stable final-domain `@id` for each physical location.
3. Add confirmed final-domain representative image URLs.
4. Replace host-relative breadcrumb `item` values with absolute canonical production URLs.
5. Add canonical link elements and include all six location URLs in the production sitemap.
6. Revalidate Local Business and breadcrumb structured data after the final domain is live.

## Outstanding local data

- East Windsor phone number: client confirmation required.
- East Windsor opening hours: client confirmation required.
- Exact Google Business Profile URLs: required for all locations except North Melbourne / Peel Street.

Until those facts are confirmed, keep them omitted from visible content and structured data rather than publishing placeholders or inferred values.
