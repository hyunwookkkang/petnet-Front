import { useCallback, useState } from "react";
import axios from "axios";


function useFetchGetTopics() {

  // 상태 관리: loading(로딩 상태), error(에러 상태)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 비동기 함수로 API 호출
  const fetchGetTopics = useCallback(async (search) => {
    // 상태 초기화
    setLoading(true);
    setError(null);
    const { category='', condition='', keyword='', offset=0 } = search;

    // set query string
    const request = `/api/topics?`
                  + `&searchCategory1=${category}`
                  + `&searchCondition=${condition}`
                  + `&searchKeyword=${keyword}`
                  + `&offset=${offset}`;

    // const request = new URL(`http://localhost:8000/api/topics`);
    // const params = new URLSearchParams();
    // params.append("searchCategory1", search.category);
    // params.append("searchCondition", search.condition);
    // params.append("searchkeyword", search.keyword);
    // request.search = params.toString();
    try {
      // axios로 get 요청 보내기
      const response = await axios.get(request);
      return response.data;
    } 
    catch (err) {
      console.log('axios fetch get topics error:', err);
      setError(`Error: ${err.response ? err.response.data : err.message}`);
    } 
    finally {
      setLoading(false);
    }
  }, []);

  return { fetchGetTopics, loading, error }
}

export default useFetchGetTopics;
