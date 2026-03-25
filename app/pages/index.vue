<script setup lang="ts">
import type { HomePage } from "~/types/content";
import { queryCollection } from "#imports";

const { locale } = useI18n();

const { data: rawPage } = await useAsyncData(
  `home-${locale.value}`,
  () => queryCollection(`home_${locale.value}`).first(),
  { watch: [locale] },
);

const page = computed<HomePage | null>(() =>
  mergeContent<HomePage>(rawPage.value),
);

usePageSeo({});
</script>

<template>
  <Home v-if="page" :page="page" />
</template>
