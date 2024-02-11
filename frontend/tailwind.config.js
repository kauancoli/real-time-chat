/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#615EF0",
        primaryHover: "#4340E0",
        dark: "#0D0F10",
        background: "#131619",
      },
    },
  },
  plugins: [require("daisyui")],
};
