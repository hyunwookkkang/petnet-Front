import { useState } from "react";
import axios from 'axios';


function useFetchUpdateTopic() {

  // 상태 관리: loading(로딩 상태), error(에러 상태)
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState();

  // 비동기 함수로 API 호출
  const fetchUpdateTopic = async (newTopic) => {
    // 상태 초기화
    setUpdateLoading(true);
    setUpdateError(null);

    try {
      // axios로 put 요청 보내기
      const response = await axios.put('/api/topics', newTopic);
      return response.data; // 받아온 데이터를 반환
    } 
    catch (err) {
      console.log('axios fetch update topic error:', err);
      setUpdateError(`Error: ${err.response ? err.response.data : err.message}`);
    } 
    finally {
      setUpdateLoading(false); // 로딩 종료
    }
  };

  return { fetchUpdateTopic, updateLoading, updateError }
}

export default useFetchUpdateTopic;
