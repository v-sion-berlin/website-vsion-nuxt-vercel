<template>
  <section>
    <h1 v-if="team">
      <span class="cursiv">{{ team.cursivWord1 }}</span>
      {{ team.headerLine1 }}
      <span class="cursiv">{{ team.cursivWord2 }}</span>
      {{ team.headerLine2 }}
    </h1>
    <h1 v-if="team">
      <span class="cursiv">{{ team.cursivWord1 }}</span>
      {{ team.headerLine1 }}
      <span class="cursiv">{{ team.cursivWord2 }}</span>
      {{ team.headerLine2 }}
    </h1>
  </section>
</template>

<script setup lang="ts">
interface TeamData {
  cursivWord1: string;
  headerLine1: string;
  cursivWord2: string;
  headerLine2: string;
}

const team = inject("team") as Ref<TeamData>;
</script>

<style scoped>
section {
  padding: clamp(10rem, 12vw, 13.75rem) 0 clamp(2rem, 5vw, 4rem)
    clamp(0rem, 5vw, 5.625rem);
  overflow: hidden;
}

h1 {
  white-space: nowrap;
}

h1:nth-of-type(1) {
  transform: translateX(clamp(10vw, 23vw, 30vw));
}

h1:nth-of-type(2) {
  transform: translateX(clamp(-77vw, -77vw, -15vw));
}

.cursiv {
  font-style: italic;
  font-weight: 300;
  word-break: break-all;
}

@media (max-width: 575px) {
  h1 {
    white-space: unset;
  }

  h1:nth-of-type(1) {
    transform: unset;
  }

  h1:nth-of-type(2) {
    transform: unset;
    display: none;
  }
}
</style>
