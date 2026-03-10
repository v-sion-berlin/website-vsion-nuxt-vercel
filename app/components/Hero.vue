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
        loading="eager"
        sizes="sm:640px"
        aria-hidden="true"
        alt=""
      />
      <div class="img">
        <NuxtPicture
          :src="useImagePath(page.heroImage?.src)"
          format="avif,webp"
          loading="eager"
          fetchpriority="high"
          densities="1"
          sizes="sm:640px md:768px lg:1024px xl:1280px 2xl:1536px"
          :alt="page.heroImage?.alt || 'Hero image'"
        />
      </div>
      <div class="wrapper">
        <h1 data-reveal>{{ page.hero }}</h1>
      </div>
    </section>
  </div>
</template>

<style scoped>
#hero {
  position: relative;
  min-height: clamp(450px, calc(20vh + 40vw), 100vw);
  overflow-x: clip;
}

#hero section {
  position: relative;
  padding: clamp(10rem, 12vw, 13.75rem) 0 clamp(2rem, 5vw, 4rem) 0;
}

.wrapper {
  margin-inline-end: auto;
  margin-inline-start: auto;
  max-width: 1920px;
  padding-inline-start: clamp(1rem, 5vw, 5.625rem);
  padding-inline-end: clamp(1rem, 5vw, 5.625rem);
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

.img :deep(img) {
  width: 100%;
  height: auto;
  display: block;
}

.blur-img {
  transform: translate(-50%, -50%);
  z-index: -150;
  filter: blur(30px);
}
</style>
