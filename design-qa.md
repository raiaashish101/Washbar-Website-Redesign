# Wash & Fold Image Design QA

## Evidence

- Source visual truth path: conversation-attached Wash & Fold image reference; no filesystem path was exposed to the workspace.
- Source asset path: `assets/wasfold.png`
- Implementation screenshot path: unavailable because no connected browser was available.
- Intended viewports: mobile, tablet, and desktop.
- State: default Wash & Fold section.
- Source asset dimensions: 620 x 620 px.
- Implementation frame: CSS `aspect-ratio: 1 / 1` with the image at `width: 100%`, `height: 100%`, and `object-fit: cover`.

## Full-View Comparison

The supplied reference shows the complete square Wash & Fold photograph filling its card. The previous implementation forced the square asset into a 4:3 frame, cropping its top and bottom. The code now uses a square frame that matches the source asset.

## Focused Region Comparison

The source file was inspected directly. Its dimensions and subject framing match the requested card treatment. A browser-rendered focused comparison could not be captured because the browser connection was unavailable.

## Findings

- The implementation code now matches the source asset ratio and fills the card without distortion.
- Visual verification of the rendered mobile, tablet, and desktop states remains unavailable.

## Comparison History

1. Earlier CSS placed the 620 x 620 px source inside a forced 4:3 image box.
2. Moved the stable aspect ratio to `.image-card` and changed it to 1:1.
3. Set the image to fill both dimensions with centered cover behavior.
4. Corrected the HTML intrinsic dimensions and alt text.

## Implementation Checklist

- Confirm the full photograph is visible at mobile width.
- Confirm the image and copy columns remain balanced at tablet and desktop widths.
- Confirm the 1-hour overlay stays inside the lower-right corner.
- Confirm there is no horizontal overflow.

final result: blocked

Blocker: no connected browser was available to capture and compare the rendered implementation.

---

# Enquiry Paths and Commercial Client Pills Design QA

## Evidence

- Source visual truth: conversation-attached enquiry-option and commercial-client pill references; no filesystem path was exposed to the workspace.
- Implementation files: `index.html`, `style.css`, and `script.js`.
- Intended viewports: mobile, tablet, and desktop.
- Intended states: default, hover, keyboard focus, and enquiry-type preselection.
- Implementation screenshot: unavailable because no connected browser was available.

## Comparison

- Enquiry paths now use full-width white link cards with a stronger title and subordinate supporting line on the existing soft-grey section background.
- Confirmed commercial client names now use larger outlined pills, stronger group headings, and clearer spacing within the existing navy panel.
- The existing soft-blue circular icon badge was retained because it already matches the supplied icon treatment.
- All visual values use existing tokens except one new commercial-pill border token in `:root`.

## Interaction Review

- Each enquiry path is a native anchor, so the whole card is available to pointer, touch, and keyboard users.
- The existing `data-enquiry-type` contract is reused for all four paths.
- With JavaScript, enquiry links preselect the matching type and scroll to the form itself.
- Without JavaScript, each link retains the useful `#enquiry` destination.

## Remaining Visual Checks

- Compare card spacing, border weight, and pill density against the references at 390px, 768px, and 1440px.
- Confirm long hospital names wrap without making the pills feel cramped.
- Confirm hover and focus treatments remain visually distinct.
- Confirm the form lands below the sticky header after each enquiry path is activated.

final result: blocked

Blocker: no connected browser was available to capture the implementation and run a same-viewport visual comparison.

---

# Who We Serve Desktop Grid Correction

## Evidence

- Source visual truth: conversation-attached desktop reference showing six cards in two rows and three columns.
- Root cause: the JavaScript-enhanced two-column selector had higher specificity than the desktop `.segment-grid` override.
- Corrected state: mobile accordion below `560px`, two-column cards from `560px`, and three-column cards from `900px`.

## Verification

- The desktop rule now targets both the fallback grid and the JavaScript-enhanced grid with equal specificity.
- The tablet two-column rule and mobile accordion rules remain unchanged.
- The stylesheet cache key was incremented so browsers request the corrected CSS.

final result: blocked

Blocker: no connected browser was available to capture a rendered desktop comparison against the supplied reference.
