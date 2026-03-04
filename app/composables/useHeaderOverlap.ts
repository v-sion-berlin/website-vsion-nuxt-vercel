import { ref, watch, onMounted, onUnmounted } from "vue";

export const useHeaderOverlap = (targetSelector: string) => {
  const isOverlapping = ref(false);
  const route = useRoute();
  const { locale } = useI18n();

  let observer: IntersectionObserver | null = null;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

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

  const waitAndObserve = (retries = 10) => {
    if (retryTimer) clearTimeout(retryTimer);

    const target = document.querySelector(targetSelector);
    if (target) {
      observe();
      return;
    }

    if (retries > 0) {
      retryTimer = setTimeout(() => waitAndObserve(retries - 1), 100);
    }
  };

  onMounted(() => {
    waitAndObserve();
  });

  watch([() => route.fullPath, locale], () => {
    observer?.disconnect();
    isOverlapping.value = false;
    setTimeout(() => waitAndObserve(), 150);
  });

  onUnmounted(() => {
    if (retryTimer) clearTimeout(retryTimer);
    observer?.disconnect();
  });

  return { isOverlapping };
};
