let cachedBaseURL: string | null = null;

const getBaseURL = (): string => {
  if (cachedBaseURL === null) {
    cachedBaseURL = useNuxtApp().$config.app.baseURL;
  }
  return cachedBaseURL;
};

export const useImagePath = (path: string | undefined): string | undefined => {
  if (path === undefined) return undefined;
  const baseURL = getBaseURL();
  return `${baseURL}${path.replace(/^\/+/, "")}`;
};
