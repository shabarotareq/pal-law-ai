/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // الخطوط
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
        amiri: ["Amiri", "serif"],
        roboto: ["Roboto", "sans-serif"], // ✅ خط Roboto للإنجليزية
      },
      // الحركات
      keyframes: {
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeInDown: "fadeInDown 1.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
