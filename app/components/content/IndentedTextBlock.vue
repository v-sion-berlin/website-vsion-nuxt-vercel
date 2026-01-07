<template>
  <div id="text-container">
    <main>
      <section>
        <h2>
          <slot mdc-unwrap="p" />
        </h2>
        <div class="body">
          <slot name="body" />
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
#text-container {
  padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 12vw, 200px)
    clamp(4rem, 5vw, 4rem) clamp(1rem, 12vw, 200px);
  z-index: 200;
  position: relative;
}
</style>
