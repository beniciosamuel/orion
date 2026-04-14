import { UserService } from "./UserService";

export type ThemePreference = "light" | "dark";

const THEME_STORAGE_KEY = "themePreference";

export const ThemePreferenceService = {
  getStoredTheme(): ThemePreference {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    return storedTheme === "light" ? "light" : "dark";
  },

  setStoredTheme(theme: ThemePreference) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  },

  async syncStoredThemeToServer() {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

    if (storedTheme !== "light" && storedTheme !== "dark") {
      return;
    }

    if (!localStorage.getItem("authToken")) {
      return;
    }

    await UserService.updateUserTheme(storedTheme);
  },
};
