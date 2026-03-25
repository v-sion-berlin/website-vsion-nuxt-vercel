<script setup lang="ts">
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { queryCollection } from "#imports";

const route = useRoute();
const { locale } = useI18n();

const slug = computed(() => String(route.params.slug ?? ""));

const { data: project } = await useAsyncData(
  () => `project-${route.path}-${locale.value}-${slug.value}`,
  () => {
    return queryCollection(`projects_${locale.value}`).path(route.path).first();
  },
  { watch: [locale, slug] },
);

usePageSeo({
  title: computed(() => (project.value as any)?.header ?? "Project").value,
});
</script>

<template>
  <section v-if="project">
    <ContentRenderer :value="project" v-reveal />
  </section>

  <div v-else>
    <h1>Project not found</h1>
  </div>
</template>
