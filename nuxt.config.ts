// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@nuxtjs/i18n",
    "nuxt-studio",
  ],
  i18n: {
    defaultLocale: "en",
    strategy: "prefix_except_default",
    detectBrowserLanguage: false,
    locales: [
      { code: "en", name: "English", language: "en-US" },
      { code: "de", name: "Deutsch", language: "de-DE" },
    ],
  },
  content: {
    preview: {
      api: "https://api.nuxt.studio",
    },
    experimental: { sqliteConnector: "native" },
  },
  studio: {
    route: "/admin",
    dev: false,
    repository: {
      provider: "github",
      owner: "v-sion-berlin",
      repo: "website-vsion-nuxt-vercel",
      branch: "main",
      private: false,
    },
  },
  fonts: {
    families: [
      {
        name: "Montserrat",
        provider: "google",
        weights: [400, 500, 700],
        display: "swap",
      },
    ],
  },
  routeRules: {
    "/": { prerender: true },
    "/about": { prerender: true },
    "/services": { prerender: true },
    "/team": { prerender: true },
    "/career": { prerender: true },
    "/projects": { prerender: true },
    "/projects/**": { prerender: true },
    "/de": { prerender: true },
    "/de/**": { prerender: true },
  },
  nitro: {
    // preset: "github_pages",
    preset: "vercel",
    prerender: {
      routes: ["/"],
      crawlLinks: true,
    },
  },

  css: [],

  app: {
    // baseURL: process.env.NUXT_APP_BASE_URL || "/",
    baseURL: "/",
    head: {
      title: "v-sion",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },

        // Open Graph
        { property: "og:title", content: "v-sion" },
        {
          property: "og:description",
          content:
            "Excellent design and pioneering technology powering today’s live content delivery",
        },
        { property: "og:image", content: "https://www.v-sion.de/OG_Image.jpg" },
        { property: "og:url", content: "https://www.v-sion.de" },
        { property: "og:type", content: "website" },

        // Twitter
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "v-sion" },
        {
          name: "twitter:description",
          content:
            "Excellent design and pioneering technology powering today’s live content delivery",
        },
        {
          name: "twitter:image",
          content: "https://www.v-sion.de/OG_Image.jpg",
        },
      ],
      link: [
        // Favicon (light)
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon-black.svg",
          media: "(prefers-color-scheme: light)",
          sizes: "any",
        },
        // Favicon (dark)
        {
          rel: "icon",
          type: "image/svg+xml",
          href: "/favicon.svg",
          media: "(prefers-color-scheme: dark)",
          sizes: "any",
        },
        // PNG fallback
        {
          rel: "icon",
          type: "image/png",
          href: "/favicon-96x96.png",
          sizes: "96x96",
        },
        // Classic favicon (important!)
        {
          rel: "icon",
          href: "/favicon.ico",
          sizes: "any",
        },
        // Safari pinned tab
        {
          rel: "mask-icon",
          href: "/safari-pinned-tab.svg",
          color: "#000000",
        },
        // Apple touch icon (placeholder)
        {
          rel: "apple-touch-icon",
          sizes: "180x180",
          href: "/apple-touch-icon.png",
        },
        // Web manifest
        { rel: "manifest", href: "/site.webmanifest" },
      ],
    },
  },
});
