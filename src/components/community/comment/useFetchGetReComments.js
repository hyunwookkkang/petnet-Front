import { useCallback, useState } from "react";
import axios from 'axios';


function useFetchGetReComments() {

  // 상태 관리: loading(로딩 상태), error(에러 상태)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  // 비동기 함수로 API 호출
  const fetchGetReComments = useCallback(async (commentId) => {
    // 상태 초기화
    setLoading(true);
    setError(null);

    // set query string
    const request = `/api/comments/re/${commentId}`;
    try {
      // axios로 get 요청 보내기
      const response = await axios.get(request);
      return response.data;
    } 
    catch (err) {
      console.error('axios fetch re-comment error:', err);
      setError(`Error: ${err.response ? err.response.data.message : err.message}`);
      throw new Error(err);
    } 
    finally {
      setLoading(false);
    }
  }, []);

  return { fetchGetReComments, loading, error }
}

export default useFetchGetReComments;
