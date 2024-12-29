import { useCallback, useState } from "react";
import axios from "axios";


function useFetchGetHotTopics() {

  // 상태 관리: loading(로딩 상태), error(에러 상태)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 비동기 함수로 API 호출
  const fetchGetHotTopics = useCallback(async (search) => {
    // 상태 초기화
    setLoading(true);
    setError(null);

    const offset = search ? search.offset : 0;

    // set query string
    const request = `/api/topics/hot`
                  + `?offset=${offset}`;
    try {
      // axios로 get 요청 보내기
      const response = await axios.get(request);
      return response.data;
    } 
    catch (err) {
      console.log('axios fetch get hot topics error:', err);
      setError(`Error: ${err.response ? err.response.data : err.message}`);
    } 
    finally {
      setLoading(false);
    }
  }, []);

  return { fetchGetHotTopics, loading, error }
}

export default useFetchGetHotTopics;
