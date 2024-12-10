import { useCallback, useState } from "react";
import axios from 'axios';


function useFetchGetScrapTopics() {

  // 상태 관리: loading(로딩 상태), error(에러 상태)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  // 비동기 함수로 API 호출
  const fetchGetScrapTopics = useCallback(async (userId, search) => {
    // 상태 초기화
    setLoading(true);
    setError(null);
    const { category = '', condition = '', keyword = '' } = search || {};

    // set query string
    const request = `http://localhost:8000/api/topics/scrap/${userId}`
                  + `?searchCategory1=${category}`
                  + `&searchCondition=${condition}`
                  + `&searchKeyword=${keyword}`;
    try {
      // axios로 get 요청 보내기
      const response = await axios.get(request);
      return response.data;
    } 
    catch (err) {
      console.log('axios fetch get scrap topics error:', err);
      setError(`Error: ${err.response ? err.response.data : err.message}`);
    } 
    finally {
      setLoading(false);
    }
  }, []);

  return { fetchGetScrapTopics, loading, error }
}

export default useFetchGetScrapTopics;
