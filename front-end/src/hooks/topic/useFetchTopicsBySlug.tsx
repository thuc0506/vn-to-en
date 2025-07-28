import { useEffect, useState } from "react";
import requestApi from "../../lib/api/requestApi";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  type: 'video' | 'audio' | 'translate';
  slug: string;
}

interface Section {
  id: number;
  title: string;
  slug: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  lessons: Lesson[];
}

interface Topic {
  id: number;
  title: string;
  description: string;
  slug: string;
  level: string;
  type: string;
  totalLessons: number;
  sections: Section[];
}

export const useFetchTopicsBySlug = (slug?: string) => {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetch = async () => {
      try {
        const response = await requestApi.getRequest(`/topic/getBySlug/${slug}`);
        setTopic(response.data); // ✅ Đúng kiểu object
      } catch (error) {
        console.error("Error fetching topic:", error);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [slug]);

  return { topic, loading };
};

export default useFetchTopicsBySlug;