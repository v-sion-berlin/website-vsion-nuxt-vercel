<template>
  <div id="text-container" class="career-container">
    <main>
      <section>
        <div class="card">
          <div>
            <h2>
              <slot mdc-unwrap="p" />
            </h2>
            <div class="body">
              <slot name="body" />
            </div>
          </div>
          <img :src="Arrow" v-if="Arrow" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import Arrow from "~/assets/ArrowCareer.svg";
</script>

<style scoped>
.career-container {
  z-index: 200;
  position: relative;
}

section {
  display: flex;
}

.card {
  background-color: var(--color-grey-card);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: clamp(2rem, 4vw, 3rem) clamp(4rem, 8vw, 6rem) clamp(2rem, 4vw, 3rem)
    clamp(2.5rem, 5vw, 3.5rem);
  display: flex;
  gap: clamp(1rem, 10vw, 10rem);
  cursor: pointer;
  transition: all 0.3s ease;
  flex-wrap: wrap;
  align-items: center;
}

.card:hover {
  filter: brightness(1.5);
}

.card > div {
  flex: 1 1 300px;
}

.card img {
  flex: 0 1 5vw;
  width: clamp(1rem, 10vw, 5rem);
}
</style>
