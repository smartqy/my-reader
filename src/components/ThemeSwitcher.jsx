import { Sun, Moon } from "lucide-react";
export default function ThemeSwitcher() {
  const changeTheme = (theme) => {
    document.documentElement.setAttribute("data-theme", theme);
  };

  return (
    <div className="flex gap-3 items-center">
      {/* ☀️ 白天模式 */}
      <button
        onClick={() => changeTheme("light")}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-[#3f3a33] bg-[#f2e5bc] hover:bg-[#e5d3a2] border border-[#ddc895] shadow-sm hover:shadow-md transition-transform hover:scale-[1.03] active:scale-[0.98]"
      >
        <Sun className="w-5 h-5 text-[#b58e5d]" />
        白天
      </button>

      {/* 🌙 夜间模式 */}
      <button
        onClick={() => changeTheme("dark")}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-[#f0e9dd] bg-[#51473d] hover:bg-[#3e372f] border border-[#63594f] shadow-sm hover:shadow-md transition-transform hover:scale-[1.03] active:scale-[0.98]"
      >
        <Moon className="w-5 h-5 text-[#f0e9dd]" />
        夜间
      </button>
    </div>
  );
}
