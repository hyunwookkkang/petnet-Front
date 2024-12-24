import { useCallback, useState } from "react";
import axios from 'axios';


function useFetchAddComment() {

  // 상태 관리: loading(로딩 상태), error(에러 상태)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  // 비동기 함수로 API 호출
  const fetchAddComment = useCallback(async (comment, imageFile) => {
    // 상태 초기화
    setLoading(true);
    setError(null);

    // 전송 데이터 전처리 (폼 데이터)
    const formData = new FormData();
    formData.append('comment', JSON.stringify(comment));
    formData.append('imageFile', imageFile);

    try {
      // axios로 post 요청 보내기
      const response = await axios.post(`/api/comments`, comment, {
        headers: { 
          'Content-Type': 'multipart/form-data' 
        }
      });
      return response.data;
    } 
    catch (err) {
      console.error('axios fetch add comment error:', err);
      setError(`Error: ${err.response ? err.response.data.message : err.message}`);
      throw new Error(err);
    } 
    finally {
      setLoading(false);
    }
  }, []);

  return { fetchAddComment, loading, error }
}

export default useFetchAddComment;
