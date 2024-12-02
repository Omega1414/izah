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
      'sans': ['ui-sans-serif', 'system-ui'],
      'serif': ['ui-serif', 'Georgia'],
      'mono': ['ui-monospace', 'SFMono-Regular'],
      'display': ['Oswald'],
      'body': ['Roboto'],
    },
    fontWeight: {
        'bold-700': '700', // This is where you define the Roboto Bold 700 weight
      },
      gridTemplateColumns: {
        card: "repeat(auto-fit, minmax(280px, 1fr))",
      },
    },
  },

  darkMode: 'class', // Enable class-based dark mode

  plugins: [],
};