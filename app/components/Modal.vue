<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="modelValue"
        class="backdrop"
        @click.self="close"
        role="presentation"
      >
        <transition name="scale">
          <div
            class="panel"
            role="dialog"
            aria-modal="true"
            :aria-labelledby="title ? titleId : undefined"
            tabindex="-1"
            ref="panel"
          >
            <button
              class="close"
              type="button"
              @click="close"
              aria-label="Modal schließen"
            >
              ×
            </button>

            <h2 v-if="title" :id="titleId" class="title">{{ title }}</h2>

            <div class="body">
              <slot />
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount, computed } from "vue";

const props = defineProps<{
  modelValue: boolean;
  title?: string;
}>();

const emit = defineEmits<{
  "update:modelValue": [boolean];
}>();

const panel = ref<HTMLElement | null>(null);
const titleId = computed(
  () => `modal-${Math.random().toString(36).slice(2, 9)}-title`
);

function close() {
  emit("update:modelValue", false);
}

let prevOverflow = "";

watch(
  () => props.modelValue,
  (open) => {
    if (import.meta.client) {
      if (open) {
        prevOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";
        requestAnimationFrame(() => panel.value?.focus());
      } else {
        document.documentElement.style.overflow = prevOverflow;
      }
    }
  },
  { immediate: true }
);

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.documentElement.style.overflow = prevOverflow;
  }
});
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 999;
}

.panel {
  background: var(--color-background);
  width: min(720px, 70vw);
  border-radius: 16px;
  padding: 24px;
  position: relative;
  outline: 1px solid var(--color-grey-menu-item-hover);
}

.title {
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
  line-height: 1.3;
  color: #c2c2c2;
}

.body {
  max-height: min(70vh, 720px);
  overflow: auto;
  color: #c2c2c2;
}

.close {
  position: absolute;
  top: 12px;
  right: 12px;
  border: 0;
  background: transparent;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
  color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-enter-active,
.scale-leave-active {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.98);
  opacity: 0;
}

.body::-webkit-scrollbar {
  width: 8px;
}

.body::-webkit-scrollbar-track {
  background: #111;
  border-radius: 8px;
}

.body::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 8px;
}

.body::-webkit-scrollbar-thumb:hover {
  background: #666;
}

/* Firefox */
.body {
  scrollbar-width: thin;
  scrollbar-color: #444 #111;
}
</style>
