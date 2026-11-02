/*
  All DOM queries and event listeners live inside DOMContentLoaded.
  This guarantees the HTML is fully parsed before any element is touched,
  which is the correct pattern when using defer on script tags.

  Bug fixed: the previous code ran lucide.createIcons() during script parse,
  before the Lucide library had executed. window.lucide was always undefined,
  so every icon silently failed to render. DOMContentLoaded fires after all
  deferred scripts have run, so lucide is available here.
*/
document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {

  // --- Initialisation ---

  // Initialise Lucide icons now that the DOM and all deferred scripts are ready.
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  // Grab the interactive elements once so all handlers below can reuse them.
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks   = document.querySelector(".nav-links");
  const skipLink = document.querySelector(".skip-link");
  const mainContent = document.querySelector("#main-content");
  const locationStatusBadges = Array.from(document.querySelectorAll(".status-live"));
  const reviewCarousel = document.querySelector("[data-review-carousel]");
  const reviewViewport = reviewCarousel?.querySelector("[data-review-viewport]");
  const reviewTrack = reviewCarousel?.querySelector("[data-review-track]");
  const reviewCards = Array.from(reviewTrack?.querySelectorAll("[data-review-card]") || []);
  const reviewControls = document.querySelector("[data-review-controls]");
  const reviewPreviousButton = document.querySelector("[data-review-previous]");
  const reviewNextButton = document.querySelector("[data-review-next]");
  const reviewStatus = reviewCarousel?.querySelector("[data-review-status]");
  const whoAccordion = document.querySelector("[data-who-accordion]");
  const whoAccordionTriggers = Array.from(
    whoAccordion?.querySelectorAll(".who-accordion-trigger") || [],
  );
  const storyReveals = Array.from(document.querySelectorAll(".story-reveal"));
  const desktopNavigationMedia = window.matchMedia("(min-width: 981px)");

  if (storyReveals.length) {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      storyReveals.forEach((section) => section.classList.add("is-visible"));
    } else {
      const storyObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      storyReveals.forEach((section) => storyObserver.observe(section));
    }
  }

  // Set dynamic copyright year so it never needs a manual update.
  const yearEl = document.getElementById("copyright-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --- Helper functions ---

  // Keep all mobile-menu changes in one function so visual and ARIA states stay in sync.
  function setMenuState(isOpen) {
    if (!menuToggle || !navLinks) {
      return;
    }

    navLinks.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");

    // Move focus to the first nav link when the menu opens so keyboard
    // and screen reader users do not have to tab through the whole page.
    if (isOpen) {
      const firstLink = navLinks.querySelector("a");
      firstLink?.focus();
    }
  }

  // Scroll to a page section while respecting users who prefer reduced motion.
  // Bug fixed: CSS scroll-behavior: smooth was removed so all smooth scrolling
  // is controlled here, where prefers-reduced-motion can be checked properly.
  function scrollToSection(hash) {
    const target = document.querySelector(hash);
    if (!target) {
      return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    target.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block:    "start",
    });
  }

  // --- Secure enquiries: the PHP response, never a timer, owns success. ---
  const enquiryForm = document.querySelector("[data-enquiry-form]");
  let selectEnquiryIntent = () => false;
  if (enquiryForm) {
    const types = ["General enquiry", "Commercial laundry", "Franchise enquiry", "Community partnership"];
    const contexts = {
      "#enquiry": types[0],
      "#enquiry-form": types[0],
      "#contact-commercial": types[1],
      "#contact-franchise": types[2],
      "#contact-community": types[3],
    };
    const fields = Object.fromEntries(
      ["enquiryType", "name", "email", "phone", "message"].map((name) => [name, enquiryForm.elements.namedItem(name)]),
    );
    const button = enquiryForm.querySelector("[data-enquiry-submit]");
    const buttonLabel = enquiryForm.querySelector("[data-enquiry-submit-label]");
    const status = enquiryForm.querySelector(".enquiry-status");
    const summary = enquiryForm.querySelector(".enquiry-error-summary");
    const availability = enquiryForm.querySelector("[data-enquiry-availability]");
    const retry = enquiryForm.querySelector("[data-enquiry-retry]");
    let ready = false;
    let checking = false;
    let busy = false;
    let reference = null;
    let previousContent = null;
    let uncertain = false;
    let accepted = false;
    enquiryForm.noValidate = true;

    function announce(message, isError = false) {
      status.textContent = message;
      status.classList.toggle("is-error", isError);
    }

    function clearErrors() {
      summary.hidden = true;
      summary.querySelector("ul").replaceChildren();
      enquiryForm.querySelectorAll(".enquiry-field-error").forEach((error) => {
        error.hidden = true;
        error.textContent = "";
      });
      Object.values(fields).forEach((field) => field.removeAttribute("aria-invalid"));
    }

    function showErrors(errors) {
      clearErrors();
      Object.entries(errors).forEach(([name, message]) => {
        const field = fields[name];
        const error = field && document.getElementById(field.getAttribute("aria-describedby"));
        if (!error || typeof message !== "string") return;
        error.textContent = message;
        error.hidden = false;
        field?.setAttribute("aria-invalid", "true");
        const item = document.createElement("li");
        if (field) {
          const link = document.createElement("a");
          link.href = `#${field.id}`;
          link.textContent = message;
          link.addEventListener("click", (event) => {
            event.preventDefault();
            field.focus();
          });
          item.append(link);
        } else {
          item.textContent = message;
        }
        summary.querySelector("ul").append(item);
      });
      if (summary.querySelector("li")) {
        summary.hidden = false;
        summary.focus();
      }
    }

    function setBusy(isBusy) {
      busy = isBusy;
      enquiryForm.setAttribute("aria-busy", String(isBusy || checking));
      Object.values(fields).forEach((field) => { field.disabled = isBusy; });
      button.disabled = isBusy || checking || !ready || accepted;
      buttonLabel.textContent = isBusy ? "Sending..." : accepted ? "Enquiry submitted" : "Send enquiry";
    }

    selectEnquiryIntent = (hash, requested, moveFocus = true) => {
      const type = requested || contexts[hash];
      if (!types.includes(type)) return false;
      if (!busy && fields.enquiryType.value !== type) {
        fields.enquiryType.value = type;
        fields.enquiryType.dispatchEvent(new Event("input", { bubbles: true }));
      }
      if (moveFocus) fields.enquiryType.focus({ preventScroll: true });
      return true;
    };

    const queryType = new URLSearchParams(window.location.search).get("enquiry");
    const initialType = types.includes(queryType) ? queryType : contexts[window.location.hash];
    if (initialType) {
      selectEnquiryIntent(window.location.hash, initialType, false);
      requestAnimationFrame(() => enquiryForm.scrollIntoView({ block: "start", behavior: "auto" }));
    }
    window.addEventListener("hashchange", () => {
      if (selectEnquiryIntent(window.location.hash)) scrollToSection("#enquiry-form");
    });

    enquiryForm.addEventListener("input", () => {
      if (busy) return;
      if (accepted) {
        accepted = false;
        button.classList.remove("is-accepted");
        announce("");
      }
      if (!uncertain) {
        reference = null;
        previousContent = null;
      }
      setBusy(false);
    });

    async function requestJSON(url, options = {}, timeout = 45000) {
      const controller = new AbortController();
      const timer = window.setTimeout(() => controller.abort(), timeout);
      try {
        const response = await fetch(url, { ...options, credentials: "same-origin", signal: controller.signal });
        const data = await response.json();
        return { response, data };
      } finally {
        window.clearTimeout(timer);
      }
    }

    enquiryForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (busy || checking || !ready || accepted) return;
      clearErrors();
      const content = Object.fromEntries(Object.entries(fields).map(([name, field]) => [name, field.value.trim()]));
      const errors = {};
      if (!types.includes(content.enquiryType)) errors.enquiryType = "Choose an enquiry type.";
      if (!content.name) errors.name = "Enter your name.";
      if (!content.email || fields.email.validity.typeMismatch) errors.email = "Enter a valid email address.";
      const phoneDigits = content.phone.replace(/[^0-9]/g, "");
      if (content.phone && (phoneDigits.length < 6 || !/^\+?[0-9 ()-]{6,32}$/.test(content.phone))) {
        errors.phone = "Enter a phone number, or leave this field blank.";
      }
      if (!content.message) errors.message = "Enter your message.";
      const limits = { enquiryType: 40, name: 100, email: 254, phone: 32, message: 4000 };
      Object.entries(content).forEach(([name, value]) => {
        if (new TextEncoder().encode(value).length > limits[name]) errors[name] = "Please shorten this field.";
        const pattern = name === "message" ? /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/ : /[\x00-\x1F\x7F]/;
        if (pattern.test(fields[name].value)) errors[name] = "Please remove unsupported characters.";
      });
      if (Object.keys(errors).length) {
        showErrors(errors);
        announce("Please check the highlighted fields.", true);
        return;
      }
      const serialized = JSON.stringify(content);
      if (uncertain && previousContent !== serialized) {
        announce("Submission is not yet confirmed. Restore the original details to retry, or call Wash Bar before sending a changed enquiry.", true);
        return;
      }
      let submissionStarted = false;
      setBusy(true);
      announce("Sending your enquiry...");
      try {
        // Recheck on each attempt so a temporary outage does not lock the form.
        if (!await refreshEnquiryAvailability()) throw new Error("Unavailable");
        reference ||= window.crypto.randomUUID();
        previousContent = serialized;
        const payload = { ...content, website: enquiryForm.elements.namedItem("website").value, reference };
        submissionStarted = true;
        const { response, data } = await requestJSON(enquiryForm.action, {
          method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok && data.ok === true && data.status === "accepted" &&
            /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(data.reference)) {
          accepted = true;
          uncertain = false;
          button.classList.add("is-accepted");
          announce("Thanks for reaching out. Your enquiry has been submitted to Wash Bar. Our team will get back to you.");
        } else {
          // A rejected retry cannot rule out acceptance of an earlier uncertain attempt.
          const explicitRejection = !response.ok && ["validation", "invalid_request", "origin", "method",
            "request_size", "content_type", "rate_limit", "smtp_failure"].includes(data.code);
          uncertain = uncertain || !explicitRejection;
          if (data.errors && typeof data.errors === "object") showErrors(data.errors);
          announce(typeof data.message === "string" ? data.message :
            "We could not confirm submission. Please call Wash Bar on 0430 455 920 before sending again.", true);
        }
      } catch {
        uncertain = uncertain || submissionStarted;
        announce(uncertain ?
          "We could not confirm submission. Please call Wash Bar on 0430 455 920 before sending again." :
          "We couldn't send your enquiry. Please try again or call Wash Bar on 0430 455 920.", true);
      } finally {
        setBusy(false);
      }
    });

    async function checkEnquiryAvailability() {
      if (window.location.hostname.endsWith(".netlify.app") ||
          !window.isSecureContext || typeof window.crypto?.randomUUID !== "function") {
        return false;
      }
      // Resolve beside this page: /v4-enquiry-test/api/ in the protected copy.
      const url = new URL(enquiryForm.dataset.config, document.baseURI);
      const { response, data } = await requestJSON(url, { cache: "no-store" }, 8000);
      return response.ok && data.available === true;
    }

    async function refreshEnquiryAvailability() {
      if (checking) return false;
      checking = true;
      ready = false;
      availability.hidden = false;
      availability.textContent = "Checking online enquiry availability...";
      retry.hidden = true;
      setBusy(busy);
      try {
        ready = await checkEnquiryAvailability();
      } catch {
        ready = false;
      } finally {
        checking = false;
        availability.hidden = ready;
        availability.textContent = ready ? "" : "Online enquiries are unavailable. Please call our Australian team.";
        retry.hidden = ready;
        setBusy(busy);
      }
      return ready;
    }

    retry.addEventListener("click", async () => {
      const restoreFocus = document.activeElement === retry;
      if (await refreshEnquiryAvailability() && restoreFocus) button.focus();
    });
    refreshEnquiryAvailability();
  }

  // --- Mobile Who We Serve accordion ---

  // Native buttons provide Enter and Space behaviour. This controller only
  // synchronises the single-open state with each trigger's associated panel.
  if (whoAccordion && whoAccordionTriggers.length) {
    let expandedWhoTrigger = null;

    function setWhoAccordionItem(trigger, isExpanded) {
      const panelId = trigger.getAttribute("aria-controls");
      const panel = panelId ? document.getElementById(panelId) : null;

      if (!panel) {
        return;
      }

      trigger.setAttribute("aria-expanded", String(isExpanded));
      panel.hidden = !isExpanded;
    }

    whoAccordionTriggers.forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const shouldOpen = expandedWhoTrigger !== trigger;

        if (expandedWhoTrigger) {
          setWhoAccordionItem(expandedWhoTrigger, false);
          expandedWhoTrigger = null;
        }

        if (shouldOpen) {
          setWhoAccordionItem(trigger, true);
          expandedWhoTrigger = trigger;
        }
      });
    });
  }

  // --- Live location status ---

  // Calculate each badge in the store's timezone, rather than the visitor's.
  // The HTML stores opening and closing times as minutes after midnight.
  function getMinutesInTimeZone(timeZone) {
    const parts = new Intl.DateTimeFormat("en-AU", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date());

    const hour = Number(parts.find((part) => part.type === "hour")?.value);
    const minute = Number(parts.find((part) => part.type === "minute")?.value);

    return (hour * 60) + minute;
  }

  function updateLocationStatuses() {
    locationStatusBadges.forEach((badge) => {
      const { timeZone, openMinutes, closeMinutes } = badge.dataset;
      const opensAt = Number(openMinutes);
      const closesAt = Number(closeMinutes);

      if (!timeZone || !Number.isFinite(opensAt) || !Number.isFinite(closesAt)) {
        return;
      }

      try {
        const currentMinutes = getMinutesInTimeZone(timeZone);
        const isOpen = closesAt > opensAt
          ? currentMinutes >= opensAt && currentMinutes < closesAt
          : currentMinutes >= opensAt || currentMinutes < closesAt;

        badge.textContent = isOpen ? "Open now" : "Closed";
        badge.classList.toggle("status-closed", !isOpen);
      } catch {
        // Keep the safe default text when a browser cannot resolve the timezone.
      }
    });
  }

  if (locationStatusBadges.length) {
    updateLocationStatuses();
    window.setInterval(updateLocationStatuses, 60_000);
  }

  // --- Customer review carousel ---

  // Store photos are ordinary image links until the native dialog is available.
  document.querySelectorAll("[data-store-gallery]").forEach((gallery, galleryIndex) => {
    const mainLink = gallery.querySelector("[data-gallery-main]");
    const photoList = gallery.querySelector("[data-gallery-photos]");
    const photoLinks = Array.from(photoList?.querySelectorAll("a") || []);
    const dialog = document.createElement("dialog");
    if (!mainLink || !photoLinks.length || typeof dialog.showModal !== "function") {
      return;
    }

    const photos = photoLinks.map((link) => {
      const image = link.querySelector("img");
      return { src: link.href, alt: image.alt, width: image.width, height: image.height };
    });
    const name = gallery.dataset.galleryName;
    const dialogId = `store-gallery-dialog-${galleryIndex}`;
    let activeIndex = 0;
    let opener = null;
    let dialogThumbnails = [];
    let pointerStartedOutside = false;

    dialog.id = dialogId;
    dialog.className = "gallery-dialog";
    dialog.setAttribute("aria-labelledby", `${dialogId}-title`);
    dialog.innerHTML = `
      <div class="gallery-toolbar">
        <h2 id="${dialogId}-title"></h2>
        <div class="gallery-toolbar-controls">
          <button class="gallery-icon-button" type="button" data-photo-previous aria-label="Previous photo" title="Previous photo"><i data-lucide="chevron-left" aria-hidden="true"></i></button>
          <span class="gallery-counter" role="status" aria-live="polite" aria-atomic="true"></span>
          <button class="gallery-icon-button" type="button" data-photo-next aria-label="Next photo" title="Next photo"><i data-lucide="chevron-right" aria-hidden="true"></i></button>
          <button class="gallery-icon-button" type="button" data-photo-close aria-label="Close photo gallery" title="Close photo gallery"><i data-lucide="x" aria-hidden="true"></i></button>
        </div>
      </div>
      <div class="gallery-stage"><img alt="" decoding="async" /></div>
      <div class="gallery-thumbnails" aria-label="Photo previews"></div>`;
    dialog.querySelector("h2").textContent = `${name} photos`;
    const dialogImage = dialog.querySelector(".gallery-stage img");
    const counter = dialog.querySelector(".gallery-counter");
    const closeButton = dialog.querySelector("[data-photo-close]");
    const dialogRail = dialog.querySelector(".gallery-thumbnails");
    document.body.append(dialog);

    const mainButton = document.createElement("button");
    mainButton.type = "button";
    mainButton.className = mainLink.className;
    mainButton.setAttribute("aria-haspopup", "dialog");
    mainButton.setAttribute("aria-controls", dialogId);
    mainButton.append(mainLink.querySelector("img"));
    mainLink.replaceWith(mainButton);
    const mainImage = mainButton.querySelector("img");

    function applyPhoto(image, photo) {
      image.src = photo.src;
      image.alt = photo.alt;
      image.width = photo.width;
      image.height = photo.height;
    }

    function selectPhoto(index) {
      activeIndex = (index + photos.length) % photos.length;
      applyPhoto(mainImage, photos[activeIndex]);
      mainButton.setAttribute("aria-label", `Open ${name} photo gallery, photo ${activeIndex + 1} of ${photos.length}`);
      previewButtons.forEach((button, i) => button.setAttribute("aria-pressed", String(i === activeIndex)));
      dialogThumbnails.forEach((button, i) => button.setAttribute("aria-pressed", String(i === activeIndex)));
      if (dialog.open) {
        applyPhoto(dialogImage, photos[activeIndex]);
        counter.textContent = `${activeIndex + 1} of ${photos.length}`;
        dialogThumbnails[activeIndex]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
      }
    }

    function makeThumbnail(photo, index) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "gallery-thumbnail";
      button.setAttribute("aria-label", `Photo ${index + 1}: ${photo.alt}`);
      button.setAttribute("aria-pressed", "false");
      const image = document.createElement("img");
      applyPhoto(image, photo);
      image.alt = "";
      image.loading = "lazy";
      button.append(image);
      button.addEventListener("click", () => selectPhoto(index));
      button.addEventListener("focus", () => selectPhoto(index));
      button.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "mouse") {
          selectPhoto(index);
        }
      });
      return button;
    }

    const previewButtons = photoLinks.map((link, index) => {
      const button = makeThumbnail(photos[index], index);
      link.replaceWith(button);
      if (index >= 4) {
        button.parentElement.hidden = true;
      }
      return button;
    });

    function openGallery(source) {
      opener = source;
      if (!dialogThumbnails.length) {
        dialogThumbnails = photos.map(makeThumbnail);
        dialogRail.append(...dialogThumbnails);
      }
      document.body.classList.add("gallery-open");
      dialog.showModal();
      selectPhoto(activeIndex);
      closeButton.focus({ preventScroll: true });
    }

    mainButton.addEventListener("click", () => openGallery(mainButton));
    if (photos.length > 4) {
      const moreItem = document.createElement("li");
      const moreButton = document.createElement("button");
      moreButton.type = "button";
      moreButton.className = "gallery-thumbnail";
      moreButton.textContent = `+${photos.length - 4}`;
      moreButton.setAttribute("aria-label", `View all ${photos.length} ${name} photos`);
      moreButton.setAttribute("aria-haspopup", "dialog");
      moreButton.setAttribute("aria-controls", dialogId);
      moreButton.addEventListener("click", () => openGallery(moreButton));
      moreItem.append(moreButton);
      photoList.append(moreItem);
    }

    closeButton.addEventListener("click", () => dialog.close());
    dialog.querySelector("[data-photo-previous]").addEventListener("click", () => selectPhoto(activeIndex - 1));
    dialog.querySelector("[data-photo-next]").addEventListener("click", () => selectPhoto(activeIndex + 1));
    dialog.addEventListener("close", () => {
      document.body.classList.remove("gallery-open");
      opener?.focus({ preventScroll: true });
    });

    function isOutsideDialog(event) {
      const rect = dialog.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right
        || event.clientY < rect.top || event.clientY > rect.bottom;
    }
    dialog.addEventListener("pointerdown", (event) => {
      pointerStartedOutside = event.target === dialog && isOutsideDialog(event);
    });
    dialog.addEventListener("click", (event) => {
      if (pointerStartedOutside && event.target === dialog && isOutsideDialog(event)) {
        dialog.close();
      }
      pointerStartedOutside = false;
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        event.preventDefault();
        selectPhoto(activeIndex + (event.key === "ArrowRight" ? 1 : -1));
      }
      if (event.key === "Tab") {
        const buttons = Array.from(dialog.querySelectorAll("button"));
        const first = buttons[0];
        const last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    });
    selectPhoto(0);
    window.lucide?.createIcons();
  });

  // Approved cards remain horizontally scrollable without JavaScript. This
  // enhancement adds buttons, position announcements, and arrow-key navigation.
  if (
    reviewViewport
    && reviewTrack
    && reviewCards.length
    && reviewPreviousButton
    && reviewNextButton
  ) {
    let activeReviewIndex = 0;
    let reviewScrollTimer = 0;
    let reviewScrollUnlockTimer = 0;
    let isProgrammaticReviewScroll = false;

    reviewViewport.tabIndex = 0;

    reviewCards.forEach((card, index) => {
      card.setAttribute("role", "group");
      card.setAttribute("aria-roledescription", "slide");
      card.setAttribute("aria-label", `${index + 1} of ${reviewCards.length}`);
    });

    if (reviewCards.length > 1 && reviewControls) {
      reviewControls.hidden = false;
    }

    function updateReviewCarouselState(index) {
      activeReviewIndex = Math.min(Math.max(index, 0), reviewCards.length - 1);
      reviewPreviousButton.disabled = activeReviewIndex === 0;
      reviewNextButton.disabled = activeReviewIndex === reviewCards.length - 1;

      if (reviewStatus) {
        reviewStatus.textContent = `Showing review ${activeReviewIndex + 1} of ${reviewCards.length}.`;
      }
    }

    function getNearestReviewIndex() {
      return reviewCards.reduce((nearestIndex, card, index) => {
        const nearestDistance = Math.abs(reviewCards[nearestIndex].offsetLeft - reviewViewport.scrollLeft);
        const cardDistance = Math.abs(card.offsetLeft - reviewViewport.scrollLeft);
        return cardDistance < nearestDistance ? index : nearestIndex;
      }, 0);
    }

    function showReview(index) {
      const targetIndex = Math.min(Math.max(index, 0), reviewCards.length - 1);
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      window.clearTimeout(reviewScrollUnlockTimer);
      isProgrammaticReviewScroll = true;
      reviewViewport.scrollTo({
        left: reviewCards[targetIndex].offsetLeft,
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
      updateReviewCarouselState(targetIndex);
      reviewScrollUnlockTimer = window.setTimeout(() => {
        isProgrammaticReviewScroll = false;
      }, prefersReducedMotion ? 0 : 600);
    }

    reviewPreviousButton.addEventListener("click", () => showReview(activeReviewIndex - 1));
    reviewNextButton.addEventListener("click", () => showReview(activeReviewIndex + 1));

    reviewViewport.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showReview(activeReviewIndex - 1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        showReview(activeReviewIndex + 1);
      }
    });

    reviewViewport.addEventListener("scroll", () => {
      if (isProgrammaticReviewScroll) {
        return;
      }

      window.clearTimeout(reviewScrollTimer);
      reviewScrollTimer = window.setTimeout(() => {
        updateReviewCarouselState(getNearestReviewIndex());
      }, 120);
    }, { passive: true });

    window.addEventListener("resize", () => updateReviewCarouselState(getNearestReviewIndex()));
    updateReviewCarouselState(0);
  }

  // --- Mobile menu ---

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen);
    });

    // Close the mobile menu after a navigation link is selected. The global
    // internal-link handler below remains the single owner of hash scrolling.
    navLinks.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) {
        return;
      }

      setMenuState(false);
    });

    // Reset mobile-only state only when the desktop breakpoint is crossed.
    desktopNavigationMedia.addEventListener("change", (event) => {
      if (event.matches) {
        setMenuState(false);
      }
    });
  }

  // Transfer skip-link focus into main before performing one controlled scroll.
  if (skipLink && mainContent) {
    skipLink.addEventListener("click", (event) => {
      event.preventDefault();
      mainContent.focus({ preventScroll: true });
      scrollToSection("#main-content");
    });
  }

  // Smooth-scroll all other internal hash links for consistent page-wide behaviour.
  // Bug fixed: history.pushState was removed. Pushing hash entries onto the
  // browser history stack meant the Back button navigated away from the page
  // instead of simply scrolling up, which broke expected browser behaviour.
  document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") {
        return;
      }

      event.preventDefault();
      if (selectEnquiryIntent(href, link.dataset.enquiryType)) {
        scrollToSection("#enquiry-form");
        return;
      }
      const target = document.querySelector(href);
      if (target?.matches("a[href]")) {
        target.focus({ preventScroll: true });
      }
      scrollToSection(href);
    });
  });

  // Let keyboard users close the mobile menu with Escape.
  window.addEventListener("keyup", (event) => {
    const isMenuOpen = menuToggle?.getAttribute("aria-expanded") === "true";
    if (event.key === "Escape" && isMenuOpen) {
      setMenuState(false);
      menuToggle.focus();
    }
  });

}); // end DOMContentLoaded
