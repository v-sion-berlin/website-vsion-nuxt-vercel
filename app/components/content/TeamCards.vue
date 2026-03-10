<template>
  <section>
    <div
      class="card wrapper"
      :class="getAlignmentClass(image)"
      v-for="image in imagesArray"
    >
      <NuxtPicture
        format="avif,webp"
        :src="useImagePath(image.src)"
        data-reveal
        loading="lazy"
        sizes="xs:384px sm:640px md:768px lg:900px xl:1080px xxl:1200px xxxl:1440px xxxxl:1920px xxxxxl:2560px"
        :alt="image.alt || 'Team member'"
      />
      <p data-reveal>{{ image.text }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useImagePath } from "~/composables/useImagePath";

const props = defineProps<{
  imagesArray?: { src: string; alt: string; text: string; alignment: string }[];
}>();

const getAlignmentClass = (image: { alignment: string }) => {
  return image.alignment === "right" ? "alignment-right" : "";
};

useScrollReveal();
</script>

<style scoped>
section {
  display: flex;
  flex-direction: column;
}

.card {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
  gap: clamp(1rem, 5vw, 6rem);
  padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 10vw, 19.125rem)
    clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 5.625rem);
}

.alignment-right {
  flex-direction: row-reverse;
}

picture:deep(img) {
  height: clamp(150px, 30vw, 420px);
  object-fit: contain;
  display: block;
  width: clamp(150px, 30vw, 630px);
}

p {
  flex: 1 1 25rem;
  font-size: clamp(1rem, 2.5vw, 24px);
  line-height: clamp(1.5rem, 3vw, 40px);
  font-weight: 500;
  margin: 0;
}
</style>
