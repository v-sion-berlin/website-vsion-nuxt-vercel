<script setup lang="ts">
import { queryCollection } from "#imports";

const { locale } = useI18n();

const { data: career } = await useAsyncData(
  `career-${locale.value}`,
  () => queryCollection(`career_${locale.value}`).first(),
  { watch: [locale] },
);

const careerTransformed = computed(() => mergeContent(career.value));

usePageSeo({ title: locale.value === "de" ? "Karriere" : "Career" });
</script>

<template>
  <article v-if="careerTransformed">
    <ContentRenderer :value="careerTransformed" />
  </article>
</template>
