import { useCallback, useState } from "react";
import axios from 'axios';


function useFetchAddScrap() {

  // 상태 관리: loading(로딩 상태), error(에러 상태)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  // 비동기 함수로 API 호출
  const fetchAddScrap = useCallback(async (userId, topicId) => {
    // 상태 초기화
    setLoading(true);
    setError(null);

    try {
      // axios로 post 요청 보내기
      const response = await axios.post(`/api/topics/scrap`, {
        "userId": userId || '',
        "topicId": topicId || 0
      });
      return response.data;
    } 
    catch (err) {
      console.log('axios fetch add scrap error:', err);
      setError(`Error: ${err.response ? err.response.data : err.message}`);
    } 
    finally {
      setLoading(false);
    }
  }, []);

  return { fetchAddScrap, loading, error }
}

export default useFetchAddScrap;
