// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      "light",
      "dark",
      {
        eye: {
          primary: "#4CAF50", // 绿色按钮
          secondary: "#A7D7C5",
          accent: "#6EE7B7",
          neutral: "#3D4451",
          "base-100": "#eaf4de", // 背景色
          "base-content": "#2f4f4f", // 文字颜色（深青色）
        },
      },
    ],
  },
};
