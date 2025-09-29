import { useState } from "react";
import FileUploader from "./components/FileUploader.jsx";
import Paginator from "./components/Paginator.jsx";
import Popup from "./components/Popup.jsx";
import { useTranslator } from "./hooks/useTranslator.jsx";
import { usePopupVisibility } from "./hooks/usePopupVisibility.jsx";

export default function App() {
  const [text, setText] = useState("");
  const [iframeDoc, setIframeDoc] = useState(null); // 👈 保存 EPUB 的 iframe document
  const { popup, setPopup, handleSelect } = useTranslator();

  // 👇 监听主页面 + iframe 内部
  usePopupVisibility(setPopup, iframeDoc);

  return (
    <div className="relative p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">My Reader</h1>

      <FileUploader onTextLoaded={setText} />

      <Paginator
        text={text}
        onSelect={handleSelect}
        onClearPopup={() => setPopup((prev) => ({ ...prev, show: false }))}
        onIframeReady={setIframeDoc} // 👈 把 iframe doc 回传进来
      />

      <Popup popup={popup} />
    </div>
  );
}
