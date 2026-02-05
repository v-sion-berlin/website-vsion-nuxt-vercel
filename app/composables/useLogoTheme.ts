type LogoTheme = "red" | "green" | "violet" | "yellow";

type ThemeConfig = {
  logo: string;
  color: string;
};

const themes: Record<LogoTheme, ThemeConfig> = {
  red: {
    logo: "LogoRed",
    color: "#ff0751",
  },
  green: {
    logo: "LogoGreen",
    color: "#1acc94",
  },
  violet: {
    logo: "LogoViolet",
    color: "#7d53de",
  },
  yellow: {
    logo: "LogoYellow",
    color: "#f3ca40",
  },
};

const themeKeys: LogoTheme[] = ["red", "red", "red", "red"];

export const useLogoTheme = () => {
  const currentTheme = useState<LogoTheme | undefined>("logoTheme", () => {
    const randomIndex = Math.floor(Math.random() * themeKeys.length);
    return themeKeys[randomIndex];
  });

  const themeConfig = computed(() => themes[currentTheme.value!]);

  const applyTheme = () => {
    if (import.meta.client) {
      document.documentElement.style.setProperty(
        "--color-primary",
        themeConfig.value.color,
      );
    }
  };

  watch(currentTheme, applyTheme, { immediate: true });

  return {
    themeConfig,
    logoName: computed(() => themeConfig.value.logo),
  };
};
