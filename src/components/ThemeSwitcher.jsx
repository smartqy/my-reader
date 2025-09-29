export default function ThemeSwitcher({ theme, setTheme }) {
  return (
    <div className="flex gap-2 mb-4">
      <button
        onClick={() => setTheme("day")}
        className={`px-3 py-1 rounded ${
          theme === "day" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        白天
      </button>
      <button
        onClick={() => setTheme("night")}
        className={`px-3 py-1 rounded ${
          theme === "night" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        夜间
      </button>
      <button
        onClick={() => setTheme("eye")}
        className={`px-3 py-1 rounded ${
          theme === "eye" ? "bg-blue-500 text-white" : "bg-gray-200"
        }`}
      >
        护眼
      </button>
    </div>
  );
}
