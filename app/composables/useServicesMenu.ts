export const useServicesMenu = () => {
  const activeIndex = useState<number | null>("activeService", () => -1);
  return { activeIndex };
};
