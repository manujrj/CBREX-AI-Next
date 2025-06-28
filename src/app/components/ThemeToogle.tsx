"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";

const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isToggleOn = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isToggleOn ? "light" : "dark");
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-800 dark:text-gray-200 font-medium">
        {isToggleOn ? "Dark" : "Light"} Mode
      </span>
      <button
        onClick={toggleTheme}
        aria-label="Toggle Theme"
        className={`w-12 h-6 ${
          isToggleOn ? "bg-[#F1652E]" : "bg-gray-400"
        } rounded-full p-1 relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#F1652E] focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#1A1B24]`}
      >
        <span
          className={`block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
            isToggleOn ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

export default ThemeToggle;
