import { useEffect, useState } from "react";
import requestApi from "../../lib/api/requestApi"; // chú ý path đúng 1 dấu `/`

export const useFetchTopicsByType = (type: string) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await requestApi.getRequest(`/topic/getByType/${type}`);
        setTopics(response.data);
      } catch (error) {
        console.error("Error fetching topics:", error);
      } finally {
        setLoading(false);
      }
    };

    if (type) {
      fetchTopics();
    }
  }, [type]);

  return { topics, loading }; // ❗❗ QUAN TRỌNG
};

export default useFetchTopicsByType;