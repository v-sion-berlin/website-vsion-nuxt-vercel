<script setup lang="ts">
import { queryCollection } from "#imports";
import { useI18n } from "vue-i18n";
import { withoutTrailingSlash } from "ufo";
import type { Collections } from "@nuxt/content";
import type { ContactData } from "~/types/content";

const { locale } = useI18n();
const route = useRoute();

const slug = computed(() => String(route.params.slug ?? ""));

const localizedPath = (subTitle: string) => {
  const isGerman = locale.value === "de";
  return isGerman ? `/de/projects/${subTitle}` : `/projects/${subTitle}`;
};

const { data: overview } = await useAsyncData(
  `projects-overview-${locale.value}`,
  () => {
    return queryCollection(`projects_overview_${locale.value}`).first();
  },
  { watch: [locale, slug] },
);

const { data: projects } = await useAsyncData(
  () => `projects-${locale.value}-${slug.value}`,
  () => {
    return queryCollection(`projects_${locale.value}`)
      .where("slug", "<>", "projects")
      .all();
  },
  {
    watch: [locale, slug],
  },
);

const { data: contactDataRaw } = await useAsyncData(
  `contact-data-${locale.value}-${slug.value}`,
  () =>
    queryCollection(
      withoutTrailingSlash(`contact_${locale.value}`) as keyof Collections,
    ).first(),
  { watch: [locale, slug] },
);

const contactData = computed<ContactData | null>(() => {
  if (!contactDataRaw.value) return null;
  return {
    ...(contactDataRaw.value.meta ?? {}),
    ...(contactDataRaw.value as any),
  };
});

const appBaseURL = useNuxtApp().$config.app.baseURL;

const projectsFull = computed(
  () =>
    projects.value?.map((p) => ({
      ...p,
      coverImage: p.coverImage
        ? {
            ...p.coverImage,
            src: `${appBaseURL}${p.coverImage.src.replace(/^\/+/, "")}`,
          }
        : undefined,
    })) || [],
);

useScrollReveal({
  threshold: 0.001,
});
</script>

<template>
  <div v-if="overview" data-reveal>
    <ContentRenderer :value="overview" />
  </div>

  <section v-if="projects">
    <div class="grid-overview wrapper">
      <div
        v-for="project in projectsFull"
        :key="project.slug"
        class="project-card"
        data-reveal
      >
        <NuxtLink :to="localizedPath(project.slug!)">
          <NuxtPicture
            format="avif,webp"
            v-if="project.coverImage"
            :src="project.coverImage.src"
            :alt="project.coverImage.alt"
            loading="lazy"
            sizes="(max-width: 768px) 60vw, 640px"
          />
          <h2>{{ project.header }}</h2>
        </NuxtLink>
      </div>
    </div>
  </section>
  <Contact v-if="contactData" :page="contactData as ContactData" />
</template>

<style scoped>
.grid-overview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 400px), 400px));
  gap: 2rem;
  padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 10vw, 19.125rem)
    clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 5.625rem);
  justify-content: center;
  justify-items: center;
}

.project-card {
  overflow: hidden;
}

.project-card :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: all 0.3s ease;
  pointer-events: none;
  -webkit-user-drag: none;
  user-select: none;
  scale: 1.15 !important;
}

.project-card a {
  cursor: pointer !important;
}

.project-card:hover :deep(img) {
  transform: scale(0.95);
  transition: all ease-in-out 0.3s;
}

.project-card a h2 {
  cursor: pointer !important;
}
</style>
