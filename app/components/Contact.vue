<template>
  <client-only>
    <div id="contact-section" class="wrapper">
      <div class="contact-left">
        <h2>{{ page.header }}</h2>
        <div class="button-container">
          <button id="contact-btn-copy" @click="copyEmail('button')">
            {{ page.button }}
          </button>
          <div
            v-if="copiedButton"
            class="button-container"
            style="gap: 4px; text-align: center"
          >
            <img :src="WhiteCheck" class="check" />
            <span class="copied-msg">{{ page.button_copied }}</span>
          </div>
        </div>
      </div>

      <div class="contact-right">
        <div class="info-box-first">
          <LegalLinksVue :page="page" />
          <p class="light">©2025, v-sion GmbH.<br />All rights reserved.</p>
        </div>

        <a class="info-box" href="tel:+491234567890">
          <img class="icon" :src="Phone" alt="phone" />
          <div>+49 (0)30 29 38 19 28</div>
        </a>

        <a class="info-box" @click="copyEmail('email')">
          <img class="icon" :src="Email" alt="email" />
          <div ref="emailEl">
            <span v-if="copiedEmail" class="email-copied">{{
              page.button_copied
            }}</span>
            <span v-else>contact@v-sion.de</span>
          </div>
        </a>

        <a
          href="https://www.linkedin.com/feed/update/urn:li:activity:7313186482737897472/"
          target="_blank"
          rel="noopener noreferrer"
          class="info-box"
        >
          <img class="icon-linkedin" :src="LinkedIn" alt="linkedin" />
          <span>LinkedIn</span>
        </a>
      </div>
    </div>
  </client-only>
</template>

<script setup lang="ts">
import { ref } from "vue";
import LegalLinksVue from "./LegalLinks.vue";
import Phone from "~/assets/Phone.svg";
import Email from "~/assets/Email.svg";
import LinkedIn from "~/assets/logo_linkedin.svg";
import WhiteCheck from "~/assets/White_checkmark.svg";
import type { ContactData } from "~/types/content";

const emailEl = ref<HTMLAnchorElement | null>(null);

const props = defineProps<{
  page: ContactData;
}>();

const copiedButton = ref(false);
const copiedEmail = ref(false);

function copyEmail(source: "button" | "email") {
  const emailText = emailEl.value?.textContent ?? "contact@v-sion.de";

  navigator.clipboard.writeText(emailText).then(() => {
    if (source === "button") {
      copiedButton.value = true;
      setTimeout(() => (copiedButton.value = false), 2000);
    } else if (source === "email") {
      copiedEmail.value = true;
      setTimeout(() => (copiedEmail.value = false), 2000);
    }
  });
}
</script>

<style scoped>
#contact-section {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: clamp(2rem, 5vw, 6rem);
  padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 10vw, 19.125rem)
    clamp(2rem, 5vw, 4rem) clamp(1rem, 5vw, 5.625rem);
  background-color: #000;
  color: #fff;
  position: relative;
}

.contact-left,
.contact-right {
  flex: 1 1 300px;
}

.contact-left h2 {
  font-size: clamp(1.5rem, 4vw, 3rem);
  line-height: clamp(2rem, 5vw, 4rem);
  font-weight: 500;
  margin-top: 0;
}

#contact-btn-copy {
  font-size: clamp(16px, 2vw, 20px);
  border: 2px solid var(--color-primary);
  border-radius: 16px;
  background: transparent;
  color: var(--color-text);
  padding: clamp(12px, 2vw, 16px) clamp(24px, 3vw, 32px);
  cursor: pointer;
  transition:
    background 0.3s ease,
    color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

#contact-btn-copy:hover {
  background: var(--color-primary);
  color: var(--color-text);
}

.button-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.copied-msg {
  font-size: clamp(16px, 1.5vw, 20px);
  color: var(--color-text);
}

.email-copied {
  color: var(--color-primary);
}

.contact-right {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 288px;
}

.light {
  font-weight: 300;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 1px;
  margin-bottom: 0px;
  margin-top: 40px;
}

.info-box-first {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-grey);
  border-radius: 16px;
  padding: 24px 32px;
  font-size: 18px;
  background-color: var(--color-grey-card);
  margin-bottom: 16px;
}

.info-box {
  display: flex;
  align-items: center;
  border: 1px solid var(--color-grey);
  border-radius: 16px;
  padding: 19px 24px;
  font-size: 18px;
  background-color: var(--color-grey-card);
  cursor: pointer;
}

.icon {
  margin-right: 16px;
}

.icon-linkedin {
  margin-right: 16px;
  width: 24px;
  height: 24px;
}

.check {
  width: 20px;
  height: 20px;
}
</style>
