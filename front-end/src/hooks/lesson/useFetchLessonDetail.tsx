import { useEffect, useState } from "react";
import requestApi from "../../lib/api/requestApi";

export const useFetchLessonDetail = (lessonId: string | number) => {
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    const fetchLesson = async () => {
      try {
        setLoading(true);
        const res = await requestApi.getRequest(`/lessons/${lessonId}`);
        setLesson(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId]);

  return { lesson, loading, error };
};

export default useFetchLessonDetail;







