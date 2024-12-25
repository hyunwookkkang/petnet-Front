import { useCallback, useState } from "react";
import axios from 'axios';


function useFetchGetTopic() {

  // 상태 관리: loading(로딩 상태), error(에러 상태)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 비동기 함수로 API 호출
  const fetchGetTopic = useCallback(async (topicId) => {
    // 상태 초기화
    setLoading(true);
    setError(null);

    // set query string
    const request = `/api/topics/${topicId}`;
    try {
      // axios로 get 요청 보내기
      const response = await axios.get(request);
      return response.data;
    } 
    catch (err) {
      console.error('axios fetch get topic error:', err);
      setError(`Error: ${err.response ? err.response.data.message : err.message}`);
      throw new Error(err);
    } 
    finally {
      setLoading(false);
    }
  }, []);

  return { fetchGetTopic, loading, error }
}

export default useFetchGetTopic;
