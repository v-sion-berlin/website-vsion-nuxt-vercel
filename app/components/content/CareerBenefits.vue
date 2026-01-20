<template>
  <section class="cards-benefits wrapper">
    <div class="cards-grid">
      <h1>
        <slot name="cardHeader" mdc-unwrap="p" />
      </h1>
      <div v-for="(card, i) in cards" :key="i" class="card">
        <h2>{{ card.header }}</h2>
        <p>{{ card.text }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  cards?: { header: string; text: string }[];
}>();
</script>

<style scoped>
.cards-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(3, auto);
  gap: 1.5em;
  position: relative;
}

.card:nth-child(1) {
  grid-area: 3 / 2 / 4 / 3;
}
.card:nth-child(2) {
  grid-area: 2 / 1 / 3 / 2;
}

.card:nth-child(4) {
  grid-area: 1 / 2 / 2 / 3;
}
.card:nth-child(3) {
  grid-area: 3 / 1 / 4 / 2;
}
.card:nth-child(5) {
  grid-area: 2 / 2 / 3 / 3;
}

.card:nth-child(3),
.card:nth-child(2) {
  transform: translateY(-15rem);
}

.card {
  background-color: var(--color-grey-card);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 16px;
  padding: clamp(2rem, 4vw, 3rem) clamp(2rem, 4vw, 3rem) clamp(2rem, 4vw, 3rem)
    clamp(2rem, 4vw, 3rem);
}

.cards-benefits {
  padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 10vw, 19.125rem)
    clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 5.625rem);
}

h1,
h2,
p {
  font-weight: 500;
  word-wrap: break-word;
  max-width: 100%;
}

.cards-benefits h1 {
  font-size: clamp(1.5rem, 6vw, 64px);
  line-height: clamp(2rem, 6vw, 80px);
  margin-top: -3.5rem;
}

.cards-benefits h2 {
  font-size: clamp(1.5rem, 3.5vw, 46px);
  margin-bottom: 1.5rem;
  margin-top: 0;
}

.cards-benefits p {
  font-size: clamp(1rem, 2vw, 24px);
  line-height: clamp(1.5rem, 3vw, 40px);
  margin: 0;
}

@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .card {
    grid-area: auto !important;
    transform: none !important;
  }
}
</style>
