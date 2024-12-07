import React from "react";
import { Link } from 'react-router-dom';

import "../../../styles/Main.css"; // 기존 스타일 재사용
import useFetchTopics from "./useFetchTopics";


const ViewTopics = ({search}) => {

  // 페이지 초기화
  const { topics, loading, error } = useFetchTopics(search);
  
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

      <Link className="link-unstyled" to={`/topicInfo/${topic.topicId}`}>
        <h2>제목: {topic.title}</h2>
        <p>작성일: {topic.addDateStr}</p>
        <p>작성자: {topic.authorId}</p>
        <p>댓글수: {topic.commentCount}</p>
      </Link>

    </div>
    
  ));

  return (

    <div>

      <h1>View Topics</h1>
      <br/>
      <ul>
        {/* topics 배열을 순회하며 각 topic을 출력 */}
        { topicsView }
      </ul>

    </div>

  );

}

export default ViewTopics;
