import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import useFetchGetHotTopics from "./useFetchGetHotTopics";

import "../../../styles/Main.css"; // 기존 스타일 재사용


const ViewHotTopics = () => {

  const { fetchGetHotTopics, loading, error } = useFetchGetHotTopics();
    
  const [topics, setTopics] = useState([]);


  // 페이지 초기화
  useEffect(() => {
    const fetchTopics = async () => {
      const response = await fetchGetHotTopics();
      setTopics(response || []);
    };
    fetchTopics();
  },[fetchGetHotTopics]);
  

  // 로딩 중일 때 표시할 메시지
  if (loading) {
    return <div>Loading...</div>;
  }

  // 에러가 발생했을 때 표시할 메시지
  if (error) {
    return <div>Error: {error}</div>;
  }


  const topicsView = topics.map((topic) => (
    <div key={topic.topicId}>

      <Link className="link-unstyled" to={`/getTopic/${topic.topicId}`}>
        <li className="topics-normal-item">
          <div className="topics-header">
            <strong className="topics-title">[{topic.categoryStr}] {topic.title}</strong>
            <span className="topics-comments">댓글 {topic.commentCount}</span>
          </div>
          <div className="topics-footer">
            <span className="topics-author">{topic.author.nickname}</span>
            <span className="topics-date">{topic.addDateStr}</span>
          </div>
        </li>
      </Link>

    </div>
  ));

  
  return (

    <div>

      <h1>금주의 인기글</h1>
      <br/>
      { topics.length === 0 ? (
        <p>아직 인기 게시글이 없습니다</p> // topics가 빈 배열일 경우
      ) : (
        <ul style={{ paddingInlineStart: '0' }}>
          { topicsView }
        </ul> // topics 배열에 데이터가 있을 경우
      )}

    </div>

  );

}

export default ViewHotTopics;
