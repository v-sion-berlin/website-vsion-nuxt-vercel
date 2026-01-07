// types/content.ts

export interface Media {
  src: string;
  alt: string;
}

export interface ListItem {
  title: string;
  color?: string;
}

export interface Project {
  type: "project";
  header?: string;
  slug?: string;
  coverImage?: { src: string; alt: string };
}

export interface HomePage {
  type: "home";
  hero: string;
  heroImage?: {
    src: string;
    alt: string;
  };

  lists: {
    studio: ListItem;
    news: ListItem;
    sport: ListItem;
    code: ListItem;
    interaction: ListItem;
    operations: ListItem;
    storytelling: ListItem;
    infographics: ListItem;
  };

  interview: {
    header: string;
    body_text: string;
    body_part_2: string;
    source_text: string;
    watch_text: string;
  };

  textblocks: {
    live: {
      header: string;
      body_text: string;
    };
    anspruch: {
      header: string;
      body_text: string;
      button: string;
      button_soon: string;
    };
    marken: {
      header: string;
      body_text: string;
      button: string;
    };
    leistungen: {
      header: string;
      body_text: string;
    };
  };
}

export interface ContactData {
  header: string;
  button: string;
  button_copied: string;
  legal: {
    liability: {
      legal_ceo: string;
      legal_liability_desc: string;
      legal_liability_header: string;
      legal_liability_body: string;
      legal_liability_image_header: string;
      legal_liability_image_hero: string;
      legal_liability_image_claim: string;
      legal_liability_adress: Address;
    };
    dataprot: {
      legal_dataprot_desc: string;
      legal_dataprot_intro: string;
      legal_dataprot_responsible_header: string;
      legal_dataprot_types_header: string;
      legal_dataprot_types_body: string;
      legal_dataprot_subjects_header: string;
      legal_dataprot_subjects_body: string;
      legal_dataprot_purpose_header: string;
      legal_dataprot_purpose_body: string;
      legal_dataprot_terms_header: string;
      legal_dataprot_terms_body: string;
      legal_dataprot_law_header: string;
      legal_dataprot_law_body: string;
      legal_dataprot_security_header: string;
      legal_dataprot_security_body: string;
      legal_dataprot_processors_header: string;
      legal_dataprot_processors_body: string;
      legal_dataprot_foreign_header: string;
      legal_dataprot_foreign_body: string;
      legal_dataprot_rights_header: string;
      legal_dataprot_rights_body: string;
      legal_dataprot_revoke_header: string;
      legal_dataprot_revoke_body: string;
      legal_dataprot_object_header: string;
      legal_dataprot_object_body: string;
      legal_dataprot_cookies_header: string;
      legal_dataprot_cookies_body: string;
      legal_dataprot_delete_header: string;
      legal_dataprot_delete_body: string;
      legal_dataprot_business_header: string;
      legal_dataprot_business_body: string;
      legal_dataprot_agency_header: string;
      legal_dataprot_agency_body: string;
      legal_dataprot_contract_header: string;
      legal_dataprot_contract_body: string;
      legal_dataprot_admin_header: string;
      legal_dataprot_admin_body: string;
      legal_dataprot_analysis_header: string;
      legal_dataprot_analysis_body: string;
      legal_dataprot_applicant_header: string;
      legal_dataprot_applicant_body: string;
      legal_dataprot_contact_header: string;
      legal_dataprot_contact_body: string;
      legal_dataprot_hosting_header: string;
      legal_dataprot_hosting_body: string;
      legal_dataprot_logfiles_header: string;
      legal_dataprot_logfiles_body: string;
      legal_dataprot_gtm_header: string;
      legal_dataprot_gtm_body: string;
      legal_dataprot_ga_header: string;
      legal_dataprot_ga_body: string;
      legal_dataprot_social_header: string;
      legal_dataprot_social_body: string;
      legal_dataprot_thirdparty_header: string;
      legal_dataprot_thirdparty_body: string;
      legal_dataprot_vimeo_header: string;
      legal_dataprot_vimeo_body: string;
      legal_dataprot_fonts_header: string;
      legal_dataprot_fonts_body: string;
      legal_dataprot_maps_header: string;
      legal_dataprot_maps_body: string;
      legal_dataprot_twitter_header: string;
      legal_dataprot_twitter_body: string;
      legal_dataprot_xing_header: string;
      legal_dataprot_xing_body: string;
      legal_dataprot_linkedin_header: string;
      legal_dataprot_linkedin_body: string;
      legal_dataprot_generator_footer: string;
    };
  };
}

export interface Address {
  company: string;
  street: string;
  zip: string;
  phone?: string;
  fax?: string;
  email?: string;
}

export interface CourtInfo {
  text: string;
  hrb: string;
}

export interface AboutPage {
  type: "about";
  header?: string;
  subTitle?: string;
  heroImage?: Media;
  addressBerlin?: Address;
  addressZDF?: Address;
  courtInfo?: CourtInfo;
}

export interface ServicesPage {
  type: "services";
  header?: string;
  heroImage?: Media;
}
