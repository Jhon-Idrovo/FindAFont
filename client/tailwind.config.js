const colors = require("tailwindcss/colors");
module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      base: colors.black,
      "txt-base": colors.gray[100],
      primary: colors.gray[400],
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
