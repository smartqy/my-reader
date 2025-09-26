import { useState, useEffect, useRef } from "react";

export default function Paginator({ text, onSelect, onClearPopup }) {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [theme, setTheme] = useState("day");
  const [rendition, setRendition] = useState(null);
  const viewerRef = useRef(null);
  const textBoxRef = useRef(null);

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

      // 选区捕获
      const onRendered = (_section, contents) => {
        const win = contents.window;
        const doc = contents.document;

        const handleMouseUp = () => {
          const sel = win.getSelection();
          if (!sel || sel.rangeCount === 0) return; // 防止 IndexSizeError
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
                onClearPopup?.();
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
                onClearPopup?.();
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
        <div
          ref={viewerRef}
          id="viewer"
          className={`relative w-full max-w-3xl shadow-md rounded-lg transition-colors duration-300 ${themeClasses[theme]}`}
          style={{ height: "70vh", overflow: "hidden" }}
        />

        <div className="flex gap-4 mt-4 relative z-10">
          <button
            onClick={() => {
              rendition && rendition.prev();
              onClearPopup?.();
            }}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            ◀ 上一页
          </button>
          <button
            onClick={() => {
              rendition && rendition.next();
              onClearPopup?.();
            }}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            下一页 ▶
          </button>
        </div>
      </div>
    );
  }
}
