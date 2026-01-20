<template>
  <section v-if="activeIndex === blockIndex || activeIndex === -1">
    <section>
      <div id="text-container" class="wrapper">
        <main>
          <section>
            <h2 id="text-container-big">
              <slot name="header" mdc-unwrap="p" />
            </h2>
            <div id="text-container-big">
              <slot name="subHeader" />
            </div>
            <div id="text-container-small">
              <slot name="body" mdc-unwrap="p" />
            </div>
          </section>
        </main>
      </div>
    </section>

    <section id="projects" v-if="showProjects" class="wrapper">
      <div class="scroll-wrapper">
        <button
          class="scroll-arrow left"
          v-show="showLeftProjectArrow"
          @click="scrollLeftGrid()"
        >
          <div class="arrow"><</div>
        </button>

        <div class="grid" ref="gridRef">
          <div
            v-for="project in projectsFull"
            :key="project.slug"
            class="project-card"
          >
            <NuxtLink :to="localizedPath(project.slug!)">
              <img
                v-if="project.coverImage"
                :src="project.coverImage.src"
                :alt="project.coverImage.alt"
              />
              <h2>{{ project.header }}</h2>
            </NuxtLink>
          </div>
        </div>

        <button
          class="scroll-arrow right"
          v-show="showRightProjectArrow"
          @click="scrollRightGrid()"
        >
          <div class="arrow">></div>
        </button>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
const { locale } = useI18n();
const route = useRoute();
const { activeIndex } = useServicesMenu();

defineProps<{
  showProjects?: boolean;
  blockIndex: number;
}>();

const slug = computed(() => String(route.params.slug ?? ""));
function localizedPath(subTitle: string) {
  const isGerman = locale.value === "de";
  return isGerman ? `/de/projects/${subTitle}` : `/projects/${subTitle}`;
}

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

const {
  sliderRef: gridRef,
  showLeftSliderArrow: showLeftProjectArrow,
  showRightSliderArrow: showRightProjectArrow,
  scrollLeft: scrollLeftGrid,
  scrollRight: scrollRightGrid,
} = useHorizontalSlider();
</script>

<style scoped>
#text-container {
  padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 10vw, 19.125rem)
    clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 5.625rem);
}

#text-container-small {
  font-size: clamp(16px, 2vw, 24px);
  margin-top: 1.5rem;
}

#text-container-big {
  margin-bottom: 1rem;
}
</style>
