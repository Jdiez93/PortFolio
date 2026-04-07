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
  
(() => {
  const canvas = document.getElementById("network-bg");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0;
  let height = 0;
  let particles = [];
  let animationId = null;

  const styles = getComputedStyle(document.documentElement);
  const DOT_RGB = styles.getPropertyValue("--network-dot-rgb").trim() || "255,255,255";
  const LINE_RGB = styles.getPropertyValue("--network-line-rgb").trim() || "255,255,255";

  const CONFIG = {
  density: 23500,
  maxParticles: 95,
  minParticles: 38,
  linkDistance: 145,
  speedMin: reducedMotion ? 0.01 : 0.035,
  speedMax: reducedMotion ? 0.03 : 0.11,
  radiusMin: 0.9,
  radiusMax: 2.4,
  dotAlphaMin: 0.22,
  dotAlphaMax: 0.42,
  lineAlpha: 0.16
};

  function resizeCanvas() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createParticles();
  }

  function getParticleCount() {
    const count = Math.floor((width * height) / CONFIG.density);
    return Math.max(CONFIG.minParticles, Math.min(CONFIG.maxParticles, count));
  }

  function createParticle() {
    const angle = Math.random() * Math.PI * 2;
    const speed =
      CONFIG.speedMin + Math.random() * (CONFIG.speedMax - CONFIG.speedMin);

    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: CONFIG.radiusMin + Math.random() * (CONFIG.radiusMax - CONFIG.radiusMin),
      alpha:
        CONFIG.dotAlphaMin +
        Math.random() * (CONFIG.dotAlphaMax - CONFIG.dotAlphaMin)
    };
  }

  function createParticles() {
    particles = Array.from({ length: getParticleCount() }, createParticle);
  }

  function updateParticles() {
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x <= 0 || p.x >= width) p.vx *= -1;
      if (p.y <= 0 || p.y >= height) p.vy *= -1;

      p.x = Math.max(0, Math.min(width, p.x));
      p.y = Math.max(0, Math.min(height, p.y));
    }
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];

      for (let j = i + 1; j < particles.length; j++) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);

        if (dist < CONFIG.linkDistance) {
          const opacity = (1 - dist / CONFIG.linkDistance) * CONFIG.lineAlpha;

          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${LINE_RGB}, ${opacity})`;
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
  }

  function drawDots() {
    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${DOT_RGB}, ${p.alpha})`;
      ctx.fill();
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    updateParticles();
    drawLines();
    drawDots();

    animationId = requestAnimationFrame(render);
  }

  function init() {
    resizeCanvas();
    cancelAnimationFrame(animationId);
    render();
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 120);
  });

  init();
})();


});

