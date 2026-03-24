export function useLocalizedPath() {
  const { locale } = useI18n();

  return (path: string) => (locale.value === "de" ? `/de${path}` : path);
}
