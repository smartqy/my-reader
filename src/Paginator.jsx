import { useState, useEffect } from "react";

export default function Paginator({ text }) {
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

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

  return (
    <div className="flex flex-col items-center">
      {/* 内容显示 */}
      <div className="bg-white shadow-md rounded-lg p-4 max-w-2xl leading-relaxed min-h-[400px]">
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
            上一页
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
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
