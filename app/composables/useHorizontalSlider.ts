import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";

interface SliderOptions {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  pauseOnHover?: boolean;
  continuous?: boolean;
  speed?: number;
  showCustomCursor?: boolean;
}

export const useHorizontalSlider = (options: SliderOptions = {}) => {
  const {
    autoPlay = false,
    autoPlayInterval = 4000,
    pauseOnHover = true,
    continuous = false,
    speed = 1,
    showCustomCursor = true,
  } = options;

  const sliderRef = ref<HTMLElement | null>(null);
  const showLeftSliderArrow = ref(false);
  const showRightSliderArrow = ref(false);

  let isDown = false;
  let startX = 0;
  let scrollLeftPos = 0;
  let isDragging = false;

  let autoPlayTimer: ReturnType<typeof setInterval> | null = null;
  let isPaused = false;

  let animationId: number | null = null;
  let isSetup = false;
  let originalWidth = 0;
  let gap = 0;

  let cursorIndicator: HTMLElement | null = null;

  const handleScroll = () => {
    if (continuous) {
      handleInfiniteScroll();
    } else {
      updateArrowVisibility();
    }
  };

  const handleResize = () => {
    if (continuous) {
      isSetup = false;
      setupContinuousLoop();
    } else {
      updateArrowVisibility();
    }
  };

  const updateArrowVisibility = () => {
    const slider = sliderRef.value;
    if (!slider) return;

    if (continuous) {
      showLeftSliderArrow.value = false;
      showRightSliderArrow.value = false;
      return;
    }

    showLeftSliderArrow.value = slider.scrollLeft > 10;
    showRightSliderArrow.value =
      slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 10;
  };

  const handleInfiniteScroll = () => {
    const slider = sliderRef.value;
    if (!slider || originalWidth === 0) return;

    if (slider.scrollLeft >= originalWidth + gap) {
      slider.scrollLeft = slider.scrollLeft - originalWidth - gap;
    } else if (slider.scrollLeft <= 0) {
      slider.scrollLeft = slider.scrollLeft + originalWidth + gap;
    }
  };

  const setupContinuousLoop = async () => {
    const slider = sliderRef.value;
    if (!slider || isSetup) return;

    await nextTick();

    const existingClones = slider.querySelectorAll("[data-clone]");
    existingClones.forEach((clone) => clone.remove());

    const children = Array.from(slider.children).filter(
      (child) => !child.hasAttribute("data-clone"),
    ) as HTMLElement[];

    if (children.length === 0) return;

    const style = window.getComputedStyle(slider);
    gap = parseFloat(style.gap) || 0;

    originalWidth = children.reduce((total, child, index) => {
      return (
        total + child.offsetWidth + (index < children.length - 1 ? gap : 0)
      );
    }, 0);

    const viewportWidth = slider.clientWidth;
    const clonesNeeded = Math.ceil((viewportWidth * 2) / originalWidth) + 1;

    for (let i = 0; i < clonesNeeded; i++) {
      children.forEach((child) => {
        const clone = child.cloneNode(true) as HTMLElement;
        clone.setAttribute("data-clone", "true");
        slider.appendChild(clone);
      });
    }

    for (let i = 0; i < clonesNeeded; i++) {
      for (let j = children.length - 1; j >= 0; j--) {
        const clone = children[j]?.cloneNode(true) as HTMLElement;
        clone.setAttribute("data-clone", "true");
        slider.insertBefore(clone, slider.firstChild);
      }
    }

    slider.scrollLeft = (originalWidth + gap) * clonesNeeded;

    isSetup = true;
  };

  const continuousScroll = () => {
    const slider = sliderRef.value;
    if (!slider) {
      animationId = requestAnimationFrame(continuousScroll);
      return;
    }

    if (!isPaused && !isDown) {
      slider.scrollLeft += speed;
    }

    animationId = requestAnimationFrame(continuousScroll);
  };

  const startContinuousLoop = () => {
    if (animationId) return;
    animationId = requestAnimationFrame(continuousScroll);
  };

  const stopContinuousLoop = () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
  };

  const getSlideWidth = () => {
    const slider = sliderRef.value;
    if (!slider) return 0;

    const firstChild = slider.firstElementChild as HTMLElement;
    if (!firstChild) return 0;

    const style = window.getComputedStyle(slider);
    const gapValue = parseFloat(style.gap) || 0;

    return firstChild.offsetWidth + gapValue;
  };

  const scrollToNextSlide = () => {
    const slider = sliderRef.value;
    if (!slider || isPaused) return;

    const slideWidth = getSlideWidth();
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    const currentScroll = slider.scrollLeft;

    if (currentScroll >= maxScroll - 10) {
      slider.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      slider.scrollBy({ left: slideWidth, behavior: "smooth" });
    }
  };

  const startAutoPlay = () => {
    if (continuous) {
      startContinuousLoop();
      return;
    }

    if (!autoPlay || autoPlayTimer) return;
    autoPlayTimer = setInterval(scrollToNextSlide, autoPlayInterval);
  };

  const stopAutoPlay = () => {
    if (continuous) {
      stopContinuousLoop();
      return;
    }

    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  };

  const pauseAutoPlay = () => {
    isPaused = true;
  };

  const resumeAutoPlay = () => {
    isPaused = false;
  };

  const createCursorIndicator = () => {
    if (cursorIndicator) return;

    cursorIndicator = document.createElement("div");
    cursorIndicator.className = "drag-cursor-indicator";
    cursorIndicator.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 17l-5-5 5-5"/>
        <path d="M17 7l5 5-5 5"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
      </svg>
    `;
    document.body.appendChild(cursorIndicator);
  };

  const handleMouseEnter = () => {
    if (!window.matchMedia("(hover: hover)").matches) return;

    if (showCustomCursor) {
      createCursorIndicator();
      if (cursorIndicator) {
        cursorIndicator.style.opacity = "1";
      }

      const slider = sliderRef.value;
      if (slider) {
        slider.style.cursor = "none";
      }
    }

    if (pauseOnHover) {
      pauseAutoPlay();
    }
  };

  const handleMouseLeaveSlider = () => {
    if (showCustomCursor && cursorIndicator) {
      cursorIndicator.style.opacity = "0";
    }

    if (isDown) {
      isDown = false;
    }

    if (pauseOnHover) {
      resumeAutoPlay();
    }
  };

  const handleMouseMoveForCursor = (e: MouseEvent) => {
    if (showCustomCursor && cursorIndicator) {
      cursorIndicator.style.left = `${e.clientX}px`;
      cursorIndicator.style.top = `${e.clientY}px`;
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    const slider = sliderRef.value;
    if (!slider) return;

    isDown = true;
    isDragging = false;

    if (!continuous) {
      slider.style.scrollSnapType = "none";
    }

    startX = e.pageX;
    scrollLeftPos = slider.scrollLeft;

    if (showCustomCursor && cursorIndicator) {
      cursorIndicator.classList.add("grabbing");
    }
  };

  const handleMouseUp = () => {
    const slider = sliderRef.value;
    if (!slider) return;

    isDown = false;

    if (!continuous) {
      slider.style.scrollSnapType = "x mandatory";
    }

    if (showCustomCursor && cursorIndicator) {
      cursorIndicator.classList.remove("grabbing");
    }

    if (isDragging) {
      setTimeout(() => {
        isDragging = false;
      }, 50);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMouseMoveForCursor(e);

    if (!isDown) return;

    const slider = sliderRef.value;
    if (!slider) return;

    e.preventDefault();

    const x = e.pageX;
    const walk = (x - startX) * (continuous ? 1.5 : 3.0);

    if (Math.abs(walk) > 5) {
      isDragging = true;
    }

    slider.scrollLeft = scrollLeftPos - walk;
  };

  const handleClick = (e: MouseEvent) => {
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  let touchStartX = 0;
  let touchScrollLeft = 0;

  const handleTouchStart = (e: TouchEvent) => {
    const slider = sliderRef.value;
    if (!slider) return;

    isDown = true;
    if (!e.touches[0]) return;

    touchStartX = e.touches[0].pageX;
    touchScrollLeft = slider.scrollLeft;

    pauseAutoPlay();
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDown) return;

    const slider = sliderRef.value;
    if (!slider) return;
    if (!e.touches[0]) return;

    const x = e.touches[0].pageX;
    const walk = (x - touchStartX) * (continuous ? 1.5 : 1);

    if (Math.abs(walk) > 5) {
      isDragging = true;
    }

    slider.scrollLeft = touchScrollLeft - walk;
  };

  const handleTouchEnd = () => {
    isDown = false;

    if (isDragging) {
      setTimeout(() => {
        isDragging = false;
      }, 50);
    }

    setTimeout(resumeAutoPlay, 500);
  };

  const init = async () => {
    const slider = sliderRef.value;
    if (!slider) return;

    // Remove existing listeners
    slider.removeEventListener("scroll", handleScroll);
    slider.removeEventListener("mouseenter", handleMouseEnter);
    slider.removeEventListener("mouseleave", handleMouseLeaveSlider);
    slider.removeEventListener("mousedown", handleMouseDown);
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleMouseMove);
    slider.removeEventListener("click", handleClick, true);
    slider.removeEventListener("touchstart", handleTouchStart);
    slider.removeEventListener("touchmove", handleTouchMove);
    slider.removeEventListener("touchend", handleTouchEnd);
    window.removeEventListener("resize", handleResize);

    // Add listeners
    slider.addEventListener("scroll", handleScroll);
    slider.addEventListener("mouseenter", handleMouseEnter);
    slider.addEventListener("mouseleave", handleMouseLeaveSlider);
    slider.addEventListener("mousedown", handleMouseDown);

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    slider.addEventListener("click", handleClick, true);
    slider.addEventListener("touchstart", handleTouchStart, { passive: true });
    slider.addEventListener("touchmove", handleTouchMove, { passive: true });
    slider.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", handleResize);

    if (continuous) {
      slider.style.scrollSnapType = "none";
      slider.style.scrollBehavior = "auto";

      await setupContinuousLoop();
      if (autoPlay) {
        startContinuousLoop();
      }
    } else {
      updateArrowVisibility();
      if (autoPlay) {
        startAutoPlay();
      }
    }
  };

  onMounted(() => {
    init();
  });

  onBeforeUnmount(() => {
    stopAutoPlay();
    stopContinuousLoop();

    const slider = sliderRef.value;
    if (slider) {
      slider.removeEventListener("scroll", handleScroll);
      slider.removeEventListener("mouseenter", handleMouseEnter);
      slider.removeEventListener("mouseleave", handleMouseLeaveSlider);
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("click", handleClick, true);
      slider.removeEventListener("touchstart", handleTouchStart);
      slider.removeEventListener("touchmove", handleTouchMove);
      slider.removeEventListener("touchend", handleTouchEnd);
    }
    document.removeEventListener("mouseup", handleMouseUp);
    document.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("resize", handleResize);

    if (cursorIndicator) {
      cursorIndicator.remove();
      cursorIndicator = null;
    }
  });

  return {
    sliderRef,
    showLeftSliderArrow,
    showRightSliderArrow,
    scrollLeft: (amount = 300) =>
      sliderRef.value?.scrollBy({ left: -amount, behavior: "smooth" }),
    scrollRight: (amount = 300) =>
      sliderRef.value?.scrollBy({ left: amount, behavior: "smooth" }),
    startAutoPlay,
    stopAutoPlay,
    pauseAutoPlay,
    resumeAutoPlay,
  };
};
