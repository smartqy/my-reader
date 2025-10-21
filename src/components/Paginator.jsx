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
  const [rendition, setRendition] = useState(null);
  const [showToc, setShowToc] = useState(false);

  const viewerRef = useRef(null);
  const textBoxRef = useRef(null);

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

        onIframeReady?.(doc);

        const handleMouseUp = () => {
          const sel = win.getSelection();
          if (!sel || sel.rangeCount === 0) return;

          const picked = sel.toString().trim();
          if (!picked) return;

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
        onIframeReady?.(null);
      };
    }
  }, [text?.book]);

  if (!text) {
    return (
      <p className="text-base-content/60">Upload a book to start reading...</p>
    );
  }

  // 普通文本模式
  if (typeof text === "string") {
    return (
      <div className="flex flex-col items-center w-full">
        {/* 主题切换器 */}
        <ThemeSwitcher />

        {/* 阅读区 */}
        <div
          ref={textBoxRef}
          className="shadow-md rounded-lg p-6 max-w-2xl leading-relaxed bg-base-100 text-base-content"
          style={{ height: "70vh", overflow: "auto" }}
        >
          {pages.length > 0 ? (
            <p className="whitespace-pre-line">{pages[currentPage]}</p>
          ) : (
            <p className="text-base-content/60">
              Upload a book to start reading...
            </p>
          )}
        </div>

        {/* 翻页按钮 */}
        {pages.length > 0 && (
          <div className="flex gap-4 mt-4">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(0, p - 1));
                onClearPopup?.();
              }}
              disabled={currentPage === 0}
              className="btn btn-outline"
            >
              ◀ 上一页
            </button>
            <span className="self-center text-base-content">
              Page {currentPage + 1} / {pages.length}
            </span>
            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(pages.length - 1, p + 1));
                onClearPopup?.();
              }}
              disabled={currentPage === pages.length - 1}
              className="btn btn-outline"
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
      <div className="flex flex-col items-center w-full relative">
        {/* 主题切换器（右上角固定） */}
        <div className="absolute right-6 top-4 z-20">
          <ThemeSwitcher />
        </div>

        {/* EPUB 阅读区 */}
        <div
          ref={viewerRef}
          id="viewer"
          className="relative w-full max-w-3xl mx-auto bg-[#f5f7e7] text-[#2f4f4f] font-serif leading-relaxed rounded-2xl shadow-sm border border-[#e0e0d1]/60 p-8 md:p-10 overflow-hidden transition-colors duration-300"
          style={{ height: "70vh" }}
        />

        {/* 控制区 */}
        <div className="flex gap-4 mt-4 relative z-10">
          {/* 上一页 */}
          <button
            onClick={() => {
              rendition && rendition.prev();
              onClearPopup?.();
            }}
            className="px-6 py-2 bg-[#e4c59e] text-gray-700 font-medium rounded-lg shadow-sm hover:bg-[#d2b48c] hover:shadow-md transition"
          >
            ◀ 上一页
          </button>

          {/* 下一页 */}
          <button
            onClick={() => {
              rendition && rendition.next();
              onClearPopup?.();
            }}
            className="px-6 py-2 bg-[#e4c59e] text-gray-700 font-medium rounded-lg shadow-sm hover:bg-[#d2b48c] hover:shadow-md transition"
          >
            下一页 ▶
          </button>

          {/* 目录按钮 */}
          <button
            onClick={() => setShowToc((prev) => !prev)}
            className="px-6 py-2 bg-[#c9a66b]/90 text-white font-medium rounded-lg shadow-sm hover:bg-[#b98b55] hover:shadow-md transition"
          >
            📖 目录
          </button>
        </div>

        {/* 目录 */}
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
