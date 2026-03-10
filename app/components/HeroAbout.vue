<template>
  <div id="hero" v-if="page">
    <!-- Hero Section -->
    <section id="headline">
      <NuxtImg
        format="webp"
        :src="useImagePath(page.heroImage?.src)"
        class="blur-img"
        loading="eager"
        sizes="sm:640px"
        aria-hidden="true"
        alt=""
      />
      <div class="img">
        <NuxtPicture
          format="avif,webp"
          :src="useImagePath(page.heroImage?.src)"
          loading="eager"
          fetchpriority="high"
          densities="1"
          sizes="sm:640px md:768px lg:1024px xl:1280px 2xl:1536px"
          :alt="page.heroImage?.alt || 'About hero image'"
        />
      </div>
      <div class="wrapper">
        <h1 data-reveal>{{ page?.header }}</h1>
        <h2 data-reveal>{{ page.subTitlePhone }}</h2>
        <h2 data-reveal>{{ page.subTitleMail }}</h2>
      </div>
    </section>

    <!-- Address Cards Section -->
    <div class="wrapper">
      <section id="card-section">
        <div class="card-grid">
          <div class="card" v-if="page.addressBerlin">
            <h3 data-reveal>{{ page.addressBerlin.company }}</h3>
            <p data-reveal>{{ page.addressBerlin.street }}</p>
            <p data-reveal>{{ page.addressBerlin.zip }}</p>
            <p data-reveal v-if="page.addressBerlin.phone">
              T: {{ page.addressBerlin.phone }}
            </p>
            <p data-reveal v-if="page.addressBerlin.fax">
              F: {{ page.addressBerlin.fax }}
            </p>
          </div>

          <div class="card" v-if="page.addressZDF">
            <h3 data-reveal>{{ page.addressZDF.company }}</h3>
            <p data-reveal>{{ page.addressZDF.street }}</p>
            <p data-reveal>{{ page.addressZDF.zip }}</p>
            <p data-reveal v-if="page.addressZDF.phone">
              T: {{ page.addressZDF.phone }}
            </p>
            <p data-reveal v-if="page.addressZDF.fax">
              F: {{ page.addressZDF.fax }}
            </p>
          </div>
        </div>
      </section>

      <!-- Amtsgericht Section -->
      <section id="card-section-long">
        <div>
          <div class="card">
            <p data-reveal>
              {{ page.courtInfo?.text }} <br />
              {{ page.courtInfo?.hrb }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>

  <div v-else>Loading...</div>
</template>

<script setup lang="ts">
import { useImagePath } from "~/composables/useImagePath";
import type { AboutPage } from "~/types/content";

const props = defineProps<{
  page: AboutPage;
}>();

useScrollReveal();
</script>

<style scoped>
#hero {
  position: relative;
  overflow-x: hidden;
  min-height: clamp(500px, 90vw, 2500px);
}

#hero #headline {
  position: relative;
  padding: clamp(10rem, 12vw, 13.75rem) clamp(1rem, 10vw, 19.125rem)
    clamp(2rem, 5vw, 4rem) 0;
}

.img,
.blur-img {
  position: absolute;
  top: clamp(260px, 25vw, 600px);
  left: 50%;
  width: clamp(40%, 60%, 80%);
}

.img {
  transform: translateX(15%);
  z-index: -100;
}

.img :deep(img) {
  width: 100%;
  height: auto;
  display: block;
}

.blur-img {
  transform: translate(-50%, 50%);
  z-index: -150;
  filter: blur(30px);
}

h1 {
  color: var(--color-text);
  font-size: clamp(32px, 6vw, 124px);
  font-family: Montserrat, sans-serif;
  font-weight: 500;
  margin: 0;
  z-index: 30;
  max-width: 90%;
  position: relative;
}

h2 {
  color: var(--color-text);
  font-size: clamp(16px, 4vw, 100px);
  font-family: Montserrat, sans-serif;
  font-weight: 500;
  z-index: 30;
  max-width: 70%;
  position: relative;
}

h3 {
  color: var(--color-text);
  font-size: clamp(16px, 2vw, 48px);
  font-family: Montserrat, sans-serif;
  font-weight: 500;
  margin: 0;
  z-index: 30;
  position: relative;
}

p {
  margin-bottom: 0;
  font-size: clamp(10px, 2vw, 32px);
}

#card-section {
  padding-top: clamp(10rem, 12vw, 13.75rem);
  padding-bottom: 2rem;
}

.card-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
}

.card {
  background-color: var(--color-grey-card);
  backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: 48px;
  flex: 1 1 200px;
}

#card-section-long {
  padding-bottom: clamp(2rem, 4vw, 4rem);
}

#card-section-long .card {
  flex: 1;
}

#card-section-long p {
  margin: 0;
}

h2:first-of-type {
  margin-top: 2rem;
  margin-bottom: 0;
}
h2 {
  margin-top: 0;
}
</style>
