<script setup lang="ts">
import type { AboutPage } from "~/types/content";
import { queryCollection } from "#imports";

const { locale } = useI18n();

const { data: rawPage } = await useAsyncData(
  `about-${locale.value}`,
  () => queryCollection(`about_${locale.value}`).first(),
  { watch: [locale] },
);

const page = computed<AboutPage | null>(() => mergeContent<AboutPage>(rawPage.value));

usePageSeo({ title: locale.value === "de" ? "Über uns" : "About" });
</script>

<template>
  <HeroAbout v-if="page" :page="page" />
  <div v-else>
    <h1>Page not found</h1>
    <p>This page doesn't exist in {{ locale }} language.</p>
  </div>
</template>
