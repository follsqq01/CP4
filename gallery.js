const lenis = new Lenis();

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

gsap.registerPlugin(Flip, CustomEase, ScrollToPlugin);

CustomEase.create(
  "hop",
  "M0,0 C0.028,0.528 0.129,0.74 0.27,0.852 0.415,0.967 0.499,1 1,1"
);

const items = document.querySelectorAll("nav .nav-item p");
const galleryContainer = document.querySelector(".gallery-container");
const imgPreviews = document.querySelector(".img-previews");
const minimap = document.querySelector(".minimap");

let activeLayout = "layout-1-gallery";

function switchLayout(newLayout) {
  if (newLayout === activeLayout) return;

  if (activeLayout === "layout-2-gallery" && window.scrollY > 0) {
    gsap.to(window, {
      scrollTo: { y: 0 },
      duration: 0.5,
      ease: "power3.out",
      onComplete: () => switchLayoutHandler(newLayout),
    });
  } else {
    switchLayoutHandler(newLayout);
  }
}
// Основной обработчик смены состояний с флип-анимацией
function switchLayoutHandler(newLayout) {
  const state = Flip.getState(gallery.querySelectorAll(".img"));

  gallery.classList.remove(activeLayout);
  gallery.classList.add(newLayout);

  let staggerValue = 0.025;
  if (
    (activeLayout === "layout-1-gallery" && newLayout === "layout-2-gallery") ||
    (activeLayout === "layout-3-gallery" && newLayout === "layout-2-gallery")
  ) {
    staggerValue = 0;
  }

  Flip.from(state, {
    duration: 1.5,
    ease: "hop",
    stagger: staggerValue,
  });

  activeLayout = newLayout;

  if (newLayout === "layout-2-gallery") {
    gsap.to([imgPreviews, minimap], {
      autoAlpha: 1,
      duration: 0.3,
      delay: 0.5,
    });
    window.addEventListener("scroll", handleScroll);
  } else {
    gsap.to([imgPreviews, minimap], {
      autoAlpha: 0,
      duration: 0.3,
    });
    window.removeEventListener("scroll", handleScroll);
    gsap.set(gallery, { clearProps: "y" });
    gsap.set(minimap, { clearProps: "y" });
  }

  items.forEach((item) => {
    item.classList.toggle("active", item.id === newLayout);
  });
}

items.forEach((item) => {
  item.addEventListener("click", () => {
    if (!item.id) return;
    const newLayout = item.id;
    switchLayout(newLayout);
  });
});

let currentScrollProgress = 0;

function handleScroll() {
  if (activeLayout !== "layout-2-gallery") return;

  const imgPreviewsHeight = imgPreviews.scrollHeight;
  const galleryHeight = gallery.scrollHeight;
  const windowHeight = window.innerHeight;
  const scrollY = window.scrollY;

  currentScrollProgress = scrollY / (imgPreviewsHeight - windowHeight);
  currentScrollProgress = Math.min(Math.max(currentScrollProgress, 0), 1);

  const galleryTranslateY =
    -currentScrollProgress * (galleryHeight - windowHeight) * 1.3;

  const minimapTranslateY =
    currentScrollProgress * (windowHeight - minimap.offsetHeight) * 0.7;

  gsap.to(gallery, {
    y: galleryTranslateY,
    ease: "none",
    duration: 0.1,
  });

  gsap.to(minimap, {
    y: minimapTranslateY,
    ease: "none",
    duration: 0.1,
  });
}

let scrollTimeout;
window.addEventListener("scroll", () => {
  if (activeLayout === "layout-2-gallery") {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScroll, 16); // ~60fps
  }
});

window.addEventListener("load", () => {
  if (activeLayout === "layout-2-gallery") {
    handleScroll();
  }
});

// мобиьная адаптация
function initMobileMinimap() {
  if (window.innerWidth <= 900) {
    const container = document.querySelector(".mobile-container");
    const items = document.querySelector(".mobile-items");
    const indicator = document.querySelector(".mobile-indicator");
    const itemElements = document.querySelectorAll(".mobile-item");
    const previewImage = document.querySelector(".mobile-img-preview img");
    const itemImages = document.querySelectorAll(".mobile-item img");

    let dimensions = {
      itemSize: 0,
      containerSize: 0,
      indicatorSize: 0,
    };

    let maxTranslate = 0;
    let currentTranslate = 0;
    let targetTranslate = 0;
    let isClickMove = false;
    let currentImageIndex = 0;
    const activeItemOpacity = 0.3;

    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    function updateDimensions() {
      dimensions = {
        itemSize: itemElements[0].getBoundingClientRect().width,
        containerSize: items.scrollWidth,
        indicatorSize: indicator.getBoundingClientRect().width,
      };
      return dimensions;
    }

    dimensions = updateDimensions();
    maxTranslate = dimensions.containerSize - dimensions.indicatorSize;

    function getItemInIndicator() {
      itemImages.forEach((img) => (img.style.opacity = "1"));
      const indicatorStart = -currentTranslate;
      const indicatorEnd = indicatorStart + dimensions.indicatorSize;

      let maxOverlap = 0;
      let selectedIndex = 0;

      itemElements.forEach((item, index) => {
        const itemStart = index * dimensions.itemSize;
        const itemEnd = itemStart + dimensions.itemSize;
        const overlapStart = Math.max(indicatorStart, itemStart);
        const overlapEnd = Math.min(indicatorEnd, itemEnd);
        const overlap = Math.max(0, overlapEnd - overlapStart);

        if (overlap > maxOverlap) {
          maxOverlap = overlap;
          selectedIndex = index;
        }
      });

      itemImages[selectedIndex].style.opacity = activeItemOpacity;
      return selectedIndex;
    }

    function updatePreviewImage(index) {
      if (currentImageIndex !== index) {
        currentImageIndex = index;
        const targetItem = itemElements[index].querySelector("img");
        const targetSrc = targetItem.getAttribute("src");
        previewImage.setAttribute("src", targetSrc);
      }
    }

    function animate() {
      const lerpFactor = isClickMove ? 0.05 : 0.075;
      currentTranslate = lerp(currentTranslate, targetTranslate, lerpFactor);

      if (Math.abs(currentTranslate - targetTranslate) > 0.01) {
        const transform = `translateX(${currentTranslate}px)`;
        items.style.transform = transform;

        const activeIndex = getItemInIndicator();
        updatePreviewImage(activeIndex);
      } else {
        isClickMove = false;
      }

      requestAnimationFrame(animate);
    }

    container.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();
        isClickMove = false;
        const delta = e.deltaY;
        const scrollVelocity = Math.min(Math.max(delta * 0.5, -20), 20);
        targetTranslate = Math.min(
          Math.max(targetTranslate - scrollVelocity, -maxTranslate),
          0
        );
      },
      { passive: false }
    );
    // Горизонтальный скролл мышью
    let touchStartY = 0;
    container.addEventListener("touchstart", (e) => {
      touchStartY = e.touches[0].clientY;
    });

    container.addEventListener(
      "touchmove",
      (e) => {
        const touchY = e.touches[0].clientY;
        const deltaY = touchStartY - touchY;
        const delta = deltaY;
        const scrollVelocity = Math.min(Math.max(delta * 0.5, -20), 20);
        targetTranslate = Math.min(
          Math.max(targetTranslate - scrollVelocity, -maxTranslate),
          0
        );
        touchStartY = touchY;
        e.preventDefault();
      },
      { passive: false }
    );

    itemElements.forEach((item, index) => {
      item.addEventListener("click", () => {
        isClickMove = true;
        targetTranslate =
          -index * dimensions.itemSize +
          (dimensions.indicatorSize - dimensions.itemSize) / 2;
        targetTranslate = Math.max(Math.min(targetTranslate, 0), -maxTranslate);
      });
    });

    window.addEventListener("resize", () => {
      dimensions = updateDimensions();
      const newMaxTranslate =
        dimensions.containerSize - dimensions.indicatorSize;
      targetTranslate = Math.min(
        Math.max(targetTranslate, -newMaxTranslate),
        0
      );
      currentTranslate = targetTranslate;
      const transform = `translateX(${currentTranslate}px)`;
      items.style.transform = transform;
    });

    itemImages[0].style.opacity = activeItemOpacity;
    updatePreviewImage(0);
    animate();
  }
}

const layout1 = document.querySelector("#layout-1-gallery");
const layout2 = document.querySelector("#layout-2-gallery");
const layout3 = document.querySelector("#layout-3-gallery");

const gallery = document.querySelector(".gallery");
const layout3Text = document.querySelector(".cosmic-text");

function showLayout(layoutName) {
  // Переключение состояний галереи
  gallery.className = "gallery " + layoutName;

  // Появление/исчезновение текста в третьем состоянии
  if (layoutName === "layout-3-gallery") {
    layout3Text.style.visibility = "visible";
    layout3Text.style.opacity = "1";
  } else {
    layout3Text.style.opacity = "0";
    setTimeout(() => {
      layout3Text.style.visibility = "hidden";
    }, 800);
  }

  if (layoutName === "layout-2-gallery") {
    lenis.start();
  } else {
    lenis.stop();
    window.scrollTo(0, 0);
  }
}

layout1.addEventListener("click", () => showLayout("layout-1-gallery"));
layout2.addEventListener("click", () => showLayout("layout-2-gallery"));
layout3.addEventListener("click", () => showLayout("layout-3-gallery"));
window.addEventListener("load", () => {
  initMobileMinimap();
  showLayout("layout-1-gallery");
});
