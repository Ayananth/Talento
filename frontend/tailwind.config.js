/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Plus Jakarta Sans'", "ui-sans-serif", "sans-serif"],
        sans: ["Figtree", "ui-sans-serif", "sans-serif"],
      },
    },
  },
  plugins: [
    require("flowbite/plugin")
  ],
};
