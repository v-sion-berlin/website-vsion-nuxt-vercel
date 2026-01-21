<script setup lang="ts">
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { queryCollection } from "#imports";
import { withoutTrailingSlash } from "ufo";
import type { Collections } from "@nuxt/content";
import type { ContactData } from "~/types/content";

const route = useRoute();
const { locale } = useI18n();

const slug = computed(() => String(route.params.slug ?? ""));

const pageId = computed(() => "project-" + route.path);

const { data: project } = await useAsyncData(
  `${pageId}-${locale.value}-${slug.value}`,
  () => {
    return queryCollection(`projects_${locale.value}`).path(route.path).first();
  },
  { watch: [locale, slug] },
);

const { data: contactDataRaw } = await useAsyncData(
  `contact-data`,
  () =>
    queryCollection(
      withoutTrailingSlash(`contact_${locale.value}`) as keyof Collections,
    ).first(),
  { watch: [locale] },
);

const contactData = computed<ContactData | null>(() => {
  if (!contactDataRaw.value) return null;
  return {
    ...(contactDataRaw.value.meta ?? {}),
    ...(contactDataRaw.value as any),
  };
});
</script>

<template>
  <section v-if="project">
    <ContentRenderer :value="project" />
  </section>

  <div v-else>
    <h1>Project not found</h1>
  </div>

  <Contact v-if="contactData" :page="contactData as ContactData" />
</template>
