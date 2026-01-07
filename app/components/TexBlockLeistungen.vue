<template>
  <div id="text-container">
    <main>
      <section>
        <h2>
          {{ page.textblock_leistungen_header }}
        </h2>
        <p>
          {{ page.textblock_leistungen_body }}
        </p>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
interface Leistung {
  textblock_leistungen_header: string;
  textblock_leistungen_body: string;
}
const props = defineProps<{
  page: Leistung;
}>();
</script>
