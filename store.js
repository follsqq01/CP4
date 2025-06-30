const projects = document.querySelectorAll(".project");

if (projects.length > 0) {
  const preview = document.querySelector(".preview");
  const previewImg = document.querySelector(".preview-img");

  let allowPreview = false;
  setTimeout(() => (allowPreview = true), 5000);

  projects.forEach((project) => {
    project.addEventListener("click", () => {
      const isActive = project.classList.contains("active");
      projects.forEach((p) => p.classList.remove("active"));

      if (!isActive) {
        project.classList.add("active");
        gsap.to(preview, { scale: 0, duration: 0.3, ease: "power2.in" });

        const description = project.querySelector(".description");
        gsap.fromTo(
          description,
          { height: 0, autoAlpha: 0 },
          { height: "auto", autoAlpha: 1, duration: 0.5, ease: "power2.out" }
        );
      }
    });

    const description = project.querySelector(".description");
    if (description) {
      description.addEventListener("click", (e) => {
        e.stopPropagation();
        if (project.classList.contains("active")) {
          const link = project.dataset.link;
          if (link) window.location.href = link;
        }
      });
    }

    project.addEventListener("mouseenter", () => {
      const someIsActive = document.querySelector(".project.active");
      if (!allowPreview || someIsActive) {
        gsap.to(preview, { scale: 0, duration: 0.3, ease: "power2.in" });
        return;
      }

      const imgUrl = project.dataset.img;
      if (imgUrl) {
        previewImg.style.backgroundImage = `url(${imgUrl})`;
        gsap.to(preview, { scale: 1, duration: 0.4, ease: "power2.out" });
      }
    });

    project.addEventListener("mouseleave", () => {
      gsap.to(preview, { scale: 0, duration: 0.3, ease: "power2.in" });
    });
  });

  // Появление товаров
  gsap.from(projects, {
    duration: 2,
    opacity: 0,
    y: 40,
    ease: "power3.inOut",
    delay: 1,
    stagger: { amount: 0.8 },
  });
}

// переходы межу странциами
window.addEventListener("load", () => {
  document.body.classList.remove("preload");
  document.body.classList.add("fade-in");
});

document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (e) => {
    const href = link.getAttribute("href");
    if (href && !href.startsWith("#") && !link.target) {
      e.preventDefault();
      document.body.classList.remove("fade-in");
      document.body.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = href;
      }, 2000);
    }
  });
});
//СТАНИЦА ТОВАРОВ
// Активная кнопка выбора размера
const sizeButtons = document.querySelectorAll(".size-button:not(.disabled)");
sizeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    sizeButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
  });
});
