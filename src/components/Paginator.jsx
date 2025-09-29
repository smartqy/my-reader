import { useState, useEffect, useRef } from "react";
import ThemeSwitcher from "./ThemeSwitcher.jsx";
import TocSidebar from "./TocSidebar.jsx";

export default function Paginator({
  text,
  onSelect,
  onClearPopup,
  onIframeReady,
}) {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [theme, setTheme] = useState("day");
  const [rendition, setRendition] = useState(null);
  const viewerRef = useRef(null);
  const textBoxRef = useRef(null);
  const [showToc, setShowToc] = useState(false);

  const themeClasses = {
    day: "bg-[#fdfcf5] text-gray-800",
    night: "bg-gray-900 text-gray-100",
    eye: "bg-[#eaf4de] text-gray-800",
  };

  // 普通文本分页
  useEffect(() => {
    if (!text || typeof text !== "string") {
      setPages([]);
      return;
    }
    const pageSize = 1000;
    const words = text.split(/(\s+|。|！|？|\n)/);
    const chunks = [];
    let cur = "";
    for (const w of words) {
      if ((cur + w).length > pageSize) {
        chunks.push(cur.trim());
        cur = w;
      } else cur += w;
    }
    if (cur) chunks.push(cur.trim());
    setPages(chunks);
    setCurrentPage(0);
  }, [text]);

  // EPUB 渲染 + 选区捕获
  useEffect(() => {
    if (
      text &&
      typeof text === "object" &&
      text.type === "epub" &&
      viewerRef.current
    ) {
      const r = text.book.renderTo(viewerRef.current, {
        width: "100%",
        height: "100%",
        spread: "none",
        flow: "paginated",
      });

      r.display();
      setRendition(r);

      const onRendered = (_section, contents) => {
        const win = contents.window;
        const doc = contents.document;

        // 把 iframe document 回传给 App
        onIframeReady?.(doc);

        const handleMouseUp = () => {
          console.log("[Paginator] mouseup 触发");
          const sel = win.getSelection();
          if (!sel || sel.rangeCount === 0) {
            console.log("[Paginator] 没有选区，直接 return");
            return;
          }

          const picked = sel.toString().trim();
          if (!picked) {
            console.log("[Paginator] 选中文字为空 -> return");
            return;
          }

          const range = sel.getRangeAt(0);
          const rect = range.getBoundingClientRect();
          const iframeRect = contents.iframe.getBoundingClientRect();

          const x = iframeRect.left + rect.right + window.scrollX;
          const y = iframeRect.top + rect.bottom + window.scrollY;

          onSelect?.({ text: picked, x, y });
        };

        doc.addEventListener("mouseup", handleMouseUp, true);
        contents.on("destroy", () => {
          doc.removeEventListener("mouseup", handleMouseUp, true);
        });
      };

      r.on("rendered", onRendered);

      return () => {
        r.off("rendered", onRendered);
        r.destroy();
        setRendition(null);
        onIframeReady?.(null); // 清理
      };
    }
  }, [text?.book]);

  if (!text) {
    return <p className="text-gray-500">Upload a book to start reading...</p>;
  }

  // 普通文本模式
  if (typeof text === "string") {
    return (
      <div className="flex flex-col items-center w-full">
        {/* 主题切换器 */}
        <ThemeSwitcher theme={theme} setTheme={setTheme} />

        {/* 阅读区 */}
        <div
          ref={textBoxRef}
          className={`shadow-md rounded-lg p-6 max-w-2xl leading-relaxed transition-colors duration-300 ${themeClasses[theme]}`}
          style={{ height: "70vh", overflow: "auto" }}
        >
          {pages.length > 0 ? (
            <p className="whitespace-pre-line">{pages[currentPage]}</p>
          ) : (
            <p className="text-gray-500">Upload a book to start reading...</p>
          )}
        </div>

        {pages.length > 0 && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(0, p - 1));
                onClearPopup?.(); // 翻页时清除 popup
              }}
              disabled={currentPage === 0}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              ◀ 上一页
            </button>
            <span className="self-center">
              Page {currentPage + 1} / {pages.length}
            </span>
            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(pages.length - 1, p + 1));
                onClearPopup?.(); // 翻页时清除 popup
              }}
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

  // EPUB 模式
  if (typeof text === "object" && text.type === "epub") {
    return (
      <div className="flex flex-col items-center w-full">
        {/* 主题切换器 */}
        <ThemeSwitcher theme={theme} setTheme={setTheme} />

        {/* EPUB 阅读区 */}
        <div
          ref={viewerRef}
          id="viewer"
          className={`relative w-full max-w-3xl shadow-md rounded-lg transition-colors duration-300 ${themeClasses[theme]}`}
          style={{ height: "70vh", overflow: "hidden" }}
        />

        {/* 控制区：翻页 + 目录 */}
        <div className="flex gap-4 mt-4 relative z-10">
          <button
            onClick={() => {
              rendition && rendition.prev();
              onClearPopup?.();
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow hover:from-blue-600 hover:to-indigo-600 transition disabled:opacity-50"
          >
            ◀ 上一页
          </button>

          <button
            onClick={() => {
              rendition && rendition.next();
              onClearPopup?.();
            }}
            className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl shadow hover:from-blue-600 hover:to-indigo-600 transition disabled:opacity-50"
          >
            下一页 ▶
          </button>

          {/* 📖 目录按钮 */}
          <button
            onClick={() => setShowToc((prev) => !prev)}
            className="px-5 py-2.5 bg-green-500 text-white rounded-xl shadow hover:bg-green-600 transition"
          >
            📖 目录
          </button>
        </div>

        {/* 目录 Sidebar */}
        {showToc && (
          <TocSidebar
            book={text.book}
            rendition={rendition}
            onClose={() => setShowToc(false)}
            onClearPopup={onClearPopup}
          />
        )}
      </div>
    );
  }
}
