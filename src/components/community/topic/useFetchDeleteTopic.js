import { useCallback, useState } from "react";
import axios from 'axios';


function useFetchDeleteTopic() {

  // 상태 관리: loading(로딩 상태), error(에러 상태)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 비동기 함수로 API 호출
  const fetchDeleteTopic = useCallback(async (topicId) => {
    // 상태 초기화
    setLoading(true);
    setError(null);

    // set query string
    const request = `/api/topics/${topicId}`;
    try {
      // axios로 delete 요청 보내기
      const response = await axios.delete(request);
      return response.data;
    } 
    catch (err) {
      setError(`Error: ${err.response ? err.response.data.message : err.message}`);
      throw new Error('axios fetch delete topic error:', err);
    } 
    finally {
      setLoading(false);
    }
  }, []);

  return { fetchDeleteTopic, loading, error }
}

export default useFetchDeleteTopic;
