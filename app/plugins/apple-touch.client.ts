export default defineNuxtPlugin(() => {
  if (import.meta.server) return;

  function updateAppleTouchIcon(e: MediaQueryList | MediaQueryListEvent) {
    const link = document.querySelector<HTMLLinkElement>(
      "#apple-touch-icon"
    );
    if (!link) return;

    link.href = e.matches
      ? "/apple-touch-icon-dark.png"
      : "/apple-touch-icon.png";
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");

  updateAppleTouchIcon(prefersDark);

  prefersDark.addEventListener("change", updateAppleTouchIcon);
});