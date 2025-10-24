import { useContext } from "react";
import { ThemeContext } from "@shared/context/themeStore";
import type { ThemeContextValue } from "@shared/context/themeStore";

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
};

export default useTheme;
