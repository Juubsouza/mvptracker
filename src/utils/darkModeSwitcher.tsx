import { useTheme } from "@rneui/themed";

export const useThemeSwitcher = () => {
  const { updateTheme } = useTheme();

  const toggleTheme = () => {
    updateTheme((theme) => ({
      mode: theme.mode === "light" ? "dark" : "light",
    }));
  };

  return { toggleTheme };
};
