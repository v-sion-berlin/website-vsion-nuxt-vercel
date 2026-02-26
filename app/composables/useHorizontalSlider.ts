import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";

type SliderOptions = {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  pauseOnHover?: boolean;
  continuous?: boolean;
  speed?: number;
  showCustomCursor?: boolean;
  videoPlayingSelector?: string;
  onClone?: (clone: HTMLElement, original: HTMLElement, index: number) => void;
};

export const useHorizontalSlider = (options: SliderOptions = {}) => {
  const {
    autoPlay = false,
    autoPlayInterval = 4000,
    pauseOnHover = true,
    continuous = false,
    speed = 1,
    showCustomCursor = true,
    videoPlayingSelector,
    onClone,
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
  let isInsideSlider = false;
  /** True when the cursor is in the bottom 1/3 of a playing-video card (controls zone) */
  let isInControlsZone = false;

  // ── Arrow visibility ──────────────────────────────────────────────────

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

  // ── Infinite / continuous scroll ──────────────────────────────────────

  const handleInfiniteScroll = () => {
    const slider = sliderRef.value;
    if (!slider || originalWidth === 0) return;

    if (slider.scrollLeft >= originalWidth + gap) {
      slider.scrollLeft -= originalWidth + gap;
    } else if (slider.scrollLeft <= 0) {
      slider.scrollLeft += originalWidth + gap;
    }
  };

  const setupContinuousLoop = async () => {
    const slider = sliderRef.value;
    if (!slider || isSetup) return;

    await nextTick();

    slider.querySelectorAll("[data-clone]").forEach((c) => c.remove());

    const children = Array.from(slider.children).filter(
      (child) => !child.hasAttribute("data-clone"),
    ) as HTMLElement[];

    if (children.length === 0) return;

    const style = window.getComputedStyle(slider);
    gap = parseFloat(style.gap) || 0;

    originalWidth = children.reduce(
      (total, child, i) =>
        total + child.offsetWidth + (i < children.length - 1 ? gap : 0),
      0,
    );

    const viewportWidth = slider.clientWidth;
    const clonesNeeded = Math.ceil((viewportWidth * 2) / originalWidth) + 1;

    for (let i = 0; i < clonesNeeded; i++) {
      children.forEach((child, index) => {
        const clone = child.cloneNode(true) as HTMLElement;
        clone.setAttribute("data-clone", "true");
        clone.setAttribute("data-clone-index", String(index));
        slider.appendChild(clone);
        onClone?.(clone, child, index);
      });
    }

    for (let i = 0; i < clonesNeeded; i++) {
      for (let j = children.length - 1; j >= 0; j--) {
        const clone = children[j]!.cloneNode(true) as HTMLElement;
        clone.setAttribute("data-clone", "true");
        clone.setAttribute("data-clone-index", String(j));
        slider.insertBefore(clone, slider.firstChild);
        onClone?.(clone, children[j]!, j);
      }
    }

    slider.scrollLeft = (originalWidth + gap) * clonesNeeded;
    isSetup = true;
  };

  const continuousScroll = () => {
    const slider = sliderRef.value;
    if (slider && !isPaused && !isDown) {
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

  // ── Scroll helpers ────────────────────────────────────────────────────

  const handleScroll = () => {
    continuous ? handleInfiniteScroll() : updateArrowVisibility();
  };

  const handleResize = () => {
    if (continuous) {
      isSetup = false;
      setupContinuousLoop();
    } else {
      updateArrowVisibility();
    }
  };

  // ── Auto-play (non-continuous) ────────────────────────────────────────

  const getSlideWidth = () => {
    const slider = sliderRef.value;
    if (!slider) return 0;
    const firstChild = slider.firstElementChild as HTMLElement;
    if (!firstChild) return 0;
    const g = parseFloat(window.getComputedStyle(slider).gap) || 0;
    return firstChild.offsetWidth + g;
  };

  const scrollToNextSlide = () => {
    const slider = sliderRef.value;
    if (!slider || isPaused) return;

    const slideWidth = getSlideWidth();
    const maxScroll = slider.scrollWidth - slider.clientWidth;

    if (slider.scrollLeft >= maxScroll - 10) {
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

  // ── Custom cursor ─────────────────────────────────────────────────────

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

    if (!document.getElementById("drag-cursor-styles")) {
      const styleEl = document.createElement("style");
      styleEl.id = "drag-cursor-styles";
      styleEl.textContent = `
        .drag-cursor-indicator {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: translate(-50%, -50%);
          opacity: 0;
          transition: opacity 0.2s ease, transform 0.15s ease;
          background-color: var(--color-grey-card, rgba(128,128,128,0.35));
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .drag-cursor-indicator.grabbing {
          transform: translate(-50%, -50%) scale(0.85);
        }
      `;
      document.head.appendChild(styleEl);
    }

    document.body.appendChild(cursorIndicator);
  };

  /**
   * Check if the mouse is in the bottom 1/3 of a playing-video card.
   * That zone is where Plyr controls live — default cursor, no drag.
   * The upper 2/3 behaves like an image slide (drag cursor + dragging).
   */
  const checkIfInVideoControlsZone = (
    target: EventTarget | null,
    clientY: number,
  ): boolean => {
    if (!videoPlayingSelector || !target) return false;
    const el = target as HTMLElement;
    const card = el.closest?.(videoPlayingSelector) as HTMLElement | null;
    if (!card) return false;

    const rect = card.getBoundingClientRect();
    const controlsThreshold = rect.top + rect.height * (2 / 3);
    return clientY >= controlsThreshold;
  };

  const applyCursorState = (inControlsZone: boolean) => {
    if (!showCustomCursor) return;
    const slider = sliderRef.value;

    if (!isInsideSlider) {
      if (cursorIndicator) cursorIndicator.style.opacity = "0";
      if (slider) slider.style.cursor = "none";
      return;
    }

    if (inControlsZone) {
      if (cursorIndicator) cursorIndicator.style.opacity = "0";
      if (slider) slider.style.cursor = "default";
    } else {
      if (cursorIndicator) cursorIndicator.style.opacity = "1";
      if (slider) slider.style.cursor = "none";
    }
  };

  // ── Mouse events ──────────────────────────────────────────────────────

  const handleMouseEnter = () => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    isInsideSlider = true;

    if (showCustomCursor) {
      createCursorIndicator();
      applyCursorState(false);
    }

    if (pauseOnHover) pauseAutoPlay();
  };

  const handleMouseLeaveSlider = () => {
    isInsideSlider = false;
    isInControlsZone = false;

    if (showCustomCursor && cursorIndicator) {
      cursorIndicator.style.opacity = "0";
    }

    if (isDown) isDown = false;
    if (pauseOnHover) resumeAutoPlay();
  };

  const cancelDrag = () => {
    const slider = sliderRef.value;
    isDown = false;
    isDragging = false;

    if (showCustomCursor && cursorIndicator) {
      cursorIndicator.classList.remove("grabbing");
    }

    if (!continuous && slider) {
      slider.style.scrollSnapType = "x mandatory";
      slider.style.scrollBehavior = "smooth";
    }
  };

  const handleMouseMoveForCursor = (e: MouseEvent) => {
    if (!showCustomCursor || !cursorIndicator) return;

    cursorIndicator.style.left = `${e.clientX}px`;
    cursorIndicator.style.top = `${e.clientY}px`;

    const nowInControlsZone = checkIfInVideoControlsZone(e.target, e.clientY);
    if (nowInControlsZone !== isInControlsZone) {
      isInControlsZone = nowInControlsZone;
      applyCursorState(nowInControlsZone);

      // If we entered the controls zone while mid-drag, cancel the drag
      // so the video player controls can receive pointer events normally.
      if (nowInControlsZone && isDown) {
        cancelDrag();
      }
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    const slider = sliderRef.value;
    if (!slider) return;

    // Don't start a drag when clicking in the video controls zone (bottom 1/3)
    if (isInControlsZone) return;

    isDown = true;
    isDragging = false;

    if (!continuous) {
      slider.style.scrollSnapType = "none";
      slider.style.scrollBehavior = "auto";
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

    if (showCustomCursor && cursorIndicator) {
      cursorIndicator.classList.remove("grabbing");
    }

    if (!continuous) {
      slider.style.scrollSnapType = "x mandatory";
      slider.style.scrollBehavior = "smooth";
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

    // Don't drag while in the controls zone — let the player handle events
    if (isInControlsZone) return;

    const slider = sliderRef.value;
    if (!slider) return;

    e.preventDefault();

    const walk = (e.pageX - startX) * 1.5;
    if (Math.abs(walk) > 5) isDragging = true;

    slider.scrollLeft = scrollLeftPos - walk;
  };

  const handleClick = (e: MouseEvent) => {
    // Don't block clicks in the video controls zone
    if (checkIfInVideoControlsZone(e.target, e.clientY)) return;

    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // ── Touch events ──────────────────────────────────────────────────────

  let touchStartX = 0;
  let touchScrollLeft = 0;

  const handleTouchStart = (e: TouchEvent) => {
    const slider = sliderRef.value;
    if (!slider || !e.touches[0]) return;

    isDown = true;
    isDragging = false;
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = slider.scrollLeft;

    if (!continuous) {
      slider.style.scrollSnapType = "none";
      slider.style.scrollBehavior = "auto";
    }

    pauseAutoPlay();
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDown) return;
    const slider = sliderRef.value;
    if (!slider || !e.touches[0]) return;

    const walk = (e.touches[0].pageX - touchStartX) * 1.5;
    if (Math.abs(walk) > 5) isDragging = true;

    slider.scrollLeft = touchScrollLeft - walk;
  };

  const handleTouchEnd = () => {
    const slider = sliderRef.value;
    isDown = false;

    if (!continuous && slider) {
      slider.style.scrollSnapType = "x mandatory";
      slider.style.scrollBehavior = "smooth";
    }

    if (isDragging) {
      setTimeout(() => {
        isDragging = false;
      }, 50);
    }

    setTimeout(resumeAutoPlay, 500);
  };

  // ── Init / cleanup ────────────────────────────────────────────────────

  const init = async () => {
    const slider = sliderRef.value;
    if (!slider) return;

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
      if (autoPlay) startContinuousLoop();
    } else {
      updateArrowVisibility();
      if (autoPlay) startAutoPlay();
    }
  };

  onMounted(() => init());

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
    scrollLeft: (amount = 750) =>
      sliderRef.value?.scrollBy({ left: -amount, behavior: "smooth" }),
    scrollRight: (amount = 750) =>
      sliderRef.value?.scrollBy({ left: amount, behavior: "smooth" }),
    startAutoPlay,
    stopAutoPlay,
    pauseAutoPlay,
    resumeAutoPlay,
  };
};
