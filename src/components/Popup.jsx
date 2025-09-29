import { motion } from "framer-motion";
import { X } from "lucide-react"; // 需要安装 lucide-react: npm i lucide-react

function LoadingDots() {
  return (
    <span className="inline-flex space-x-1 ml-1">
      <span className="animate-bounce">.</span>
      <span className="animate-bounce delay-150">.</span>
      <span className="animate-bounce delay-300">.</span>
    </span>
  );
}

export default function Popup({ popup, onClose }) {
  if (!popup.show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 8 }}
      transition={{ duration: 0.2 }}
      id="popup"
      className="fixed z-50 bg-white border border-gray-200 shadow-2xl rounded-xl p-4 w-72"
      style={{
        top: popup.y + 8,
        left: popup.x + 8,
      }}
    >
      {/* 标题 + 关闭按钮 */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-semibold text-gray-700">
          {popup.isLoading ? "正在翻译..." : "翻译结果"}
        </h2>
      </div>

      {/* 内容区域 */}
      <div className="text-gray-700 leading-snug text-sm whitespace-pre-line">
        {popup.isLoading ? (
          <span className="text-gray-500 flex items-center">
            请稍候 <LoadingDots />
          </span>
        ) : (
          popup.content
        )}
      </div>
    </motion.div>
  );
}
