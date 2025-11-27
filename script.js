const canvas = document.getElementById("starfield");
      const ctx = canvas.getContext("2d");
      let stars = [];
      const numStars = 100;

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener("resize", resize);

      function createStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
          stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5,
            speed: 0.02 + Math.random() * 0.03,
          });
        }
      }
      createStars();

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        stars.forEach((star) => {
          star.x -= star.speed;
          if (star.x < 0) star.x = canvas.width;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        });
        requestAnimationFrame(animate);
      }
      animate();

      const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  }, {
    threshold: 0.1 // ajusta si quieres que se active antes o después
  });

  reveals.forEach((el) => observer.observe(el));
});


  const toggleBtn = document.getElementById("toggle-theme");
  const body = document.body;

  // Comprobar si hay un tema guardado
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    body.classList.add(savedTheme);
    updateButtonText(savedTheme);
  } else {
    body.classList.add("dark"); // Tema por defecto: oscuro
    updateButtonText("dark");
  }

  toggleBtn.addEventListener("click", () => {
    if (body.classList.contains("light")) {
      body.classList.replace("light", "dark");
      localStorage.setItem("theme", "dark");
      updateButtonText("dark");
    } else {
      body.classList.replace("dark", "light");
      localStorage.setItem("theme", "light");
      updateButtonText("light");
    }
  });

  function updateButtonText(theme) {
    toggleBtn.textContent = theme === "dark" ? "☀️ Tema claro" : "🌙 Tema oscuro";
  }

   function descargarPDF() {
    const enlace = document.createElement("a");
    enlace.href = "Jorge_Diez_CV.pdf"; // Cambia esto por la ruta a tu PDF
    enlace.download = "Jorge_Diez_CV"; // Nombre con el que se descargará
    enlace.click();
  }