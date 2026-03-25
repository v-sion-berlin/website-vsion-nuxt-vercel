<script setup lang="ts">
import { queryCollection } from "#imports";

const { locale } = useI18n();

const { data: team } = await useAsyncData(
  `team-${locale.value}`,
  () => queryCollection(`team_${locale.value}`).first(),
  { watch: [locale] },
);

const teamTransformed = computed(() => mergeContent(team.value));

provide("team", teamTransformed);

usePageSeo({ title: "Team" });
</script>

<template>
  <article v-if="teamTransformed">
    <ContentRenderer :value="teamTransformed" />
  </article>
</template>
