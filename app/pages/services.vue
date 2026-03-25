<script setup lang="ts">
import { queryCollection } from "#imports";

const { locale } = useI18n();

const { data: services } = await useAsyncData(
  `services-${locale.value}`,
  () => queryCollection(`services_${locale.value}`).first(),
  { watch: [locale] },
);

usePageSeo({ title: locale.value === "de" ? "Leistungen" : "Services" });
</script>

<template>
  <article v-if="services">
    <ContentRenderer :value="services" :key="locale" />
  </article>
</template>
