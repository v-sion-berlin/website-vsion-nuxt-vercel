const defaultDescription =
  "Excellent design and pioneering technology powering today's live content delivery";

export const usePageSeo = (options: {
  title?: string;
  description?: string;
  path?: string;
}) => {
  const { locale } = useI18n();
  const route = useRoute();
  const siteUrl = useRuntimeConfig().public.siteUrl as string;

  const currentPath = computed(() => options.path ?? route.path);

  const alternatePath = computed(() => {
    const p = currentPath.value;
    if (locale.value === "de") {
      return p.replace(/^\/de\/?/, "/") || "/";
    }
    return `/de${p === "/" ? "" : p}`;
  });

  useHead({
    title: options.title ? `${options.title} | v-sion` : "v-sion",
    link: [
      {
        rel: "canonical",
        href: `${siteUrl}${currentPath.value}`,
      },
      {
        rel: "alternate",
        hreflang: "en",
        href: `${siteUrl}${locale.value === "en" ? currentPath.value : alternatePath.value}`,
      },
      {
        rel: "alternate",
        hreflang: "de",
        href: `${siteUrl}${locale.value === "de" ? currentPath.value : alternatePath.value}`,
      },
      {
        rel: "alternate",
        hreflang: "x-default",
        href: `${siteUrl}${locale.value === "en" ? currentPath.value : alternatePath.value}`,
      },
    ],
  });

  useSeoMeta({
    description: options.description ?? defaultDescription,
    ogTitle: options.title ? `${options.title} | v-sion` : "v-sion",
    ogDescription: options.description ?? defaultDescription,
    ogUrl: `${siteUrl}${currentPath.value}`,
  });
};
