<template>
  <div>
    <header class="sticky-header">
      <div class="menu-group">
        <div id="logo-vsion" class="menu-item" @click="scrollToTop">
          <img
            src="/letters/Letter_V.svg"
            alt="Logo"
            class="glow-white letter-v"
          />
          <img
            src="/letters/Letter_I_Red.svg"
            alt="Logo"
            class="glow-red letter-i"
          />
          <img src="/letters/Letter_S.svg" alt="Logo" class="glow-white" />
          <img
            src="/letters/Letter_I_White.svg"
            alt="Logo"
            class="glow-white"
          />
          <img src="/letters/Letter_O.svg" alt="Logo" class="glow-red" />
          <img src="/letters/Letter_N.svg" alt="Logo" class="glow-white" />
        </div>

        <div class="desktop-nav">
          <ClientOnly>
            <PageMenu />
          </ClientOnly>
        </div>
      </div>

      <div class="menu-right desktop-nav">
        <LanguageSwitcher />
        <div id="contact-btn" class="menu-item" @click="scrollToBottom">
          <span class="glow-white">Contact</span>
          <img :src="Cursor" alt="Cursor Icon" class="cursor" />
        </div>
      </div>

      <!-- burger button -->
      <div class="burger-btn mobile-only menu-item" @click="toggleDrawer">
        <img :src="Menu" alt="Menu" />
      </div>
    </header>

    <!-- mobile overlay -->
    <div
      class="mobile-overlay"
      :class="{ active: drawerOpen }"
      @click="toggleDrawer"
    ></div>

    <div class="mobile-drawer" :class="{ open: drawerOpen }">
      <div class="drawer-header">
        <div class="close-btn" @click="toggleDrawer">X</div>
      </div>
      <ClientOnly>
        <PageMenu mobile />
        <LanguageSwitcher mobile />
      </ClientOnly>
      <div
        id="contact-btn-mobile"
        class="menu-item"
        @click="
          () => {
            scrollToBottom();
            toggleDrawer();
          }
        "
      >
        <span class="glow-white">Contact</span>
        <img :src="Cursor" alt="Cursor Icon" class="cursor" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import LanguageSwitcher from "./LanguageSwitcher.vue";
import Cursor from "~/assets/Cursor.svg";
import PageMenu from "./PageMenu.vue";
import Menu from "~/assets/Menu.svg";

const router = useRouter();
const route = useRoute();
const { locale } = useI18n();
const drawerOpen = ref(false);

function localizedPath() {
  const isGerman = locale.value === "de";
  return isGerman ? `/de/` : `/`;
}

function toggleDrawer() {
  drawerOpen.value = !drawerOpen.value;
}

function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

function scrollToTop() {
  if (route.path === "/" || route.path === "/de") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  router.push(localizedPath());
}
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
  background-color: var(--color-grey-card);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 19px 32px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: clamp(0.85rem, 1.5vw, 1rem);
  cursor: pointer;
  border-radius: 16px;
}

#contact-btn {
  display: flex;
  align-items: center;
}

.menu-item:hover {
  background-color: var(--color-grey-menu-item-hover);
}

.glow-white {
  filter: drop-shadow(0 0 8px white);
  z-index: 50;
}

.glow-red {
  filter: drop-shadow(0 0 8px var(--color-primary));
}

#logo-vsion {
  gap: 2px;
}

.letter-v {
  margin-right: -4px;
}
.letter-i {
  margin-right: -2px;
}

.burger-btn {
  display: none;
  cursor: pointer;
  z-index: 201; /* above drawer */
}

.burger-btn img {
  filter: drop-shadow(0 0 8px white);
}

/* overlay */
.mobile-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: none;
  z-index: 900;
  transition: opacity 0.3s;
}
.mobile-overlay.active {
  display: block;
}

/* drawer */
.drawer-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.close-btn {
  cursor: pointer;
  width: 28px;
  height: 28px;
  filter: drop-shadow(0 0 8px white);
}

.mobile-drawer {
  position: fixed;
  top: 0;
  right: -100%;
  width: 250px;
  height: 100vh;
  background: #1a1a1ac3;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 32px 16px;
  transition: right 0.3s ease-in-out;
  z-index: 1000;
}
.mobile-drawer.open {
  right: 0;
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
    display: block;
  }
}
</style>
