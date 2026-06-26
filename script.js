/*
  All DOM queries and event listeners live inside DOMContentLoaded.
  This guarantees the HTML is fully parsed before any element is touched,
  which is the correct pattern when using defer on script tags.

  Bug fixed: the previous code ran lucide.createIcons() during script parse,
  before the Lucide library had executed. window.lucide was always undefined,
  so every icon silently failed to render. DOMContentLoaded fires after all
  deferred scripts have run, so lucide is available here.
*/
document.addEventListener("DOMContentLoaded", () => {

  // --- Initialisation ---

  // Initialise Lucide icons now that the DOM and all deferred scripts are ready.
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  // Grab the interactive elements once so all handlers below can reuse them.
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks   = document.querySelector(".nav-links");
  const enquiryForm  = document.querySelector(".enquiry-form");
  const formMessage  = document.querySelector(".form-message");
  const enquiryTypeInput = document.querySelector("input[name='enquiryType']");
  const messageTextarea   = document.querySelector("textarea[name='message']");
  const customSelect = document.querySelector("[data-custom-select]");
  const customSelectButton = customSelect?.querySelector(".custom-select-button");
  const customSelectMenu = customSelect?.querySelector(".custom-select-menu");
  const customSelectValue = customSelect?.querySelector("#custom-select-value");
  const customSelectOptions = Array.from(customSelect?.querySelectorAll('[role="option"]') || []);

  // Set dynamic copyright year so it never needs a manual update.
  const yearEl = document.getElementById("copyright-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Set dynamic open/closed status badges based on current local time.
  // Wash Bar hours: 6:00 AM to 12:00 AM (midnight) every day.
  // Bug fixed: the previous markup hardcoded "Open now" regardless of time.
  // The ChatGPT suggestion used `hour < 0` which is always false — corrected below.
  const hour = new Date().getHours(); // 0–23
  const isOpenNow = hour >= 6 && hour < 24;
  document.querySelectorAll(".status-live").forEach((badge) => {
    badge.textContent = isOpenNow ? "Open now" : "Closed";
    badge.classList.toggle("status-closed", !isOpenNow);
  });

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

  // --- Mobile menu ---

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!isOpen);
    });

    // Close the mobile menu after a navigation link is selected.
    navLinks.addEventListener("click", (event) => {
      const link = event.target.closest("a");
      if (!link) {
        return;
      }

      const href = link.getAttribute("href");
      setMenuState(false);

      // Wait one tick so the menu close animation does not race the scroll.
      if (href && href.startsWith("#")) {
        window.setTimeout(() => scrollToSection(href), 0);
      }
    });
  }

  // Smooth-scroll all internal hash links for consistent page-wide behaviour.
  // Bug fixed: history.pushState was removed. Pushing hash entries onto the
  // browser history stack meant the Back button navigated away from the page
  // instead of simply scrolling up, which broke expected browser behaviour.
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
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
      scrollToSection(href);
    });
  });

  // Let keyboard users close the mobile menu with Escape.
  window.addEventListener("keyup", (event) => {
    if (event.key === "Escape") {
      setMenuState(false);
    }
  });

  // --- Enquiry form: context-aware placeholder text ---

  // When the user selects an enquiry type, update the message textarea
  // placeholder so they know what information is useful to include.
  // This removes the friction of arriving at a blank message box with no guidance.
  const placeholders = {
    "Wash and fold":         "Tell us your preferred location, approximate load size, and when you need it.",
    "Commercial laundry":    "Tell us your business type, estimated weekly load, and preferred location.",
    "Franchise opportunity": "Tell us your preferred city or country and your investment timeline.",
    "General question":      "Ask us anything about our services, locations, or pricing.",
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
        setEnquiryType(option.dataset.value || "");
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
  }

}); // end DOMContentLoaded
