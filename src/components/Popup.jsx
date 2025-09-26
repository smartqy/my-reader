import { motion } from "framer-motion";

export default function Popup({ popup }) {
  if (!popup.show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 4 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 4 }}
      transition={{ duration: 0.2 }}
      className="fixed z-50 bg-gradient-to-br from-blue-50 to-white border border-blue-200 shadow-xl rounded-xl px-4 py-3 text-sm text-gray-800 max-w-xs"
      style={{
        top: popup.y + 6, // 距离选区底部 6px
        left: popup.x + 6, // 距离选区右侧 6px
        pointerEvents: "none",
      }}
    >
      <p className="text-gray-700 leading-snug">{popup.content}</p>
    </motion.div>
  );
}
