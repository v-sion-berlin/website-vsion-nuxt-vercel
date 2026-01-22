<template>
  <div id="text-container" class="wrapper">
    <main>
      <section>
        <h2 data-reveal>
          <slot mdc-unwrap="p" />
        </h2>
        <div class="body" data-reveal>
          <slot name="body" />
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
#text-container {
  padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 10vw, 19.125rem)
    clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 5.625rem);
  z-index: 200;
  position: relative;
}
</style>
