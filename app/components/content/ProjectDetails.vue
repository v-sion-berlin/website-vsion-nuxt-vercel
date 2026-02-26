<template>
  <section>
    <div id="headline" class="wrapper">
      <h1 v-reveal>
        <div style="display: flex">
          <slot mdc-unwrap="p" />
          <div class="project-name">
            <slot name="project-name" mdc-unwrap="p" />
          </div>
          <img
            :src="useImagePath(imageSrc?.src)"
            class="img"
            v-if="props.imageSrc"
            alt=""
            aria-hidden="true"
          />
        </div>
      </h1>
      <div id="text-container-big" v-reveal="100">
        <slot name="body" />
      </div>
      <br />
      <div id="text-container" v-reveal="200">
        <slot name="sub" />
      </div>
    </div>
  </section>

  <section v-if="sliderItems?.length" id="projects" data-reveal>
    <div class="scroll-wrapper">
      <button
        class="scroll-arrow left"
        v-show="showLeftSliderArrow"
        aria-label="Scroll left"
        @click="scrollLeft()"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div class="grid" ref="sliderRef">
        <div
          v-for="(item, index) in sliderItemsFull"
          :key="index"
          class="slide-card"
          :class="{
            'is-video': item.type === 'video',
            'is-video-playing':
              item.type === 'video' &&
              (item.autoPlay || activeVideoIndex === index),
          }"
        >
          <!-- image slide -->
          <template v-if="item.type === 'image'">
            <NuxtImg
              format="webp"
              :src="item.src"
              :alt="item.alt"
              loading="lazy"
              sizes="(max-width: 768px) 60vw, 800px"
            />
          </template>

          <!-- video slide -->
          <template v-else-if="item.type === 'video'">
            <template v-if="item.autoPlay">
              <div class="video-player" :ref="(el) => setVideoRef(el, index)">
                <div class="plyr__video-embed">
                  <iframe
                    :src="getVideoEmbedUrl(item, true)"
                    :title="item.title || 'Project video'"
                    allowfullscreen
                    allowtransparency
                    allow="autoplay; encrypted-media"
                  ></iframe>
                </div>
              </div>
            </template>

            <!-- manual play: poster → click → player -->
            <template v-else>
              <div
                class="video-poster"
                v-if="activeVideoIndex === null || activeVideoIndex !== index"
                @click="playVideo(index)"
              >
                <NuxtImg
                  format="webp"
                  :alt="item.title"
                  :src="item.poster || '/images/projects/test.jpg'"
                  loading="lazy"
                  sizes="(max-width: 768px) 60vw, 800px"
                />
                <button class="play-button" aria-label="Play video">
                  <svg viewBox="0 0 24 24" fill="white" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>

              <div
                v-else
                class="video-player"
                :ref="(el) => setVideoRef(el, index)"
              >
                <div class="plyr__video-embed">
                  <iframe
                    :src="getVideoEmbedUrl(item, false)"
                    :title="item.title || 'Project video'"
                    allowfullscreen
                    allowtransparency
                    allow="autoplay"
                  ></iframe>
                </div>
              </div>
            </template>
          </template>

          <h2
            v-if="
              item.title &&
              (item.type === 'image' ||
                (!item.autoPlay && activeVideoIndex !== index))
            "
          >
            {{ item.title }}
          </h2>
        </div>
      </div>

      <button
        class="scroll-arrow right"
        v-show="showRightSliderArrow"
        aria-label="Scroll right"
        @click="scrollRight()"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  </section>

  <section id="table" class="wrapper" data-reveal>
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

  <section id="projects" data-reveal>
    <div class="header wrapper">{{ projectsHeader }}</div>

    <div class="scroll-wrapper">
      <button
        class="scroll-arrow left"
        v-show="showLeftProjectArrow"
        aria-label="Scroll left"
        @click="scrollLeftGrid()"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div class="grid" ref="gridRef">
        <div
          v-for="project in projectsFull"
          :key="project.slug"
          class="project-card"
        >
          <NuxtLink :to="localizedPath(project.slug!)">
            <NuxtImg
              format="webp"
              v-if="project.coverImage"
              :src="project.coverImage.src"
              :alt="project.coverImage.alt"
              loading="lazy"
              sizes="(max-width: 768px) 60vw, 800px"
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
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
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

interface SliderImage {
  type: "image";
  src: string;
  alt: string;
  title: string;
}

interface SliderVideo {
  type: "video";
  provider: "vimeo" | "youtube";
  videoId: string;
  title: string;
  poster?: string;
  autoPlay?: boolean;
}

type SliderItem = SliderImage | SliderVideo;

const props = defineProps<{
  imageSrc?: { src: string; alt: string };
  tableDetails?: {
    header: { firstCol: string; secondCol: string };
    tasks?: string[];
    technologies?: string[];
  };
  projectsHeader?: string;
  sliderHeader?: string;
  sliderItems?: SliderItem[];
}>();

const activeVideoIndex = ref<number | null>(null);
const videoRefs = ref<Map<number, HTMLElement>>(new Map());
let playerInstances = new Map<number, any>();

const sliderItemsFull = computed(() => {
  const items = props.sliderItems || [];

  return items.map((item) => {
    if (item.type === "image" || !item.type) {
      return {
        ...item,
        type: "image" as const,
        src: `${appBaseURL}${(item as SliderImage).src.replace(/^\/+/, "")}`,
      };
    }
    return {
      ...item,
      poster: (item as SliderVideo).poster
        ? `${appBaseURL}${(item as SliderVideo).poster!.replace(/^\/+/, "")}`
        : undefined,
    };
  });
});

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

const localizedPath = (subTitle: string) => {
  const isGerman = locale.value === "de";
  return isGerman ? `/de/projects/${subTitle}` : `/projects/${subTitle}`;
};

const getVideoEmbedUrl = (item: SliderVideo, muted: boolean): string => {
  if (item.provider === "vimeo") {
    if (muted) {
      return `https://player.vimeo.com/video/${item.videoId}?autoplay=1&muted=1&loop=1&byline=false&portrait=false&title=false&speed=true&transparent=0`;
    }
    return `https://player.vimeo.com/video/${item.videoId}?autoplay=1&loop=false&byline=false&portrait=false&title=false&speed=true&transparent=0&gesture=media`;
  }

  if (item.provider === "youtube") {
    if (muted) {
      return `https://www.youtube.com/embed/${item.videoId}?autoplay=1&mute=1&loop=1&playlist=${item.videoId}&rel=0&modestbranding=1&playsinline=1`;
    }
    return `https://www.youtube.com/embed/${item.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`;
  }

  return "";
};

const playVideo = async (index: number) => {
  if (activeVideoIndex.value !== null && activeVideoIndex.value !== index) {
    destroyPlayer(activeVideoIndex.value);
  }

  activeVideoIndex.value = index;

  await nextTick();

  const container = videoRefs.value.get(index);
  if (container) {
    const [{ default: Plyr }] = await Promise.all([
      import("plyr"),
      import("plyr/dist/plyr.css"),
    ]);
    const playerElement = container.querySelector(".plyr__video-embed");

    if (playerElement) {
      const player = new Plyr(playerElement as HTMLElement, {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "fullscreen",
        ],
        vimeo: {
          byline: false,
          portrait: false,
          title: false,
          speed: true,
          transparent: false,
        },
        youtube: {
          noCookie: true,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
        },
      });

      playerInstances.set(index, player);
    }
  }
};

const destroyPlayer = (index: number) => {
  const player = playerInstances.get(index);
  if (player) {
    player.destroy();
    playerInstances.delete(index);
  }
};

const setVideoRef = (el: any, index: number) => {
  if (el) {
    videoRefs.value.set(index, el);
  }
};

onBeforeUnmount(() => {
  playerInstances.forEach((player) => player.destroy());
  playerInstances.clear();
});

/** Initialize Plyr on autoplay video slides once the DOM is ready */
onMounted(async () => {
  const items = props.sliderItems || [];
  const autoplayIndices = items
    .map((item, i) =>
      item.type === "video" && (item as SliderVideo).autoPlay ? i : -1,
    )
    .filter((i) => i !== -1);

  if (autoplayIndices.length === 0) return;

  await nextTick();

  const [{ default: Plyr }] = await Promise.all([
    import("plyr"),
    import("plyr/dist/plyr.css"),
  ]);

  for (const index of autoplayIndices) {
    const container = videoRefs.value.get(index);
    if (!container) continue;

    const playerElement = container.querySelector(".plyr__video-embed");
    if (!playerElement) continue;

    const player = new Plyr(playerElement as HTMLElement, {
      controls: [
        "play-large",
        "play",
        "progress",
        "current-time",
        "mute",
        "volume",
        "fullscreen",
      ],
      autoplay: true,
      muted: true,
      vimeo: {
        byline: false,
        portrait: false,
        title: false,
        speed: true,
        transparent: false,
      },
      youtube: {
        noCookie: true,
        rel: 0,
        showinfo: 0,
        modestbranding: 1,
      },
    });

    playerInstances.set(index, player);
  }
});

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
} = useHorizontalSlider({
  autoPlay: false,
  autoPlayInterval: 3000,
  continuous: false,
  pauseOnHover: true,
  videoPlayingSelector: ".slide-card.is-video-playing",
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

useScrollReveal();
</script>

<style scoped>
.grid {
  margin-bottom: 5rem;
  margin-top: 5rem;
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  cursor: none;
  user-select: none;
}

.grid::-webkit-scrollbar {
  display: none;
}

.slide-card img,
.project-card a img {
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.slide-card img,
.project-card img {
  pointer-events: none;
  user-select: none;
  -webkit-user-drag: none;
}

.slide-card {
  flex: 0 0 auto;
  height: clamp(300px, 45vw, 550px);
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease;
}

.slide-card img {
  height: 100%;
  width: auto;
  object-fit: cover;
  display: block;
  transition: filter 0.3s ease;
}

.slide-card.is-video {
  aspect-ratio: 16 / 9;
  background: #000;
}

.slide-card h2 {
  display: flex;
  position: absolute;
  bottom: clamp(10px, 3vw, 20px);
  left: clamp(10px, 3vw, 20px);
  background-color: var(--color-grey-card);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 19px 32px;
  font-family: "Montserrat", sans-serif;
  font-weight: 500;
  border-radius: clamp(8px, 2.5vw, 16px);
  color: var(--color-text);
  font-size: clamp(8px, 2vw, 24px);
  width: max-content;
  margin: 0;
}

#headline {
  position: relative;
  padding: clamp(10rem, 12vw, 13.75rem) clamp(1rem, 10vw, 19.125rem)
    clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 5.625rem);
  overflow-x: clip;
}

#table {
  padding: 0 clamp(1rem, 10vw, 19.125rem) clamp(2rem, 5vw, 4rem)
    clamp(1rem, 5vw, 5.625rem);
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
  font-weight: 200;
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
  object-fit: contain;
}

/* video slide */
.video-poster {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-poster img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.play-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background 0.3s ease,
    transform 0.3s ease;
}

.play-button svg {
  width: 40px;
  height: 40px;
  color: white;
  margin-left: 4px;
}

.play-button:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: translate(-50%, -50%) scale(1.1);
}

.video-player {
  width: 100%;
  height: 100%;
}

.video-player .plyr__video-embed {
  width: 100%;
  height: 100%;
}

.video-player .plyr__video-embed iframe {
  width: 100%;
  height: 100%;
}

.slide-card :deep(.plyr) {
  width: 100%;
  height: 100%;
}

.slide-card :deep(.plyr__video-wrapper) {
  height: 100%;
}
</style>
