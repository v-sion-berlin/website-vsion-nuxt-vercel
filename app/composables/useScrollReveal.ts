import { onMounted, onBeforeUnmount } from "vue";

type ScrollRevealOptions = {
  selector?: string;
  threshold?: number;
  rootMargin?: string;
  duration?: number;
  delay?: number;
  stagger?: number;
  distance?: string;
  easing?: string;
  once?: boolean;
};

export const useScrollReveal = (options: ScrollRevealOptions = {}) => {
  const {
    selector = "[data-reveal]",
    threshold = 0.1,
    rootMargin = "0px 0px -50px 0px",
    duration = 600,
    delay = 0,
    stagger = 30,
    distance = "30px",
    easing = "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    once = true,
  } = options;

  let observer: IntersectionObserver | null = null;
  let styleElement: HTMLStyleElement | null = null;

  const injectStyles = () => {
    if (styleElement) return;

    styleElement = document.createElement("style");
    styleElement.textContent = `
      ${selector} {
        opacity: 0;
        transform: translateY(${distance});
        transition:
          opacity ${duration}ms ${easing},
          transform ${duration}ms ${easing};
        transition-delay: var(--reveal-delay, ${delay}ms);
      }

      ${selector}.revealed {
        opacity: 1;
        transform: translateY(0);
      }

      /* Respect reduced motion preferences */
      @media (prefers-reduced-motion: reduce) {
        ${selector} {
          opacity: 0;
          transform: none;
          transition: opacity ${duration}ms ${easing};
        }

        ${selector}.revealed {
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(styleElement);
  };

  const applyDelay = (el: HTMLElement, index: number) => {
    const custom = el.dataset.revealDelay;
    const ms = custom ? parseInt(custom, 10) : delay + index * stagger;
    el.style.setProperty("--reveal-delay", `${ms}ms`);
  };

  const init = () => {
    injectStyles();

    const elements = document.querySelectorAll(selector);
    if (elements.length === 0) return;

    elements.forEach((el, index) => applyDelay(el as HTMLElement, index));

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");

            if (once) {
              observer?.unobserve(entry.target);
            }
          } else if (!once) {
            entry.target.classList.remove("revealed");
          }
        });
      },
      {
        threshold,
        rootMargin,
      },
    );

    elements.forEach((el) => observer?.observe(el));
  };

  const refresh = () => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      if (!el.classList.contains("revealed")) {
        applyDelay(el as HTMLElement, index);
        observer?.observe(el);
      }
    });
  };

  const reveal = (element: HTMLElement) => {
    element.classList.add("revealed");
  };

  const hide = (element: HTMLElement) => {
    element.classList.remove("revealed");
  };

  onMounted(() => {
    init();
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;

    if (styleElement) {
      styleElement.remove();
      styleElement = null;
    }
  });

  return {
    refresh,
    reveal,
    hide,
  };
};
