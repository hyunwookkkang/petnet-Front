import { useState } from "react";
import axios from 'axios';


function useFetchAddTopic() {

  // 상태 관리: loading(로딩 상태), error(에러 상태)
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState();

  // 비동기 함수로 API 호출
  const fetchAddTopic = async (newTopic) => {
    // 상태 초기화
    setAddLoading(true);
    setAddError(null);

    // axios로 post 요청 보내기
    await axios.post(`/api/topics`, newTopic)
      .then(response => {
        return response.data; // 받아온 데이터를 저장
      })
      .catch(err => {
        console.log('axios fetch add topic error : ', err);
        setAddError(`Error: ${err.response ? err.response.data : err.message}`); // 에러 처리
      })  
      .finally(() => {
        setAddLoading(false); // 로딩 종료.
      });
  };

  return { fetchAddTopic, addLoading, addError }
}

export default useFetchAddTopic;
