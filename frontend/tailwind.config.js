/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ تغطية شاملة لجميع الملفات
  ],
  theme: {
    extend: {
      // الألوان المخصصة
      colors: {
        brown: {
          100: "#f5f1e8",
          200: "#e8dfca",
          300: "#d7c9a9",
          400: "#c9b18b",
          500: "#8b5a2b",
          600: "#6d4c2d",
          700: "#5d4037",
          800: "#4e342e",
          900: "#3e2723",
        },
        parchment: {
          light: "#f9f5eb",
          dark: "#f5f1e8",
        },
        gold: {
          400: "#d7a45b",
          500: "#bf8c42",
          600: "#8b5a2b",
        },
      },

      // الخطوط المخصصة
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
        amiri: ["Amiri", "serif"],
        roboto: ["Roboto", "sans-serif"],
        "traditional-arabic": [
          "Traditional Arabic",
          "Times New Roman",
          "serif",
        ],
        serif: ["Amiri", "Traditional Arabic", "Times New Roman", "serif"],
      },

      // صور الخلفية
      backgroundImage: {
        "paper-texture":
          "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
        "gold-gradient": "linear-gradient(to bottom right, #d7a45b, #bf8c42)",
        "parchment-gradient":
          "linear-gradient(to bottom right, #f9f5eb, #f5f1e8)",
      },

      // الحركات والتحريك
      keyframes: {
        fadeInDown: {
          "0%": {
            opacity: "0",
            transform: "translateY(-30px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        flip: {
          "0%": {
            transform: "rotateY(0deg)",
          },
          "50%": {
            transform: "rotateY(90deg)",
          },
          "100%": {
            transform: "rotateY(0deg)",
          },
        },
        pageTurn: {
          "0%": {
            transform: "rotateY(0deg)",
            "z-index": "1",
          },
          "50%": {
            transform: "rotateY(-90deg)",
            "z-index": "0",
          },
          "100%": {
            transform: "rotateY(-180deg)",
            "z-index": "0",
          },
        },
      },

      animation: {
        fadeInDown: "fadeInDown 1.5s ease-out forwards",
        flip: "flip 0.8s ease-in-out",
        pageTurn: "pageTurn 0.8s ease-in-out forwards",
      },

      // تأثيرات الظل المخصصة
      boxShadow: {
        book: "0 10px 30px rgba(0, 0, 0, 0.3)",
        "book-inner": "inset 0 0 20px rgba(0, 0, 0, 0.3)",
        gold: "0 3px 8px rgba(215, 164, 91, 0.4)",
        page: "0 2px 10px rgba(139, 90, 43, 0.2)",
      },

      // أحجام مخصصة
      spacing: {
        "book-width": "550px",
        "book-height": "750px",
        "page-padding": "2rem",
      },

      // زوايا حدود مخصصة
      borderRadius: {
        book: "10px",
        page: "2px",
        seal: "50%",
      },

      // إعدادات التعتيم المخصصة
      opacity: {
        15: "0.15",
        35: "0.35",
        65: "0.65",
      },
    },
  },
  plugins: [],
};
