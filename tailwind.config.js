/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        reader: {
          day: "#fdfcf5", // 日间
          night: "#111827", // 夜间
          eye: "#eaf4de", // 护眼
        },
      },
      fontFamily: {
        serif: ["Georgia", "Times New Roman", "serif"], // 更适合阅读的衬线体
        sans: ["system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
