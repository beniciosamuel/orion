import type { ButtonHTMLAttributes } from "react";
import React from "react";

import styles from "./ThemeSwitcher.module.css";
import { SunIcon, MoonIcon } from "../Icons";

type ThemeSwitcherProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  className,
  ...buttonProps
}) => {
  const [theme, setTheme] = React.useState<"light" | "dark">("dark");

  React.useEffect(() => {
    document.body.classList.toggle("theme-light", theme === "light");
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
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
