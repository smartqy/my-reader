import { useState, useEffect } from "react";

export default function Paginator({ text }) {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  // 新增：主题状态
  const [theme, setTheme] = useState("day"); // "day" | "night" | "eye"

  useEffect(() => {
    if (!text) {
      setPages([]);
      return;
    }

    const pageSize = 1000; // 每页字符数，可调整
    const chunks = [];
    for (let i = 0; i < text.length; i += pageSize) {
      chunks.push(text.slice(i, i + pageSize));
    }
    setPages(chunks);
    setCurrentPage(0);
  }, [text]);

  // 根据主题设置样式
  const themeClasses = {
    day: "bg-[#fdfcf5] text-gray-800", // 日间模式：米白底 黑字
    night: "bg-gray-900 text-gray-100", // 夜间模式：深色底 浅字
    eye: "bg-[#eaf4de] text-gray-800", // 护眼模式：淡绿底 黑字
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* 控制区：主题切换 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTheme("day")}
          className={`px-3 py-1 rounded ${
            theme === "day" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          ☀️ 日间
        </button>
        <button
          onClick={() => setTheme("night")}
          className={`px-3 py-1 rounded ${
            theme === "night" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          🌙 夜间
        </button>
        <button
          onClick={() => setTheme("eye")}
          className={`px-3 py-1 rounded ${
            theme === "eye" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          🌿 护眼
        </button>
      </div>

      {/* 内容显示 */}
      <div
        className={`shadow-md rounded-lg p-6 max-w-2xl leading-relaxed min-h-[400px] transition-colors duration-300 ${themeClasses[theme]}`}
      >
        {pages.length > 0 ? (
          <p className="whitespace-pre-line">{pages[currentPage]}</p>
        ) : (
          <p className="text-gray-500">Upload a book to start reading...</p>
        )}
      </div>

      {/* 翻页按钮 */}
      {pages.length > 0 && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            ◀ 上一页
          </button>
          <span className="self-center">
            Page {currentPage + 1} / {pages.length}
          </span>
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(pages.length - 1, p + 1))
            }
            disabled={currentPage === pages.length - 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            下一页 ▶
          </button>
        </div>
      )}
    </div>
  );
}
