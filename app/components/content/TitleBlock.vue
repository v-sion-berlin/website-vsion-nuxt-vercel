<template>
  <section id="hero">
    <div id="headline">
      <div class="headline-content" data-reveal>
        <h1 :class="{ 'text-right': textPos === 'r' }">
          <slot v-if="$slots.default" mdc-unwrap="p" />
        </h1>
        <div class="description">
          <slot name="description" />
        </div>
      </div>
    </div>
    <div
      class="image-wrapper"
      :class="{
        'image-right': imagePos === 'tr',
        'image-left': imagePos !== 'tr',
      }"
    >
      <NuxtImg
        format="webp"
        :src="useImagePath(imageSrc.src)"
        v-if="imageSrc"
        class="main-img"
      />
      <NuxtImg
        format="webp"
        :src="useImagePath(imageSrc.src)"
        v-if="imageSrc"
        class="blur-img"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useImagePath } from "~/composables/useImagePath";

defineProps<{
  imageSrc?: { src: string; alt: string };
  imagePos?: string;
  textPos?: string;
}>();

useScrollReveal();
</script>

<style scoped>
.image-wrapper {
  position: relative;
  width: 100%;
  pointer-events: none;
  overflow-x: clip;
}

.image-wrapper img {
  display: block;
  max-width: 100%;
  height: auto;
}

.text-right {
  display: flex;
  text-align: right;
  position: relative;
  right: -10%;
  justify-content: end;
}

.text-right > * {
  padding: 0;
  margin: 0;
  width: clamp(250px, 60vw, 1000px);
}

.text-right {
  text-wrap-style: pretty;
  text-indent: calc(6vw + 15rem);
}

#headline {
  position: relative;
  max-width: 100%;
  padding: clamp(10rem, 12vw, 13.75rem) clamp(1rem, 10vw, 19.125rem)
    clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 5.625rem);
  overflow-x: clip;
}

.headline-content {
  z-index: 1;
  display: flex;
}

.description {
  margin-top: 2rem;
  color: var(--color-text);
  font-size: clamp(16px, 1.5vw, 32px);
  font-family: Montserrat, sans-serif;
  font-weight: 400;
  max-width: 70%;
  line-height: 1.6;
}

.image-right .main-img {
  position: absolute;
  bottom: clamp(260px, 25vw, 600px);
  right: calc(-45vw + 25%);
  width: clamp(30%, 40%, 60%);
  z-index: -1;
  transform: translateY(42%);
}

.image-right .blur-img {
  position: absolute;
  bottom: clamp(260px, 25vw, 600px);
  right: calc(-15vw + 25%);
  width: clamp(30%, 40%, 60%);
  filter: blur(20px);
  z-index: -2;
}

.image-left .main-img {
  position: absolute;
  bottom: clamp(260px, 25vw, 600px);
  left: -16vw;
  width: clamp(40%, 50%, 70%);
  z-index: -1;
  transform: translateY(95%);
}

.image-left .blur-img {
  position: absolute;
  width: clamp(40%, 50%, 70%);
  bottom: clamp(260px, 25vw, 600px);
  left: calc(-4vw + 25%);
  filter: blur(20px);
  transform: translateY(65%);
  z-index: -2;
}

@media (max-width: 765px) {
  .text-right {
    text-wrap-style: pretty;
    text-indent: 0;
  }
}
</style>
