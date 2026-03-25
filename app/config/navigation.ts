export const navigationConfig: Record<
  "en" | "de",
  { name: string; path: string }[]
> = {
  en: [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "Team", path: "/team" },
    { name: "Career", path: "/career" },
    { name: "Projects", path: "/projects" },
    { name: "About", path: "/about" },
  ],
  de: [
    { name: "Startseite", path: "/de" },
    { name: "Leistungen", path: "/de/services" },
    { name: "Team", path: "/de/team" },
    { name: "Karriere", path: "/de/career" },
    { name: "Projekte", path: "/de/projects" },
    { name: "Über uns", path: "/de/about" },
  ],
};
