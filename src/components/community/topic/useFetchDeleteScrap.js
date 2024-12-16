import { useCallback, useState } from "react";
import axios from 'axios';


function useFetchDeleteScrap() {

  // 상태 관리: loading(로딩 상태), error(에러 상태)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  // 비동기 함수로 API 호출
  const fetchDeleteScrap = useCallback(async (userId='', topicId='') => {
    // 상태 초기화
    setLoading(true);
    setError(null);

    // set query string
    const request = `/api/topics/scrap/${userId}/${topicId}`;
    try {
      // axios로 delete 요청 보내기
      const response = await axios.delete(request);
      return response.data;
    } 
    catch (err) {
      console.log('axios fetch delete scrap error:', err);
      setError(`Error: ${err.response ? err.response.data : err.message}`);
    } 
    finally {
      setLoading(false);
    }
  }, []);

  return { fetchDeleteScrap, loading, error }
}

export default useFetchDeleteScrap;
