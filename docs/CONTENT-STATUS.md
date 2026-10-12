# Version 4 Content Status

## Status definitions

- `CLIENT CONFIRMED`: Supplied or explicitly approved by the client.
- `PROJECT APPROVED`: Approved by the project owner for prototype use only.
  Not cleared for production without client sign-off.
- `AWAITING`: Requires client confirmation, a source, or permission.
- `DO NOT PUBLISH`: Must remain out of the website.

## Content register

| Content item | Status | Notes |
|---|---|---|
| Do not display public prices | CLIENT CONFIRMED | Explicit client direction for Version 4. |
| Founder story source email | CLIENT CONFIRMED | Stored unedited in content/founder-story.md. |
| Dedicated Our Story page content | PROJECT APPROVED | Approved for the V4 standalone Our Story page and derived only from the client-confirmed founder story source. |
| Web-ready franchise teaser copy | CONFIRMED | Approved for V4 homepage franchise section. Derived from client-supplied founder story email. |
| Supporting Our Community source email | CLIENT CONFIRMED | Stored unedited in content/community.md. |
| Creative collaborations copy | PROJECT APPROVED | Prototype only. Requires final client sign-off. |
| Cancer Council Victoria fundraising copy | CLIENT CONFIRMED | Public naming is approved. Wash Bar dedicates one fundraising day during summer and donates 100% of the money raised that day to Cancer Council Victoria for cancer research and development. No event date or recurrence schedule is confirmed. |
| Six location addresses | CLIENT CONFIRMED | Confirmed correct 7 August 2026. |
| Opening hours (6am–midnight all Melbourne stores) | CLIENT CONFIRMED | Confirmed correct 7 August 2026. |
| Australian store phone number | CLIENT CONFIRMED | 0430 455 920 confirmed for the five Australian stores in the canonical location records on 7 August 2026. Do not apply this number to East Windsor. |
| Public contact email and enquiry coverage | AWAITING | `mail@wash-bar.com.au` was displayed in earlier V4 HTML, but no explicit client approval for public use or general/commercial/franchise/community coverage was found in the current register or source content. Omitted from launch-candidate HTML and Organization schema pending approval. `devald84@gmail.com` is an intended future backend recipient, not an approved public contact address. |
| Launch contact experience without a form | PROJECT APPROVED | Owner-directed on 10 October 2026: use direct contact, remove the non-sending form, preserve Australian calls and store-specific booking, and implement a secure backend after launch. Email actions remain held pending public-address approval. No production deployment is authorised by this task. |
| East Windsor hours and phone | AWAITING | Not yet provided by client. |
| Store photographs (Melbourne) | CLIENT CONFIRMED | Client-supplied, high-confidence store mappings. Normalised production assets are in assets/locations/. |
| Store photographs (East Windsor) | CLIENT CONFIRMED | Project owner mapped `assets/East Windsor 1.webp` through `East Windsor 7.webp` to the East Windsor store on 13 September 2026; the client explicitly confirmed the photographs on 15 September 2026. Published on the homepage and dedicated location page. |
| Payment methods (coin, card, Apple Pay, Google Pay) | CLIENT CONFIRMED | Confirmed same across all locations 7 August 2026. |
| Wash & Fold workflow | CLIENT CONFIRMED | Available at all stores. Customers book by phone, drop off and pay upfront, Wash Bar washes, dries and folds the load, and collection is at the agreed time. Turnaround depends on booking and load. |
| Seven approved review sources | CLIENT CONFIRMED | All confirmed as real reviews 7 August 2026 and attributed to the public Peel Street Google listing. Five are currently published. David and Ali remain preserved but unpublished because their timing and ironing wording conflicts with the confirmed Wash & Fold policy. |
| Review source links for David, Ali, Rachel O. | CLIENT CONFIRMED | Project owner approved attribution to the Peel Street Google listing on 8 August 2026. |
| Over 700 five-star Google reviews | CLIENT CONFIRMED | Confirmed accurate 7 August 2026. |
| 400,000+ customers served | CLIENT CONFIRMED | Confirmed accurate 7 August 2026. |
| Nearly one million customers served | DO NOT PUBLISH | Appears in founder email. 400k+ is the confirmed figure. |
| Portia Gowrie review | DO NOT PUBLISH | Contains price language. Preserve in content/reviews.md. Do not publish while no-price rule is active. |
| Named hotel clients (Hilton, Sofitel, Park Hyatt, Ibis, Hotel Jasper) | CLIENT CONFIRMED | Client confirmed permission to name on website 7 August 2026. Text only — no logos without separate permission. |
| Named hospital clients (Royal Melbourne Hospital, Royal Children's Hospital, Melbourne Asthma Clinic) | CLIENT CONFIRMED | Client confirmed permission to name on website 7 August 2026. Text only — no logos. |
| Commercial industry categories and safe trust statement | CLIENT CONFIRMED | Approved. Named clients may now also be displayed as text. |
| Instagram URL | CLIENT CONFIRMED | Supplied 6 August 2026. |
| Facebook URL | CLIENT CONFIRMED | Supplied 6 August 2026. |
| Business name: Wash Bar Coin Laundrette | CLIENT CONFIRMED | Correct legal trading name. Note spelling: Laundrette not Laundry. |
| Business name: Wash Bar Laundromat | CLIENT CONFIRMED | Also a correct trading name. Use in descriptive copy where appropriate. |
| Franchise section content | AWAITING | Franchise details, support offering, and legal review required before publication. |
| "Primus machines" brand claim | AWAITING | Requires client confirmation before publishing the brand name. |
| "Bulk wash discounts for 6+ properties" | AWAITING | Pricing-adjacent claim. Conflicts with no-price rule. Requires explicit client direction before use. |
| Dedicated Our Story page | PROJECT APPROVED | Included in Version 4. No founder-story teaser is published on the homepage. |
| Four SEO-03 Blog source drafts and editorial direction | CLIENT CONFIRMED | Published as one connected Blog system on 25 September 2026. Editorial corrections remove unsupported timing, pricing, WiFi, hygiene-superiority, discount, medical and specialist stain-treatment claims. External guidance is recorded in content/blog-sources.md. |

## LAUNCH-01C Approval Reconciliation

Reviewed 13 October 2026 against the source emails, published pages and Git
history. No Story or Community content was changed by the contact task.

- The dedicated Our Story page approval was recorded in commit `d76f824`.
  Its published milestones, values and franchise narrative agree with the
  client-confirmed founder email. The `AWAITING` note in
  `content/founder-story.md` belongs to an older condensed homepage draft,
  not the current standalone page. The prohibited nearly-one-million figure
  is absent from the published Story.
- Current creative-collaboration copy restates the client-confirmed Community
  email without adding outcomes, commitments or other factual claims.
- Cancer Council Victoria naming and the summer fundraising-day arrangement
  remain explicitly `CLIENT CONFIRMED`; no date or annual schedule is published.

The existing `PROJECT APPROVED` entries are preserved, not downgraded or silently
promoted to new client sign-off. No contradictory published fact was found, so
LAUNCH-01C does not raise a new Story/Community factual blocker. Historical
editorial sign-off notes are distinct from the public-email approval still
missing for direct contact.
