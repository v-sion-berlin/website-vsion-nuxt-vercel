<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { onClickOutside } from "@vueuse/core";
import Menu from "~/assets/Menu.svg";

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

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function navigate(path: string) {
  const page = pages.value.find((p) => p.path === path);
  if (page) currentPage.value = page.name;

  router.push(path);
  showDropdown.value = false;
}

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

<template>
  <div ref="menuRef" class="page-menu" :class="{ mobile: props.mobile }">
    <div
      class="menu-item"
      :class="{ active: showDropdown }"
      @click="toggleDropdown"
    >
      <span class="glow-white">{{ currentPage }}</span>
      <img
        v-if="!props.mobile"
        :src="Menu"
        class="menu-icon"
        :class="{ rotated: showDropdown }"
      />
      <span v-else class="arrow" :class="{ rotated: showDropdown }">▼</span>
    </div>

    <Transition name="dropdown">
      <div v-if="showDropdown" class="dropdown">
        <TransitionGroup name="item" tag="div" class="dropdown-items">
          <div
            v-for="(page, index) in pages"
            :key="page.path"
            class="dropdown-item"
            :style="{ '--i': index }"
            @click="navigate(page.path)"
          >
            <span>{{ page.name }}</span>
          </div>
        </TransitionGroup>
      </div>
    </Transition>
  </div>
</template>

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
}

.menu-item.active {
  background-color: var(--color-grey-menu-item-hover);
}

.menu-icon {
  transition: transform 0.3s ease;
}

.menu-icon.rotated {
  transform: rotate(180deg);
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
}

.dropdown-item:hover {
  background-color: var(--color-grey-menu-item-hover);
  transform: translateX(4px);
}

.dropdown-enter-active {
  animation: dropdownIn 0.25s ease-out forwards;
}

.dropdown-leave-active {
  animation: dropdownOut 0.2s ease-in forwards;
}

@keyframes dropdownIn {
  from {
    opacity: 0;
    transform: scaleY(0.8) translateY(-8px);
  }
  to {
    opacity: 1;
    transform: scaleY(1) translateY(0);
  }
}

@keyframes dropdownOut {
  from {
    opacity: 1;
    transform: scaleY(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scaleY(0.8) translateY(-8px);
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
  .menu-icon {
    transition: none;
  }
}
</style>
