import { useRef, useLayoutEffect, useState } from "react";
import { motion } from "framer-motion";

function LoadingDots() {
  return (
    <span className="inline-flex space-x-1 ml-1">
      <span className="animate-bounce">.</span>
      <span className="animate-bounce delay-150">.</span>
      <span className="animate-bounce delay-300">.</span>
    </span>
  );
}

export default function Popup({ popup }) {
  const popupRef = useRef(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (popup.show && popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let top = popup.y + 12;
      let left = popup.x + 12;

      // 👉 水平位置修正
      if (left + rect.width > vw) {
        left = popup.x - rect.width - 12;
      }
      if (left < 12) left = 12;

      // 👉 垂直位置修正
      if (top + rect.height > vh) {
        top = popup.y - rect.height - 12;
      }
      if (top < 12) top = 12;

      setPosition({ top, left });
    }
  }, [popup]);

  if (!popup.show) return null;

  return (
    <motion.div
      ref={popupRef}
      initial={{ opacity: 0, scale: 0.95, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 6 }}
      transition={{ duration: 0.25 }}
      id="popup"
      className="fixed z-50 w-80 p-5 rounded-2xl border border-gray-200
                 bg-white/90 backdrop-blur-md shadow-xl"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      {/* 标题 */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-gray-800 tracking-wide">
          {popup.isLoading ? "正在翻译..." : "翻译结果"}
        </h2>
      </div>

      {/* 内容 */}
      <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
        {popup.isLoading ? (
          <p className="text-gray-500 flex items-center">
            请稍候 <LoadingDots />
          </p>
        ) : (
          popup.content
        )}
      </div>
    </motion.div>
  );
}
