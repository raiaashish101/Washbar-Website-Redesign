# V4 Fast-Track Launch Contact Experience

Implemented locally: 10 October 2026. LAUNCH-01C review: 13 October 2026.
Delivery scope: GitHub main and its Netlify staging deployment only. No cPanel
production deployment, DNS change or staging-index-control removal is authorised.

## Outcome

The non-sending enquiry form has been replaced with direct Australian contact.
The existing light section, topic cards, two-column layout, blue action styling
and mobile stacking are retained. The backend is post-launch work.

Email implementation is held: earlier V4 HTML displayed a public address, but
the repository contains no explicit approval for public use or enquiry coverage.
The project owner was asked to confirm that address. Until confirmation arrives,
the launch candidate omits email links and the Organization email property.
There is no visible placeholder or disabled email action.

## Existing Dependencies Audited

| Previous dependency | Result |
| --- | --- |
| Homepage form, Name/Phone/Email/Message fields | Removed; no customer details are collected |
| Native/custom enquiry select, hidden type input | Removed |
| Submit interception and green Details ready state | Removed; no sending/sent/received claim |
| `data-enquiry-type` and textarea guidance | Removed; replaced by explicit topic destinations |
| Commercial, Franchise, Community section CTAs | Matching contact-option anchors |
| Airbnb article query-string/form fragment | Updated to the commercial contact option |
| Header/footer Contact and mobile Enquiry | Existing `#enquiry` destination retained |
| Wash & Fold enquiry option | Native link to `#locations` for store selection |
| Five Australian store Call and booking actions | Retained with each canonical confirmed number |
| East Windsor actions | Directions and gallery retained; no phone/hours/Call/booking CTA |
| Existing `#enquiry-form` links | Fragment retained on the new contact panel as a compatibility alias; no form or type-selection script exists |
| Analytics | No infrastructure added; no `generate_lead` event |

## Contact Authority

| Detail | Evidence / status | Launch treatment |
| --- | --- | --- |
| `0430 455 920` / `tel:+61430455920` | CLIENT CONFIRMED for the five Australian stores in `content/locations.md` and `docs/CONTENT-STATUS.md` | Visible Australian-store number, general Call button and topic-specific call links |
| `mail@wash-bar.com.au` | Previously displayed in V4 HTML; explicit public approval and enquiry coverage not recorded | Held in the register; omitted from customer HTML and Organization schema |
| Future backend recipient | Internal delivery plan only; not approved for public display | Not added to any public route |
| Commercial / franchise dedicated inbox or number | No separately confirmed destination found | Matching option routes to the confirmed Australian team number; no specialist hotline or inbox claimed |
| East Windsor phone and hours | AWAITING | Omitted in visible content, schema and store actions |

If the client approves the public email, enable native links with these subjects:
`General enquiry`, `Commercial laundry enquiry`, `Franchise enquiry`, and
`Community partnership enquiry`. Show the approved address as selectable text.
Do not add customer information to a mailto body or describe an email click as
delivery. This email work is not implemented in the current candidate.

## CTA Destination Map

| Source | Destination | Customer action |
| --- | --- | --- |
| Header / footer Contact | `#enquiry` on homepage | View direct contact |
| Mobile sticky Enquiry | `#enquiry` on homepage | View direct contact; Services/Locations/Enquiry order retained |
| Homepage Commercial | `#contact-commercial` | Call Australian team about commercial laundry |
| Homepage Franchise | `#contact-franchise` | Call Australian team about franchising |
| Homepage Community | `#contact-community` | Call Australian team about a collaboration |
| Airbnb Blog article | `../../index.html#contact-commercial` | Reach commercial contact |
| Wash & Fold option | `#locations` | Choose store, then use its confirmed booking phone |
| General Call / visible phone | `tel:+61430455920` | Open the device's phone handler |
| Contact panel Find a store | `#locations` | Choose a physical location |

Native links provide the contact experience without JavaScript. With JavaScript,
the existing reduced-motion-aware scroll handler scrolls to the actual anchor
and places focus on a topic link when that link is the destination.

## Verification

Automated local Chromium checks passed again on 13 October 2026 across all 13
customer routes at 320,
390, 768 and 1440px: **52 route/viewport checks**. Evidence is in
`/private/tmp/washbar-contact-qa/report.json` and `contact-{width}.png`.

| Check | Result |
| --- | --- |
| Responsive contact layout | Natural mobile stacking; existing two columns from 721px; no page horizontal overflow |
| Contact touch targets | Topic rows 74px; phone/action links 48px across tested widths |
| Keyboard | Enter reaches/focuses the matching topic option; Tab/Shift+Tab follow normal link order; 3px visible blue focus outline; labels included in accessible names |
| Mobile menu | Opens, Escape closes, and focus returns to toggle on all non-home routes at 390px |
| Sticky Enquiry | Works at 320/390px; existing bar is hidden from 721px |
| Native phone handling | `tel:+61430455920`; app code does not intercept the phone action |
| Six store galleries | Open, next photo, Escape and focus restoration pass at every tested width |
| East Windsor | No telephone, hours or booking action in page/schema |
| No JavaScript | Homepage, six store pages and Airbnb article remain useful: 8 checks passed |
| Link integrity | All collected internal route/fragment links resolve, including the old form-fragment alias |
| Runtime | No JavaScript exceptions, console errors or failing HTTP requests during checks |
| Static | Unique IDs; ARIA references resolve; valid JSON-LD; one main/footer on every page; JS syntax passes |
| SEO | `noindex,follow` retained on all 13 routes; no production canonical added |
| Analytics | No lead event or new measurement code |
| Visual regression | Header, Commercial, Community and Franchise screenshots match pre-LAUNCH-01 baseline `37efce2` pixel-for-pixel at all four widths: 16 comparisons |
| Contrast | Muted text 4.55:1 on section / 4.93:1 on white; heading 15.79:1 on white; blue button/phone 7.91:1 |
| Git whitespace | `git diff --check` passed |

Phone verification covers link/handler behaviour, not an actual completed call.
Email subjects, email-app launching and message delivery are not tested because
email publication is awaiting approval. The browser checks do not constitute a
full screen-reader or physical-device audit. No production runtime is claimed.

## Files Changed

Line ranges refer to the current candidate; removed blocks are described beside
their nearest current line. Every HTML route also uses CSS v52 / script v18 to
avoid serving the former form presentation from cache.

| File | Lines | Change |
| --- | --- | --- |
| `index.html` | 25, 33, 608, 660, 694, 757-805, 876, 899 | Hold unapproved Organization/footer email; replace form with direct contact; update topic destinations and asset versions |
| `script.js` | 27, 60, 499-503, 515 | Remove form queries, select/validation/completion/query handling; focus and scroll to the actual topic link |
| `style.css` | 19, 2663-2779, 3271, 3286 | Remove form-only success tokens/control styles; retain section/cards; style contact panel/details/actions; reduced-motion option transition/lift disabled |
| `blog/airbnb-laundry-turnover-guide/index.html` | 28, 94, 113, 116 | Commercial destination, held footer email, asset versions |
| `blog/how-often-to-wash-sheets-towels-gym-clothes/index.html` | 28, 108, 111 | Held footer email and asset versions |
| `blog/how-to-remove-common-laundry-stains/index.html` | 38, 169, 175 | Held footer email and asset versions |
| `blog/self-service-vs-wash-and-fold/index.html` | 28, 120, 123 | Held footer email and asset versions |
| `blog/index.html` | 16, 144, 156 | Held footer email and asset versions |
| `our-story/index.html` | 16, 198, 211 | Held footer email and asset versions |
| `locations/north-melbourne/index.html` | 48, 242, 255 | Held footer email and asset versions; store call/booking unchanged |
| `locations/flemington/index.html` | 48, 241, 254 | Held footer email and asset versions; store call/booking unchanged |
| `locations/west-melbourne/index.html` | 48, 241, 254 | Held footer email and asset versions; store call/booking unchanged |
| `locations/fitzroy/index.html` | 48, 241, 254 | Held footer email and asset versions; store call/booking unchanged |
| `locations/ascot-vale/index.html` | 48, 241, 254 | Held footer email and asset versions; store call/booking unchanged |
| `locations/east-windsor/index.html` | 43, 237, 250 | Held footer email and asset versions; no phone introduced |
| `README.md` | 99, 143-144, 154-166, 197, 281-285, 294, 297-298 | Current contact decision, email hold, QA/measurement and post-launch backend status |
| `docs/CONTENT-STATUS.md` | 25-26, 51-71 | Public-email hold, owner-directed direct-contact decision and evidence-based Story/Community approval reconciliation |
| `docs/V4-IA.md` | 25-30 | Direct contact replaces enquiry form in IA |
| `docs/QA-CHECKLIST.md` | 27-28, 38-44 | Contact/native-action checks replace form checks |
| `docs/SEO-INTERNAL-LINK-MAP.md` | 3, 41-44, 65, 78-81 | Topic links and compatibility alias |
| `docs/SEO-BASELINE.md` | 309 | Update historical form blocker with worktree resolution and email hold |
| `docs/CONTACT-LAUNCH.md` | Entire new file | Audit, evidence, destinations, limitations and release handoff |

## Git and Release Status

The initial worktree was clean. This task changes 21 tracked files and adds this
handoff file. LAUNCH-01C reviews and stages these 22 intended files, then commits
with `LAUNCH-01: replace enquiry form with direct contact` and pushes to main.
The final task handoff records the commit hash, clean-tree check and matching
Netlify deployment verification. cPanel upload, DNS/domain changes and
preview-subdomain work remain out of scope.

## Story and Community Approval Reconciliation

The standalone Story approval is recorded in commit `d76f824`; the old
`AWAITING` condensed homepage draft is not the published standalone page.
Published Story milestones and narrative match the client-confirmed founder
email, and the prohibited nearly-one-million claim is absent. Creative
collaboration copy restates the confirmed Community email. Cancer Council
Victoria naming and the fundraising-day arrangement have explicit confirmation.

No actual factual conflict was found. This review does not reclassify previously
approved content as unapproved, invent fresh client sign-off, or raise a new
Story/Community factual blocker. Existing editorial approval statuses and
historical notes are retained; see `docs/CONTENT-STATUS.md` for the reconciliation.

Remaining decisions before release:

- Approve a public email and its enquiry coverage to complete the requested
  Email experience, or explicitly accept a call-only launch.
- Prepare the production release separately: host-specific indexing/metadata,
  redirects and release packaging. Preserve staging noindex; exclude private
  source/docs and internal prototypes from public hosting as identified by
  the existing SEO audit. No readiness claim for those release steps is made.
- East Windsor phone/hours remain client confirmations; safe omission means
  these facts do not block the rest of the site.

Secure enquiry delivery and analytics activation remain later work. This task
does not begin either package or change hosting settings.
