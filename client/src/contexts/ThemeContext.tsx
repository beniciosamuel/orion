import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ThemePreferenceService,
  type ThemePreference,
} from "../services/ThemePreference";

type ThemeContextType = {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<ThemePreference>(() =>
    ThemePreferenceService.getStoredTheme(),
  );

  useEffect(() => {
    document.body.classList.toggle("theme-light", theme === "light");
    ThemePreferenceService.setStoredTheme(theme);
  }, [theme]);

  const setTheme = (newTheme: ThemePreference) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};
