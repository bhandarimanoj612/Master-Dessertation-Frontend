// src/components/DarkModeToggle.tsx
import { useEffect, useState } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check local storage for theme preference
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      return storedTheme === "dark";
    }
    // If no preference is stored, use system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="flex items-center space-x-4 sm:space-x-2">
      {/* Dynamic Label */}

      {/* Toggle Button */}
      <button
        onClick={toggleDarkMode}
        aria-label="Toggle Dark Mode"
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        className={`relative w-10 h-5 sm:w-8 sm:h-4 md:w-16 md:h-8 flex items-center rounded-full cursor-pointer transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-blue-600`}
      >
        {/* Background */}
        <div
          className={`absolute inset-0  rounded-full transition-colors duration-300 ${
            isDarkMode ? "bg-gray-700" : "bg-yellow-200"
          }`}
        ></div>

        {/* Toggle Handle */}
        <div
          className={`absolute top-0.8 left-0.8 w-4 h-4 sm:w-3 sm:h-3 md:w-6 md:h-6 bg-white rounded-full shadow-md transform transition-transform duration-500 flex items-center justify-center ${
            isDarkMode
              ? "translate-x-5 sm:translate-x-4 md:translate-x-8"
              : "translate-x-0"
          }`}
        >
          {/* <div
          className={`absolute top-1 left-1 w-4 h-4    md:w-6 md:h-6 sm:w-3 sm:h-2   bg-white   rounded-full shadow-md transform transition-transform duration-500 flex items-center justify-center ${
            isDarkMode ? 'translate-x-8 sm:translate-x-4 md:translate-x-8' : 'translate-x-0'
          }`}
        > */}
          {isDarkMode ? (
            <FaMoon size={16} className="text-gray-300" />
          ) : (
            <FaSun size={16} className="text-yellow-500" />
          )}
        </div>
      </button>
    </div>
  );
};

export default DarkModeToggle;
