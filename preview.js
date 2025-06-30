// букавки по бокам экрана
document.addEventListener("DOMContentLoaded", function () {
  let k1 = document.querySelector(".k1");
  let i = document.querySelector(".i");
  let n = document.querySelector(".n");
  let k2 = document.querySelector(".k2");
  let overlay = document.querySelector(".overlay");
  const centerContainer = document.querySelector(".center-container");
  const bgVideo = document.getElementById("bg-video");

  setTimeout(function () {
    k1.classList.add("top-left");
    i.classList.add("bottom-left");
    n.classList.add("top-right");
    k2.classList.add("bottom-right");
    overlay.style.opacity = "0";
  }, 1000);

  setTimeout(() => {
    centerContainer.classList.add("visible");
    bgVideo.style.opacity = "1";
  }, 2200);

  overlay.addEventListener("transitionend", function () {
    overlay.style.display = "none";
  });
  const newsButton = document.getElementById("news-button");
  if (newsButton) {
    newsButton.addEventListener("click", function (e) {
      e.preventDefault();
      centerContainer.classList.add("fade-out");
      centerContainer.addEventListener(
        "transitionend",
        function () {
          const currentTime = bgVideo.currentTime;
          window.location.href = `events.html?time=${currentTime}`;
        },
        { once: true }
      );
    });
  }
});
// время / часики
function updateTimes() {
  const now = new Date();
  const nyOffset = -5 * 60 + now.getTimezoneOffset();
  const nyDate = new Date(now.getTime() + nyOffset * 60 * 1000);
  document.getElementById("ny-time").innerText = nyDate.toLocaleString([], {
    timeStyle: "medium",
  });

  const mskOffset = 3 * 60 + now.getTimezoneOffset();
  const mskDate = new Date(now.getTime() + mskOffset * 60 * 1000);
  document.getElementById("msk-time").innerText = mskDate.toLocaleString([], {
    timeStyle: "medium",
  });
}

setInterval(updateTimes, 500);
updateTimes();
