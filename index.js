(function () {
  const toggleBtn = document.querySelector(".nav__toggle");
  const menu = document.querySelector("#navMenu");
  const year = document.querySelector("#year");
  const navLinks = document.querySelectorAll(".nav__link");

  if (year) year.textContent = String(new Date().getFullYear());

  function setMenu(open) {
    if (!toggleBtn || !menu) return;
    menu.classList.toggle("is-open", open);
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
})();
