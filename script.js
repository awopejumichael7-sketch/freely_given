/* ============================================================
   CAC GOOD WORKS ASSEMBLY — 2026 CAMP MEETING
   script.js
   ============================================================ */
(function () {
  "use strict";

  /* ==========================================================
     CAMP MEETING BASIC INFORMATION
     EDIT THESE VALUES
     ========================================================== */
  const CAMP_INFO = {
    eventStart: "2026-10-08T00:00:00", // First day of camp meeting (local time)
    eventEnd:   "2026-10-11T23:59:59", // Last day of camp meeting (local time, end of day)
  };

  /* ==========================================================
     EDIT YOUR CAMP MEETING LINKS HERE
     ----------------------------------------------------------
     Replace each "PASTE_..._LINK_HERE" value with the real URL.
     Leave a value untouched and its button will politely tell
     visitors the link isn't ready yet, instead of breaking.
     ========================================================== */
  const CAMP_LINKS = {
    registration:  "https://script.google.com/macros/s/AKfycbztL5hul8-FEikBgRJJR66zW4D9tJorL4NLGZG92LKMajojdvUVp6HOZWUSarU59vDx/exec",
    gallery:       "https://script.google.com/macros/s/AKfycbztL5hul8-FEikBgRJJR66zW4D9tJorL4NLGZG92LKMajojdvUVp6HOZWUSarU59vDx/exec?page=gallery",
    volunteer:     "https://script.google.com/macros/s/AKfycbztL5hul8-FEikBgRJJR66zW4D9tJorL4NLGZG92LKMajojdvUVp6HOZWUSarU59vDx/exec?page=checkin",
    admin:         "https://script.google.com/macros/s/AKfycbztL5hul8-FEikBgRJJR66zW4D9tJorL4NLGZG92LKMajojdvUVp6HOZWUSarU59vDx/exec?page=admin",
    documentation: "PASTE_DOCUMENTATION_LINK_HERE",
    strategies:    "PASTE_STRATEGIES_LINK_HERE",
  };

  const FRIENDLY_NAMES = {
    registration: "Registration",
    gallery: "Gallery",
    volunteer: "Volunteer",
    admin: "Admin",
    documentation: "Documentation",
    strategies: "Strategies",
  };

  /* ==========================================================
     UTILITIES
     ========================================================== */
  function isPlaceholder(url) {
    return !url || /^PASTE_.*_LINK_HERE$/.test(url.trim());
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  /* ==========================================================
     LINK CARD BUTTONS (Register, Gallery, Volunteer, Admin,
     Documentation, Strategies)
     ========================================================== */
  function initLinkCards() {
    const cards = document.querySelectorAll("[data-link-key]");
    cards.forEach((card) => {
      const key = card.getAttribute("data-link-key");
      const url = CAMP_LINKS[key];

      if (isPlaceholder(url)) {
        card.classList.add("is-disabled");
        card.setAttribute("aria-disabled", "true");
        card.addEventListener("click", () => {
          const label = FRIENDLY_NAMES[key] || "This";
          showToast(`${label} link has not been added yet.`);
        });
      } else {
        card.addEventListener("click", () => {
          window.open(url, "_blank", "noopener");
        });
      }
    });
  }

  /* ==========================================================
     COUNTDOWN TIMER
     ========================================================== */
  function initCountdown() {
    const grid = document.getElementById("countdownGrid");
    const status = document.getElementById("countdownStatus");
    const els = {
      days: document.getElementById("cd-days"),
      hours: document.getElementById("cd-hours"),
      minutes: document.getElementById("cd-minutes"),
      seconds: document.getElementById("cd-seconds"),
    };

    const start = new Date(CAMP_INFO.eventStart).getTime();
    const end = new Date(CAMP_INFO.eventEnd).getTime();

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function render() {
      const now = Date.now();

      if (now >= start && now <= end) {
        // Event is currently happening
        grid.hidden = true;
        status.hidden = false;
        status.textContent = "THE CAMP MEETING IS NOW LIVE!";
        return;
      }

      if (now > end) {
        // Event has finished
        grid.hidden = true;
        status.hidden = false;
        status.textContent = "THANK YOU FOR BEING PART OF THE 2026 CAMP MEETING";
        return;
      }

      // Event is upcoming
      const diff = start - now;

      if (diff <= 0) {
        grid.hidden = true;
        status.hidden = false;
        status.textContent = "WELCOME TO THE 2026 CAMP MEETING";
        return;
      }

      grid.hidden = false;
      status.hidden = true;

      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      els.days.textContent = pad(days);
      els.hours.textContent = pad(hours);
      els.minutes.textContent = pad(minutes);
      els.seconds.textContent = pad(seconds);
    }

    render();
    setInterval(render, 1000);
  }

  /* ==========================================================
     STICKY NAV — SCROLLED STATE
     ========================================================== */
  function initHeaderScroll() {
    const header = document.getElementById("site-header");
    if (!header) return;
    function update() {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  /* ==========================================================
     MOBILE NAV TOGGLE
     ========================================================== */
  function initNavToggle() {
    const toggle = document.getElementById("navToggle");
    const menu = document.getElementById("navMenu");
    if (!toggle || !menu) return;

    function closeMenu() {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    menu.querySelectorAll(".nav__link").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ==========================================================
     SCROLL REVEAL ANIMATIONS
     ========================================================== */
  function initScrollReveal() {
    const targets = document.querySelectorAll(".reveal, .reveal-scroll");
    if (!("IntersectionObserver" in window) || targets.length === 0) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((el) => observer.observe(el));

    // Hero content reveals immediately with a slight stagger
    document.querySelectorAll(".hero .reveal").forEach((el, i) => {
      setTimeout(() => el.classList.add("is-visible"), 120 * i);
    });
  }

  /* ==========================================================
     AMBIENT GOLD PARTICLES (decorative, lightweight)
     ========================================================== */
  function initHeroParticles() {
    const holder = document.getElementById("heroParticles");
    if (!holder) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const COUNT = 22;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < COUNT; i++) {
      const p = document.createElement("span");
      p.className = "hero__particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = Math.random() * 100 + "%";
      p.style.setProperty("--s", 2 + Math.random() * 3 + "px");
      p.style.setProperty("--dur", 10 + Math.random() * 10 + "s");
      p.style.setProperty("--delay", Math.random() * 6 + "s");
      frag.appendChild(p);
    }
    holder.appendChild(frag);
  }

  /* ==========================================================
     PWA — INSTALL PROMPT
     ========================================================== */
  function initInstall() {
    const installBtn = document.getElementById("installBtn");
    const iosModal = document.getElementById("iosModal");
    const iosModalClose = document.getElementById("iosModalClose");
    let deferredPrompt = null;

    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    const isIOS = /iphone|ipad|ipod/i.test(window.navigator.userAgent);

    if (isStandalone) {
      return; // Already installed — keep the button hidden
    }

    if (isIOS) {
      // No beforeinstallprompt on iOS Safari — show button that opens instructions
      installBtn.hidden = false;
      installBtn.addEventListener("click", () => {
        iosModal.hidden = false;
      });
      iosModalClose.addEventListener("click", () => (iosModal.hidden = true));
      iosModal.addEventListener("click", (e) => {
        if (e.target === iosModal) iosModal.hidden = true;
      });
      return;
    }

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;
      installBtn.hidden = false;
    });

    installBtn.addEventListener("click", async () => {
      if (!deferredPrompt) {
        showToast("Use your browser menu to Add to Home Screen or Install App.");
        return;
      }
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        installBtn.hidden = true;
      }
      deferredPrompt = null;
    });

    window.addEventListener("appinstalled", () => {
      installBtn.hidden = true;
      showToast("App installed. Thank you!");
    });
  }

  /* ==========================================================
     SERVICE WORKER REGISTRATION
     ========================================================== */
  function initServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(() => {
        /* Fail silently — site still works without offline support */
      });
    });
  }

  /* ==========================================================
     INIT
     ========================================================== */
  document.addEventListener("DOMContentLoaded", () => {
    initLinkCards();
    initCountdown();
    initHeaderScroll();
    initNavToggle();
    initScrollReveal();
    initHeroParticles();
    initInstall();
    initServiceWorker();
  });
})();
