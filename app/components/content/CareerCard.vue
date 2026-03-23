<template>
  <div id="text-container" class="career-container wrapper">
    <main>
      <section>
        <div class="card" @click="copyEmail()">
          <div>
            <h2 data-reveal>
              <slot mdc-unwrap="p" />
            </h2>
            <div class="body" data-reveal>
              <slot name="body" />
            </div>
          </div>
          <img v-show="!copiedEmail" :src="Arrow" data-reveal />
          <span v-show="copiedEmail" class="copied-msg">Email copied!</span>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import Arrow from "~/assets/ArrowCareer.svg";

const copiedEmail = ref(false);

const copyEmail = () => {
  const emailText = "contact@v-sion.de";

  navigator.clipboard.writeText(emailText).then(() => {
    copiedEmail.value = true;
    setTimeout(() => (copiedEmail.value = false), 2000);
  });
};

useScrollReveal();
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

.card img,
.card span {
  flex: 0 1 5vw;
  width: clamp(1rem, 10vw, 5rem);
}

.copied-msg {
  color: var(--color-primary);
  font-size: clamp(16px, 1.5vw, 20px);
  white-space: pre;
}
</style>
