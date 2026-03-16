// ==== DROPDOWN OVERLAY – single source of truth (hide when no dropdown open on desktop) ====
function updateDropdownOverlay() {
  const overlay = document.getElementById("dropdownOverlay");
  if (!overlay) return;
  const anyDropdownOpen = document.querySelector(".dropdown-menu:not(.hidden)");
  if (anyDropdownOpen && window.innerWidth >= 900) {
    overlay.classList.remove("hidden");
  } else {
    overlay.classList.add("hidden");
  }
}

function getOffset() {
  if (window.innerWidth < 1281) return 100;
  if (window.innerWidth < 1442) return 110;
  return 120;
}

// ==== DROPDOWN TOGLLE ====
function toggleDropdown(button) {
  const menu = button.nextElementSibling; // ✅ ONLY this dropdown
  const arrowIcon = button.querySelector("svg");
  const isMobile = window.innerWidth < 900;

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

  updateDropdownOverlay();
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

  updateDropdownOverlay();
}

// Close dropdowns and search when clicking outside
window.addEventListener("click", function (e) {
  if (!e.target.closest(".relative")) {
    document.querySelectorAll(".dropdown-menu").forEach((drop) => {
      drop.classList.add("hidden");
      const button = drop.previousElementSibling;
      if (button) {
        button.classList.remove("dropdown-open");
        button.querySelector("svg")?.classList.remove("rotate-180");
      }
    });
    updateDropdownOverlay();
  }

  const searchBar = document.getElementById("searchBar");
  const isSearchVisible = searchBar && searchBar.classList.contains("search-open");
  if (
    isSearchVisible &&
    !e.target.closest("#searchBar") &&
    !e.target.closest("#searchBarMobile") &&
    !e.target.closest("#searchToggle") &&
    !e.target.closest("#searchToggleMobile") &&
    !e.target.closest("#searchToggleHeaderMobile")
  ) {
    toggleSearchOverlay(false);
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

// ==== SEARCH BAR ====
let isSearchOpen = false;

const searchIconMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" class="sm:size-5 size-4.5"><path d="M18.3333 18.3333L13.3333 13.3333" stroke="#353535" stroke-width="1.6" stroke-linecap="round"/><path d="M8.33333 15.8333C12.158 15.8333 15.1667 12.8247 15.1667 9C15.1667 5.17526 12.158 2.16667 8.33333 2.16667C4.50859 2.16667 1.5 5.17526 1.5 9C1.5 12.8247 4.50859 15.8333 8.33333 15.8333Z" stroke="#353535" stroke-width="1.6"/></svg>`;
const closeIconMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" class="size-5.5"><path d="M5.5 5.5L18.5 18.5M5.5 18.5L18.5 5.5" stroke="#353535" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const searchIconMobileMarkup = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none" class="sm:size-5 size-4.5"><path d="M16.0925 16.0925L20.1666 20.1666M1.83325 9.9814C1.83325 12.1424 2.69172 14.2149 4.21979 15.743C5.74786 17.2711 7.82038 18.1295 9.9814 18.1295C12.1424 18.1295 14.2149 17.2711 15.743 15.743C17.2711 14.2149 18.1295 12.1424 18.1295 9.9814C18.1295 7.82038 17.2711 5.74786 15.743 4.21979C14.2149 2.69172 12.1424 1.83325 9.9814 1.83325C7.82038 1.83325 5.74786 2.69172 4.21979 4.21979C2.69172 5.74786 1.83325 7.82038 1.83325 9.9814Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function toggleSearchOverlay(force) {
  const searchBar = document.getElementById("searchBar");
  const searchBarMobile = document.getElementById("searchBarMobile");
  const input = document.getElementById("navSearchInput");
  const inputMobile = document.getElementById("navSearchInputMobile");
  const searchToggle = document.getElementById("searchToggle");
  const searchToggleMobile = document.getElementById("searchToggleMobile");
  const searchToggleHeaderMobile = document.getElementById("searchToggleHeaderMobile");
  const isMobile = window.innerWidth < 900;
  if (!searchBar) return;

  if (typeof force === "boolean") {
    isSearchOpen = force;
  } else {
    isSearchOpen = !isSearchOpen;
  }

  searchBar.classList.toggle("search-open", isSearchOpen);

  if (isSearchOpen) {
    document.querySelectorAll(".dropdown-menu:not(.hidden)").forEach((drop) => {
      drop.classList.add("hidden");
      drop.classList.remove("is-open");

      const trigger = drop.previousElementSibling;
      trigger?.classList.remove("dropdown-open");
      trigger?.querySelector("svg")?.classList.remove("rotate-180");
    });
    updateDropdownOverlay();

    if (searchToggle) searchToggle.innerHTML = closeIconMarkup;
    if (searchToggleMobile) searchToggleMobile.innerHTML = closeIconMarkup;
    if (searchToggleHeaderMobile) searchToggleHeaderMobile.innerHTML = closeIconMarkup;

    if (isMobile && searchBarMobile) {
      /* Close nav menu when opening search so both are not open at once */
      const nav = document.getElementById("nav-links");
      const burgerIcon = document.getElementById("burger-icon");
      const closeIcon = document.getElementById("close-icon");
      if (nav && !nav.classList.contains("hidden")) {
        nav.classList.add("hidden");
        burgerIcon?.classList.remove("hidden");
        closeIcon?.classList.add("hidden");
      }
      searchBarMobile.classList.remove("hidden");
      inputMobile?.focus();
      if (window.innerWidth < 640) document.body.classList.add("mobile-search-open");
    } else {
      input?.focus();
    }
  } else {
    updateDropdownOverlay();

    if (searchToggle) searchToggle.innerHTML = searchIconMarkup;
    if (searchToggleMobile) searchToggleMobile.innerHTML = searchIconMarkup;
    if (searchToggleHeaderMobile) searchToggleHeaderMobile.innerHTML = searchIconMobileMarkup;

    if (isMobile && searchBarMobile) {
      searchBarMobile.classList.add("hidden");
      if (inputMobile) inputMobile.value = "";
      document.body.classList.remove("mobile-search-open");
    }

    input?.blur();
    inputMobile?.blur();
    if (input) input.value = "";
  }
}


["searchToggle", "searchToggleMobile", "searchToggleHeaderMobile"].forEach((id) => {
  const btn = document.getElementById(id);
  btn?.addEventListener("click", function (e) {
    e.stopPropagation();
    toggleSearchOverlay();
  });
});

const searchBar = document.getElementById("searchBar");
searchBar?.addEventListener("click", function (e) {
  if (e.target === searchBar) toggleSearchOverlay(false);
});

document.getElementById("searchBarMobile")?.addEventListener("click", function (e) {
  if (e.target === this) toggleSearchOverlay(false);
});

// Close search bar with ESC
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    toggleSearchOverlay(false);
  }
});

document.getElementById("navSearchInput")?.addEventListener("click", function (e) {
  e.stopPropagation();
});
document.getElementById("navSearchInputMobile")?.addEventListener("click", function (e) {
  e.stopPropagation();
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
  // ========== OPEN FIRST FAQ IN EACH OUTER BOX ==========
  document.addEventListener("DOMContentLoaded", function () {

    const faqGroups = document.querySelectorAll(".faq-outer-box");

    faqGroups.forEach(group => {
      const firstButton = group.querySelector(".faq-inner-box .faq-toggle-button");

      if (firstButton) {
        const content = firstButton.nextElementSibling;
        const icon = firstButton.querySelector("svg");

        content.classList.add("active");
        content.style.maxHeight = content.scrollHeight + "px";
        icon.classList.add("rotate-45");
      }
    });
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

// INSIGHT GRID CHANGE (insights-2.html only - guard to avoid errors on other pages)
const grid = document.getElementById("insightGrid");
const grid2 = document.getElementById("grid2Btn");
const grid3 = document.getElementById("grid3Btn");
if (grid && grid2 && grid3) {
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
}

// ===============================
// SINGLE INSIGHT PAGE NAVIGATION
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const tocNav = document.getElementById('toc-nav');
  if (!tocNav) return;

  const tocLinks = Array.from(tocNav.querySelectorAll('a[href^="#"]'));
  const tocItems = Array.from(tocNav.querySelectorAll('.toc-item'));
  // Build section list from TOC only (href="#id" → getElementById), sort by page position
  const sections = tocLinks
    .map(a => {
      const href = a.getAttribute('href') || '';
      const id = href.startsWith('#') ? href.slice(1) : '';
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean)
    .sort((a, b) => (a.getBoundingClientRect().top + window.scrollY) - (b.getBoundingClientRect().top + window.scrollY));

  const PRIMARY_COLOR = '#ff8343';
  function setActive(id) {
    tocItems.forEach(item => {
      item.classList.remove('toc-active');
      const a = item.querySelector('a');
      if (a) {
        a.style.color = '';
      }
    });
    const activeLink = tocNav.querySelector(`a[href="#${CSS.escape(id)}"]`);
    const activeItem = activeLink?.closest('.toc-item');
    if (!activeItem) return;
    activeItem.classList.add('toc-active');
    if (activeLink) {
      activeLink.style.color = PRIMARY_COLOR;
    }
  }

  function updateActiveSection() {
    if (sections.length === 0) return;
    // Pick the one section that contains the viewport reference point (only one item active, not parent+children)
    const refY = window.scrollY + Math.min(120, window.innerHeight * 0.25);
    let currentSection = sections[0];
    for (const section of sections) {
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionBottom = sectionTop + rect.height;
      if (refY >= sectionTop && refY < sectionBottom) {
        currentSection = section;
        break;
      }
      if (sectionTop <= refY) currentSection = section;
    }
    if (currentSection?.id) {
      setActive(currentSection.id);
    }
  }

  // Smooth Scroll + set active on TOC click
  tocLinks.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();

      const targetID = link.getAttribute('href');
      const target = document.querySelector(targetID);
      if (!target) return;

      setActive(targetID.slice(1));

      const offset = getOffset();
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  window.addEventListener('scroll', () => updateActiveSection(), { passive: true });

  updateActiveSection();
  // Re-run after hash scroll (browser scrolls to #hash after load)
  if (window.location.hash) {
    requestAnimationFrame(updateActiveSection);
    setTimeout(updateActiveSection, 100);
    window.addEventListener('load', () => setTimeout(updateActiveSection, 50));
  }
  window.addEventListener('hashchange', updateActiveSection);
});

/* ==============================
   GLOBAL REPLY FORM
================================*/
const replyForm = document.getElementById('replyForm');

function updateCommentLine(comment) {
  const line = comment.querySelector('.comment-line');
  if (!line) return;
  const hasReplies = comment.querySelectorAll('.comment-item.ml-5').length > 0;
  const replyOpen =
    replyForm.dataset.open === '1' &&
    replyForm.parentNode === comment;

  if (hasReplies || replyOpen) {
    line.classList.remove('h-0');
  } else {
    line.classList.add('h-0');
  }
}
/* ==============================
   REPLY FORM OPEN
================================*/
function openForm(form) {
  form.dataset.open = '1';
  form.classList.replace('h-0', 'h-full'); form.style.maxHeight = form.scrollHeight + 'px';
  form.classList.remove('opacity-0', '-translate-y-1.5', 'mt-0');
  form.classList.add('opacity-100', 'translate-y-0', 'mt-5');
  form.querySelector('.reply-body').classList.replace('border-transparent', 'border-brand');
}

/* ==============================
   REPLY FORM CLOSE
================================*/
function closeForm(form) {
  form.dataset.open = '0';
  form.style.maxHeight = '0px';
  form.classList.remove('opacity-100', 'translate-y-0', 'mt-5');
  form.classList.add('opacity-0', '-translate-y-1.5', 'mt-0');
  form.querySelector('.reply-body')
    .classList.replace('border-brand', 'border-transparent');
}

/* ==============================
   TOGGLE REPLY
================================*/
function toggleReply(btn) {
  const comment = btn.closest('.comment-item');
  const form = document.getElementById('replyForm');
  const previousComment = form.parentNode;
  const alreadyOpen =
    form.dataset.open === '1' &&
    previousComment === comment;

  /* ===== If clicking same comment -> close ===== */
  if (alreadyOpen) {
    closeForm(form);
    btn.classList.remove('text-primary');
    btn.classList.add('text-slate-100');
    updateCommentLine(comment);
    return;
  }

  /* ===== CLOSE PREVIOUS COMMENT ===== */
  if (previousComment && previousComment !== comment) {
    const prevBtn = previousComment.querySelector('.reply-btn');
    closeForm(form);
    prevBtn?.classList.remove('text-primary');
    prevBtn?.classList.add('text-slate-100');
    updateCommentLine(previousComment);
  }

  /* ===== MOVE FORM ===== */
  comment.appendChild(form);
  openForm(form);
  btn.classList.add('text-primary');
  updateCommentLine(comment);
}

/* ==============================
   CANCEL REPLY
================================*/
function cancelReply(btn) {
  const parentComment = replyForm.parentNode;
  closeForm(replyForm);
  document.querySelectorAll('.reply-btn')
    .forEach(b => {
      b.classList.remove('text-primary');
      b.classList.add('text-slate-100');
    });

  replyForm
    .querySelectorAll('input,textarea')
    .forEach(el => {
      el.value = '';
    });
  updateCommentLine(parentComment);
}

/* ==============================
   VOTING
================================*/
function vote(btn, dir) {
  const item = btn.closest('.comment-item');
  const likeBtn = item.querySelector('.like-btn');
  const dislikeBtn = item.querySelector('.dislike-btn');
  const count = btn.querySelector('.vote-count');
  let num = parseInt(count.textContent);
  const prev = btn.dataset.voted ? parseInt(btn.dataset.voted) : null;

  // Determine opposite button
  const otherBtn = dir === 1 ? dislikeBtn : likeBtn;
  // remove vote if clicked again (same button)
  if (prev === dir) {
    num--;
    count.textContent = String(num).padStart(2, '0');
    delete btn.dataset.voted;
    btn.classList.remove('text-primary', 'text-red-500');
    btn.classList.add('text-slate-100');
    return;
  }

  // If opposite button has a vote, remove it first
  if (otherBtn && otherBtn.dataset.voted) {
    const otherCount = otherBtn.querySelector('.vote-count');
    let otherNum = parseInt(otherCount.textContent);
    otherNum--;
    otherCount.textContent = String(otherNum).padStart(2, '0');
    delete otherBtn.dataset.voted;
    otherBtn.classList.remove('text-primary', 'text-red-500');
    otherBtn.classList.add('text-slate-100');
  }

  // If current button already had a different vote, decrease its count
  if (prev) {
    num--;
  }

  // add vote
  num++;
  count.textContent = String(num).padStart(2, '0');
  btn.dataset.voted = String(dir);
  btn.classList.remove('text-slate-100');
  btn.classList.add(
    dir === 1
      ? 'text-primary'
      : 'text-red-500'
  );
}

/* ==============================
   UNIVERSAL FORM VALIDATION
================================*/
function validateForm(formElement) {
  const fields = formElement.querySelectorAll('[required]');
  let isValid = true;

  // Remove previous errors
  formElement.querySelectorAll('[data-error]').forEach(msg => msg.remove());
  formElement.querySelectorAll('[data-field-error]').forEach(field => {
    field.classList.remove('border-red-500');
  });
  // Also remove red border from dropdown buttons
  formElement.querySelectorAll('.form-dropdown-button').forEach(button => {
    button.classList.remove('border-red-500');
  });

  fields.forEach(field => {

    let errorText = '';
    let isEmpty = false;

    // Get error label - check for custom data-error-label first, then fall back to label text
    let fieldName = 'This field';

    // Check if field has custom error label
    const customErrorLabel = field.getAttribute('data-error-label');
    if (customErrorLabel) {
      fieldName = customErrorLabel;
    } else {
      // Fall back to label text from the parent container
      const label = field.closest('div')?.querySelector('label');
      if (label) {
        fieldName = label.textContent.replace('*', '').trim();
      }
    }

    // Check empty
    if (field.type === 'file') {
      isEmpty = !field.files || field.files.length === 0;
    } else if (field.type === 'checkbox') {
      isEmpty = !field.checked;
    } else {
      isEmpty = !field.value.trim();
    }

    if (isEmpty) {
      if (field.type === 'file') {
        errorText = `Please upload an image`;
      } else if (field.type === 'checkbox') {
        errorText = `Please accept the terms to continue`;
      } else {
        errorText = `${fieldName} is required`;
      }
    }

    // Email validation
    else if (field.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field.value.trim())) {
        errorText = `Please enter a valid email address`;
      }
    }

    // URL validation
    else if (field.type === 'url') {
      try {
        new URL(field.value.trim());
      } catch {
        errorText = `Please enter a valid website URL`;
      }
    }

    if (errorText) {
      isValid = false;

      field.classList.add('border-red-500');
      field.setAttribute('data-field-error', 'true');

      const errorMsg = document.createElement('span');
      errorMsg.setAttribute('data-error', 'true');
      errorMsg.className = 'text-red-500 text-sm mt-0.5 block';
      errorMsg.textContent = errorText;

      // For hidden inputs in dropdowns, append error after the dropdown button
      if (field.type === 'hidden' && field.closest('.form-dropdown')) {
        const dropdown = field.closest('.form-dropdown');
        const button = dropdown.querySelector('.form-dropdown-button');
        if (button) {
          // Add red border to the visible button instead of the hidden input
          button.classList.add('border-red-500');
          button.parentNode.insertBefore(errorMsg, button.nextSibling);
        }
      } else if (field.type === 'checkbox' && field.closest('label')) {
        // For checkboxes inside labels, append error to the label's parent container
        const label = field.closest('label');
        label.parentNode.appendChild(errorMsg);
      } else {
        field.parentNode.appendChild(errorMsg);
      }
    }

    /* 🔥 update form height after errors appear */
    const replyForm = formElement.closest('#replyForm');
    if (replyForm && replyForm.dataset.open === '1') {
      replyForm.style.maxHeight = replyForm.scrollHeight + 'px';
    }

    return isValid;

  });
  const replyForm = formElement.closest('#replyForm');
  if (replyForm && replyForm.dataset.open === '1') {
    replyForm.style.maxHeight = replyForm.scrollHeight + 'px';
  }

  return isValid;
}

/* ==============================
   SHOW TOAST NOTIFICATION
================================*/
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;

  // Show toast
  toast.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
  toast.classList.add('opacity-100', 'translate-y-0');

  // Auto hide after duration
  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    toast.classList.remove('opacity-100', 'translate-y-0');
  }, duration);
}

/* ==============================
   SUBMIT REPLY
================================*/
function submitReply(btn) {
  const form = btn.closest('.reply-body');
  if (!form) return;

  // Validate form - errors show in form only
  if (!validateForm(form.closest('[id="replyForm"]'))) {
    return;
  }

  // Get form values
  const replyForm = form.closest('[id="replyForm"]');
  const formData = {
    firstName: replyForm.querySelector('input[placeholder="Your first name"]')?.value || '',
    lastName: replyForm.querySelector('input[placeholder="Your last name"]')?.value || '',
    email: replyForm.querySelector('input[placeholder="Your email address"]')?.value || '',
    website: replyForm.querySelector('input[placeholder="Enter your website"]')?.value || '',
    image: replyForm.querySelector('input[type="file"]')?.files[0] || null,
    comment: replyForm.querySelector('textarea[placeholder="Type your comment here..."]')?.value || ''
  };

  // Here you can add API call to submit the form
  console.log('Form submitted:', formData);

  // Show success toast only
  showToast('Reply submitted successfully!', 3000);

  // Reset form and close
  cancelReply(btn);
}

/* ==============================
   UNIVERSAL FORM SUBMIT HANDLER
   (For all forms with "universal-form" class)
================================*/
document.addEventListener('DOMContentLoaded', function () {
  const universalForms = document.querySelectorAll('form.universal-form');

  universalForms.forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Validate form (shows errors automatically)
      if (!validateForm(this)) {
        return;
      }

      // If validation passes, show success message
      showToast('Form submitted successfully!', 3000);

      // Reset form
      this.reset();

      // Reset dropdown fields to default text
      const dropdowns = this.querySelectorAll('.form-dropdown');
      dropdowns.forEach(dropdown => {
        const selectedSpan = dropdown.querySelector('.form-dropdown-selected');
        const hiddenInput = dropdown.querySelector('input[type="hidden"]');

        if (hiddenInput) {
          hiddenInput.value = '';
        }

        // Reset to default text based on dropdown type
        const dataName = dropdown.getAttribute('data-name');
        if (dataName === 'project_type') {
          selectedSpan.textContent = 'Select your project needs';
        } else if (dataName === 'budget_type') {
          selectedSpan.textContent = 'Choose your budget range';
        } else {
          selectedSpan.textContent = 'Select an option';
        }

        selectedSpan.classList.remove('is-selected');

        // Remove active state from all options
        dropdown.querySelectorAll('.form-dropdown-option').forEach(opt => {
          opt.classList.remove('is-active');
        });
      });
    });
  });

  // Handle position card & support ticket clicks with offset
  function handleScrollWithOffset(selector) {
    const links = document.querySelectorAll(`a[href="${selector}"]`);

    links.forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(selector);
        if (target) {
          const offset = getOffset();
          const top = target.getBoundingClientRect().top + window.scrollY - offset;

          window.scrollTo({
            top,
            behavior: "smooth"
          });
        }
      });
    });
  }

  handleScrollWithOffset("#open-position-form");
  handleScrollWithOffset("#support-ticket");

});



// file choose name toggle
const fileInput = document.getElementById('fileUpload');
const fileText = document.getElementById('fileText');

fileInput.addEventListener('change', function () {
  if (this.files.length > 0) {
    fileText.textContent = this.files[0].name;
  } else {
    fileText.textContent = "No file selected";
  }
});