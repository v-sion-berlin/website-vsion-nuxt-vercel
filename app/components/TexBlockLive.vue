<template>
  <div id="text-container" style="padding-top: 0" class="wrapper">
    <main>
      <section>
        <h2 data-reveal>
          {{ page.textblock_live_header }}
          <span style="font-style: italic; font-weight: 300">easy</span>
        </h2>
        <p data-reveal>
          {{ page.textblock_live_body }}
        </p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
interface Live {
  textblock_live_header: string;
  textblock_live_body: string;
}
const props = defineProps<{
  page: Live;
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
#text-container {
  padding-top: 0;
}
</style>
