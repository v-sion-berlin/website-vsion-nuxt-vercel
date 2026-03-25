<template>
  <div>
    <Header />
    <slot />
    <Contact
      v-if="contactData"
      :page="contactData as ContactData"
      :class="{ about: route.path.endsWith('/about') }"
    />
  </div>
</template>

<script setup lang="ts">
import { queryCollection } from "#imports";
import { withoutTrailingSlash } from "ufo";
import type { Collections } from "@nuxt/content";
import type { ContactData } from "~/types/content";

const { locale } = useI18n();
const route = useRoute();

const { data: contactDataRaw } = await useAsyncData(
  () => `contact-data-${locale.value}`,
  () =>
    queryCollection(
      withoutTrailingSlash(`contact_${locale.value}`) as keyof Collections,
    ).first(),
  { watch: [locale] },
);

const contactData = computed<ContactData | null>(() =>
  mergeContent<ContactData>(contactDataRaw.value),
);

const { data: projects } = await useAsyncData(
  () => `all-projects-${locale.value}`,
  () =>
    queryCollection(`projects_${locale.value}`)
      .where("slug", "<>", "projects")
      .all(),
  { watch: [locale] },
);

provide("projects", projects);
</script>

<style scoped>
.about {
  padding: clamp(2rem, 5vw, 4rem) 0 clamp(2rem, 5vw, 4rem) 0 !important;
  padding-inline: clamp(1rem, 5vw, 5.625rem) !important;
}
</style>
