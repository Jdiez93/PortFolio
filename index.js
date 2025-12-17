(function () {
  const toggleBtn = document.querySelector(".nav__toggle");
  const menu = document.querySelector("#navMenu");
  const year = document.querySelector("#year");
  const navLinks = document.querySelectorAll(".nav__link");

  if (year) year.textContent = String(new Date().getFullYear());

  function setMenu(open) {
  if (!toggleBtn || !menu) return;
  menu.classList.toggle("is-open", open);
  toggleBtn.classList.toggle("is-open", open); // ✅ AÑADE ESTA LÍNEA
  toggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
  toggleBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
}


  if (toggleBtn && menu) {
    toggleBtn.addEventListener("click", () => {
      const isOpen = menu.classList.contains("is-open");
      setMenu(!isOpen);
    });

    // Cierra el menú al hacer click en un enlace (mobile)
    navLinks.forEach((link) => {
      link.addEventListener("click", () => setMenu(false));
    });

    // Cierra al hacer click fuera
    document.addEventListener("click", (e) => {
      const target = e.target;
      const clickInside = menu.contains(target) || toggleBtn.contains(target);
      if (!clickInside) setMenu(false);
    });

    // Cierra con Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });
  }

  // Resalta enlace activo al hacer scroll (sutil)
  const sections = [
    document.querySelector("#sobre-mi"),
    document.querySelector("#habilidades"),
    document.querySelector("#certificaciones"),
    document.querySelector("#experiencia"),
    document.querySelector("#proyectos"),
  ].filter(Boolean);

  const linkById = new Map();
  navLinks.forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href.startsWith("#")) linkById.set(href.slice(1), a);
  });

  function setActive(id) {
    navLinks.forEach((a) => a.classList.remove("is-active"));
    const link = linkById.get(id);
    if (link) link.classList.add("is-active");
  }

  // Estilo active sin “ruido”
  const style = document.createElement("style");
  style.textContent = `
    .nav__link.is-active{
      background: rgba(255,255,255,0.04);
      text-decoration: none;
    }
  `;
  document.head.appendChild(style);

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible && visible.target && visible.target.id) {
          setActive(visible.target.id);
        }
      },
      { root: null, threshold: [0.2, 0.35, 0.5] }
    );

    sections.forEach((s) => observer.observe(s));
  }

  // Animación títulos al entrar en viewport
const titles = document.querySelectorAll(".section__title");

if ("IntersectionObserver" in window && titles.length) {
  const titleObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          obs.unobserve(entry.target); // solo una vez
        }
      });
    },
    { threshold: 0.35 }
  );

  titles.forEach((t) => titleObserver.observe(t));
} else {
  // Fallback: si no hay IO, mostramos todo
  titles.forEach((t) => t.classList.add("is-revealed"));
}

// Contadores en el aside (una sola vez)
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
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });
}

if (statsBox && "IntersectionObserver" in window) {
  const obs = new IntersectionObserver((entries, observer) => {
    if (entries.some((e) => e.isIntersecting)) {
      animateCounters();
      observer.disconnect();
    }
  }, { threshold: 0.35 });

  obs.observe(statsBox);
} else {
  animateCounters();
}

// ====== Scroll Reveal (entra desde laterales, al bajar y al subir) ======
const revealTargets = [
  ".section__header",
  ".skills__group",
  ".timeline__item",
  ".experience__item",
  ".flip-card",
  ".hero__content",
  ".hero__card",
  ".ai-card"
].flatMap((sel) => Array.from(document.querySelectorAll(sel)));

revealTargets.forEach((el, idx) => {
  el.classList.add("reveal");
  el.classList.add(idx % 2 === 0 ? "reveal--left" : "reveal--right");

  // Stagger suave (solo para que no aparezca todo a la vez)
  const delay = Math.min(idx * 90, 360);
  el.style.setProperty("--delay", `${delay}ms`);
  el.setAttribute("data-delay", "1");
});

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Entra => visible / Sale => se quita (para que al volver se reanime)
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
  );

  revealTargets.forEach((el) => io.observe(el));
} else {
  // Fallback
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}


})();

