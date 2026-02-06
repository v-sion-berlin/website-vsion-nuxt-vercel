<template>
  <div>
    <header class="sticky-header">
      <div class="menu-group">
        <div @mouseenter="handleMouseEnter">
          <Lottie
            ref="logoLottie"
            :name="logoName"
            class="menu-item logo-lottie"
            @click="scrollToTop"
            :width="100"
            :loop="1"
            :autoplay="false"
          />
        </div>

        <div class="desktop-nav">
          <ClientOnly>
            <PageMenu />
          </ClientOnly>
        </div>
      </div>

      <div class="menu-right desktop-nav">
        <LanguageSwitcher />
        <button id="contact-btn" class="menu-item" @click="scrollToBottom">
          <span>Contact</span>
          <img :src="Cursor" alt="" aria-hidden="true" class="cursor" />
        </button>
      </div>

      <!-- burger button -->
      <button
        class="burger-btn mobile-only menu-item"
        :class="{ active: drawerOpen }"
        :aria-expanded="drawerOpen"
        aria-label="Open navigation menu"
        @click="toggleDrawer"
      >
        <div class="burger-icon" :class="{ open: drawerOpen }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>
    </header>

    <!-- mobile overlay -->
    <Transition name="overlay">
      <div v-if="drawerOpen" class="mobile-overlay" @click="toggleDrawer"></div>
    </Transition>

    <!-- mobile drawer -->
    <Transition name="drawer" @after-enter="onDrawerOpen">
      <div v-if="drawerOpen" class="mobile-drawer">
        <div class="drawer-header">
          <button
            class="close-btn"
            aria-label="Close navigation menu"
            @click="toggleDrawer"
          >
            ✕
          </button>
        </div>

        <div class="drawer-content">
          <div
            class="drawer-item"
            :class="{ visible: itemsVisible }"
            :style="{ '--i': 0 }"
          >
            <ClientOnly>
              <PageMenu mobile />
            </ClientOnly>
          </div>
          <div
            class="drawer-item"
            :class="{ visible: itemsVisible }"
            :style="{ '--i': 1 }"
          >
            <ClientOnly>
              <LanguageSwitcher mobile />
            </ClientOnly>
          </div>
          <button
            class="drawer-item drawer-contact-btn"
            :class="{ visible: itemsVisible }"
            :style="{ '--i': 2 }"
            @click="
              () => {
                scrollToBottom();
                toggleDrawer();
              }
            "
          >
            <span>Contact</span>
            <img :src="Cursor" alt="" aria-hidden="true" class="cursor" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import LanguageSwitcher from "./LanguageSwitcher.vue";
import Cursor from "~/assets/Cursor.svg";
import PageMenu from "./PageMenu.vue";
import type { Lottie } from "nuxt-lottie";

const { logoName } = useLogoTheme();

const router = useRouter();
const route = useRoute();
const { locale } = useI18n();
const drawerOpen = ref(false);
const itemsVisible = ref(false);

const logoLottie = ref<Lottie>();

const handleMouseEnter = () => {
  if (logoLottie.value) {
    logoLottie.value.goToAndPlay(0);
  }
};

const localizedPath = () => {
  const isGerman = locale.value === "de";
  return isGerman ? `/de/` : `/`;
};

const toggleDrawer = () => {
  if (drawerOpen.value) {
    itemsVisible.value = false;
    setTimeout(() => {
      drawerOpen.value = false;
    }, 150);
  } else {
    drawerOpen.value = true;
  }
};

const onDrawerOpen = () => {
  itemsVisible.value = true;
};

const scrollToBottom = () => {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
};

const scrollToTop = () => {
  if (route.path === "/" || route.path === "/de") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  router.push(localizedPath());
};
</script>

<style>
.sticky-header {
  position: fixed;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: clamp(12px, 4vw, 36px);
  top: 0;
  left: 0;
  width: 100%;
  width: -webkit-fill-available;
  width: -moz-available; /* firefox */
  max-height: 140px;
  z-index: 999;
  gap: clamp(8px, 2vw, 24px);
}

.menu-right {
  display: flex;
  gap: clamp(4px, 2vw, 16px);
}

.menu-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.cursor {
  width: 14px;
  height: 14px;
  margin-left: 16px;
  filter: drop-shadow(0 0 8px var(--color-text));
}

.menu-item {
  display: flex;
  background-color: var(--color-grey-card) !important;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 19px 32px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: clamp(0.85rem, 1.5vw, 1rem);
  cursor: pointer;
  border-radius: 16px;
  transition: background-color 0.2s ease;
  border: none;
  color: var(--color-text);
}

.logo-lottie {
  padding: 15.87px 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

#contact-btn {
  display: flex;
  align-items: center;
}

.menu-item:hover {
  background-color: var(--color-grey-menu-item-hover);
}

/* Burger button */
.burger-btn {
  display: none;
  cursor: pointer;
  z-index: 1001;
  padding: 19px 24px;
}

.burger-btn.active {
  background-color: var(--color-grey-menu-item-hover);
}

.burger-icon {
  width: 24px;
  height: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.burger-icon span {
  display: block;
  height: 2px;
  width: 100%;
  background-color: white;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
}

.burger-icon.open span:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.burger-icon.open span:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.burger-icon.open span:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* Overlay */
.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 900;
  backdrop-filter: blur(2px);
}

.overlay-enter-active {
  transition: opacity 0.3s ease;
}

.overlay-leave-active {
  transition: opacity 0.25s ease;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

/* Drawer */
.drawer-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.close-btn {
  cursor: pointer;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  filter: drop-shadow(0 0 8px white);
  transition: transform 0.2s ease;
  border: none;
  background: none;
  color: var(--color-text);
  padding: 0;
}

.close-btn:hover {
  transform: scale(1.1);
}

.mobile-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: #1a1a1ae6;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  padding: 32px 16px;
  z-index: 1000;
  box-shadow: -4px 0 30px rgba(0, 0, 0, 0.3);
}

.drawer-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.drawer-item {
  opacity: 0;
  transform: translateX(30px);
  transition:
    opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-item.visible {
  opacity: 1;
  transform: translateX(0);
}

.drawer-contact-btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 19px 32px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: clamp(0.85rem, 1.5vw, 1rem);
  cursor: pointer;
  border-radius: 16px;
  background: transparent;
  background-color: var(--color-grey-card);
  border: none;
  color: var(--color-text);
  width: 100%;

  transition:
    opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
    background-color 0.2s ease;
}

.drawer-contact-btn:hover {
  background-color: var(--color-grey-menu-item-hover);
}

.drawer-contact-btn .cursor {
  margin-left: auto;
}

/* Drawer slide animation */
.drawer-enter-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

.desktop-nav {
  display: flex;
}

.mobile-only {
  display: none;
}

@media (max-width: 700px) {
  .desktop-nav {
    display: none;
  }
  .mobile-only {
    display: flex;
  }
  .burger-btn {
    display: flex;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mobile-drawer,
  .mobile-overlay,
  .drawer-item,
  .burger-icon span,
  .close-btn {
    transition: opacity 0.2s ease;
  }

  .drawer-enter-from,
  .drawer-leave-to {
    transform: none;
    opacity: 0;
  }

  .drawer-item {
    transform: none;
  }

  .burger-icon.open span:nth-child(1),
  .burger-icon.open span:nth-child(3) {
    transition: opacity 0.2s ease;
  }
}
</style>
