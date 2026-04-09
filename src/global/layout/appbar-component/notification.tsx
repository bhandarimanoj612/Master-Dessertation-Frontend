import { useEffect, useState } from "react";

const Notification = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <button
          onClick={toggleTheme}
          className="px-4 py-2 text-sm font-medium rounded-lg text-neutral-800 dark:bg-neutral-700 dark:text-white"
        >
          Toggle {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>
    </div>
  );
};

export default Notification;
