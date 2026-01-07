import { defineContentConfig, defineCollection, property } from "@nuxt/content";
import { z } from "zod";

const listItemSchema = z.object({
  title: z.string(),
  color: z.string(),
});

// --- Home Page ---
const homePageSchema = z.object({
  // --- Hero Section ---
  type: z.literal("home"),
  hero: z.string(),
  heroImage: z
    .object({
      src: property(z.string()).editor({ input: "media" }),
      alt: z.string(),
    })
    .optional(),

  // --- Interview Section ---
  interview: z
    .object({
      header: z.string(),
      body_text: z.string(),
      body_part_2: z.string(),
      source_text: z.string(),
      watch_text: z.string(),
    })
    .optional(),

  // --- Textblocks Section ---
  textblocks: z
    .object({
      live: z.object({
        header: z.string(),
        body_text: z.string(),
      }),
      anspruch: z.object({
        header: z.string(),
        body_text: z.string(),
        button: z.string(),
        button_soon: z.string(),
      }),
      marken: z.object({
        header: z.string(),
        body_text: z.string(),
        button: z.string(),
      }),
      leistungen: z.object({
        header: z.string(),
        body_text: z.string(),
      }),
    })
    .optional(),

  // Lists
  lists: z
    .object({
      studio: listItemSchema,
      news: listItemSchema,
      sport: listItemSchema,
      code: listItemSchema,
      interaction: listItemSchema,
      operations: listItemSchema,
      storytelling: listItemSchema,
      infographics: listItemSchema,
    })
    .optional(),
});

// --- Projects Overview Page ---
const projectsOverviewSchema = z.object({
  type: z.literal("projects"),
  header: z.string().optional(),
  slug: z.string().optional(),
});

// --- Project schema ---
const projectSchema = z.object({
  type: z.literal("project"),
  header: z.string().optional(),
  slug: z.string().optional(),
  projectsHeader: z.string().optional(),
  coverImage: z
    .object({
      src: property(z.string()).editor({ input: "media" }),
      alt: z.string(),
    })
    .optional(),
  detailImage: z
    .object({
      src: property(z.string()).editor({ input: "media" }),
      alt: z.string(),
    })
    .optional(),
  table: z
    .object({
      header: z
        .object({
          firstCol: z.string(),
          secondCol: z.string(),
        })
        .optional(),
      tasks: z.array(z.string()).optional(),
      technologies: z.array(z.string()).optional(),
    })
    .optional(),
  sliderImages: z
    .array(
      z.object({
        src: property(z.string()).editor({ input: "media" }),
        alt: z.string(),
        title: z.string(),
      })
    )
    .optional(),
});

// --- Team Page ---
const teamPageSchema = z.object({
  type: z.literal("team"),
  headerLine1: z.string().optional(),
  headerLine2: z.string().optional(),
  cursivWord1: z.string().optional(),
  cursivWord2: z.string().optional(),
  images: z
    .array(
      z.object({
        src: property(z.string()).editor({ input: "media" }),
        alt: z.string(),
        text: z.string(),
        alignment: z.string(),
      })
    )
    .optional(),
});

// --- About Page ---
const aboutPageSchema = z.object({
  type: z.literal("about"),
  header: z.string().optional(),
  subTitle: z.string().optional(),
  heroImage: z
    .object({
      src: property(z.string()).editor({ input: "media" }),
      alt: z.string(),
    })
    .optional(),
  addressBerlin: z
    .object({
      company: z.string(),
      street: z.string(),
      zip: z.string(),
      phone: z.string(),
      fax: z.string(),
    })
    .optional(),
  addressZDF: z
    .object({
      company: z.string(),
      street: z.string(),
      zip: z.string(),
      phone: z.string(),
      fax: z.string(),
    })
    .optional(),
  courtInfo: z
    .object({
      text: z.string(),
      hrb: z.string(),
    })
    .optional(),
});

// --- Contact Component ---
const contactSchema = z.object({
  type: z.literal("contact"),
  header: z.string(),
  button: z.string(),
  button_copied: z.string(),
  legal: z.object({
    liability: z.object({
      legal_ceo: z.string(),
      legal_liability_desc: z.string(),
      legal_liability_header: z.string(),
      legal_liability_body: z.string(),
      legal_liability_image_header: z.string(),
      legal_liability_image_hero: z.string(),
      legal_liability_image_claim: z.string(),
      legal_liability_adress: z.object({
        company: z.string(),
        street: z.string(),
        zip: z.string(),
        phone: z.string(),
        fax: z.string(),
        email: z.string(),
      }),
    }),
  }),
});

// --- Services Page ---
const servicesPageSchema = z.object({
  type: z.literal("services"),
  header: z.string().optional(),
  heroImage: z
    .object({
      src: property(z.string()).editor({ input: "media" }),
      alt: z.string(),
    })
    .optional(),
  menu: z
    .object({
      items: z.array(z.string()).optional(),
    })
    .optional(),
});

// --- Career Page ---
const careerPageSchema = z.object({
  type: z.literal("career"),
  header: z.string().optional(),
  heroImage: z
    .object({
      src: property(z.string()).editor({ input: "media" }),
      alt: z.string(),
    })
    .optional(),
  careerImage1: z
    .object({
      src: property(z.string()).editor({ input: "media" }),
      alt: z.string(),
    })
    .optional(),
  careerImage2: z
    .object({
      src: property(z.string()).editor({ input: "media" }),
      alt: z.string(),
    })
    .optional(),
  smallCards: z
    .array(
      z.object({
        header: z.string(),
        text: z.string(),
      })
    )
    .optional(),
});

export default defineContentConfig({
  collections: {
    // HOME
    home_en: defineCollection({
      type: "page",
      source: { include: "en/index.md", prefix: "/" },
      schema: homePageSchema,
    }),
    home_de: defineCollection({
      type: "page",
      source: { include: "de/index.md", prefix: "/" },
      schema: homePageSchema,
    }),

    // SERVICES
    services_en: defineCollection({
      type: "page",
      source: { include: "en/services.md", prefix: "/" },
      schema: servicesPageSchema,
    }),
    services_de: defineCollection({
      type: "page",
      source: { include: "de/services.md", prefix: "/" },
      schema: servicesPageSchema,
    }),

    // TEAM
    team_en: defineCollection({
      type: "page",
      source: { include: "en/team.md", prefix: "/" },
      schema: teamPageSchema,
    }),

    team_de: defineCollection({
      type: "page",
      source: { include: "de/team.md", prefix: "/" },
      schema: teamPageSchema,
    }),

    // CAREER
    career_en: defineCollection({
      type: "page",
      source: { include: "en/career.md", prefix: "/" },
      schema: careerPageSchema,
    }),

    career_de: defineCollection({
      type: "page",
      source: { include: "de/career.md", prefix: "/" },
      schema: careerPageSchema,
    }),

    // PROJECTS OVERVIEW
    projects_overview_en: defineCollection({
      type: "page",
      source: { include: "en/projects/index.md", prefix: "/" },
      schema: projectsOverviewSchema,
    }),

    projects_overview_de: defineCollection({
      type: "page",
      source: { include: "de/projects/index.md", prefix: "/" },
      schema: projectsOverviewSchema,
    }),

    // PROJECTS DETAILS
    projects_en: defineCollection({
      type: "page",
      source: { include: "en/projects/**", prefix: "/projects" },
      schema: projectSchema,
    }),
    projects_de: defineCollection({
      type: "page",
      source: { include: "de/projects/**", prefix: "/de/projects" },
      schema: projectSchema,
    }),

    // ABOUT
    about_en: defineCollection({
      type: "page",
      source: { include: "en/about.md", prefix: "/" },
      schema: aboutPageSchema,
    }),
    about_de: defineCollection({
      type: "page",
      source: { include: "de/about.md", prefix: "/" },
      schema: aboutPageSchema,
    }),

    // CONTACT COMPONENT
    contact_en: defineCollection({
      type: "data",
      source: { include: "en/contact.md", prefix: "/" },
      schema: contactSchema,
    }),
    contact_de: defineCollection({
      type: "data",
      source: { include: "de/contact.md", prefix: "/" },
      schema: contactSchema,
    }),
  },
});
