import { useState, useCallback } from "react";

interface TranslatedSentences {
  [key: number]: string;
}

export const useTranslationProgress = () => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [translatedSentences, setTranslatedSentences] = useState<TranslatedSentences>({});
  const [userInput, setUserInput] = useState("");
  const [completed, setCompleted] = useState(false);


  // Lưu câu dịch
  const saveSentence = useCallback((index: number, translation: string) => {
    setTranslatedSentences(prev => ({
      ...prev,
      [index]: translation
    }));
  }, []);


  // Chuyển sang câu tiếp theo
  const nextSentence = useCallback((totalSentences: number) => {
    if (currentSentence < totalSentences - 1) {
      setCurrentSentence(prev => prev + 1);
      setUserInput("");
      return true;
    } else {
      setCompleted(true);
      return false;
    }
  }, [currentSentence]);


  // Quay lại câu trước
  const prevSentence = useCallback(() => {
    if (currentSentence > 0) {
      setCurrentSentence(prev => prev - 1);
      setUserInput("");
      return true;
    }
    return false;
  }, [currentSentence]);


  // Chuyển đến câu cụ thể
  const goToSentence = useCallback((index: number) => {
    setCurrentSentence(index);
    setUserInput("");
  }, []);


  // Tải bản dịch đã lưu
  const loadSavedTranslation = useCallback((index: number) => {
    const saved = translatedSentences[index];
    setUserInput(saved || "");
  }, [translatedSentences]);


  // Đặt lại tiến trình dịch
  const resetProgress = useCallback(() => {
    setCurrentSentence(0);
    setTranslatedSentences({});
    setUserInput("");
    setCompleted(false);
  }, []);


  // Lấy tiến trình dịch (%)
  const getProgress = useCallback((totalSentences: number) => {
    const translatedCount = Object.keys(translatedSentences).length;
    return totalSentences > 0 ? (translatedCount / totalSentences) * 100 : 0;
  }, [translatedSentences]);


  // Kiểm tra câu đã dịch chưa
  const isSentenceTranslated = useCallback((index: number) => {
    return !!translatedSentences[index];
  }, [translatedSentences]);

  return {

    // State và hàm xử lý
    currentSentence,
    translatedSentences,
    userInput,
    completed,

    // Setters và actions
    setUserInput,
    setCurrentSentence,
    setCompleted,
    saveSentence,
    nextSentence,
    prevSentence,
    goToSentence,
    loadSavedTranslation,
    resetProgress,
    getProgress,
    isSentenceTranslated
  };
};