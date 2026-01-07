<template>
  <section>
    <div
      class="card"
      :class="getAlignmentClass(image)"
      v-for="image in imagesArray"
    >
      <img :src="useImagePath(image.src)" />
      <p>{{ image.text }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useImagePath } from "~/composables/useImagePath";

const props = defineProps<{
  imagesArray?: { src: string; alt: string; text: string; alignment: string }[];
}>();

function getAlignmentClass(image: { alignment: string }) {
  return image.alignment === "right" ? "alignment-right" : "";
}
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
  gap: clamp(1rem, 5vw, 6rem);
  padding: 4rem clamp(0rem, 5vw, 5.625rem);
}

.alignment-right {
  flex-direction: row-reverse;
}

.card img {
  border-radius: 16px;
  width: clamp(20rem, 40vw, 50rem);
  height: auto;
  min-width: 250px;
}

p {
  flex: 1 1 25rem;
  font-size: clamp(1rem, 2.5vw, 24px);
  line-height: clamp(1.5rem, 3vw, 40px);
  font-weight: 500;
  margin: 0;
}
</style>
