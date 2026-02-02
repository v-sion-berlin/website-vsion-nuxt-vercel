<script setup lang="ts">
import { useImagePath } from "~/composables/useImagePath";

type Media = {
  src: string;
  alt: string;
};
type Page = {
  heroImage?: Media;
  hero?: string;
};

const props = defineProps<{
  page: Page;
}>();

useScrollReveal();
</script>

<template>
  <div id="hero">
    <section>
      <NuxtImg
        :src="useImagePath(page.heroImage?.src)"
        class="blur-img"
        format="webp"
      />
      <NuxtImg
        :src="useImagePath(page.heroImage?.src)"
        class="img"
        format="webp"
      />
      <div>
        <h1 data-reveal>{{ page.hero }}</h1>
      </div>
    </section>
  </div>
</template>

<style scoped>
#hero {
  position: relative;
  min-height: clamp(450px, calc(20vh + 50vw), 100vw);
  overflow-x: clip;
}

#hero section {
  position: relative;
  padding: clamp(10rem, 12vw, 13.75rem) clamp(1rem, 10vw, 19.125rem)
    clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 5.625rem);
}

.img,
.blur-img {
  position: absolute;
  top: clamp(260px, 25vw, 600px);
  left: 50%;
  width: clamp(40%, 60%, 80%);
}

.img {
  transform: translateX(15%);
  z-index: -100;
}

.blur-img {
  transform: translate(-50%, -50%);
  z-index: -150;
  filter: blur(30px);
}
</style>
