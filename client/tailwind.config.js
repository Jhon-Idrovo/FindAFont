const colors = require("tailwindcss/colors");
module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      base: "#434A42",
      "txt-base": "#FF6542",
      primary: "#FF6542",
      "txt-primary": colors.white,
      secondary: colors.yellow[900],
      "txt-secondary": colors.white,
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
