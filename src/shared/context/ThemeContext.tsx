import React, { useEffect, useMemo } from "react";
import { useLocalStorage } from "@shared/hooks/useLocalStorage";
import { ThemeContext } from "@shared/context/themeStore";
import type { Theme, ThemeContextValue } from "@shared/context/themeStore";

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Prefer system setting if available, otherwise default to dark (matches CSS default)
  const prefersLight =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches;

  const [theme, setTheme] = useLocalStorage<Theme>(
    "theme",
    prefersLight ? "light" : "dark"
  );

  useEffect(() => {
    try {
      document.documentElement.setAttribute("data-theme", theme);
    } catch {
      // silently ignore if DOM not available
    }
  }, [theme]);

  const value = useMemo(() => {
    const toggleTheme = () =>
      setTheme((prev) => (prev === "light" ? "dark" : "light"));
    return {
      theme,
      isLight: theme === "light",
      setTheme,
      toggleTheme,
    } as ThemeContextValue;
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
