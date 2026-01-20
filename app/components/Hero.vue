<script setup lang="ts">
import { useImagePath } from "~/composables/useImagePath";

interface Media {
  src: string;
  alt: string;
}
interface Page {
  heroImage?: Media;
  hero?: string;
}

const props = defineProps<{
  page: Page;
}>();
</script>

<template>
  <div id="hero">
    <section>
      <img :src="useImagePath(page.heroImage?.src)" class="blur-img" />
      <img :src="useImagePath(page.heroImage?.src)" class="img" />
      <div class="wrapper">
        <h1>{{ page.hero }}</h1>
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
  max-width: 100%;
  padding: clamp(10rem, 12vw, 13.75rem) clamp(1rem, 10vw, 19.125rem)
    clamp(2rem, 5vw, 4rem) 0;
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
