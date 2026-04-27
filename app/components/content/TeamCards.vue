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
        densities="1"
        sizes="sm:640px md:768px lg:1024px xl:1280px 2xl:1536px"
        :alt="image.alt || 'Team member'"
      />
      <p data-reveal>{{ image.text }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
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

picture {
  display: block;
  width: clamp(250px, 30vw, 830px);
  aspect-ratio: 4 / 3;
  flex-shrink: 0;
  border-radius: 0.5rem;
  overflow: hidden;
}

picture:deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

p {
  flex: 1 1 25rem;
  font-size: clamp(1rem, 2.5vw, 24px);
  line-height: clamp(1.5rem, 3vw, 40px);
  font-weight: 500;
  margin: 0;
}
</style>
