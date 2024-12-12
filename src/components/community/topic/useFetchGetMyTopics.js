import { useCallback, useState } from "react";
import axios from 'axios';


function useFetchGetMyTopics() {

  // 상태 관리: loading(로딩 상태), error(에러 상태)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  // 비동기 함수로 API 호출
  const fetchGetMyTopics = useCallback(async (userId, search) => {
    // 상태 초기화
    setLoading(true);
    setError(null);
    const { category = '', condition = '', keyword = '' } = search || {};

    // set query string
    const request = `/api/topics/mine/${userId}`
                  + `?searchCategory1=${category}`
                  + `&searchCondition=${condition}`
                  + `&searchKeyword=${keyword}`;
    try {
      // axios로 get 요청 보내기
      const response = await axios.get(request);
      return response.data;
    } 
    catch (err) {
      console.log('axios fetch get my topics error:', err);
      setError(`Error: ${err.response ? err.response.data : err.message}`);
    } 
    finally {
      setLoading(false);
    }
  }, []);

  return { fetchGetMyTopics, loading, error }
}

export default useFetchGetMyTopics;
