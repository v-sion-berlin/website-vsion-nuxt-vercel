import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";

export const useHeaderOverlap = (targetSelector: string) => {
  const isOverlapping = ref(false);
  const route = useRoute();
  const { locale } = useI18n();

  let observer: IntersectionObserver | null = null;
  let mutationObserver: MutationObserver | null = null;

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

  const waitAndObserve = () => {
    const target = document.querySelector(targetSelector);
    if (target) {
      observe();
      return;
    }

    // Use MutationObserver to watch for the target element appearing in the DOM
    mutationObserver?.disconnect();
    mutationObserver = new MutationObserver(() => {
      const el = document.querySelector(targetSelector);
      if (el) {
        mutationObserver?.disconnect();
        mutationObserver = null;
        observe();
      }
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  onMounted(() => {
    waitAndObserve();
  });

  watch([() => route.fullPath, locale], async () => {
    observer?.disconnect();
    mutationObserver?.disconnect();
    isOverlapping.value = false;
    await nextTick();
    waitAndObserve();
  });

  onUnmounted(() => {
    mutationObserver?.disconnect();
    observer?.disconnect();
  });

  return { isOverlapping };
};
