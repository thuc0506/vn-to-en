import { useState } from "react";
import requestApi from "../../../lib/api/requestApi";
import { set } from "date-fns";

interface TranslateLessonResponse {
  score: number;
  vocab: string;
  grammar: string;
  correctExample: string;
  otherTip: string;
}

interface HintResponse {
  vocab: string;
  grammar: string;
  suggestion: string;
}

export const useTranslateLesson = () => {
  const [result, setResult] = useState<TranslateLessonResponse | null>(null);
  const [hint, setHint] = useState<HintResponse | null>(null);  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  // Check answer
  const checkAnswer = async (sentence: string, answer: string, level: string) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res = await requestApi.postRequest(`/lession-text/check`, {
        sentence,
        answer,
        level,
      });

      setResult(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Có lỗi xảy ra khi kiểm tra đáp án");
    } finally {
      setLoading(false);
    }
  };


  // Hint
  const getHint = async (sentence: string, level: string) => {
    try {
      setLoading(true);
      setError(null);
      setHint(null);
      const res = await requestApi.postRequest(`/lession-text/generate-hint`, {
        sentence,
        level,
      });
      setHint(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Có lỗi xảy ra khi lấy gợi ý");
    } finally {
      setLoading(false);
    }     
  };

  return { checkAnswer, getHint, result, hint, loading, error };
};


