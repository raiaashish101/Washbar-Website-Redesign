# SEO-02 Internal Link Map

Last reviewed: 24 September 2026

The current V4 repository is authoritative. This map records crawlable page
relationships without creating links to routes that do not exist yet. Staging
remains `noindex,follow`; production canonicals and URL normalisation remain
SEO-05 work.

## Current Route Audit

| Route | Purpose | Primary inbound path | Primary outbound path | Status |
| --- | --- | --- | --- | --- |
| `/` | Business, services, trust, locations and enquiry | Site root | Story, six stores and homepage service/enquiry sections | Current V4 homepage |
| `/our-story/` | Founder and brand narrative | Header, homepage franchise section and footer | Franchise, services, commercial, locations and enquiry | Current V4 page |
| `/locations/north-melbourne/` | Peel Street store information | Homepage North Melbourne card | Homepage locations, services, Story and enquiry | Current V4 page |
| `/locations/flemington/` | Racecourse Road store information | Homepage Flemington card | Homepage locations, services, Story and enquiry | Current V4 page |
| `/locations/west-melbourne/` | Spencer Street store information | Homepage West Melbourne card | Homepage locations, services, Story and enquiry | Current V4 page |
| `/locations/fitzroy/` | Brunswick Street store information | Homepage Fitzroy card | Homepage locations, services, Story and enquiry | Current V4 page |
| `/locations/ascot-vale/` | Ascot Vale Road store information | Homepage Ascot Vale card | Homepage locations, services, Story and enquiry | Current V4 page |
| `/locations/east-windsor/` | East Windsor store information | Homepage East Windsor card | Homepage locations, services, Story and enquiry | Current V4 page |
| `/prototype-location-gallery.html` | Internal location-gallery review | None by design | Prototype-only links | Keep noindexed; exclude from production |
| `/prototype-locations.html` | Internal location-concept review | None by design | Prototype-only links | Keep noindexed; exclude from production |

The eight customer-facing V4 routes are not orphaned. The two prototypes are
intentionally absent from customer navigation and must not become production
search destinations.

## Current Customer Journeys

| Source page | Destination | Intent | Anchor in use | Status |
| --- | --- | --- | --- | --- |
| Homepage hero | `/#locations` | Find a store | `Find a location` | Live |
| Homepage hero / Wash & Fold | `/#locations` | Choose the store that handles the booking | `Choose a store for Wash & Fold` | Live |
| Homepage Wash & Fold section | `/#locations` | Continue from service explanation to store choice | `Find a location to book` | Live |
| Homepage Commercial section | `/#enquiry` | Start a commercial enquiry with context preselected | `Enquire about commercial laundry` | Live |
| Homepage franchise section | `/our-story/` | Understand the business story before enquiring | `Read the Wash Bar story` | Live |
| Our Story | `/#franchise` | Continue from founder narrative to franchise information | `Explore the franchise pathway` | Live |
| Homepage Locations | Six store routes | View practical store information | Area and street name on each card | Live |
| Each store page | `/#locations` | Compare or choose another store | `Locations` breadcrumb and `Find your store` | Live |

## Future Blog Link Plan

Do not add these links until SEO-03 creates and verifies the destination routes.

| Source page | Destination | Intent | Suggested anchor | Status |
| --- | --- | --- | --- | --- |
| Homepage footer | `/blog/` | Discover educational content | `Laundry guides` | SEO-03 planned |
| `/blog/` | `/blog/how-to-remove-common-laundry-stains/` | Laundry-care guidance | `How to remove common laundry stains` | SEO-03 planned |
| `/blog/` | `/blog/self-service-vs-wash-and-fold/` | Service-choice guidance | `Self-service or Wash & Fold?` | SEO-03 planned |
| `/blog/` | `/blog/airbnb-laundry-turnover-guide/` | Commercial and short-stay guidance | `Laundry planning for Airbnb turnovers` | SEO-03 planned |
| `/blog/` | `/blog/how-often-to-wash-sheets-towels-gym-clothes/` | Everyday laundry guidance | `How often to wash sheets, towels and gym clothes` | SEO-03 planned |
| Stain guide | `/#locations` | Find equipment after reading care guidance | `Find your nearest Wash Bar` | SEO-03 planned |
| Stain guide | `/blog/self-service-vs-wash-and-fold/` | Choose how to handle the load | `Compare self-service and Wash & Fold` | SEO-03 planned |
| Stain guide | `/blog/how-often-to-wash-sheets-towels-gym-clothes/` | Continue practical laundry learning | `See the practical washing schedule` | SEO-03 planned |
| Service comparison | `/#locations` | Choose a store | `Choose your nearest Wash Bar` | SEO-03 planned |
| Service comparison | `/#services` | Review the confirmed booking workflow | `How Wash & Fold works` | SEO-03 planned |
| Airbnb guide | `/#enquiry` | Start a commercial enquiry | `Enquire about commercial laundry` | SEO-03 planned |
| Airbnb guide | `/#commercial` | Review supported commercial audiences | `Commercial laundry support` | SEO-03 planned |
| Airbnb guide | `/#locations` | Find a nearby store as a secondary path | `Find a Wash Bar location` | SEO-03 planned |
| Washing-frequency guide | `/#locations` | Find a store after planning a load | `Find a Wash Bar location` | SEO-03 planned |
| Washing-frequency guide | `/blog/self-service-vs-wash-and-fold/` | Choose a suitable service | `Compare self-service and Wash & Fold` | SEO-03 planned |
| Each article | Other contextually related articles | Prevent isolated article journeys | Descriptive article title | SEO-03 planned |

## Linking Rules

- Keep links useful to the reader; do not repeat exact-match anchors excessively.
- Do not add links to unbuilt Blog routes before SEO-03.
- Keep location-card links as one whole-card link with area and street context.
- Keep Commercial calls to action routed to the preselected commercial enquiry.
- Keep Wash & Fold booking routed through store selection because booking is by
  phone with the chosen store.
- Do not create thin service pages solely to add keyword destinations.
