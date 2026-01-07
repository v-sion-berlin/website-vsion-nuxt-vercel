<template>
  <div id="text-container">
    <main>
      <section>
        <h2>{{ page.textblock_marken_header }}</h2>
        <p>
          {{ page.textblock_marken_body }}
        </p>
      </section>

      <section id="logo-grid">
        <div>
          <img :src="DW" alt="DW" />
        </div>
        <div>
          <img :src="ARD" alt="ARD" />
        </div>
        <div>
          <img :src="ZDF" alt="ZDF" />
        </div>
        <div>
          <img :src="DreiSAT" alt="3SAT" />
        </div>
        <div>
          <img :src="SWR" alt="SWR" />
        </div>
        <div>
          <img :src="RBB" alt="RBB" />
        </div>
        <div>
          <img :src="RTL" alt="RTL" />
        </div>
        <div>
          <img :src="NTV" alt="NTV" />
        </div>
        <div>
          <img :src="Welt" alt="Welt" />
        </div>
        <div>
          <img :src="PRO7" alt="PRO7" />
        </div>
        <div>
          <img :src="SAT1" alt="SAT.1" />
        </div>
        <div>
          <img :src="KABEL1" alt="Kabel1" />
        </div>
        <div>
          <img :src="SVT" alt="SVT" />
        </div>
        <NuxtLink :to="localizedPath()" class="menu-link">
          <div>
            <p>{{ page.textblock_marken_button }}</p>
          </div>
        </NuxtLink>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import RBB from "~/assets/RBB.svg";
import SAT1 from "~/assets/SAT1.svg";
import SVT from "~/assets/SVT.svg";
import SWR from "~/assets/SWR.svg";
import Welt from "~/assets/Welt.svg";
import ZDF from "~/assets/ZDF.svg";
import DW from "~/assets/DW.svg";
import DreiSAT from "~/assets/3SAT.svg";
import ARD from "~/assets/ARD.svg";
import KABEL1 from "~/assets/KABEL1.svg";
import NTV from "~/assets/NTV.svg";
import PRO7 from "~/assets/PRO7.svg";
import RTL from "~/assets/RTL.svg";
const { locale } = useI18n();

interface Marken {
  textblock_marken_header: string;
  textblock_marken_body: string;
  textblock_marken_button: string;
}
const props = defineProps<{
  page: Marken;
}>();

function localizedPath() {
  const isGerman = locale.value === "de";
  return isGerman ? `/de/projects/` : `/projects/`;
}
</script>

<style scoped>
section {
  margin-top: clamp(2rem, 8vw, 9rem);
}

.menu-link {
  color: inherit;
}

#logo-grid {
  margin-top: 5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(288px, 100%), 1fr));
  gap: clamp(1rem, 1.5rem, 2rem);
  justify-items: center;
  align-items: center;
  box-sizing: border-box;
  max-width: 100%;
}

#logo-grid img {
  max-width: clamp(60px, 80px, 100px);
  height: auto;
  opacity: 0.9;
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

#logo-grid > div {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-grey-card);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px); /* Safari support */
  cursor: pointer;
  border-radius: 16px;
  width: 100%;
  height: clamp(100px, 12vw, 120px);
  transition:
    background 0.3s ease,
    color 0.3s ease,
    transform 0.3s ease;
}

#logo-grid .menu-link {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--color-background);
  cursor: pointer;
  border-radius: 16px;
  outline: 2px solid var(--color-primary);
  width: 100%;
  height: clamp(100px, 12vw, 120px);
  transition: background 0.3s ease;
}

#logo-grid div:hover img {
  opacity: 1;
  transform: scale(1.2);
}

#logo-grid div:hover,
#logo-grid .menu-link:hover {
  background-color: var(--color-primary);
}
</style>
