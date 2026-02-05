<template>
  <section id="menu" class="wrapper">
    <div v-if="menu?.items?.length" class="scroll-wrapper">
      <button
        class="scroll-arrow left"
        v-show="showLeftSliderArrow"
        @click="scrollLeft()"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <ul ref="sliderRef" class="slider">
        <li
          v-for="(item, i) in menu.items"
          :key="i"
          class="item"
          :class="{ active: activeIndex === i }"
          @click="onClick(i)"
        >
          {{ item }}
        </li>
      </ul>

      <button
        class="scroll-arrow right"
        v-show="showRightSliderArrow"
        @click="scrollRight()"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const { activeIndex } = useServicesMenu();

const onClick = (i: number) => {
  activeIndex.value = i === activeIndex.value ? (activeIndex.value = -1) : i;
};

defineProps<{
  imageSrc?: { src: string; alt: string };
  menu?: {
    items?: string[];
  };
}>();

const {
  sliderRef,
  showLeftSliderArrow,
  showRightSliderArrow,
  scrollLeft,
  scrollRight,
} = useHorizontalSlider({
  autoPlay: false,
  continuous: false,
  speed: 1.5,
  pauseOnHover: true,
  showCustomCursor: false,
});
</script>

<style scoped>
#menu {
  padding: 4rem clamp(0rem, 5vw, 5.625rem) 0 clamp(0rem, 5vw, 5.625rem);
  z-index: 200;
  position: relative;
}

ul {
  padding: 0;
  display: flex;
  gap: clamp(0.5rem, 2vw, 1rem);
  width: 100%;
}

li {
  list-style-type: none;
}

.item {
  display: flex;
  background-color: var(--color-grey-card);
  backdrop-filter: blur(8px);
  padding: clamp(0.8rem, 2vw, 1rem) clamp(1rem, 4vw, 2rem);
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  font-size: clamp(0.75rem, 1.4vw, 1rem);
  cursor: pointer;
  border-radius: 16px;
  transition: all ease 0.1s;
  align-items: center;
  border: 2px solid var(--color-background);

  flex: 1 1 auto;
  text-align: center;
  white-space: nowrap;
}

.item:hover:not(.active) {
  background-color: var(--color-grey-menu-item-hover);
}

.active {
  background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
  border: 2px solid var(--color-primary);
}
</style>
