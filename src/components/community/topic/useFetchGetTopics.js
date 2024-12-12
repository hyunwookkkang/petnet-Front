import { useEffect, useState } from "react";

import "../../../styles/Main.css"; // 기존 스타일 재사용


function useFetchGetTopics(search) {

  // 상태 관리: topics(주제 리스트), loading(로딩 상태), error(에러 상태)
  const [topics, setTopics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { category, condition, keyword } = search;

  // useEffect를 사용하여 컴포넌트가 마운트될 때 API 호출
  useEffect(() => {
  
    // 비동기 함수로 API 호출
    const fetchTopics = async () => {
      try {
        // const request = new URL(`http://localhost:8000/api/topics`);
        // const params = new URLSearchParams();
        // params.append("searchCategory1", search.category);
        // params.append("searchCondition", search.condition);
        // params.append("searchkeyword", search.keyword);
        // request.search = params.toString();

        const request = `/api/topics`
                      + `?searchCategory1=${category}`
                      + `&searchCondition=${condition}`
                      + `&searchKeyword=${keyword}`;

        const response = await fetch(request);
        
        if (!response.ok) {
          throw new Error('Failed to fetch topics');
        }
        const data = await response.json(); // JSON 형태로 데이터 받기
        setTopics(data); // 받아온 데이터를 상태에 저장

      } catch (err) {
        setError(err.message); // 에러 처리
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchTopics(); // API 호출 실행

  }, [category, condition, keyword]);

  return { topics, loading, error }
}

export default useFetchGetTopics;
