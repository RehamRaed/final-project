"use client";

import { createContext, useEffect, useState } from "react";

type ThemeContextType = {
  dark: boolean;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem("theme") === "dark";
    } catch {
      return false;
    }
  });
  const [mounted] = useState<boolean>(() => typeof window !== 'undefined');

  useEffect(() => {
    if (!mounted) return;

    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark, mounted]);

  const toggleTheme = () => setDark(prev => !prev);

  if (!mounted) return null;

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
