import type { DirectiveBinding, ObjectDirective } from "vue";

type RevealOptions = {
  threshold?: number;
  rootMargin?: string;
  duration?: number;
  delay?: number;
  distance?: string;
  easing?: string;
  once?: boolean;
};

type RevealElement = HTMLElement & {
  _revealObserver?: IntersectionObserver;
  _revealCleanup?: () => void;
};

const defaultOptions: RevealOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
  duration: 600,
  delay: 0,
  distance: "30px",
  easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  once: true,
};

let stylesInjected = false;

const injectGlobalStyles = () => {
  if (stylesInjected) return;

  const style = document.createElement("style");
  style.id = "v-reveal-styles";
  style.textContent = `
    [data-v-reveal] {
      opacity: 0;
      transform: translateY(var(--reveal-distance, 30px));
      transition:
        opacity var(--reveal-duration, 600ms) var(--reveal-easing, cubic-bezier(0.25, 0.46, 0.45, 0.94)),
        transform var(--reveal-duration, 600ms) var(--reveal-easing, cubic-bezier(0.25, 0.46, 0.45, 0.94));
      transition-delay: var(--reveal-delay, 0ms);
    }

    [data-v-reveal].revealed {
      opacity: 1;
      transform: translateY(0);
    }

    @media (prefers-reduced-motion: reduce) {
      [data-v-reveal] {
        transform: none;
        transition: opacity var(--reveal-duration, 600ms) var(--reveal-easing, cubic-bezier(0.25, 0.46, 0.45, 0.94));
      }

      [data-v-reveal].revealed {
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
  stylesInjected = true;
};

const setupReveal = (
  el: RevealElement,
  binding: DirectiveBinding<RevealOptions | number | undefined>,
) => {
  injectGlobalStyles();

  let options: RevealOptions = { ...defaultOptions };
  if (typeof binding.value === "number") {
    options.delay = binding.value;
  } else if (binding.value) {
    options = { ...defaultOptions, ...binding.value };
  }

  el.setAttribute("data-v-reveal", "");
  el.style.setProperty("--reveal-distance", options.distance!);
  el.style.setProperty("--reveal-duration", `${options.duration}ms`);
  el.style.setProperty("--reveal-delay", `${options.delay}ms`);
  el.style.setProperty("--reveal-easing", options.easing!);

  if (el._revealObserver) {
    el._revealObserver.disconnect();
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          if (options.once) {
            observer.disconnect();
          }
        } else if (!options.once) {
          el.classList.remove("revealed");
        }
      });
    },
    {
      threshold: options.threshold,
      rootMargin: options.rootMargin,
    },
  );

  observer.observe(el);
  el._revealObserver = observer;

  el._revealCleanup = () => {
    observer.disconnect();
    el.removeAttribute("data-v-reveal");
    el.classList.remove("revealed");
  };
};

export const vReveal: ObjectDirective<
  RevealElement,
  RevealOptions | number | undefined
> = {
  mounted(el, binding) {
    setupReveal(el, binding);
  },

  updated(el, binding) {
    if (JSON.stringify(binding.value) !== JSON.stringify(binding.oldValue)) {
      setupReveal(el, binding);
    }
  },

  unmounted(el) {
    el._revealCleanup?.();
  },
};

export const RevealPlugin = {
  install(app: {
    directive: (name: string, directive: ObjectDirective) => void;
  }) {
    app.directive("reveal", vReveal);
  },
};

export default vReveal;
