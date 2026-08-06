# Wash Bar Laundromat Website Redesign - Version 4

Version 4 is a client-informed redesign of the Wash Bar Laundromat website.
It combines product thinking, responsive interface design, accessibility, and
front-end development in a plain HTML, CSS, and JavaScript implementation.

The website is currently a local prototype for client discussion and portfolio
documentation. Business claims and content marked as awaiting confirmation are
not ready for production publication.

## Project Overview

The original brief was to replace an outdated website with a modern and
professional experience. Face-to-face client discovery showed that the website
also needed to support several different customer and business goals:

- Help walk-in customers find a suitable Wash Bar location quickly.
- Promote fast Wash & Fold enquiries.
- Create a clearer pathway for commercial laundry enquiries.
- Communicate the founders' journey and community involvement.
- Support franchise interest across Melbourne and the United States.
- Use real location photography and approved customer reviews to build trust.

Later client feedback changed the homepage direction again. The client asked
for public pricing to be removed and placed greater emphasis on locations,
services, reviews, commercial customers, community work, and the Wash Bar
founder story. Version 4 translates that feedback into a more complete service
and brand experience.

## Product Problem

Laundromat customers are usually task-focused. They need to understand what the
business offers, choose a location, check practical store information, contact
the team, or request a service without searching through unrelated content.

At the same time, Wash Bar needs the website to support higher-consideration
commercial and franchise enquiries without making the homepage confusing for
everyday customers.

Version 4 therefore uses a utility-first hierarchy: practical customer tasks
come first, trust and brand evidence follow, and enquiry pathways complete the
journey.

## Version 4 Goals

- Make locations, directions, calls, and service enquiries easy to reach.
- Present walk-in, Wash & Fold, commercial, and franchise pathways clearly.
- Remove all public pricing content in line with the client's direction.
- Use only confirmed reviews, claims, locations, and client-approved content.
- Introduce the founder and community stories without blocking practical tasks.
- Provide an accessible, mobile-first experience using progressive enhancement.
- Create a maintainable static website without frameworks or build tooling.

## Primary Audiences

- Walk-in customers looking for a nearby laundromat.
- Customers enquiring about Wash & Fold.
- Commercial organisations seeking ongoing laundry support.
- Prospective franchise partners.
- Community collaborators who want to contact Wash Bar.

## Homepage Information Architecture

The approved Version 4 homepage order is:

1. Header and navigation
2. Hero
3. Quick actions
4. Core services
5. Locations
6. Real reviews
7. Commercial clients
8. Founder-story teaser
9. Supporting Our Community
10. Franchise teaser
11. Enquiry form
12. Footer

The sequence intentionally moves from immediate customer utility to service
proof, brand story, and conversion.

## Key Design and UX Decisions

### No public pricing

Version 3 treated pricing as a primary customer route. Version 4 removes the
pricing navigation item, hero action, quick-action card, homepage section,
mobile action, and footer link following explicit client feedback.

The replacement hierarchy focuses on services, locations, reviews, commercial
support, and relevant enquiry paths.

### Accessible six-location selector

The location experience uses an ARIA tabs pattern with six location controls
and one active detail panel. It supports:

- Mouse, touch, and keyboard input.
- Arrow, Home, End, Enter, and Space keyboard behaviour.
- Horizontally scrollable location controls on smaller screens.
- Store image, address, hours, phone, call, and directions information.
- A stacked no-JavaScript fallback.
- Timezone-aware live status only where the required hours are available.

Location details remain subject to the confirmation status recorded in
`content/locations.md` and `docs/CONTENT-STATUS.md`.

### Source-backed customer reviews

The review section uses approved review text without rewriting it. It includes
source attribution, accessible star labels, keyboard-operable previous and next
controls, and responsive horizontal scrolling. Review content that conflicts
with Version 4 content rules or lacks an approved source is not published.

### Commercial and community pathways

Commercial content uses confirmed industry categories and safe category-level
trust language while named organisations and logos await publication
permission. Community collaboration links pre-select the relevant enquiry type.
Unconfirmed partnership statements and social links remain unavailable until
approved.

### Progressive founder storytelling

The homepage introduces the founders' story through a concise teaser rather
than reproducing the complete source email. The story connects the founders'
experiences as international students to the values behind Wash Bar. Claims
that still require evidence remain excluded from publication.

### Context-aware enquiry form

Calls to action can pre-select the appropriate enquiry type for Wash & Fold,
commercial laundry, franchise interest, or community collaboration. This
reduces repeated decisions and provides more relevant message guidance.

## Visual Direction

The interface preserves the established Wash Bar visual system:

- Dark navy for trust and high-emphasis sections.
- Bright blue for primary actions and selected states.
- Restrained white and light-grey surfaces for readable content.
- Clear typography, compact labels, and consistent spacing tokens.
- Mobile-first layouts that expand at tablet and desktop breakpoints.

The design tokens live in `:root` in `style.css`. Repeated colour, spacing, and
typography values should not be hardcoded outside the token system.

## Accessibility Approach

Version 4 targets WCAG 2.1 AA and includes:

- Semantic landmarks and a logical heading hierarchy.
- A keyboard-accessible navigation menu.
- Visible `:focus-visible` states.
- Native controls and ARIA only where needed.
- Keyboard-operable location tabs and review controls.
- Properly labelled form fields and enquiry options.
- Meaningful image alternatives and explicit image dimensions.
- Safe external links with descriptive accessible names.
- Reduced-motion support.
- Progressive enhancement and essential no-JavaScript content.

The full manual test list is maintained in `docs/QA-CHECKLIST.md`.

## Technology

- Semantic HTML5
- Custom mobile-first CSS
- Vanilla JavaScript
- Lucide icons
- No React, Tailwind CSS, Bootstrap, or other framework
- No Webpack, Vite, Rollup, package manager, or compile step

## Project Structure

```text
Washbar website Redesign/
|-- assets/                  # Approved and candidate website imagery
|-- content/                 # Client source material and publication status
|   |-- commercial-clients.md
|   |-- community.md
|   |-- founder-story.md
|   |-- locations.md
|   `-- reviews.md
|-- docs/
|   |-- CONTENT-STATUS.md    # Source-of-truth content approval register
|   |-- QA-CHECKLIST.md      # Responsive and accessibility checks
|   `-- V4-IA.md             # Approved homepage section order
|-- AGENTS.md                # Permanent repository rules
|-- index.html
|-- style.css
|-- script.js
`-- README.md
```

## Run Locally

From the project directory, start a local static server:

```bash
python3 -m http.server 4184
```

Then open:

```text
http://localhost:4184/
```

Use localhost rather than opening `index.html` through `file://` so browser
behaviour and local asset loading are tested consistently.

## Content Governance

`docs/CONTENT-STATUS.md` is the source of truth for publication readiness. Its
statuses are:

- `CONFIRMED`: approved for the stated use.
- `AWAITING`: requires confirmation, a source, or permission.
- `PLACEHOLDER`: planned but not approved.
- `DO NOT PUBLISH`: must remain out of the public website.

Missing content must not be replaced with invented visible copy. Development
notes use non-visible `CLIENT TO CONFIRM` comments as defined in `AGENTS.md`.

## Proposed Success Measures

Version 4 has not yet been measured against live business outcomes. Suitable
future measures include:

- Location-tab engagement and directions clicks.
- Phone-call clicks.
- Wash & Fold enquiry starts and submissions.
- Commercial and franchise enquiry submissions.
- Completion of primary mobile tasks.
- Form validation errors and abandonment.

These are proposed measures, not claims of achieved results.

## Current Status and Next Steps

The current build is a working Version 4 prototype. Before production launch:

1. Complete the design-validation gate for remaining or revised sections.
2. Confirm every location address, phone number, opening schedule, and image.
3. Obtain approval for outstanding community, commercial, and social content.
4. Replace disabled development actions with confirmed destinations.
5. Connect the enquiry form to an approved delivery service or backend.
6. Complete the responsive, accessibility, no-JavaScript, and browser QA list.
7. Recheck all public claims and permissions immediately before deployment.

## Portfolio Case Study Framing

Version 4 demonstrates how a visual redesign evolved through client discovery
and feedback into a broader product-design problem. The work includes:

- Translating business goals into user pathways and information architecture.
- Revising an earlier price-led hierarchy after the client's direction changed.
- Designing for walk-in, service, commercial, franchise, and community needs.
- Separating confirmed content from assumptions and unapproved claims.
- Building responsive, accessible interactions with semantic HTML, custom CSS,
  and progressively enhanced JavaScript.
- Defining proposed success measures and a structured pre-launch QA process.

The case study should present Version 4 as an ongoing client-informed prototype,
not as evidence of measured conversion or revenue improvement.
