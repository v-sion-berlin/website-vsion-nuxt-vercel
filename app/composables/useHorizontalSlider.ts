import { ref, onMounted, onUpdated, onBeforeUnmount } from "vue";

export const useHorizontalSlider = () => {
  const sliderRef = ref<HTMLElement | null>(null);
  const showLeftSliderArrow = ref(false);
  const showRightSliderArrow = ref(false);

  let isDown = false;
  let startX = 0;
  let scrollLeftPos = 0;
  let isDragging = false;

  let cursorIndicator: HTMLElement | null = null;

  const handleScroll = () => updateArrowVisibility();
  const handleResize = () => updateArrowVisibility();

  const updateArrowVisibility = () => {
    const slider = sliderRef.value;
    if (!slider) return;

    showLeftSliderArrow.value = slider.scrollLeft > 10;
    showRightSliderArrow.value =
      slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 10;
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

    createCursorIndicator();
    if (cursorIndicator) {
      cursorIndicator.style.opacity = "1";
    }

    const slider = sliderRef.value;
    if (slider) {
      slider.style.cursor = "none";
    }
  };

  const handleMouseLeaveSlider = () => {
    if (cursorIndicator) {
      cursorIndicator.style.opacity = "0";
    }

    if (isDown) {
      isDown = false;
    }
  };

  const handleMouseMoveForCursor = (e: MouseEvent) => {
    if (cursorIndicator) {
      cursorIndicator.style.left = `${e.clientX}px`;
      cursorIndicator.style.top = `${e.clientY}px`;
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    const slider = sliderRef.value;
    if (!slider) return;

    isDown = true;
    isDragging = false;
    slider.style.scrollSnapType = "none";
    startX = e.pageX - slider.offsetLeft;
    scrollLeftPos = slider.scrollLeft;

    if (cursorIndicator) {
      cursorIndicator.classList.add("grabbing");
    }
  };

  const handleMouseUp = () => {
    const slider = sliderRef.value;
    if (!slider) return;

    isDown = false;
    slider.style.scrollSnapType = "x mandatory";

    if (cursorIndicator) {
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
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 1.5;

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

  const init = () => {
    const slider = sliderRef.value;
    if (!slider) return;

    // Remove existing listeners
    slider.removeEventListener("scroll", handleScroll);
    slider.removeEventListener("mouseenter", handleMouseEnter);
    slider.removeEventListener("mouseleave", handleMouseLeaveSlider);
    slider.removeEventListener("mousedown", handleMouseDown);
    slider.removeEventListener("mouseup", handleMouseUp);
    slider.removeEventListener("mousemove", handleMouseMove);
    slider.removeEventListener("click", handleClick, true);
    window.removeEventListener("resize", handleResize);

    // Add listeners
    slider.addEventListener("scroll", handleScroll);
    slider.addEventListener("mouseenter", handleMouseEnter);
    slider.addEventListener("mouseleave", handleMouseLeaveSlider);
    slider.addEventListener("mousedown", handleMouseDown);
    slider.addEventListener("mouseup", handleMouseUp);
    slider.addEventListener("mousemove", handleMouseMove);
    slider.addEventListener("click", handleClick, true);
    window.addEventListener("resize", handleResize);

    updateArrowVisibility();
  };

  onMounted(() => {
    init();
  });

  onUpdated(() => {
    init();
  });

  onBeforeUnmount(() => {
    const slider = sliderRef.value;
    if (slider) {
      slider.removeEventListener("scroll", handleScroll);
      slider.removeEventListener("mouseenter", handleMouseEnter);
      slider.removeEventListener("mouseleave", handleMouseLeaveSlider);
      slider.removeEventListener("mousedown", handleMouseDown);
      slider.removeEventListener("mouseup", handleMouseUp);
      slider.removeEventListener("mousemove", handleMouseMove);
      slider.removeEventListener("click", handleClick, true);
    }
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
  };
};
