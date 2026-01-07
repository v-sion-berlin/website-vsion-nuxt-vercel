export const useImagePath = (path: string | undefined) => {
  const appBaseURL = useNuxtApp().$config.app.baseURL;
  if (path === undefined) return;
  return `${appBaseURL}${path.replace(/^\/+/, "")}`;
};
