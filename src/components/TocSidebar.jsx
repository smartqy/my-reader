import { useState, useEffect } from "react";

export default function TocSidebar({ book, rendition, onClose, onClearPopup }) {
  const [toc, setToc] = useState([]);

  useEffect(() => {
    if (book) {
      book.ready.then(() => {
        setToc(book.navigation.toc || []);
      });
    }
  }, [book]);

  return (
    <div className="absolute right-4 top-16 w-64 bg-white shadow-lg rounded-xl border max-h-[70vh] overflow-y-auto z-50">
      <h3 className="p-3 font-semibold border-b flex justify-between items-center">
        目录
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          ✕
        </button>
      </h3>
      <ul>
        {toc.map((item, i) => (
          <li
            key={i}
            className="p-3 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              rendition.display(item.href); // 👉 跳转章节
              onClose();
              onClearPopup?.();
            }}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
