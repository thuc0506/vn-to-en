import { useState, useCallback } from "react";

export const usePopup = () => {
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [showHintPopup, setShowHintPopup] = useState(false);

  // Mở popup
  const openPopup = useCallback(() => {
    setShowResultPopup(true);
  }, []);

  const openHintPopup = useCallback(() => {
    setShowHintPopup(true);
  }, []);

  // Đóng popup
  const closePopup = useCallback(() => {
    setShowResultPopup(false);
  }, []);

  const closeHintPopup = useCallback(() => {
    setShowHintPopup(false);
  }, []);

  // Chuyển đổi trạng thái popup
  const togglePopup = useCallback(() => {
    setShowResultPopup(prev => !prev);
  }, []);

  const toggleHintPopup = useCallback(() => {
    setShowHintPopup(prev => !prev);
  }, []);

  return {
    // ✅ Popup Kết quả
    showResultPopup,
    openPopup,
    closePopup,
    togglePopup,
    setShowResultPopup,

    // ✅ Popup Gợi ý
    showHintPopup,
    openHintPopup,
    closeHintPopup,
    toggleHintPopup,
    setShowHintPopup,
  };
};
