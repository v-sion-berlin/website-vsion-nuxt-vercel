<template>
  <section>
    <div id="headline" class="wrapper">
      <h1>
        <div style="display: flex">
          <slot mdc-unwrap="p" />
          <div class="project-name">
            <slot name="project-name" mdc-unwrap="p" />
          </div>
          <img
            :src="useImagePath(imageSrc?.src)"
            class="img"
            v-if="props.imageSrc"
          />
          <!-- <img
            :src="useImagePath(imageSrc?.src)"
            class="blur-img"
            v-if="props.imageSrc"
          /> -->
        </div>
      </h1>
      <div id="text-container-big">
        <slot name="body" />
      </div>
      <div id="text-container">
        <slot name="sub" />
      </div>
    </div>
  </section>

  <section id="table" class="wrapper">
    <div class="table-col" v-if="tableDetails?.tasks?.length">
      <div class="table-header">{{ tableDetails.header.firstCol }}</div>
      <ul class="table-list">
        <li v-for="(task, i) in tableDetails.tasks" :key="i">{{ task }}</li>
      </ul>
    </div>

    <div class="table-col" v-if="tableDetails?.technologies?.length">
      <div class="table-header">{{ tableDetails.header.secondCol }}</div>
      <ul class="table-list">
        <li v-for="(tech, i) in tableDetails.technologies" :key="i">
          {{ tech }}
        </li>
      </ul>
    </div>
  </section>

  <section id="projects" v-if="sliderImages?.length" class="wrapper">
    <div class="header">{{ sliderHeader }}</div>

    <div class="scroll-wrapper">
      <button
        class="scroll-arrow left"
        v-show="showLeftSliderArrow"
        @click="scrollLeft()"
      >
        <div class="arrow"><</div>
      </button>

      <div class="grid" ref="sliderRef">
        <div
          v-for="(slide, index) in sliderImagesFull"
          :key="index"
          class="slide-card"
        >
          <img :src="slide.src" :alt="slide.alt" />
          <h2>{{ slide.title }}</h2>
        </div>
      </div>

      <button
        class="scroll-arrow right"
        v-show="showRightSliderArrow"
        @click="scrollRight()"
      >
        <div class="arrow">></div>
      </button>
    </div>
  </section>

  <section id="projects" class="wrapper">
    <div class="header">{{ projectsHeader }}</div>

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
</template>

<script setup lang="ts">
import { useImagePath } from "~/composables/useImagePath";

const { locale } = useI18n();
const route = useRoute();

const slug = computed(() => String(route.params.slug ?? ""));

const appBaseURL = useNuxtApp().$config.app.baseURL;

const props = defineProps<{
  imageSrc?: { src: string; alt: string };
  tableDetails?: {
    header: { firstCol: string; secondCol: string };
    tasks?: string[];
    technologies?: string[];
  };
  projectsHeader?: string;
  sliderHeader?: string;
  sliderImages?: { src: string; alt: string; title: string }[];
}>();

const sliderImagesFull = computed(
  () =>
    props.sliderImages?.map((img) => ({
      ...img,
      src: `${appBaseURL}${img.src.replace(/^\/+/, "")}`,
    })) || [],
);

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

const {
  sliderRef,
  showLeftSliderArrow,
  showRightSliderArrow,
  scrollLeft,
  scrollRight,
} = useHorizontalSlider();

const {
  sliderRef: gridRef,
  showLeftSliderArrow: showLeftProjectArrow,
  showRightSliderArrow: showRightProjectArrow,
  scrollLeft: scrollLeftGrid,
  scrollRight: scrollRightGrid,
} = useHorizontalSlider();
</script>

<style scoped>
.grid {
  margin-bottom: 5rem;
  margin-top: 5rem;
}

.slide-card {
  flex: 0 0 60vw;
  aspect-ratio: 16/9;
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
  scroll-snap-align: start;
  cursor: grab;
  transition: transform 0.3s ease;
}

.slide-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: filter 0.3s ease;
}

.slide-card h2 {
  display: flex;
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: var(--color-grey-card);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 19px 32px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  cursor: pointer;
  border-radius: 16px;
  color: var(--color-text);
  font-size: clamp(16px, 2vw, 24px);
  width: max-content;
  margin: 0;
}

#headline {
  position: relative;
  padding: clamp(10rem, 12vw, 13.75rem) clamp(0rem, 5vw, 3rem)
    clamp(2rem, 5vw, 4rem) clamp(0rem, 5vw, 5.625rem);
  overflow-x: clip;
}

#table {
  padding: 4rem clamp(0rem, 5vw, 5.625rem) 0 clamp(0rem, 5vw, 5.625rem);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(288px, 100%), 1fr));
  gap: 7rem;
}

.table-col {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.table-header {
  align-self: flex-start;
  background: var(--color-grey-card);
  color: var(--color-text);
  padding: 19px 32px;
  border-radius: 1rem;
  font-size: clamp(16px, 1.5vw, 20px);
  font-weight: 500;
  letter-spacing: 1px;
}

.table-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.table-list li {
  font-size: clamp(1.5rem, 1.5vw, 1.7rem);
  font-weight: 500;
  border-bottom: 1px solid #222;
  padding: 1.5rem 0;
  padding-left: 2rem;
}

.project-name {
  font-weight: 300;
  font-style: italic;
  padding-left: clamp(1rem, 2vw, 5rem);
  display: inline-flex;
}
.project-name * {
  font-weight: inherit;
  font-style: inherit;
  margin: 0;
}
#text-container {
  padding: 0;
  z-index: 200;
  position: relative;
}

#text-container-big {
  font-size: clamp(2rem, 2.5vw, 48px);
  line-height: clamp(2.2rem, 5vw, 64px);
  font-weight: 500;
  margin: 0;
  max-width: 100%;
  word-wrap: break-word;
  z-index: 200;
  position: relative;
}

.blur-img {
  position: absolute;
  left: 100%;
  width: clamp(400px, 50vw, 764px);
  z-index: -200;
  transform: translate(-40%, 0%);
  filter: blur(20px);
}

.img {
  width: clamp(80px, 10vw, 137px);
  margin-left: auto;
}
</style>
