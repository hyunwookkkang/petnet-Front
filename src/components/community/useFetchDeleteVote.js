import { useCallback, useState } from "react";
import axios from 'axios';


function useFetchDeleteVote() {

  // 상태 관리: loading(로딩 상태), error(에러 상태)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  // 비동기 함수로 API 호출
  const fetchDeleteVote = useCallback(async (vote) => {
    // 상태 초기화
    setLoading(true);
    setError(null);
    const { userId='', targetTopicId='', targetCommentId='', isLike='' } = vote || {};
    
    // set query string
    const request = `/api/votes`
                  + `?userId=${userId}`
                  + `&targetTopicId=${targetTopicId}`
                  + `&targetCommentId=${targetCommentId}`
                  + `&isLike=${isLike}`;
    try {
      // axios로 delete 요청 보내기
      const response = await axios.delete(request);
      return response.data;
    } 
    catch (err) {
      console.error('axios fetch delete vote error:', err);
      setError(`Error: ${err.response ? err.response.data.message : err.message}`);
      throw new Error(err);
    } 
    finally {
      setLoading(false);
    }
  }, []);

  return { fetchDeleteVote, loading, error }
}

export default useFetchDeleteVote;
