import { useState } from "react";
import FileUploader from "./FileUploader";
import Paginator from "./Paginator";

export default function App() {
  const [text, setText] = useState("");

  const [popup, setPopup] = useState({
    show: false,
    x: 0,
    y: 0,
    content: "",
  });

  const handleMouseUp = async (e) => {
    const sel = window.getSelection();
    const picked = sel ? sel.toString().trim() : "";
    if (!picked) {
      setPopup({ show: false, x: 0, y: 0, content: "" });
      return;
    }

    const x = e.pageX;
    const y = e.pageY;
    setPopup({ show: true, x, y, content: "Translating..." });

    try {
      const resp = await fetch("http://localhost:5050/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: picked, to: "zh-CN" }),
      });
      const data = await resp.json();
      setPopup({
        show: true,
        x,
        y,
        content: data.translated || "⚠️ Translation failed",
      });
    } catch (err) {
      console.error(err);
      setPopup({ show: true, x, y, content: "❌ Error connecting to server" });
    }
  };

  return (
    <div
      className="p-8 bg-gray-100 min-h-screen flex flex-col items-center justify-start"
      onMouseUp={handleMouseUp}
    >
      <h1 className="text-3xl font-bold text-blue-600 mb-6">My Reader</h1>

      {/* 文件上传器 */}
      <FileUploader onTextLoaded={setText} />

      {/* 分页阅读器 */}
      <Paginator text={text} />

      {/* 浮窗翻译 */}
      {popup.show && (
        <div
          className="absolute bg-white border border-gray-300 shadow-lg rounded-lg px-4 py-2 text-sm text-gray-800 max-w-xs"
          style={{ top: popup.y + 10, left: popup.x + 10 }}
        >
          {popup.content}
        </div>
      )}
    </div>
  );
}
