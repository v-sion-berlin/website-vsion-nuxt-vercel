export default defineNuxtPlugin(() => {
  const { themeConfig } = useLogoTheme();

  document.documentElement.style.setProperty(
    "--color-primary",
    themeConfig.value.color,
  );
});
