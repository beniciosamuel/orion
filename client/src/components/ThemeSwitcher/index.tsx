import type { ButtonHTMLAttributes } from "react";
import React from "react";

import styles from "./ThemeSwitcher.module.css";
import { SunIcon, MoonIcon } from "../Icons";
import { ThemePreferenceService } from "../../services/ThemePreference";

type ThemeSwitcherProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className,
  ...buttonProps
}) => {
  const [theme, setTheme] = React.useState<"light" | "dark">(() =>
    ThemePreferenceService.getStoredTheme(),
  );

  React.useEffect(() => {
    document.body.classList.toggle("theme-light", theme === "light");
    ThemePreferenceService.setStoredTheme(theme);
  }, [theme]);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    ThemePreferenceService.setStoredTheme(newTheme);

    try {
      await ThemePreferenceService.syncStoredThemeToServer();
    } catch (error) {
      console.error("Failed to update user theme:", error);
      // Revert theme on error
      const revertedTheme = newTheme === "light" ? "dark" : "light";
      setTheme(revertedTheme);
      ThemePreferenceService.setStoredTheme(revertedTheme);
    }
  };

  const classes = [styles.themeSwitcher, className].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      className={classes}
      onClick={toggleTheme}
      aria-label={
        theme === "light" ? "Switch to dark theme" : "Switch to light theme"
      }
      aria-pressed={theme === "dark"}
      data-testid="theme-switcher"
      {...buttonProps}
    >
      {theme === "light" ? <MoonIcon /> : <SunIcon />}
    </button>
  );
};
