import { useEffect, useState } from "react";
import axios from 'axios';


function useFetchGetTopic(topicId) {

  // 상태 관리: topic(게시글), loading(로딩 상태), error(에러 상태)
  const [topic, setTopic] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  // useEffect를 사용하여 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
  
    // 비동기 함수로 API 호출
    const fetchGetTopic = async () => {
      // axios로 GET 요청 보내기
      await axios.get(`http://localhost:8000/api/topics/${topicId}`)
        .then(response => {
          setTopic(response.data); // 받아온 데이터를 저장
        })
        .catch(err => {
          console.log('axios fetch get topic error : ', err);
          setError(`Error: ${err.response ? err.response.data : err.message}`); // 에러 처리
        })  
        .finally(() => {
          setLoading(false); // 로딩 종료.
        });
    };

    fetchGetTopic(); // API 호출 실행

  }, [topicId]);

  return { topic, loading, error }
}

export default useFetchGetTopic;
