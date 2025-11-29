/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Agregamos ts y tsx
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tailwind-scrollbar")],
};
