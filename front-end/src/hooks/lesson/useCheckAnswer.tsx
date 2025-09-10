import { useState } from "react";
import requestApi from "../../lib/api/requestApi";

interface CheckAnswerResponse {
  score: number;
  vocab: string;
  grammar: string;
  correctExample: string;
  otherTip: string;
}

export const useCheckAnswer = () => {
  const [result, setResult] = useState<CheckAnswerResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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

  return { checkAnswer, result, loading, error };
};

export default useCheckAnswer;
