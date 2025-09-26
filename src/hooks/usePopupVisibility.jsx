import { useEffect } from "react";

export function usePopupVisibility(setPopup) {
  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.toString().trim() === "") {
        // 清空时隐藏浮窗
        setPopup((prev) => ({ ...prev, show: false }));
      }
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [setPopup]);
}
