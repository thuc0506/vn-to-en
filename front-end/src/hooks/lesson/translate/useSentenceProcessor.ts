import { useMemo } from "react";

// Xử lý câu trong bài dịch
interface TranslatedSentences {
  [key: number]: string;
}

export const useSentenceProcessor = (
  content: string | undefined,
  translatedSentences: TranslatedSentences
) => {
  // Phân tích nội dung thành từng câu
  const sentences = useMemo(() => {
    if (!content) return [];
    
    const splitSentences = content
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
    
    return splitSentences;
  }, [content]);

  // Tạo nội dung hiển thị với các câu đã dịch được thay thế
  const displayContent = useMemo(() => {
    if (!content) return "";
    
    let updatedContent = content;
    
    Object.entries(translatedSentences).forEach(([index, translation]) => {
      const originalSentence = sentences[parseInt(index)];
      if (originalSentence) {
        updatedContent = updatedContent.replace(originalSentence, translation);
      }
    });
    
    return updatedContent;
  }, [content, translatedSentences, sentences]);

  // Highlight câu hiện tại trong đoạn văn
  const getHighlightedContent = (currentSentence: number): string => {
    const currentOriginalSentence = sentences[currentSentence];
    const currentTranslatedSentence = translatedSentences[currentSentence];
    
    if (!currentOriginalSentence) return displayContent;
    
    const sentenceToHighlight = currentTranslatedSentence || currentOriginalSentence;
    
    return displayContent.replace(
      sentenceToHighlight,
      `<mark class="bg-yellow-200 p-1 rounded">${sentenceToHighlight}</mark>`
    );
  };

  // Tìm câu dựa trên text được chọn
  const findSentenceByText = (selectedText: string): number => {
    return sentences.findIndex(sentence => 
      sentence.includes(selectedText) || selectedText.includes(sentence)
    );
  };

  return {
    sentences,
    displayContent,
    getHighlightedContent,
    findSentenceByText
  };
};