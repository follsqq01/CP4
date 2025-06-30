// анимации при переходе страниуц
window.addEventListener("load", function () {
  document.body.classList.add("fade-in");
});

document.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = link.getAttribute("href");

    if (href && !href.startsWith("#") && !link.target) {
      e.preventDefault();
      document.body.classList.remove("fade-in");
      document.body.classList.add("fade-out");

      setTimeout(() => {
        window.location.href = href;
      }, 800);
    }
  });
});
