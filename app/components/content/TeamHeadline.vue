<template>
  <section ref="sectionRef">
    <h1 v-if="team" class="from-left" :class="{ visible: isVisible }">
      <span class="cursiv">{{ team.cursivWord1 }}</span>
      {{ team.headerLine1 }}
    </h1>
    <h1 v-if="team" class="from-right" :class="{ visible: isVisible }">
      <span class="cursiv">{{ team.cursivWord2 }}</span>
      {{ team.headerLine2 }}
    </h1>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, inject, type Ref } from "vue";

type TeamData = {
  cursivWord1: string;
  headerLine1: string;
  cursivWord2: string;
  headerLine2: string;
};

const team = inject("team") as Ref<TeamData>;

const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);

let observer: IntersectionObserver | null = null;

onMounted(() => {
  if (!sectionRef.value) return;

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true;
          observer?.disconnect();
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    },
  );

  observer.observe(sectionRef.value);
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<style scoped>
section {
  padding: clamp(10rem, 12vw, 13.75rem) 0 clamp(2rem, 5vw, 4rem)
    clamp(0rem, 5vw, 5.625rem);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  white-space: nowrap;
  opacity: 0;
  transition:
    opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

h1.from-left {
  transform: translateX(-100%);
}

h1.from-right {
  transform: translateX(100%);
  transition-delay: 0.15s;
}

h1.visible {
  opacity: 1;
  transform: translateX(0);
}

.cursiv {
  font-style: italic;
  font-weight: 300;
  word-break: break-all;
}

@media (prefers-reduced-motion: reduce) {
  h1 {
    transform: none;
    transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  h1.from-left,
  h1.from-right {
    transform: none;
  }
}

@media (max-width: 575px) {
  h1 {
    white-space: unset;
  }

  h1.from-right {
    display: none;
  }
}
</style>
