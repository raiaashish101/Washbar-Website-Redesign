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
  const enquiryForm  = document.querySelector(".enquiry-form");
  const formMessage  = document.querySelector(".form-message");
  const nativeEnquirySelect = document.querySelector("#enquiry-type-native");
  const enquiryTypeInput = document.querySelector("input[name='enquiryType']");
  const messageTextarea   = document.querySelector("textarea[name='message']");
  const customSelect = document.querySelector("[data-custom-select]");
  const customSelectButton = customSelect?.querySelector(".custom-select-button");
  const customSelectMenu = customSelect?.querySelector(".custom-select-menu");
  const customSelectValue = customSelect?.querySelector("#custom-select-value");
  const customSelectOptions = Array.from(customSelect?.querySelectorAll('[role="option"]') || []);
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

  // Only one enquiry-type field participates in submission at a time.
  // The native select remains active when JavaScript is unavailable.
  if (nativeEnquirySelect && enquiryTypeInput) {
    nativeEnquirySelect.disabled = true;
    enquiryTypeInput.disabled = false;
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
      const enquiryType = link.getAttribute("data-enquiry-type");
      if (enquiryType) {
        setEnquiryType(enquiryType);
      }
      scrollToSection(enquiryType ? "#enquiry-form" : href);
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

  // --- Enquiry form: context-aware placeholder text ---

  // When the user selects an enquiry type, update the message textarea
  // placeholder so they know what information is useful to include.
  // This removes the friction of arriving at a blank message box with no guidance.
  const placeholders = {
    "Wash and fold":         "Ask a Wash & Fold question. To book, call your chosen store before dropping off your laundry.",
    "Commercial laundry":    "Tell us your business type, estimated weekly load, and preferred location.",
    "Community collaboration": "Tell us about your collaboration idea.",
    "Franchise opportunity": "Tell us your preferred city or country and your investment timeline.",
    "General question":      "Ask us anything about our services or locations.",
  };

  function closeCustomSelect() {
    if (!customSelect || !customSelectButton || !customSelectMenu) {
      return;
    }

    customSelect.classList.remove("is-open");
    customSelectButton.setAttribute("aria-expanded", "false");
    customSelectMenu.hidden = true;
  }

  function openCustomSelect() {
    if (!customSelect || !customSelectButton || !customSelectMenu) {
      return;
    }

    customSelect.classList.add("is-open");
    customSelectButton.setAttribute("aria-expanded", "true");
    customSelectMenu.hidden = false;
  }

  function setEnquiryType(type) {
    if (!enquiryTypeInput || !customSelectValue) {
      return;
    }

    enquiryTypeInput.value = type || "";
    customSelectValue.textContent = type || "Choose one";
    if (type) {
      customSelectButton?.setAttribute("aria-invalid", "false");
      if (formMessage) {
        formMessage.textContent = "";
      }
    }
    if (messageTextarea) {
      messageTextarea.placeholder = placeholders[type] || "Your message";
    }

    customSelectOptions.forEach((option) => {
      option.setAttribute("aria-selected", String(option.dataset.value === (type || "")));
    });
  }

  function focusSelectedOption() {
    const selectedOption = customSelectOptions.find((option) => option.getAttribute("aria-selected") === "true");
    (selectedOption || customSelectOptions[0])?.focus();
  }

  function focusOptionByOffset(offset) {
    const currentIndex = customSelectOptions.indexOf(document.activeElement);
    const safeIndex = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = (safeIndex + offset + customSelectOptions.length) % customSelectOptions.length;
    customSelectOptions[nextIndex]?.focus();
  }

  if (customSelectButton && customSelectMenu) {
    customSelectButton.addEventListener("click", () => {
      if (customSelectButton.getAttribute("aria-expanded") === "true") {
        closeCustomSelect();
      } else {
        openCustomSelect();
      }
    });

    customSelectOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const selectedType = option.dataset.value || "";
        setEnquiryType(selectedType);
        closeCustomSelect();
        customSelectButton.focus();
      });
    });

    customSelectButton.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCustomSelect();
        focusSelectedOption();
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        openCustomSelect();
        customSelectOptions[customSelectOptions.length - 1]?.focus();
      }
    });

    customSelectMenu.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCustomSelect();
        customSelectButton.focus();
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        focusOptionByOffset(1);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        focusOptionByOffset(-1);
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        document.activeElement?.click();
      }
    });

    customSelect.addEventListener("focusout", (event) => {
      if (!customSelect.contains(event.relatedTarget)) {
        closeCustomSelect();
      }
    });

    document.addEventListener("click", (event) => {
      if (!customSelect?.contains(event.target)) {
        closeCustomSelect();
      }
    });

    window.addEventListener("keyup", (event) => {
      if (event.key === "Escape") {
        closeCustomSelect();
      }
    });
  }

  // --- Prototype form feedback ---

  // Shows a success message without sending real customer data anywhere.
  // A live site would POST to an email service or CRM endpoint instead.
  if (enquiryForm && formMessage) {
    enquiryForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!enquiryTypeInput?.value) {
        formMessage.textContent = "Please choose an enquiry type.";
        customSelectButton?.setAttribute("aria-invalid", "true");
        customSelectButton?.focus();
        return;
      }

      const formData    = new FormData(enquiryForm);
      const enquiryType = formData.get("enquiryType");

      formMessage.textContent = `Thanks. Your ${enquiryType || "Wash Bar"} enquiry is ready to be sent in the live site build.`;
      enquiryForm.reset();
      setEnquiryType("");

      // Reset the placeholder back to the default after the form clears.
      if (messageTextarea) {
        messageTextarea.placeholder = "Your message";
      }
    });

    // The static baseline exposes direct call/email actions. Reveal the form
    // only after its non-submitting prototype handler is safely attached.
    enquiryForm.hidden = false;
  }

}); // end DOMContentLoaded
