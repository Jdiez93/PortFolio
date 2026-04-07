document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // ELEMENTOS GENERALES
  // =========================
  const toggleBtn = document.querySelector(".nav__toggle");
  const menu = document.querySelector("#navMenu");
  const navLinks = document.querySelectorAll(".nav__link");
  const year = document.querySelector("#year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  // =========================
  // MENÚ MÓVIL
  // =========================
  function setMenu(open) {
    if (!toggleBtn || !menu) return;

    menu.classList.toggle("is-open", open);
    toggleBtn.classList.toggle("is-open", open);
    toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
    toggleBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
  }

  if (toggleBtn && menu) {
    toggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains("is-open");
      setMenu(!isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        setMenu(false);
      });
    });

    document.addEventListener("click", (e) => {
      const target = e.target;
      const clickInsideMenu = menu.contains(target);
      const clickOnButton = toggleBtn.contains(target);

      if (!clickInsideMenu && !clickOnButton) {
        setMenu(false);
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setMenu(false);
      }
    });
  }

  // =========================
  // NAVBAR: LINK ACTIVO SEGÚN SECCIÓN
  // =========================
  const linkById = new Map();

  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    if (href.startsWith("#")) {
      const id = href.slice(1);
      linkById.set(id, link);
    }
  });

  const sections = [...linkById.keys()]
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  function setActive(id) {
    navLinks.forEach((link) => link.classList.remove("is-active"));

    const activeLink = linkById.get(id);
    if (activeLink) {
      activeLink.classList.add("is-active");
    }
  }

  // Estilo sutil para el enlace activo
  const activeStyle = document.createElement("style");
  activeStyle.textContent = `
    .nav__link.is-active {
      background: rgba(255,255,255,0.04);
      text-decoration: none;
    }
  `;
  document.head.appendChild(activeStyle);

  if ("IntersectionObserver" in window && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleSections.length) {
          setActive(visibleSections[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-45% 0px -45% 0px",
        threshold: [0, 0.15, 0.3, 0.5, 0.75, 1]
      }
    );

    sections.forEach((section) => sectionObserver.observe(section));
  }

  // =========================
  // ANIMACIÓN DE TÍTULOS
  // =========================
  const titles = document.querySelectorAll(".section__title");

  if ("IntersectionObserver" in window && titles.length) {
    const titleObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.35 }
    );

    titles.forEach((title) => titleObserver.observe(title));
  } else {
    titles.forEach((title) => title.classList.add("is-revealed"));
  }

  // =========================
  // CONTADORES
  // =========================
  const counters = document.querySelectorAll("[data-counter]");
  const statsBox = document.querySelector(".stats");

  function animateCounters() {
    counters.forEach((el) => {
      const target = Number(el.getAttribute("data-counter")) || 0;
      const duration = 900;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.round(target * progress);
        el.textContent = String(value);

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
    });
  }

  if (statsBox && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          animateCounters();
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    counterObserver.observe(statsBox);
  } else if (counters.length) {
    animateCounters();
  }

  // =========================
  // SCROLL REVEAL
  // =========================
  const revealTargets = [
    ".section__header",
    ".skills__group",
    ".timeline__item",
    ".experience__item",
    ".flip-card",
    ".hero__content",
    ".hero__card",
    ".ai-card"
  ].flatMap((selector) => Array.from(document.querySelectorAll(selector)));

  revealTargets.forEach((el, index) => {
    el.classList.add("reveal");
    el.classList.add(index % 2 === 0 ? "reveal--left" : "reveal--right");

    const delay = Math.min(index * 90, 360);
    el.style.setProperty("--delay", `${delay}ms`);
  });

  if ("IntersectionObserver" in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      {
        threshold: 0.18,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }
});