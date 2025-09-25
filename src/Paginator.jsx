import { useState, useEffect, useRef } from "react";

export default function Paginator({ text }) {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [theme, setTheme] = useState("day");
  const [rendition, setRendition] = useState(null); // 保存 epub.js 渲染器
  const viewerRef = useRef(null);

  // 📖 普通文本（txt/pdf）分页逻辑
  useEffect(() => {
    if (!text || typeof text !== "string") {
      setPages([]);
      return;
    }

    const pageSize = 1000; // 每页大约字数
    const words = text.split(/(\s+|。|！|？|\n)/);

    const chunks = [];
    let current = "";

    words.forEach((word) => {
      if ((current + word).length > pageSize) {
        chunks.push(current.trim());
        current = word;
      } else {
        current += word;
      }
    });
    if (current) chunks.push(current.trim());

    setPages(chunks);
    setCurrentPage(0);
  }, [text]);

  const themeClasses = {
    day: "bg-[#fdfcf5] text-gray-800", // 米白
    night: "bg-gray-900 text-gray-100", // 夜间
    eye: "bg-[#eaf4de] text-gray-800", // 护眼
  };

  // 📚 EPUB 渲染逻辑
  useEffect(() => {
    if (typeof text === "object" && text.type === "epub" && viewerRef.current) {
      const r = text.book.renderTo(viewerRef.current, {
        width: "100%",
        height: "100%",
        spread: "none", // ✅ 单页模式，避免封面超大
        flow: "paginated",
      });

      // 限制图片大小，避免封面溢出
      r.themes.default({
        img: {
          "max-width": "100% !important",
          height: "auto !important",
        },
        body: {
          margin: "1em !important",
        },
      });

      r.display(); // 显示第一页
      setRendition(r);

      // 调试：输出当前页面
      r.on("relocated", (location) => {
        console.log("当前页:", location.start.cfi);
      });

      // 清理函数
      return () => {
        r.destroy();
        setRendition(null);
      };
    }
  }, [text]);

  // 👉 没有内容时
  if (!text) {
    return <p className="text-gray-500">Upload a book to start reading...</p>;
  }

  // 👉 EPUB 模式
  if (typeof text === "object" && text.type === "epub") {
    return (
      <div className="flex flex-col items-center w-full">
        {/* 主题切换 */}
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

        {/* EPUB 渲染容器 */}
        <div
          ref={viewerRef}
          id="viewer"
          className={`relative w-full max-w-3xl shadow-md rounded-lg transition-colors duration-300 ${themeClasses[theme]}`}
          style={{ height: "70vh", overflow: "hidden" }}
        ></div>

        {/* 翻页按钮 */}
        <div className="flex gap-4 mt-4 relative z-10">
          <button
            onClick={() => rendition && rendition.prev()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ◀ 上一页
          </button>
          <button
            onClick={() => rendition && rendition.next()}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            下一页 ▶
          </button>
        </div>
      </div>
    );
  }

  // 👉 普通文本模式（txt/pdf）
  return (
    <div className="flex flex-col items-center w-full">
      {/* 主题切换 */}
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
        className={`shadow-md rounded-lg p-6 max-w-2xl leading-relaxed transition-colors duration-300 ${themeClasses[theme]}`}
        style={{ height: "70vh", overflow: "hidden" }}
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
