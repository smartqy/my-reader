import { useState } from "react";
import FileUploader from "./components/FileUploader.jsx";
import Paginator from "./components/Paginator.jsx";
import Popup from "./components/Popup.jsx";
import { useTranslator } from "./hooks/useTranslator.jsx";
import { usePopupVisibility } from "./hooks/usePopupVisibility.jsx";

export default function App() {
  const [text, setText] = useState("");
  const { popup, setPopup, handleSelect } = useTranslator();

  // 👇 监听选区变化，清除浮窗
  usePopupVisibility(setPopup);

  return (
    <div className="relative p-8 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">My Reader</h1>

      <FileUploader onTextLoaded={setText} />

      <Paginator
        text={text}
        onSelect={handleSelect}
        // 👇 翻页时清除浮窗
        onClearPopup={() => setPopup((prev) => ({ ...prev, show: false }))}
      />

      <Popup popup={popup} />
    </div>
  );
}
