import { useState } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import ePub from "epubjs";

// 设置 PDF worker 路径
GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function FileUploader({ onTextLoaded }) {
  const [fileName, setFileName] = useState("");
  const [showUploader, setShowUploader] = useState(false); // 👈 控制是否显示上传区

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const ext = file.name.split(".").pop().toLowerCase();

    // 处理 TXT
    if (ext === "txt") {
      const reader = new FileReader();
      reader.onload = () => {
        onTextLoaded(reader.result);
      };
      reader.readAsText(file, "utf-8");
    }

    // 处理 PDF
    if (ext === "pdf") {
      const reader = new FileReader();
      reader.onload = async () => {
        const typedArray = new Uint8Array(reader.result);
        const pdf = await getDocument(typedArray).promise;
        let content = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item) => item.str).join(" ");
          content += pageText + "\n";
        }
        onTextLoaded(content);
      };
      reader.readAsArrayBuffer(file);
    }

    // 处理 EPUB
    if (ext === "epub") {
      const reader = new FileReader();
      reader.onload = async () => {
        const book = ePub(reader.result);
        onTextLoaded({ type: "epub", book });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      {/* 展开 / 收起按钮 */}
      <button
        onClick={() => setShowUploader((prev) => !prev)}
        className="w-full flex items-center justify-between px-5 py-3 rounded-lg bg-[#c9a66b] hover:bg-[#b98b55] text-white font-medium shadow-sm transition"
      >
        📚 {showUploader ? "收起上传区" : "上传书籍"}
        <span className="text-lg">{showUploader ? "▲" : "▼"}</span>
      </button>

      {/* 折叠面板区域 */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          showUploader ? "max-h-60 mt-4 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/70 backdrop-blur-sm border border-gray-200/60 rounded-xl p-4 shadow-sm transition">
          <label
            htmlFor="file-upload"
            className="flex items-center justify-center px-5 py-3 rounded-lg cursor-pointer bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium transition"
          >
            📂 选择文件（.txt / .pdf / .epub）
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".txt,.pdf,.epub"
            onChange={(e) => {
              handleFileUpload(e);
              e.target.value = ""; // 允许连续上传同一文件
            }}
            className="hidden"
          />

          {fileName && (
            <p className="text-sm text-gray-500 mt-3 text-center italic">
              已加载：
              <span className="text-gray-700 font-medium">{fileName}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
