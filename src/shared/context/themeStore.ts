import { createContext } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextValue {
  theme: Theme;
  isLight: boolean;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
}

// Context only (no components exported from this file)
export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);
