<template>
  <section id="hero">
    <div id="headline">
      <div
        class="headline-content"
        :class="{
          wrapper: imagePos === 'tr',
          'wrapper-right': imagePos !== 'tr',
        }"
        data-reveal
      >
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
      <div v-if="imageSrc" class="main-img">
        <NuxtPicture
          format="avif,webp"
          :src="useImagePath(imageSrc.src)"
          loading="eager"
          fetchpriority="high"
          sizes="xs:384px sm:640px md:768px lg:900px xl:1080px xxl:1200px xxxl:1440px xxxxl:1920px xxxxxl:2560px"
          :alt="imageSrc.alt || 'Section image'"
        />
      </div>
      <NuxtImg
        format="webp"
        :src="useImagePath(imageSrc.src)"
        v-if="imageSrc"
        class="blur-img"
        loading="eager"
        sizes="480px"
        aria-hidden="true"
        alt=""
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

.image-wrapper :deep(img) {
  display: block;
  width: 100%;
  height: auto;
}

.text-right {
  display: flex;
  text-align: right;
  position: relative;
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
  padding: clamp(10rem, 12vw, 13.75rem) 0 clamp(2rem, 5vw, 4rem) 0;
  overflow-x: clip;
}

.wrapper {
  margin-inline-end: auto;
  margin-inline-start: auto;
  max-width: 1920px;
  padding-inline-start: clamp(1rem, 5vw, 5.625rem);
  padding-inline-end: clamp(1rem, 5vw, 5.625rem);
}

.wrapper-right {
  margin-inline-end: auto;
  margin-inline-start: auto;
  max-width: 1920px;
  padding-inline-start: clamp(1rem, 5vw, 5.625rem);
  padding-inline-end: clamp(1rem, 5vw, 5.625rem);
  padding-right: clamp(1rem, 10vw, 19.125rem);
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
