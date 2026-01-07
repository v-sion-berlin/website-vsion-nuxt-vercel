<template>
  <div class="legal-links">
    <div class="link-wrapper">
      <button type="button" class="link" @click="impressumOpen = true">
        {{ page.legal.liability.legal_liability_desc }}
      </button>
      <button type="button" class="link" @click="datenschutzOpen = true">
        {{ page.legal.dataprot.legal_dataprot_desc }}
      </button>
    </div>

    <Modal
      v-model="impressumOpen"
      :title="page.legal.liability.legal_liability_desc"
    >
      <p>
        {{ page.legal.liability.legal_liability_adress.company }}<br />
        {{ page.legal.liability.legal_liability_adress.street }}<br />
        {{ page.legal.liability.legal_liability_adress.zip }}
      </p>
      <p>
        T: {{ page.legal.liability.legal_liability_adress.phone }}<br />
        F: {{ page.legal.liability.legal_liability_adress.fax }}
      </p>
      <p>E: {{ page.legal.liability.legal_liability_adress.email }}</p>
      <p>
        Amtsgericht Berlin Charlottenburg<br />
        HRB 119 647
      </p>
      <p>
        {{ page.legal.liability.legal_ceo }}:<br />
        Albrecht Richter <br />Henning Tilp
      </p>
      <p>Finanzamt für Körperschaften II <br />USt-IdNr.: DE123456789</p>
      <br />
      <h3>{{ page.legal.liability.legal_liability_header }}</h3>
      <p>
        {{ page.legal.liability.legal_liability_body }}
      </p>
      <h3>{{ page.legal.liability.legal_liability_image_header }}</h3>
      <p>
        {{ page.legal.liability.legal_liability_image_hero }}
        <a
          href="https://unsplash.com/de/@joshuahanson43"
          target="_blank"
          rel="noopener noreferrer"
          >Unsplash</a
        >
      </p>
      <p>
        {{ page.legal.liability.legal_liability_image_claim }}
        <a
          href="https://unsplash.com/de/@dillonjshook"
          target="_blank"
          rel="noopener noreferrer"
          >Unsplash</a
        >
      </p>
    </Modal>

    <Modal
      v-model="datenschutzOpen"
      :title="page.legal.dataprot.legal_dataprot_desc"
    >
      <p>
        {{ page.legal.dataprot.legal_dataprot_intro }}
      </p>
      <h3>{{ page.legal.dataprot.legal_dataprot_responsible_header }}</h3>
      <p>
        v-sion GmbH <br />
        Warschauer Straße 59a <br />
        10243 Berlin
      </p>
      <p>
        T: +49 (0)30 29 38 19 28<br />
        F: +49 (0)30 29 38 19 18
      </p>
      <p>E: contact@v-sion.de</p>
      <p>
        {{ page.legal.liability.legal_ceo }}:<br />
        Albrecht Richter <br />Henning Tilp
      </p>
      <h3>{{ page.legal.dataprot.legal_dataprot_types_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_types_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_subjects_header }}</h3>
      <p>{{ page.legal.dataprot.legal_dataprot_subjects_body }}</p>

      <h3>{{ page.legal.dataprot.legal_dataprot_purpose_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_purpose_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_terms_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_terms_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_law_header }}</h3>
      <p>{{ page.legal.dataprot.legal_dataprot_law_body }}</p>

      <h3>{{ page.legal.dataprot.legal_dataprot_security_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_security_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_processors_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_processors_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_foreign_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_foreign_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_rights_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_rights_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_revoke_header }}</h3>
      <p>{{ page.legal.dataprot.legal_dataprot_revoke_body }}</p>

      <h3>{{ page.legal.dataprot.legal_dataprot_object_header }}</h3>
      <p>{{ page.legal.dataprot.legal_dataprot_object_body }}</p>

      <h3>{{ page.legal.dataprot.legal_dataprot_cookies_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_cookies_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_delete_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_delete_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_business_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_business_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_agency_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_agency_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_contract_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_contract_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_admin_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_admin_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_analysis_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_analysis_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_applicant_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_applicant_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_contact_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_contact_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_hosting_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_hosting_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_logfiles_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_logfiles_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_gtm_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_gtm_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_ga_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_ga_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_social_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_social_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_thirdparty_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_thirdparty_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_vimeo_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_vimeo_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_fonts_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_fonts_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_maps_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_maps_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_twitter_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_twitter_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_xing_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_xing_body" />

      <h3>{{ page.legal.dataprot.legal_dataprot_linkedin_header }}</h3>
      <SafeHtml :html="page.legal.dataprot.legal_dataprot_linkedin_body" />

      <p>
        <a
          href="https://datenschutz-generator.de/"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ page.legal.dataprot.legal_dataprot_generator_footer }}
        </a>
      </p>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Modal from "./Modal.vue";
import SafeHtml from "./SafeHtml.vue";
import type { ContactData } from "~/types/content";

const impressumOpen = ref(false);
const datenschutzOpen = ref(false);

const props = defineProps<{
  page: ContactData;
}>();
</script>

<style scoped>
p {
  font-size: 1em;
  line-height: 1.5em;
}

.legal-links {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.link {
  background: none;
  border: 0;
  padding: 0;
  font: inherit;
  text-decoration: none;
  cursor: pointer;
  font-weight: 500;
  font-size: 16px;
  line-height: 26px;
  letter-spacing: 1px;
  color: var(--color-text);
}

.link-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;
}
</style>
