// ==== DROPDOWN TOGLLE ====
function toggleDropdown(button) {
  const menu = button.nextElementSibling; // ✅ ONLY this dropdown
  const arrowIcon = button.querySelector("svg");
  const isMobile = window.innerWidth < 900;
  const overlay = document.getElementById("dropdownOverlay");

  // 🔒 Close all other dropdowns
  document.querySelectorAll(".dropdown-menu").forEach((drop) => {
    if (drop !== menu) {
      drop.classList.remove("is-open");
      drop.classList.add("hidden");

      const btn = drop.previousElementSibling;
      btn?.classList.remove("dropdown-open");
      btn?.querySelector("svg")?.classList.remove("rotate-180");
    }
  });

  // 🔓 Toggle clicked dropdown
  if (isMobile) {
    menu.classList.toggle("is-open");
    menu.classList.remove("hidden");
  } else {
    menu.classList.toggle("hidden");
    menu.classList.remove("is-open");
  }

  // Keep dropdown-btn primary (text-primary) when dropdown is open
  const isOpen = isMobile ? menu.classList.contains("is-open") : !menu.classList.contains("hidden");
  if (isOpen) {
    button.classList.add("dropdown-open");
    arrowIcon?.classList.add("rotate-180");
  } else {
    button.classList.remove("dropdown-open");
    arrowIcon?.classList.remove("rotate-180");
  }

  const anyOpen = document.querySelector(".dropdown-menu:not(.hidden)");

  if (anyOpen && window.innerWidth >= 900) {
    overlay.classList.remove("hidden");
  } else {
    overlay.classList.add("hidden");
  }
}


function closeDropdown(el) {
  const menu = el.closest(".dropdown-menu");
  const trigger = menu.previousElementSibling;

  // Always close dropdown
  menu.classList.remove("is-open");
  menu.classList.add("hidden");

  trigger.classList.remove("dropdown-open");
  trigger.querySelector("svg")?.classList.remove("rotate-180");

  // 🧠 Detect BACK arrow (first SVG inside dropdown-title)
  const titleBar = el.closest(".dropdown-title");
  const svgs = titleBar?.querySelectorAll("svg");

  const isBackArrow = svgs && svgs[0] === el;

  // ⬅ Back arrow → STOP here (one step only)
  if (isBackArrow) return;

  // ❌ Close icon → ALSO close mobile nav
  const nav = document.getElementById("nav-links");
  const burgerIcon = document.getElementById("burger-icon");
  const closeIcon = document.getElementById("close-icon");

  if (window.innerWidth < 900 && nav) {
    nav.classList.remove("is-open");
    nav.classList.add("hidden");

    burgerIcon?.classList.remove("hidden");
    closeIcon?.classList.add("hidden");
  }
}

// Close dropdowns when clicking outside
window.addEventListener("click", function (e) {
  if (!e.target.closest(".relative")) {
    document.querySelectorAll(".dropdown-menu").forEach((drop) => {
      drop.classList.add("hidden");
      const button = drop.previousElementSibling;
      button.classList.remove("dropdown-open");
      button.querySelector("svg").classList.remove("rotate-180");
    });
  }
});

// ==================  HOME PAGE ================================
// ====  NAVBAR MENU TOGGLE ====
document.getElementById("burgerBtn").addEventListener("click", function () {
  const nav = document.getElementById("nav-links");
  const burgerIcon = document.getElementById("burger-icon");
  const closeIcon = document.getElementById("close-icon");

  nav.classList.toggle("hidden");
  burgerIcon.classList.toggle("hidden");
  closeIcon.classList.toggle("hidden");
});

// ==== Our Clients SWIPER ====
var swiper = new Swiper(".our-clients.swiper", {
  slidesPerView: 1,
  loop: true,
  spaceBetween: 16,
  speed: 1000,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },

  breakpoints: {
    320: {
      slidesPerView: 2,
    },
    575: {
      slidesPerView: 3,
    },
    768: {
      slidesPerView: 4,
      spaceBetween: 16,
    },
    1170: {
      slidesPerView: 5,
      spaceBetween: 20,
    },
  },
});

// ==== WHY-US SECTION SWIPER ====
const whyUsThumbs = new Swiper(".why-us .why-us-content", {
  spaceBetween: 10,
  slidesPerView: 1,
  freeMode: true,
  watchSlidesProgress: true,
  slideToClickedSlide: true,
});

const whyUsMain = new Swiper(".why-us .why-us-img", {
  spaceBetween: 60,
  slidesPerView: 1,
  effect: "fade",
  navigation: {
    nextEl: ".why-us .swiper-button-next",
    prevEl: ".why-us .swiper-button-prev",
  },
  pagination: {
    el: ".why-us .swiper-pagination",
    type: "fraction",
  },
  thumbs: {
    swiper: whyUsThumbs,
  },
});

// COOKIE STORAGE
// Track currently open section
(function () {
  let currentOpenSection = 'essential';

  window.onload = function () {
    const cookiePopup = document.querySelector(".cookie-popup");
    if (cookiePopup) {
      document.body.classList.add("overflow-hidden");
    }

    // Initialize: Essential section is open by default
    currentOpenSection = 'essential';
  };

  window.openCookieSettings = function () {
    const sidebar = document.getElementById('cookie-settings-sidebar');
    const mainPopup = document.getElementById('cookie-popup');

    if (sidebar) {
      sidebar.classList.remove('translate-x-full');
      sidebar.classList.add('translate-x-0');
    }

    if (mainPopup) {
      mainPopup.classList.add('hidden');
    }

    // Set open section height on next frame so drawer is visible and smooth (no flash)
    requestAnimationFrame(function () {
      const openContent = document.getElementById('content-essential');
      if (openContent && openContent.classList.contains('active')) {
        openContent.style.maxHeight = openContent.scrollHeight + 'px';
      }
    });
  };

  window.closeCookieSettings = function () {
    const sidebar = document.getElementById('cookie-settings-sidebar');

    if (sidebar) {
      sidebar.classList.remove('translate-x-0');
      sidebar.classList.add('translate-x-full');
    }

    // Remove overlay & restore scroll
    const cookieOverlay = document.querySelector(".cookie-popup");
    if (cookieOverlay) {
      cookieOverlay.remove();
      document.body.classList.remove("overflow-hidden");
    }
  };

  window.savePreferences = function () {
    const performance = document.getElementById('performance-cookies')?.checked;
    const functional = document.getElementById('functional-cookies')?.checked;
    const targeting = document.getElementById('targeting-cookies')?.checked;

    localStorage.setItem(
      'cookiePreferences',
      JSON.stringify({
        essential: true,
        performance,
        functional,
        targeting,
      })
    );

    window.closeCookieSettings();
    window.acceptCookies();
  };

  window.acceptCookies = function () {
    const cookiePopup = document.querySelector(".cookie-popup");
    if (cookiePopup) {
      cookiePopup.remove();
      document.body.classList.remove("overflow-hidden");
    }
  };

  // Accordion toggle – smooth drawer open/close (animate to actual height)
  window.toggleCookieSection = function (sectionId) {
    const content = document.getElementById(`content-${sectionId}`);
    const chevron = document.getElementById(`chevron-${sectionId}`);

    if (!content || !chevron) return;

    const isOpen = content.classList.contains('active');

    // Close previously open section with smooth close
    if (currentOpenSection && currentOpenSection !== sectionId) {
      const prevContent = document.getElementById(
        `content-${currentOpenSection}`
      );
      const prevChevron = document.getElementById(
        `chevron-${currentOpenSection}`
      );
      if (prevContent && prevChevron) {
        prevContent.style.maxHeight = '0';
        prevContent.classList.remove('active');
        prevChevron.classList.remove('rotated');
      }
    }

    if (!isOpen) {
      content.classList.add('active');
      content.style.maxHeight = content.scrollHeight + 'px';
      chevron.classList.add('rotated');
      currentOpenSection = sectionId;
    } else {
      content.style.maxHeight = '0';
      content.classList.remove('active');
      chevron.classList.remove('rotated');
      currentOpenSection = null;
    }
  };

})();


// ============================= HOME-2 =================================
// ====  TESTIMONILS ====
const testimonialSwiper = new Swiper(".testimonials-2 .testimonials", {
  spaceBetween: 15,
  slidesPerView: 1,
  navigation: {
    nextEl: ".testimonials-2 .swiper-button-next",
    prevEl: ".testimonials-2 .swiper-button-prev",
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
      spaceBetween: 15,
    },
    769: {
      slidesPerView: 2,
      spaceBetween: 25,
    },
    1025: {
      slidesPerView: 2,
      spaceBetween: 32,
    },
  },
});

// CARDS SLIDER
// ==== CARDS COVERFLOW SWIPER with Navigation ====
const cardsSwiper = new Swiper(" .cards", {
  grabCursor: true,
  slidesPerView: "2.3",
  spaceBetween: 60,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  pagination: {
    el: ".cards .swiper-pagination",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    439: {
      slidesPerView: 1.2,
      spaceBetween: 25,
    },
    550: {
      slidesPerView: 1.4,
      spaceBetween: 33,
    },
    618: {
      slidesPerView: 1.6,
      spaceBetween: 25,
    },
    769: {
      slidesPerView: 1.6,
      spaceBetween: 33,
    },
    992: {
      slidesPerView: 2,
      spaceBetween: 40,
    },
    1170: {
      slidesPerView: 2.5,
      spaceBetween: 40,
    },
    1260: {
      spaceBetween: 50,
      slidesPerView: 2.5,
    },
  },
});

// ==== RANGE SLIDER CONTROLS ====
const range = document.getElementById("slideRange");

function updateRangeFill(value, max) {
  const percentage = (value / max) * 100;
  range.style.background = `linear-gradient(to right, orange ${percentage}%, #e5e7eb ${percentage}%)`;
}

if (range && cardsSwiper) {
  // Set initial background
  updateRangeFill(range.value, range.max);

  range.addEventListener("input", function () {
    const index = parseInt(this.value) - 1;
    cardsSwiper.slideTo(index);
    updateRangeFill(this.value, this.max);
  });

  cardsSwiper.on("slideChange", () => {
    const current = cardsSwiper.realIndex + 1;
    range.value = current;
    updateRangeFill(current, range.max);
  });
}

(function () {
  // ================= FAQ TOGGLE =================

  window.toggleFaq = function (button) {
    const content = button.nextElementSibling;
    const icon = button.querySelector("svg");
    const isOpen = content.classList.contains("active");

    // 🔒 Close all FAQs
    document.querySelectorAll(".faq-content").forEach((c) => {
      c.style.maxHeight = "0";
      c.classList.remove("active");
    });

    document.querySelectorAll(".faq-toggle-button svg").forEach((svg) => {
      svg.classList.remove("rotate-45");
    });

    // 🔓 Open clicked FAQ
    if (!isOpen) {
      content.classList.add("active");
      content.style.maxHeight = content.scrollHeight + "px";
      icon.classList.add("rotate-45");
    }
  };

  // ========== OPEN FIRST FAQ BY DEFAULT ==========
  document.addEventListener("DOMContentLoaded", function () {
    const firstFaqButton = document.querySelector(
      ".faq-inner-box .faq-toggle-button"
    );

    if (firstFaqButton) {
      window.toggleFaq(firstFaqButton);
    }
  });
})();


// ========================= ENX OVEWRVIEW =========================================
// TAB MENU

const tabButtons = document.querySelectorAll(".tab-btn");
const tabImage = document.getElementById("tabImage");

const ACTIVE_CLASSES = [
  "!text-primary",
  "border-primary",
  "2xl:pl-[34px]",
  "xl:pl-[22px]",
  "pl-[18px]",
];
const INACTIVE_CLASSES = ["!text-white/60", "border-transparent", "!pl-0"];

// Mapping tab key to image
const TAB_IMAGES = {
  data: "../image/data-management.webp",
  networking: "../image/networking.webp",
  software: "../image/Software-development.webp",
  cloud: "../image/Cloud-computing.webp",
  mobile: "../image/Mobile-technology.webp",
  bi: "../image/Business-intelligence.webp",
  cybersecurity: "../image/Cybersecurity.webp",
};

// Set image on load
const defaultTab = document.querySelector(".tab-btn.text-white"); // active on load
if (defaultTab) {
  const defaultKey = defaultTab.dataset.tab;
  if (TAB_IMAGES[defaultKey]) {
    tabImage.src = TAB_IMAGES[defaultKey];
  }
}

tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => {
      b.classList.remove(...ACTIVE_CLASSES);
      b.classList.add(...INACTIVE_CLASSES);
    });

    btn.classList.add(...ACTIVE_CLASSES);
    btn.classList.remove(...INACTIVE_CLASSES);

    const key = btn.dataset.tab;
    if (TAB_IMAGES[key]) {
      // Add fade-out class to trigger animation
      tabImage.classList.add("image-fade-out");

      // Wait for the fade-out animation to finish before changing the image
      setTimeout(() => {
        tabImage.src = TAB_IMAGES[key];
        tabImage.classList.remove("image-fade-out");
        tabImage.classList.add("image-fade-in"); // Add fade-in class

        // Remove fade-in class after the transition
        setTimeout(() => {
          tabImage.classList.remove("image-fade-in");
        }, 300); // Match this duration with the CSS transition duration
      }, 300); // Match this duration with the CSS transition duration
    }
  });
});

// ==================================== CYUBERSECURITY =======================================================
// ===== TAB BUTTON
document.addEventListener("DOMContentLoaded", () => {

  const imageMap = {
    cyber: {
      network: "../image/construction-sevices-1.webp",
      information: "../image/construction-sevices-2.webp",
      endpoint: "../image/construction-sevices-3.webp",
      incident: "../image/construction-sevices-4.webp",
    },
    care: {
      development: "../image/healthcare-service-1.webp",
      management: "../image/healthcare-service-2.webp",
      telemedicin: "../image/healthcare-service-3.webp",
      analytics: "../image/healthcare-service-4.webp",
      software: "../image/healthcare-service-5.webp",
      automation: "../image/healthcare-service-6.webp",
    },
  };

  /* ---------- DEFAULT LOAD ---------- */
  const defaultTab = document.querySelector(".tab--active");
  if (defaultTab) {
    const group = defaultTab.dataset.group;
    const tab = defaultTab.dataset.tab;

    document
      .querySelectorAll(`.tab-content[data-group="${group}"]`)
      .forEach((content) => {
        content.classList.toggle("hidden", content.dataset.tab !== tab);
      });

    const imageElement = document.getElementById(`tabImg-${group}`);
    if (imageElement && imageMap[group]?.[tab]) {
      imageElement.src = imageMap[group][tab];
    }
  }

  /* ---------- TAB CLICK ---------- */
  const tabs = document.querySelectorAll("[data-tab]");

  tabs.forEach((tabBtn) => {
    tabBtn.addEventListener("click", () => {
      const group = tabBtn.dataset.group;
      const tab = tabBtn.dataset.tab;

      document
        .querySelectorAll(`[data-group="${group}"][data-tab]`)
        .forEach((btn) => {
          btn.classList.toggle("tab--active", btn === tabBtn);
        });

      document
        .querySelectorAll(`.tab-content[data-group="${group}"]`)
        .forEach((content) => {
          content.classList.toggle("hidden", content.dataset.tab !== tab);
        });

      const imageElement = document.getElementById(`tabImg-${group}`);
      if (imageElement && imageMap[group]?.[tab]) {
        imageElement.src = imageMap[group][tab];
      }
    });
  });

});

// ============================ HEALTHCARE SOLUTIONS ======================================
// OVERFLOW SWIPER
// ==== CARDS COVERFLOW SWIPER with Navigation ====
const healthcareSwiper = new Swiper(".trendHealthcare .healthcare", {
  grabCursor: true,
  // centeredSlides: true,
  slidesPerView: "3.2",
  spaceBetween: 41,
  navigation: {
    nextEl: ".trendHealthcare .swiper-button-next",
    prevEl: ".trendHealthcare .swiper-button-prev",
  },
  pagination: {
    el: ".trendHealthcare .healthcare .swiper-pagination",
  },
  breakpoints: {
    0: {
      slidesPerView: 1,
      spaceBetween: 16,
    },
    426: {
      slidesPerView: 1.1,
      spaceBetween: 16,
    },
    470: {
      slidesPerView: 1.6,
      spaceBetween: 16,
    },
    530: {
      slidesPerView: 1.8,
      spaceBetween: 16,
    },
    601: {
      slidesPerView: "2",
      spaceBetween: 25,
    },
    769: {
      slidesPerView: "2.3",
      spaceBetween: 28,
    },
    992: {
      slidesPerView: "2.7",
      spaceBetween: 28,
    },
    1170: {
      slidesPerView: "3.2",
      spaceBetween: 32,
    },
    1441: {
      spaceBetween: 41,
    },
  },
});

// VIDEO PLAY/PAUSE
const video = document.getElementById("mainVideo");
const playButton = document.getElementById("playButton");

if (video && playButton) {
  playButton.addEventListener("click", () => {
    video.play();
    playButton.classList.add("hidden");
  });

  video.addEventListener("click", () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
}

var swiper = new Swiper(".logos", {
  loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  breakpoints: {
    0: {
      spaceBetween: 16,
      slidesPerView: 2,
    },
    321: {
      spaceBetween: 40,
      slidesPerView: 2,
    },
    500: {
      spaceBetween: 40,
      slidesPerView: 3,
    },
    591: {
      spaceBetween: 60,
      slidesPerView: 3,
    },
    992: {
      spaceBetween: 60,
      slidesPerView: 4,
    },
    1170: {
      spaceBetween: 60,
      slidesPerView: 5,
    },
    1260: {
      slidesPerView: 5,
      spaceBetween: 80,
    },
  },
});

document.addEventListener("DOMContentLoaded", () => {
  function formatNumberAbbreviated(value, decimals = 0) {
    if (value >= 1e9)
      return (value / 1e9).toFixed(decimals).replace(/\.0+$/, "") + "B";
    if (value >= 1e6)
      return (value / 1e6).toFixed(decimals).replace(/\.0+$/, "") + "M";
    if (value >= 1e3)
      return (value / 1e3).toFixed(decimals).replace(/\.0+$/, "") + "k";

    return value.toFixed(decimals).replace(/\.0+$/, "");
  }

  function animateValue(el, start, end, duration, suffix = "") {
    if (end < start) return;

    const decimals = (end.toString().split(".")[1] || "").length;
    let startTimestamp = null;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;

      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = progress * (end - start) + start;

      el.innerHTML =
        formatNumberAbbreviated(current, decimals) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;

          const start = parseFloat(el.dataset.start) || 0;
          const end = parseFloat(el.dataset.end) || 0;
          const duration = parseInt(el.dataset.duration) || 2000;
          const suffix = el.dataset.suffix || "";

          animateValue(el, start, end, duration, suffix);
          obs.unobserve(el);
        }
      });
    },
    { threshold: 0.6 }
  );

  document.querySelectorAll(".count-up").forEach((el) => {
    observer.observe(el);
  });
});



// ========================= FOOTER MARQUEE (INDEX-2) ==========================
(function () {
  const slider = document.querySelector(".footer-marquee");
  const track = document.querySelector(".footer-marquee-track");
  if (!slider || !track) return;
  const originalHTML = track.innerHTML.trim();
  // Ensure one "set" is at least as wide as the slider
  while (track.scrollWidth < slider.offsetWidth) {
    track.innerHTML += originalHTML;
  }
  // Duplicate the whole set once more so we have two identical halves
  track.innerHTML += track.innerHTML;
  const singleSetWidth = track.scrollWidth / 2;
  // Distance to travel in one cycle (exact width of one set)
  track.style.setProperty(
    "--footer-marquee-translate",
    -singleSetWidth + "px",
  );
  // Optional: keep speed roughly constant regardless of width
  const pixelsPerSecond = 80; // adjust for faster/slower scroll
  const duration = singleSetWidth / pixelsPerSecond;
  track.style.setProperty("--footer-marquee-duration", duration + "s");
})();


// ISOLATED Custom Dropdown Script - Uses only "form-dropdown" class
// No inline CSS - All styling from external CSS file
(function () {
  'use strict';

  const FormDropdown = {
    init: function () {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupDropdowns());
      } else {
        this.setupDropdowns();
      }
    },
    setupDropdowns: function () {
      const formDropdowns = document.querySelectorAll('.form-dropdown');
      if (formDropdowns.length === 0) return;
      formDropdowns.forEach(dropdown => {
        this.initializeDropdown(dropdown);
      });
      this.setupGlobalClickHandler();
    },

    initializeDropdown: function (dropdown) {
      const button = dropdown.querySelector('.form-dropdown-button');
      const menu = dropdown.querySelector('.form-dropdown-menu');
      const selected = dropdown.querySelector('.form-dropdown-selected');
      const arrow = dropdown.querySelector('.form-dropdown-arrow');
      const options = dropdown.querySelectorAll('.form-dropdown-option');

      if (!button || !menu || !selected || !options.length) return;

      // Check if already initialized
      if (dropdown.hasAttribute('data-dropdown-initialized')) return;
      dropdown.setAttribute('data-dropdown-initialized', 'true');

      // Toggle dropdown
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggleDropdown(dropdown, menu, arrow);
      });

      // Handle options - DON'T clone, just add listeners directly
      options.forEach(option => {
        option.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.selectOption(dropdown, option, selected, menu, arrow);
        });
      });
    },

    toggleDropdown: function (currentDropdown, menu, arrow) {
      // Close all other dropdowns
      document.querySelectorAll('.form-dropdown').forEach(otherDropdown => {
        if (otherDropdown !== currentDropdown) {
          const otherMenu = otherDropdown.querySelector('.form-dropdown-menu');
          const otherArrow = otherDropdown.querySelector('.form-dropdown-arrow');
          if (otherMenu) otherMenu.classList.remove('is-open');
          if (otherArrow) otherArrow.classList.remove('is-rotated');
        }
      });

      // Toggle current dropdown
      const isOpen = menu.classList.contains('is-open');
      if (isOpen) {
        menu.classList.remove('is-open');
        if (arrow) arrow.classList.remove('is-rotated');
      } else {
        menu.classList.add('is-open');
        if (arrow) arrow.classList.add('is-rotated');
      }
    },

    selectOption: function (dropdown, selectedOption, selectedSpan, menu, arrow) {
      const value = selectedOption.getAttribute('data-value');
      const text = selectedOption.textContent.trim();

      // Update displayed text
      selectedSpan.textContent = text;
      selectedSpan.classList.add('is-selected');

      // Remove is-active from all options in THIS dropdown
      dropdown.querySelectorAll('.form-dropdown-option').forEach(opt => {
        opt.classList.remove('is-active');
      });

      // Add is-active to selected option
      selectedOption.classList.add('is-active');

      // Store selected value
      dropdown.setAttribute('data-selected-value', value);

      // Create or update hidden input
      let hiddenInput = dropdown.querySelector('input[type="hidden"]');
      if (!hiddenInput) {
        hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = dropdown.getAttribute('data-name') || 'dropdown-value';
        dropdown.appendChild(hiddenInput);
      }
      hiddenInput.value = value;

      // Close dropdown
      menu.classList.remove('is-open');
      if (arrow) arrow.classList.remove('is-rotated');

      // Dispatch event
      const event = new CustomEvent('form-dropdown-change', {
        detail: { value: value, text: text, dropdown: dropdown },
        bubbles: true
      });
      dropdown.dispatchEvent(event);
    },

    setupGlobalClickHandler: function () {
      document.addEventListener('click', (e) => {
        const clickedDropdown = e.target.closest('.form-dropdown');
        if (!clickedDropdown) {
          this.closeAllDropdowns();
        }
      }, true);
    },

    closeAllDropdowns: function () {
      document.querySelectorAll('.form-dropdown-menu').forEach(menu => {
        menu.classList.remove('is-open');
      });
      document.querySelectorAll('.form-dropdown-arrow').forEach(arrow => {
        arrow.classList.remove('is-rotated');
      });
    }
  };

  // Initialize
  FormDropdown.init();
  // Expose globally if needed
  window.FormDropdown = FormDropdown;
})();

// ================= INSIGHT PAGE DROPDOWN =================
// INSIGHTS DROPDOWN (isolated - no conflict)
document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("insightDropdownBtn");
  const menu = document.getElementById("insightMenu");
  const chevron = document.getElementById("insightChevron");
  const wrapper = document.getElementById("insight-wrapper");

  if (!btn) return;

  btn.addEventListener("click", function (e) {
    e.stopPropagation();
    menu.classList.toggle("hidden");
    chevron.classList.toggle("rotate-180");
  });

  document.addEventListener("click", function (e) {
    if (!wrapper.contains(e.target)) {
      menu.classList.add("hidden");
      chevron.classList.remove("rotate-180");
    }
  });
});


// INSIGHT GRID CHANGE
const grid = document.getElementById("insightGrid");
const grid2 = document.getElementById("grid2Btn");
const grid3 = document.getElementById("grid3Btn");

grid2.addEventListener("click", () => {

  grid.classList.remove("grid-3");

  grid2.classList.add("active");
  grid3.classList.remove("active");

});

grid3.addEventListener("click", () => {

  grid.classList.add("grid-3");

  grid3.classList.add("active");
  grid2.classList.remove("active");

});



// SINGLE INSIGHT PAGE NAVIGATE
// ── Smooth scroll on TOC click ──
document.querySelectorAll('#toc-nav a').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Active TOC highlight via scroll position ──
// Uses scroll position to always pick the last section whose top is above
// the trigger line (20% from top of viewport) — reliable, no race conditions.
(function () {
  const tocSections = Array.from(document.querySelectorAll('.section-anchor'));
  const tocItems    = document.querySelectorAll('.toc-item');

  function setActive(id) {
    tocItems.forEach(li => li.classList.remove('toc-active'));
    const active = document.querySelector(`.toc-item[data-target="${id}"]`);
    if (active) active.classList.add('toc-active');
  }

  function onScroll() {
    const triggerY = window.scrollY + window.innerHeight * 0.2;

    // Find the last section whose top edge is above the trigger line
    let current = tocSections[0];
    for (const sec of tocSections) {
      if (sec.getBoundingClientRect().top + window.scrollY <= triggerY) {
        current = sec;
      } else {
        break;
      }
    }

    if (current) setActive(current.id);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Run once on load to highlight the correct item immediately
  onScroll();
})();

// ── Scroll progress bar ──
const bar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  if (bar) bar.style.width = pct + '%';
}, { passive: true });