<script setup lang="ts">
import { queryCollection } from "#imports";
import { useI18n } from "vue-i18n";

const { locale } = useI18n();

const localePath = useLocalizedPath();

const { data: overview } = await useAsyncData(
  `projects-overview-${locale.value}`,
  () => {
    return queryCollection(`projects_overview_${locale.value}`).first();
  },
  { watch: [locale] },
);

const { data: projects } = await useAsyncData(
  `projects-${locale.value}`,
  () => {
    return queryCollection(`projects_${locale.value}`)
      .where("slug", "<>", "projects")
      .all();
  },
  { watch: [locale] },
);

const projectsFull = computed(
  () =>
    projects.value?.map((p) => ({
      ...p,
      coverImage: p.coverImage
        ? {
            ...p.coverImage,
            src: useImagePath(p.coverImage.src) ?? "",
          }
        : undefined,
    })) || [],
);

useScrollReveal();

usePageSeo({ title: locale.value === "de" ? "Projekte" : "Projects" });
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
        v-show="project.active"
        data-reveal
      >
        <NuxtLink :to="localePath(`/projects/${project.slug!}`)">
          <NuxtPicture
            format="avif,webp"
            v-if="project.coverImage"
            :src="project.coverImage.src"
            :alt="project.coverImage.alt"
            loading="lazy"
            densities="1"
            sizes="sm:640px md:768px lg:1024px xl:1280px 2xl:1536px"
          />
          <h2>{{ project.header }}</h2>
        </NuxtLink>
      </div>
    </div>
  </section>
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
