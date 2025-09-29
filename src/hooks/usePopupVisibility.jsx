import { useEffect } from "react";

export function usePopupVisibility(setPopup, iframeDoc = null) {
  useEffect(() => {
    // 点击空白处关闭
    const handleClick = (e) => {
      const popupEl = document.querySelector("#popup");
      if (popupEl && e.target && popupEl.contains(e.target)) return;

      console.log("[usePopupVisibility] 点击 Popup 外部 -> 关闭");
      setPopup((prev) => (prev.show ? { ...prev, show: false } : prev));
    };

    // 主文档选区变化
    const handleSelectionChangeMain = () => {
      const sel = window.getSelection();
      if (!sel || sel.toString().trim() === "") {
        console.log("[usePopupVisibility] 主文档选区被清空 -> 关闭 Popup");
        setPopup((prev) => (prev.show ? { ...prev, show: false } : prev));
      }
    };

    // iframe 内部选区变化
    const handleSelectionChangeIframe = () => {
      if (!iframeDoc) return;
      const sel = iframeDoc.getSelection();
      if (!sel || sel.toString().trim() === "") {
        console.log("[usePopupVisibility] iframe 选区被清空 -> 关闭 Popup");
        setPopup((prev) => (prev.show ? { ...prev, show: false } : prev));
      }
    };

    // 主文档监听
    document.addEventListener("click", handleClick);
    document.addEventListener("selectionchange", handleSelectionChangeMain);

    // iframe 内部监听
    if (iframeDoc) {
      iframeDoc.addEventListener("click", handleClick);
      iframeDoc.addEventListener(
        "selectionchange",
        handleSelectionChangeIframe
      );
    }

    return () => {
      // 主文档解绑
      document.removeEventListener("click", handleClick);
      document.removeEventListener(
        "selectionchange",
        handleSelectionChangeMain
      );

      // iframe 解绑
      if (iframeDoc) {
        iframeDoc.removeEventListener("click", handleClick);
        iframeDoc.removeEventListener(
          "selectionchange",
          handleSelectionChangeIframe
        );
      }
    };
  }, [setPopup, iframeDoc]); // ✅ 保持依赖数组稳定
}
