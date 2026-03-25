<template>
  <div class="error-page">
    <h1 class="error-code">{{ error?.status ?? 404 }}</h1>
    <p class="error-message">
      {{ error?.status === 404 ? "Page not found" : "Something went wrong" }}
    </p>
    <NuxtLink to="/" class="error-link">Back to Home</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();
</script>

<style scoped>
.error-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  font-family: "Montserrat", sans-serif;
  background-color: var(--color-background, #000);
  color: var(--color-text, #fff);
  text-align: center;
  padding: 2rem;
}

.error-code {
  font-size: clamp(4rem, 15vw, 10rem);
  font-weight: 700;
  margin: 0;
  color: var(--color-primary, #ff0751);
}

.error-message {
  font-size: clamp(1rem, 3vw, 1.5rem);
  font-weight: 400;
  margin: 1rem 0 2rem;
  color: var(--color-text-secondary, #767676);
}

.error-link {
  padding: 12px 32px;
  border: 2px solid var(--color-primary, #ff0751);
  border-radius: 16px;
  color: var(--color-text, #fff);
  font-family: "Montserrat", sans-serif;
  font-size: 1rem;
  text-decoration: none;
  transition: background-color 0.2s ease;
}

.error-link:hover {
  background-color: var(--color-primary, #ff0751);
  color: var(--color-text, #fff);
}
</style>
