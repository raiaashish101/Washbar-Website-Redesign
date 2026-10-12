# Version 4 QA Checklist

## Viewports

- [ ] 320px
- [ ] 375px
- [ ] 390px
- [ ] 430px
- [ ] 768px
- [ ] 1024px
- [ ] 1280px
- [ ] 1440px

## Interaction and accessibility tests

- [ ] Complete all primary journeys using keyboard navigation only.
- [ ] Confirm desktop primary navigation ends with a text-only Contact action.
- [ ] Confirm the mobile dropdown ends with Locations and does not expose the
      desktop-only Contact action to keyboard or accessibility APIs.
- [ ] Confirm the mobile sticky bar contains equal-width Services, Locations,
      and Enquiry actions in that order.
- [ ] Confirm that every interactive element has a visible focus state.
- [ ] Confirm that reduced-motion preferences disable or reduce non-essential
      motion.
- [ ] Confirm that essential content and actions remain usable with JavaScript
      disabled.
- [ ] Confirm no non-sending form, custom select, submission button or local
      success state is exposed in the launch contact section.
- [ ] Test every Australian store phone link on a supported mobile device.
- [ ] Test every map link and confirm the destination matches its location.
- [ ] Confirm East Windsor omits phone, hours, Call, and booking controls while
      retaining its confirmed address, payment methods, and Directions link.
- [ ] Open each confirmed store gallery by large image and +N control; test
      thumbnails, previous/next, Escape, close button, backdrop, focus trap,
      and focus restoration.
- [ ] Confirm galleries degrade to ordinary image links without JavaScript.
- [ ] Test every internal anchor and confirm it lands at the intended heading.
- [ ] Confirm Commercial, Franchise, Community and the Airbnb guide reach the
      matching direct-contact option; navigation and mobile Enquiry reach
      `#enquiry`, and Wash & Fold reaches store selection.
- [ ] Confirm contact actions work without JavaScript and show visible focus.
- [ ] Publish email actions only after public-address approval; check general,
      commercial, franchise and community subjects if email is enabled.
- [ ] Confirm no `generate_lead` event fires for direct-contact intent.
- [ ] Confirm Community names only Cancer Council Victoria and accurately states
      the dedicated summer fundraising-day arrangement.
- [ ] Test open/closed status for Australian stores against confirmed hours and
      the Melbourne timezone.
- [ ] Confirm that the page has one clear `h1` and a logical heading order.
- [ ] Check text, icon, focus, control, and status colour contrast against
      WCAG 2.1 AA.
- [ ] Confirm that informative images have meaningful alt text and decorative
      images use empty alt text.
