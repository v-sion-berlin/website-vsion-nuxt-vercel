import { ref, onMounted, onBeforeUnmount, watch, nextTick } from "vue";

export function useHorizontalSlider() {
  const sliderRef = ref<HTMLElement | null>(null);

  const showLeftSliderArrow = ref(false);
  const showRightSliderArrow = ref(false);

  const handleScroll = () => updateArrowVisibility();
  const handleResize = () => updateArrowVisibility();

  function updateArrowVisibility() {
    const slider = sliderRef.value;
    if (!slider) return;

    showLeftSliderArrow.value = slider.scrollLeft > 10;
    showRightSliderArrow.value =
      slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 10;
  }

  function init() {
    const slider = sliderRef.value;
    if (!slider) return;

    slider.removeEventListener("scroll", handleScroll);
    slider.addEventListener("scroll", handleScroll);

    window.removeEventListener("resize", handleResize);
    window.addEventListener("resize", handleResize);

    updateArrowVisibility();
  }

  onMounted(() => {
    init();
  });

  onUpdated(() => {
    init();
  });

  onBeforeUnmount(() => {
    const slider = sliderRef.value;
    if (!slider) return;

    slider.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", handleResize);
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
}
