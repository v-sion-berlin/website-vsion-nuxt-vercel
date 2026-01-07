<template>
  <div id="text-container">
    <main>
      <section>
        <div>
          <h2>
            {{ page.textblock_anspruch_header }}
          </h2>
          <p>
            {{ page.textblock_anspruch_body }}
          </p>
          <NuxtLink :to="localizedPath()">
            <div id="contact-btn-copy">
              <p>{{ page.textblock_anspruch_button }}</p>
            </div>
          </NuxtLink>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n();

interface Anspruch {
  textblock_anspruch_header: string;
  textblock_anspruch_body: string;
  textblock_anspruch_button: string;
  textblock_anspruch_button_soon: string;
}
const props = defineProps<{
  page: Anspruch;
}>();

function localizedPath() {
  const isGerman = locale.value === "de";
  return isGerman ? `/de/team/` : `/team/`;
}
</script>

<style scoped>
h2 {
  font-weight: 500;
  font-size: clamp(32px, 5vw, 64px);
  line-height: clamp(40px, 6vw, 80px);
  margin-bottom: 32px;
}

p {
  font-size: clamp(16px, 2.5vw, 24px);
  font-weight: 500;
  line-height: clamp(24px, 3vw, 40px);
}

section {
  display: flex;
  flex-wrap: wrap;
  gap: 5rem;
  align-items: flex-start;
}

section img {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  object-fit: cover;
  object-position: center bottom;
  transition: transform 0.3s ease;
}

.image-container {
  flex: 1 1 420px;
  max-width: min(100%, 420px);
  height: 560px;
  overflow: hidden;
}

section div:last-child {
  flex: 1 1 280px;
}

#contact-btn-copy {
  font-size: clamp(16px, 2vw, 20px);
  margin-top: 1rem;
  border: 2px solid var(--color-primary);
  border-radius: 16px;
  background: transparent;
  color: white;
  padding: clamp(12px, 2vw, 16px) clamp(24px, 3vw, 32px);
  cursor: pointer;
  transition:
    background 0.3s ease,
    color 0.3s ease;
}

#contact-btn-copy:hover {
  background: var(--color-primary);
}

div a {
  display: inline-flex;
}
</style>
