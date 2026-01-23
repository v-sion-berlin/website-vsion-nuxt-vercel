<template>
  <div>
    <main>
      <section class="image-wrapper wrapper">
        <div class="first-image" data-reveal>
          <NuxtPicture
            format="webp"
            :src="useImagePath(careerImage1?.src)"
            v-if="careerImage1"
          />
        </div>
        <div data-reveal>
          <NuxtPicture
            format="webp"
            :src="useImagePath(careerImage2?.src)"
            v-if="careerImage2"
          />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useImagePath } from "~/composables/useImagePath";

const props = defineProps<{
  careerImage1?: { src: string; alt: string };
  careerImage2?: { src: string; alt: string };
}>();

useScrollReveal({
  threshold: 0.1,
  duration: 800,
  distance: "30px",
  stagger: 50,
  once: true,
});
</script>

<style scoped>
.image-wrapper {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding: clamp(2rem, 5vw, 4rem) 0 clamp(2rem, 5vw, 4rem)
    clamp(1rem, 5vw, 5.625rem);
  margin-top: clamp(-10rem, -15vw, -6rem);
  height: clamp(20rem, 55vw, 50rem);
  position: relative;
}

picture {
  display: block;
  width: auto;
  max-height: clamp(200px, 40vw, 600px);
}

.first-image * {
  transform: translateY(30%);
}
</style>
