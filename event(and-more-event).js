document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("subscribe-banner");
  const closeBtn = document.getElementById("subscribe-close");
  const subscribeForm = document.getElementById("subscribe-form");

  if (closeBtn && banner) {
    closeBtn.addEventListener("click", () => {
      banner.classList.add("hide");
    });
  }

  if (subscribeForm && banner) {
    subscribeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      banner.classList.add("hide");
      alert("Thank you for subscribing! Check your e-mail :)");
      // Тут можно добавить логику отправки формы, например fetch/AJAX
    });
  }

  const slider = document.querySelector(".slider");
  const slides = document.querySelectorAll(".slide");
  const prevBtn = document.querySelector(".slider-arrow.left");
  const nextBtn = document.querySelector(".slider-arrow.right");

  if (slider && slides.length && prevBtn && nextBtn) {
    let currentSlide = 0;

    function updateSlider() {
      const offset = -currentSlide * 100;
      slider.style.transform = `translateX(${offset}%)`;
    }

    prevBtn.addEventListener("click", () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateSlider();
    });

    nextBtn.addEventListener("click", () => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlider();
    });

    updateSlider();
  }
});
