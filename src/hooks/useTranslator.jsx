import { useState, useRef } from "react";

export function useTranslator() {
  const [popup, setPopup] = useState({ show: false, x: 0, y: 0, content: "" });
  const busyRef = useRef(false);
  const lastRef = useRef({ text: "", t: 0 });

  const handleSelect = async ({ text: picked, x, y }) => {
    const now = Date.now();
    if (picked === lastRef.current.text && now - lastRef.current.t < 500)
      return;
    lastRef.current = { text: picked, t: now };

    setPopup({ show: true, x, y, content: "Translating..." });

    if (busyRef.current) return;
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
    }
  };

  return { popup, setPopup, handleSelect };
}
