import { useState, useRef } from "react";

export function useTranslator() {
  const [popup, setPopup] = useState({ show: false, x: 0, y: 0, content: "" });
  const busyRef = useRef(false);
  const lastRef = useRef({ text: "", t: 0 });

  const handleSelect = async ({ text: picked, x, y }) => {
    if (!picked || picked.trim() === "") {
      console.log("[useTranslator] 空选区，忽略");
      return;
    }

    const now = Date.now();
    if (picked === lastRef.current.text && now - lastRef.current.t < 500) {
      console.log("[useTranslator] 短时间重复选中，忽略");
      return; // 避免短时间重复触发
    }
    lastRef.current = { text: picked, t: now };

    console.log("[useTranslator] Translating ");
    setPopup({ show: true, x, y, content: "Translating..." });

    if (busyRef.current) return;
    console.log("[useTranslator] 正在翻译中，忽略新的请求");
    busyRef.current = true;

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
    } catch (e) {
      console.error(e);
      setPopup({ show: true, x, y, content: "❌ Error connecting to server" });
    } finally {
      busyRef.current = false;
      console.log("[useTranslator] busyRef 重置为 false");
    }
  };

  return { popup, setPopup, handleSelect };
}
