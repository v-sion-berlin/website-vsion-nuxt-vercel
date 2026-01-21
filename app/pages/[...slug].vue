<script setup lang="ts">
import type {
  HomePage,
  AboutPage,
  ContactData,
  ServicesPage,
} from "~/types/content";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import { queryCollection } from "#imports";
import type { Collections } from "@nuxt/content";
import { withoutTrailingSlash } from "ufo";

const route = useRoute();
const { locale } = useI18n();

const slug = computed(() => String(route.params.slug ?? ""));

const collectionName = computed<keyof Collections | null>(() => {
  if (slug.value === "") return `home_${locale.value}` as const;
  if (slug.value === "about") return `about_${locale.value}` as const;
  else return null;
});

const { data: rawPage } = await useAsyncData(
  route.path,
  async () => {
    if (collectionName.value !== null) {
      return queryCollection(
        withoutTrailingSlash(collectionName.value) as keyof Collections,
      ).first();
    }
    return null;
  },
  { watch: [locale] },
);

const { data: contactDataRaw } = await useAsyncData(
  `contact-data`,
  () =>
    queryCollection(
      withoutTrailingSlash(`contact_${locale.value}`) as keyof Collections,
    ).first(),
  { watch: [locale] },
);

const page = computed<HomePage | AboutPage | ServicesPage | null>(() => {
  if (!rawPage.value) return null;
  return { ...(rawPage.value.meta ?? {}), ...(rawPage.value as any) };
});

const { data: services } = await useAsyncData(
  `services-${locale.value}`,
  () => {
    return queryCollection(`services_${locale.value}`).first();
  },
  { watch: [locale, slug] },
);

const { data: career } = await useAsyncData(
  `career-${locale.value}`,
  () => {
    return queryCollection(`career_${locale.value}`).first();
  },
  { watch: [locale, slug] },
);

const careerTransformed = computed<any>(() => {
  if (!career.value) return null;
  return { ...(career.value.meta ?? {}), ...(career.value as any) };
});

const { data: team } = await useAsyncData(
  `team-${locale.value}`,
  () => {
    return queryCollection(`team_${locale.value}`).first();
  },
  { watch: [locale, slug] },
);

const teamTransformed = computed<any>(() => {
  if (!team.value) return null;
  return { ...(team.value.meta ?? {}), ...(team.value as any) };
});

const contactData = computed<ContactData | null>(() => {
  if (!contactDataRaw.value) return null;
  return {
    ...(contactDataRaw.value.meta ?? {}),
    ...(contactDataRaw.value as any),
  };
});

provide("team", teamTransformed);
</script>

<template>
  <HeroAbout v-if="page?.type === 'about'" :page="page as AboutPage" />
  <Home v-else-if="page?.type === 'home'" :page="page as HomePage" />

  <article v-else-if="services && route.path.includes('services')">
    <ContentRenderer :value="services" />
  </article>

  <article v-else-if="career && route.path.includes('career')">
    <ContentRenderer :value="careerTransformed" />
  </article>

  <article v-else-if="team && route.path.includes('team')">
    <ContentRenderer :value="teamTransformed" />
  </article>

  <div v-else-if="!page">
    <h1>Page not found</h1>
    <p>This page doesn't exist in {{ locale }} language.</p>
  </div>
  <Contact
    v-if="contactData"
    :page="contactData as ContactData"
    :class="{ about: page?.type === 'about' }"
  />
</template>

<style>
.about {
  padding: clamp(2rem, 5vw, 4rem) 0 clamp(2rem, 5vw, 4rem) 0 !important;
  padding-inline: clamp(1rem, 5vw, 5.625rem) !important;
}
</style>
