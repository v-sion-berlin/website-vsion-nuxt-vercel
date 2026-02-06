<template>
  <div ref="menuRef" class="page-menu" :class="{ mobile: props.mobile }">
    <button
      class="menu-item"
      :class="{ active: showDropdown }"
      :aria-expanded="showDropdown"
      aria-haspopup="true"
      @click="toggleDropdown"
    >
      <span>{{ currentPage }}</span>
      <svg
        v-if="!props.mobile"
        class="menu-icon"
        :class="{ open: showDropdown }"
        width="21"
        height="14"
        viewBox="0 0 21 14"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect
          class="line line-top"
          x="0"
          y="0"
          width="20"
          height="1.5"
          rx="0.75"
          fill="currentColor"
        />
        <rect
          class="line line-bottom"
          x="10"
          y="8"
          width="10"
          height="1.5"
          rx="0.75"
          fill="currentColor"
        />
      </svg>
      <span v-else class="arrow" :class="{ rotated: showDropdown }">▼</span>
    </button>

    <Transition name="dropdown">
      <div v-if="showDropdown" class="dropdown">
        <TransitionGroup name="item" tag="div" class="dropdown-items">
          <button
            v-for="(page, index) in pages"
            :key="page.path"
            class="dropdown-item"
            :style="{ '--i': index }"
            @click="navigate(page.path)"
          >
            <span>{{ page.name }}</span>
          </button>
        </TransitionGroup>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { onClickOutside } from "@vueuse/core";

const { locale } = useI18n();
const route = useRoute();
const router = useRouter();

const props = withDefaults(defineProps<{ mobile?: boolean }>(), {
  mobile: false,
});

const menuRef = ref<HTMLElement | null>(null);
const showDropdown = ref(false);
const currentPage = ref("Menu");
const currentLang = ref(locale.value as "en" | "de");

const pagesByLang: Record<"en" | "de", { name: string; path: string }[]> = {
  en: [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Team", path: "/team" },
    { name: "Career", path: "/career" },
    { name: "Projects", path: "/projects" },
    { name: "About", path: "/about" },
  ],
  de: [
    { name: "Startseite", path: "/de" },
    { name: "Leistungen", path: "/de/services" },
    { name: "Team", path: "/de/team" },
    { name: "Karriere", path: "/de/career" },
    { name: "Projekte", path: "/de/projects" },
    { name: "Über uns", path: "/de/about" },
  ],
};

const pages = ref(pagesByLang[currentLang.value]);

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const navigate = (path: string) => {
  const page = pages.value.find((p) => p.path === path);
  if (page) currentPage.value = page.name;

  router.push(path);
  showDropdown.value = false;
};

watch(
  [() => route.path, locale],
  ([path, newLocale]) => {
    currentLang.value = newLocale as "en" | "de";
    pages.value = pagesByLang[currentLang.value];

    let page = pages.value.find((p) => p.path === path);

    if (!page) {
      page = pages.value
        .filter((p) => path === p.path || path.startsWith(p.path + "/"))
        .sort((a, b) => b.path.length - a.path.length)[0];
    }

    currentPage.value = page ? page.name : "Menu";
  },
  { immediate: true },
);

onClickOutside(menuRef, () => {
  showDropdown.value = false;
});
</script>

<style scoped>
.page-menu.mobile .dropdown {
  position: static;
  margin-top: 0;
  background-color: transparent;
  backdrop-filter: none;
  border-radius: 0;
}

.arrow {
  margin-left: auto;
  transition: transform 0.3s ease;
  display: inline-block;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.page-menu {
  position: relative;
  display: inline-block;
  font-family: "Montserrat", sans-serif;
  width: 100%;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 19px 32px;
  background-color: var(--color-grey-card);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-weight: 500;
  cursor: pointer;
  border-radius: 16px;
  user-select: none;
  min-width: 160px;
  width: auto;
  transition: background-color 0.2s ease;
  border: none;
  color: var(--color-text);
  font-family: "Montserrat", sans-serif;
  font-size: clamp(0.85rem, 1.5vw, 1rem);
  width: 100%;
}

.menu-item.active {
  background-color: var(--color-grey-menu-item-hover);
}

.menu-icon {
  flex-shrink: 0;
  overflow: visible;
}

.menu-icon .line {
  transform-origin: center center;
  transition:
    transform 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    width 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    x 0.35s cubic-bezier(0.4, 0, 0.2, 1),
    y 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-icon .line-top {
  transform-origin: 10px 0.75px;
}

.menu-icon .line-bottom {
  transform-origin: 15px 8.75px;
}

.menu-icon.open .line-top {
  transform: translate(0px, 5px) rotate(50deg);
  width: 12px;
  x: 1;
}

.menu-icon.open .line-bottom {
  transform: translate(0px, -5px) rotate(-50deg);
  width: 12px;
  x: 9;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: var(--color-grey-card);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  margin-top: 8px;
  overflow: hidden;
  z-index: 50;
  min-width: 100%;
  transform-origin: top center;
}

.dropdown-items {
  display: flex;
  flex-direction: column;
}

.dropdown-item {
  padding: 19px 32px;
  cursor: pointer;
  white-space: nowrap;
  font-size: clamp(0.85rem, 1.5vw, 1rem);
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;
  border: none;
  background: none;
  color: var(--color-text);
  font-family: "Montserrat", sans-serif;
  width: 100%;
  text-align: left;
}

.dropdown-item:hover {
  background-color: var(--color-grey-menu-item-hover);
}

.dropdown-enter-active {
  animation: dropdownIn 0.35s ease-in-out forwards;
}

.dropdown-leave-active {
  animation: dropdownOut 0.35s ease-in-out forwards;
}

@keyframes dropdownIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes dropdownOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}

.item-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  transition-delay: calc(var(--i) * 0.05s);
}

.item-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
  transition-delay: calc((5 - var(--i)) * 0.02s);
}

.item-enter-from {
  opacity: 0;
  transform: translateX(-12px);
}

.item-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .dropdown-enter-active,
  .dropdown-leave-active {
    animation: none;
    transition: opacity 0.2s ease;
  }

  .dropdown-enter-from,
  .dropdown-leave-to {
    opacity: 0;
  }

  .item-enter-active,
  .item-leave-active {
    transition: opacity 0.2s ease;
    transition-delay: 0s;
  }

  .item-enter-from,
  .item-leave-to {
    transform: none;
  }

  .arrow,
  .menu-icon .line {
    transition: none;
  }
}
</style>
