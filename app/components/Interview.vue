<template>
  <div id="text-container">
    <main>
      <section>
        <h2>{{ page.interview_header }}</h2>
        <p style="display: inline">
          {{ page.interview_body }}
          <a href="https://www.vizrt.com" target="_blank" rel="noopener">
            Vizrt</a
          >{{ page.interview_body_part_2 }}
        </p>
      </section>

      <div
        class="watch"
        :class="{ expanded: isVideoOpen }"
        @click.stop="toggleVideo"
      >
        <p :class="{ hidden: isVideoOpen }">{{ page.interview_watch_text }}</p>

        <transition name="video-fade">
          <div class="video-container" v-if="isVideoOpen">
            <button class="close-btn" @click.stop="collapseVideo">✕</button>
            <iframe
              src="https://player.vimeo.com/video/1058566689?loop=false&autoplay=true&muted=false&gesture=media&playsinline=false&byline=false&portrait=false&title=false&speed=true&transparent=false&dnt=true&h=fefa83d4e9"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
            ></iframe>
          </div>
        </transition>
      </div>
      <div class="video-source" v-if="isVideoOpen">
        {{ page.interview_source_text }}
        <a
          href="https://www.vizrt.com/campaign/unlock-next-level-news-production-with-viz-pilot-edge/"
          target="_blank"
          rel="noopener"
        >
          Vizrt
        </a>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const isVideoOpen = ref(false);

function toggleVideo() {
  isVideoOpen.value = !isVideoOpen.value;
}

function collapseVideo() {
  isVideoOpen.value = false;
}
interface Interview {
  interview_header: string;
  interview_body: string;
  interview_body_part_2: string;
  interview_source_text: string;
  interview_watch_text: string;
}
const props = defineProps<{
  page: Interview;
}>();
</script>

<style scoped>
.watch {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  cursor: pointer;
  border-radius: 16px;
  outline: 2px solid var(--color-primary);
  width: 150px;
  height: 50px;
  transition:
    background-color 0.3s ease,
    width 0.5s cubic-bezier(0.65, 0, 0.35, 1),
    height 0.5s cubic-bezier(0.65, 0, 0.35, 1),
    outline 0.5s cubic-bezier(0.65, 0, 0.35, 1),
    border-radius 0.5s cubic-bezier(0.65, 0, 0.35, 1);
  position: relative;
  overflow: hidden;
  margin-top: 32px;
}

.watch:hover {
  background-color: var(--color-primary);
}

.watch.expanded {
  width: clamp(320px, 90vw, 1000px);
  height: clamp(200px, 50vh, 60vh);
  border-radius: 16px;
  background-color: var(--color-background);
  outline: none;
}

.video-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 16px;
  overflow: hidden;
  z-index: 1;
}

.video-container iframe {
  width: 100%;
  height: 100%;
  border: 0;
}

.watch p {
  color: var(--color-text);
  font-weight: bold;
  font-size: clamp(16px, 2vw, 24px);
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  z-index: 2;
  position: absolute;
  text-align: center;
}

.watch p.hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateY(-10px);
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  border: none;
  color: var(--color-text);
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background 0.3s ease;
}

.video-source {
  margin-top: 8px;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  text-align: center;
}

/* transitions */
.video-fade-enter-active,
.video-fade-leave-active {
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

.video-fade-enter-from,
.video-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.video-fade-enter-to,
.video-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
</style>
