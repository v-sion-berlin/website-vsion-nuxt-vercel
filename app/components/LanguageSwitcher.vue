<script setup lang="ts">
import { ref, watch } from "vue";
import { onClickOutside } from "@vueuse/core";

const { setLocale, locales, locale } = useI18n();
const props = withDefaults(defineProps<{ mobile?: boolean }>(), {
  mobile: false,
});

const menuRef = ref<HTMLElement | null>(null);
const showDropdown = ref(false);
const currentLang = ref(locale.value.toUpperCase());

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

onClickOutside(menuRef, () => {
  showDropdown.value = false;
});

watch(locale, (val) => {
  currentLang.value = val.toUpperCase();
});
</script>

<template>
  <div
    ref="menuRef"
    class="language-switcher"
    :class="{ mobile: props.mobile }"
  >
    <div class="menu-item" @click="toggleDropdown">
      <span>{{ currentLang }}</span>
      <span v-if="props.mobile" class="arrow">{{
        showDropdown ? "▲" : "▼"
      }}</span>
    </div>

    <div v-if="showDropdown" class="dropdown">
      <div
        v-for="_locale of locales"
        :key="_locale.code"
        class="dropdown-item"
        @click="setLocale(_locale.code)"
      >
        <span>{{ _locale.code?.toUpperCase() }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.language-switcher.mobile .dropdown {
  position: static;
  margin-top: 0;
  background-color: transparent;
  backdrop-filter: none;
  border-radius: 0;
}
.arrow {
  margin-left: auto;
}

.language-switcher {
  position: relative;
  display: inline-block;
  font-family: "Montserrat", sans-serif;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 19px 32px;
  background-color: var(--color-grey-card);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-weight: 500;
  cursor: pointer;
  border-radius: 16px;
  user-select: none;
  min-width: 20px;
  width: auto;
}

.menu-item:hover {
  background-color: var(--color-grey-menu-item-hover);
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
}

.dropdown-item {
  padding: 19px 32px;
  cursor: pointer;
  white-space: nowrap;
  font-size: clamp(0.85rem, 1.5vw, 1rem);
}

.dropdown-item:hover {
  background-color: var(--color-grey-menu-item-hover);
}
</style>
