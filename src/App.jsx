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
    <div className="min-h-screen bg-[#f5f3e7] text-[#3f3a33] font-serif flex flex-col items-center py-10 px-6">
      {/* 标题区 */}
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-serif font-semibold tracking-wide text-[#8b7355] select-none">
          <span className="bg-gradient-to-r from-[#b58e5d] to-[#d2b48c] bg-clip-text text-transparent drop-shadow-sm">
            My&nbsp;Reader
          </span>
        </h1>
        <div className="mt-3 h-[2px] w-24 mx-auto bg-[#d2b48c]/70 rounded-full"></div>
      </header>

      {/* 上传区 */}
      <section className="w-full max-w-md mb-10">
        <FileUploader onTextLoaded={setText} />
      </section>

      {/* 阅读区 */}
      <main className="relative w-full max-w-4xl bg-[#fdfcf6] border border-[#e5dcc4]/80 rounded-2xl shadow-md p-6 md:p-10 flex-1 flex flex-col items-center">
        <Paginator
          text={text}
          onSelect={handleSelect}
          onClearPopup={() => setPopup((prev) => ({ ...prev, show: false }))}
          onIframeReady={setIframeDoc}
        />
      </main>

      {/* 弹窗（例如目录 / 注释） */}
      <Popup popup={popup} />
    </div>
  );
}
