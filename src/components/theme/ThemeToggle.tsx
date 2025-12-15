"use client";

import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const ctx = useContext(ThemeContext);
  if (!ctx) return null;

  const { dark, toggleTheme } = ctx;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg"
    >
      {dark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-gray-800" />
      )}
    </button>
  );
}
