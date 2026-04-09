/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
  extend: {
    keyframes: {
      marquee: {
        from: { transform: "translateX(0)" },
        to:   { transform: "translateX(-50%)" },
      },
    },
    animation: {
      marquee: "marquee 28s linear infinite",
    },
  },
},
  plugins: [ require('tailwind-scrollbar-hide')],
};

