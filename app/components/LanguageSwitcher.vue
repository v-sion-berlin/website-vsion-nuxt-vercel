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

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

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
    <div
      class="menu-item"
      :class="{ active: showDropdown }"
      @click="toggleDropdown"
    >
      <span>{{ currentLang }}</span>
      <span v-if="props.mobile" class="arrow" :class="{ rotated: showDropdown }"
        >▼</span
      >
    </div>

    <Transition name="dropdown">
      <div v-if="showDropdown" class="dropdown">
        <TransitionGroup name="item" tag="div" class="dropdown-items">
          <div
            v-for="(_locale, index) of locales"
            :key="_locale.code"
            class="dropdown-item"
            :style="{ '--i': index }"
            @click="setLocale(_locale.code)"
          >
            <span>{{ _locale.code?.toUpperCase() }}</span>
          </div>
        </TransitionGroup>
      </div>
    </Transition>
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
  transition: transform 0.3s ease;
  display: inline-block;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.language-switcher {
  position: relative;
  display: inline-block;
  font-family: "Montserrat", sans-serif;
  width: 100%;
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
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background-color: var(--color-grey-menu-item-hover);
}

.menu-item.active {
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

  .arrow {
    transition: none;
  }
}
</style>
