import { ref, watch, nextTick, onMounted, onUnmounted } from "vue";

export const useHeaderOverlap = (targetSelector: string) => {
  const isOverlapping = ref(false);
  const route = useRoute();

  let observer: IntersectionObserver | null = null;

  const observe = () => {
    observer?.disconnect();
    isOverlapping.value = false;

    const target = document.querySelector(targetSelector);
    if (!target) return;

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        isOverlapping.value = entry.isIntersecting;
      },
      {
        root: null,
        rootMargin: "-0px 0px -95% 0px",
        threshold: 0,
      },
    );

    observer.observe(target);
  };

  onMounted(() => {
    observe();
  });

  // re-attach observer after every route change
  watch(
    () => route.fullPath,
    async () => {
      await nextTick();
      observe();
    },
  );

  onUnmounted(() => {
    observer?.disconnect();
  });

  return { isOverlapping };
};
