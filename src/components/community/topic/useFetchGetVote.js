import { useCallback, useState } from "react";
import axios from 'axios';


function useFetchGetVote() {

  // 상태 관리: loading(로딩 상태), error(에러 상태)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  // 비동기 함수로 API 호출
  const fetchGetVote = useCallback(async (vote) => {
    // 상태 초기화
    setLoading(true);
    setError(null);
    const { userId='', topicId='', commentId='', isLike='' } = vote || {};

    // set query string
    const request = `/api/votes`
                  + `?userId=${userId}`
                  + `&targetTopicId=${topicId}`
                  + `&targetCommentId=${commentId}`
                  + `&isLike=${isLike}`;
    try {
      // axios로 get 요청 보내기
      const response = await axios.get(request);
      return response.data;
    } 
    catch (err) {
      console.log('axios fetch get vote error:', err);
      setError(`Error: ${err.response ? err.response.data : err.message}`);
    } 
    finally {
      setLoading(false);
    }
  }, []);

  return { fetchGetVote, loading, error }
}

export default useFetchGetVote;
