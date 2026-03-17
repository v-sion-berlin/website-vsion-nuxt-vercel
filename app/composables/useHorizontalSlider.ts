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

// Custom cursor

const useDragCursor = (
  sliderRef: ReturnType<typeof ref<HTMLElement | null>>,
  videoPlayingSelector?: string,
) => {
  let cursorEl: HTMLElement | null = null;
  let isInside = false;
  let isInControlsZone = false;

  const ensureCursor = () => {
    if (cursorEl) return;

    cursorEl = document.createElement("div");
    cursorEl.className = "drag-cursor-indicator";
    cursorEl.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
           fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M7 17l-5-5 5-5"/><path d="M17 7l5 5-5 5"/><line x1="2" y1="12" x2="22" y2="12"/>
      </svg>`;

    if (!document.getElementById("drag-cursor-styles")) {
      const style = document.createElement("style");
      style.id = "drag-cursor-styles";
      style.textContent = `
        .drag-cursor-indicator {
          position: fixed; pointer-events: none; z-index: 9999;
          width: 56px; height: 56px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          transform: translate(-50%, -50%);
          opacity: 0; transition: opacity 0.2s ease, transform 0.15s ease;
          background-color: var(--color-grey-card, rgba(128,128,128,0.35));
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        }
        .drag-cursor-indicator.grabbing {
          transform: translate(-50%, -50%) scale(0.85);
        }`;
      document.head.appendChild(style);
    }

    document.body.appendChild(cursorEl);
  };

  const checkControlsZone = (
    target: EventTarget | null,
    clientY: number,
  ): boolean => {
    if (!videoPlayingSelector || !target) return false;
    const card = (target as HTMLElement).closest?.(
      videoPlayingSelector,
    ) as HTMLElement | null;
    if (!card) return false;

    const rect = card.getBoundingClientRect();
    return clientY >= rect.top + rect.height * (2 / 3);
  };

  const applyCursorState = (inControls: boolean) => {
    const slider = sliderRef.value;
    if (!isInside) {
      if (cursorEl) cursorEl.style.opacity = "0";
      if (slider) slider.style.cursor = "none";
      return;
    }
    if (inControls) {
      if (cursorEl) cursorEl.style.opacity = "0";
      if (slider) slider.style.cursor = "default";
    } else {
      if (cursorEl) cursorEl.style.opacity = "1";
      if (slider) slider.style.cursor = "none";
    }
  };

  const onEnter = () => {
    isInside = true;
    ensureCursor();
    applyCursorState(false);
  };

  const onLeave = () => {
    isInside = false;
    isInControlsZone = false;
    if (cursorEl) cursorEl.style.opacity = "0";
  };

  /** Returns true when entering the controls zone (signals drag should cancel) */
  const onMove = (e: MouseEvent): boolean => {
    if (!cursorEl) return false;
    cursorEl.style.left = `${e.clientX}px`;
    cursorEl.style.top = `${e.clientY}px`;

    const nowInControls = checkControlsZone(e.target, e.clientY);
    if (nowInControls !== isInControlsZone) {
      isInControlsZone = nowInControls;
      applyCursorState(nowInControls);
      return nowInControls;
    }
    return false;
  };

  const setGrabbing = (active: boolean) => {
    cursorEl?.classList.toggle("grabbing", active);
  };

  const destroy = () => {
    cursorEl?.remove();
    cursorEl = null;
  };

  return {
    onEnter,
    onLeave,
    onMove,
    setGrabbing,
    destroy,
    get isInControlsZone() {
      return isInControlsZone;
    },
    checkControlsZone,
  };
};

// Main
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

  // Drag state
  let isDown = false;
  let isDragging = false;
  let dragStartX = 0;
  let dragScrollLeft = 0;

  // Auto-play / continuous state
  let autoPlayTimer: ReturnType<typeof setInterval> | null = null;
  let isPaused = false;
  let animationId: number | null = null;
  let isSetup = false;
  let originalWidth = 0;
  let gap = 0;
  let clonesNeeded = 0;

  // Cleanup
  let abortController: AbortController | null = null;

  // Cursor
  const cursor = showCustomCursor
    ? useDragCursor(sliderRef, videoPlayingSelector)
    : null;

  // Scroll-snap helper

  const setScrollSnap = (enabled: boolean) => {
    if (continuous) return;
    const slider = sliderRef.value;
    if (!slider) return;
    slider.style.scrollSnapType = enabled ? "x mandatory" : "none";
    slider.style.scrollBehavior = enabled ? "smooth" : "auto";
  };

  // Arrow visibility

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

  // Infinite / continuous scroll

  const handleInfiniteScroll = () => {
    const slider = sliderRef.value;
    if (!slider || originalWidth === 0) return;

    const cycle = originalWidth + gap;
    const buffer = cycle * clonesNeeded;

    if (slider.scrollLeft >= buffer + cycle) {
      slider.scrollLeft -= cycle;
    } else if (slider.scrollLeft <= buffer - cycle) {
      slider.scrollLeft += cycle;
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

    if (originalWidth === 0) return;

    const viewportWidth = slider.clientWidth;
    clonesNeeded = Math.ceil((viewportWidth * 2) / originalWidth) + 1;

    // Append clones
    for (let i = 0; i < clonesNeeded; i++) {
      children.forEach((child, index) => {
        const clone = child.cloneNode(true) as HTMLElement;
        clone.setAttribute("data-clone", "true");
        clone.setAttribute("data-clone-index", String(index));
        slider.appendChild(clone);
        onClone?.(clone, child, index);
      });
    }

    // Prepend clones
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

  //  Auto-play

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

  // Unified drag helpers

  const DRAG_MULTIPLIER = 1.5;
  const DRAG_THRESHOLD = 5;

  const startDrag = (pageX: number) => {
    const slider = sliderRef.value;
    if (!slider) return;

    isDown = true;
    isDragging = false;
    dragStartX = pageX;
    dragScrollLeft = slider.scrollLeft;
    setScrollSnap(false);
    cursor?.setGrabbing(true);
  };

  const moveDrag = (pageX: number, e?: MouseEvent) => {
    if (!isDown) return;
    const slider = sliderRef.value;
    if (!slider) return;

    e?.preventDefault();

    const walk = (pageX - dragStartX) * DRAG_MULTIPLIER;
    if (Math.abs(walk) > DRAG_THRESHOLD) isDragging = true;
    slider.scrollLeft = dragScrollLeft - walk;
  };

  const endDrag = () => {
    isDown = false;
    setScrollSnap(true);
    cursor?.setGrabbing(false);

    if (isDragging) {
      setTimeout(() => {
        isDragging = false;
      }, 50);
    }
  };

  // Mouse events

  const handleMouseEnter = () => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    cursor?.onEnter();
    if (pauseOnHover) pauseAutoPlay();
  };

  const handleMouseLeave = () => {
    cursor?.onLeave();
    if (isDown) endDrag();
    if (pauseOnHover) resumeAutoPlay();
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (cursor?.isInControlsZone) return;
    startDrag(e.pageX);
  };

  const handleMouseUp = () => {
    if (!sliderRef.value) return;
    endDrag();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (cursor) {
      const enteredControls = cursor.onMove(e);
      if (enteredControls && isDown) {
        endDrag();
        return;
      }
    }

    if (cursor?.isInControlsZone) return;
    moveDrag(e.pageX, e);
  };

  const handleClick = (e: MouseEvent) => {
    if (cursor?.checkControlsZone(e.target, e.clientY)) return;
    if (isDragging) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // Touch events

  const handleTouchStart = (e: TouchEvent) => {
    if (!e.touches[0]) return;
    startDrag(e.touches[0].pageX);
    pauseAutoPlay();
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!e.touches[0]) return;
    moveDrag(e.touches[0].pageX);
  };

  const handleTouchEnd = () => {
    endDrag();
    setTimeout(resumeAutoPlay, 500);
  };

  // Scroll / resize

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

  //  Init / cleanup

  const init = async () => {
    const slider = sliderRef.value;
    if (!slider) return;

    // Destroy listeners with abort controller
    abortController?.abort();
    abortController = new AbortController();
    const { signal } = abortController;

    // All listeners use the same signal
    slider.addEventListener("scroll", handleScroll, { signal });
    slider.addEventListener("mouseenter", handleMouseEnter, { signal });
    slider.addEventListener("mouseleave", handleMouseLeave, { signal });
    slider.addEventListener("mousedown", handleMouseDown, { signal });
    document.addEventListener("mouseup", handleMouseUp, { signal });
    document.addEventListener("mousemove", handleMouseMove, { signal });
    slider.addEventListener("click", handleClick, { capture: true, signal });

    // On touch-primary devices, let the browser handle native scroll
    const isTouchPrimary = window.matchMedia("(pointer: coarse)").matches;

    if (isTouchPrimary) {
      slider.addEventListener("touchstart", () => pauseAutoPlay(), {
        passive: true,
        signal,
      });
      slider.addEventListener(
        "touchend",
        () => setTimeout(resumeAutoPlay, 500),
        { signal },
      );
    } else {
      slider.addEventListener("touchstart", handleTouchStart, {
        passive: true,
        signal,
      });
      slider.addEventListener("touchmove", handleTouchMove, {
        passive: true,
        signal,
      });
      slider.addEventListener("touchend", handleTouchEnd, { signal });
    }
    window.addEventListener("resize", handleResize, { signal });

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
    abortController?.abort();
    stopAutoPlay();
    stopContinuousLoop();
    cursor?.destroy();
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
