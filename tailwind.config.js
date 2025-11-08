/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-plus-jakarta-sans)",
          "Plus Jakarta Sans",
          "sans-serif",
        ],
        afacad: ["var(--font-afacad)", "Afacad", "sans-serif"],
      },
    },
  },
  plugins: [],
};
