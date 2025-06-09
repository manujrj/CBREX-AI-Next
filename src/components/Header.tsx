"use client";

import Image from "next/image";
import { useTheme } from "./ThemeProvider";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

export default function Header() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md p-1 flex items-center justify-between fixed top-0 left-0 z-50">
      <div className="flex items-center">
        <Image src="/cbrexlogo1.png" alt="Logo" width={100} height={50} />
      </div>

      <button onClick={toggleTheme} className="p-2">
        {isDark ? (
          <SunIcon className="w-6 h-6 text-white" />
        ) : (
          <MoonIcon className="w-6 h-6 text-gray-800" />
        )}
      </button>
    </header>
  );
}
