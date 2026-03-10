<template>
  <section v-show="activeIndex === blockIndex || activeIndex === -1">
    <section>
      <div id="text-container" class="wrapper">
        <main>
          <section>
            <h2 id="text-container-big" v-reveal>
              <slot name="header" mdc-unwrap="p" />
            </h2>
            <div id="text-container-big" v-reveal="100">
              <slot name="subHeader" />
            </div>
            <div id="text-container-small" v-reveal="200">
              <slot name="body" mdc-unwrap="p" />
            </div>
          </section>
        </main>
      </div>
    </section>

    <section id="projects" v-if="showProjects" v-reveal>
      <div class="scroll-wrapper">
        <button
          class="scroll-arrow left"
          v-show="showLeftProjectArrow"
          aria-label="Scroll left"
          @click="scrollLeftGrid()"
        >
          <img :src="SliderArrowLeft" alt="" aria-hidden="true" />
        </button>

        <div class="grid" ref="gridRef">
          <div
            v-for="project in projectsFull"
            :key="project.slug"
            class="project-card"
          >
            <NuxtLink :to="localizedPath(project.slug!)">
              <NuxtPicture
                format="avif,webp"
                v-if="project.coverImage"
                :src="project.coverImage.src"
                :alt="project.coverImage.alt"
                loading="lazy"
                sizes="xs:384px sm:640px md:768px lg:900px xl:1080px xxl:1200px xxxl:1440px xxxxl:1920px xxxxxl:2560px"
              />
              <h2>{{ project.header }}</h2>
            </NuxtLink>
          </div>
        </div>

        <button
          class="scroll-arrow right"
          v-show="showRightProjectArrow"
          aria-label="Scroll right"
          @click="scrollRightGrid()"
        >
          <img :src="SliderArrowRight" alt="" aria-hidden="true" />
        </button>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import SliderArrowLeft from "~/assets/SliderArrowLeft.svg";
import SliderArrowRight from "~/assets/SliderArrowRight.svg";

const { locale } = useI18n();
const { activeIndex } = useServicesMenu();

const props = defineProps<{
  showProjects?: boolean;
  blockIndex: number;
  category?: string;
}>();

const localizedPath = (subTitle: string) => {
  const isGerman = locale.value === "de";
  return isGerman ? `/de/projects/${subTitle}` : `/projects/${subTitle}`;
};

const projects = inject<Ref<any[] | null>>("projects", ref(null));

const appBaseURL = useNuxtApp().$config.app.baseURL;
const category = toRef(props, "category");

const projectsFull = shallowRef<any[]>([]);

watchEffect(() => {
  const all = projects.value ?? [];
  const cat = category.value;

  const filtered = cat ? all.filter((p) => p.category?.includes(cat)) : all;

  projectsFull.value = filtered.map((p) => ({
    ...p,
    coverImage: p.coverImage
      ? {
          ...p.coverImage,
          src: `${appBaseURL}${p.coverImage.src.replace(/^\/+/, "")}`,
        }
      : undefined,
  }));
});

const {
  sliderRef: gridRef,
  showLeftSliderArrow: showLeftProjectArrow,
  showRightSliderArrow: showRightProjectArrow,
  scrollLeft: scrollLeftGrid,
  scrollRight: scrollRightGrid,
} = useHorizontalSlider({
  autoPlay: true,
  continuous: true,
  speed: 0.8,
  pauseOnHover: true,
});
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
