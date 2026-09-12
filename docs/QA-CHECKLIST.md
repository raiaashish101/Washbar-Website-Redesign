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
- [ ] Confirm that every interactive element has a visible focus state.
- [ ] Confirm that reduced-motion preferences disable or reduce non-essential
      motion.
- [ ] Confirm that essential content and actions remain usable with JavaScript
      disabled.
- [ ] Test required fields, input types, useful errors, and successful form
      validation.
- [ ] Test every Australian store phone link on a supported mobile device.
- [ ] Test every map link and confirm the destination matches its location.
- [ ] Confirm East Windsor omits phone, hours, Call, and booking controls while
      retaining its confirmed address, payment methods, and Directions link.
- [ ] Open each confirmed store gallery by large image and +N control; test
      thumbnails, previous/next, Escape, close button, backdrop, focus trap,
      and focus restoration.
- [ ] Confirm galleries degrade to ordinary image links without JavaScript.
- [ ] Test every internal anchor and confirm it lands at the intended heading.
- [ ] Confirm that enquiry links pre-select the correct enquiry type.
- [ ] Test open/closed status for Australian stores against confirmed hours and
      the Melbourne timezone.
- [ ] Confirm that the page has one clear `h1` and a logical heading order.
- [ ] Check text, icon, focus, control, and status colour contrast against
      WCAG 2.1 AA.
- [ ] Confirm that informative images have meaningful alt text and decorative
      images use empty alt text.
