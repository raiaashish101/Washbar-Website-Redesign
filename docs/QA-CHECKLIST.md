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
- [ ] Confirm Send enquiry starts disabled and enables only after an actual
      successful PHP readiness response. Failed readiness/Netlify keeps the
      warning and phone fallback visible; input must not enable submission.
- [ ] Confirm Check availability again recovers after configuration is fixed,
      hides the warning only when ready and restores focus to Send enquiry.
- [ ] Verify root and protected-folder API URLs: /v4-enquiry-test/ must request
      only /v4-enquiry-test/api/; no customer details reach production-root /api/.
- [ ] Confirm one pending attempt disables the button, recovery rechecks
      readiness, and an uncertain earlier POST remains protected against duplicates.
- [ ] Test required fields, invalid email, optional phone, field length limits,
      error-summary focus and retained values after errors.
- [ ] On inherited ea-php83, verify OpenSSL/json/hash, TLS trust, filesystem
      locking/sync permissions, execution limits and private PHPMailer setup;
      PHP 8.3 selection alone does not establish extension/runtime readiness.
- [ ] Connect to mail.wash-bar.com.au:465 using implicit TLS and validate its
      certificate hostname/chain. Keep SMTP authentication and peer checks on.
- [ ] Treat the confirmed manual Webmail send/receive as mailbox evidence,
      not proof of authenticated SMTP from the enquiry backend.
- [ ] Verify honeypot, locked file-based rate limits, corrupt-state rejection
      and concurrent duplicate protection on the protected PHP host.
- [ ] Confirm SMTP accepts both recipients and final DATA before success;
      uncertain attempts must not be automatically re-sent. Obtain confirmed
      receipt in both mail@wash-bar.com.au and the private CC inbox.
- [ ] Recheck message authentication/alignment on real test mail. SPF/DKIM/PTR
      are valid in the supplied cPanel evidence, but the Digital Pacific DMARC
      warning remains a separate final deliverability sign-off gate; no DNS
      changes are authorised in this implementation task.
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
      matching editable form type; navigation and mobile Enquiry select General
      enquiry at `#enquiry`, and Wash & Fold reaches store selection.
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
