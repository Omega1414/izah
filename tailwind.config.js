/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        black1: "rgba(0,0,0,0.8)",
        banner: "rgb(255, 192, 23)",
        darkBg: "#202124", // Add your custom dark mode background color here
        darkText: "#edf2f7"
      },
      fontFamily: {
        title: `gt-super, Georgia, Cambria, Times New Roman, Times, serif;`,
        texts: `sohne, Helvetica Neue, Helvetica, Arial, sans-serif`,
      },
      gridTemplateColumns: {
        card: "repeat(auto-fit, minmax(280px, 1fr))",
      },
    },
  },

  darkMode: 'class', // Enable class-based dark mode

  plugins: [],
};