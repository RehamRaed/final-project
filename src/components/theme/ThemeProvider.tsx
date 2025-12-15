"use client";

import { createContext, useEffect, useState } from "react";

type ThemeContextType = {
  dark: boolean;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // نقرأ الثيم بعد ما الصفحة تشتغل
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
    setMounted(true);
  }, []);

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

  if (!mounted) return null; // 🔴 هذا مهم جدًا لمنع الإكسر

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
