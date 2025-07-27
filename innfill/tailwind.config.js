/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // Enables dark mode via a .dark class
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        // Your custom palette
        primary: {
          DEFAULT: "#0a0a23", // deep dark blue
          light: "#23234b",
          dark: "#050517",
        },
        background: "#0a0a0a", // black
        accent: "#1e40af", // blue-800
        // Add more as needed
      },
    },
  },
  plugins: [],
};
