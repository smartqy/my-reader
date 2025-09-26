import { useState } from "react";
import { GlobalWorkerOptions, getDocument } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import ePub from "epubjs";

// 设置 worker 路径
GlobalWorkerOptions.workerSrc = pdfjsWorker;

export default function FileUploader({ onTextLoaded }) {
  const [fileName, setFileName] = useState("");

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
    <div className="mb-4">
      <input
        type="file"
        accept=".txt,.pdf,.epub"
        onChange={(e) => {
          handleFileUpload(e);
          e.target.value = ""; // 允许连续上传同一文件
        }}
        className="block mb-2"
      />

      {fileName && <p className="text-sm text-gray-500">Loaded: {fileName}</p>}
    </div>
  );
}
