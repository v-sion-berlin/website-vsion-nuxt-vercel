<template>
  <div id="text-container" style="padding-top: 0">
    <main>
      <section>
        <h2>
          {{ page.textblock_live_header }}
          <span style="font-style: italic; font-weight: 300">easy</span>
        </h2>
        <p>
          {{ page.textblock_live_body }}
        </p>
      </section>
    </main>
  </div>
</template>

<style scoped>
#text-container {
  padding-top: 0;
}
</style>

<script setup lang="ts">
interface Live {
  textblock_live_header: string;
  textblock_live_body: string;
}
const props = defineProps<{
  page: Live;
}>();
</script>
