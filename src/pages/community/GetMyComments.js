import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Container } from "react-bootstrap";

import { useUser } from "../../components/contexts/UserContext";
import useFetchGetMyTopics from "../../components/community/topic/useFetchGetMyTopics";

import "../../styles/Main.css"; // 기존 스타일 재사용


const GetMyComments = () => {

  const navigate = useNavigate();

  const { userId } = useUser(''); // 사용자 ID 가져오기

  const { fetchGetMyTopics, error } = useFetchGetMyTopics();

  const [topics, setTopics] = useState([]);
  
  const [search, setSearch] = useState({
    "category": '',
    "condition": '',
    "keyword": ''
  });


  useEffect(() => {

    const fetchTopics = async () => {
      const response = await fetchGetMyTopics(userId, search);
      setTopics(response || []);
    };
    fetchTopics();

  }, [fetchGetMyTopics, userId, search, navigate]);


  const topicsView = topics.map((topic) => (

    <div key={topic.topicId}>

      <Link className="link-unstyled" to={`/getTopic/${topic.topicId}`}>
        <h2>제목: {topic.title}</h2>
        <p>작성일: {topic.addDateStr}</p>
        <p>작성자: {topic.author.userId}</p>
        <p>댓글수: {topic.commentCount}</p>
      </Link>

    </div>

  ));


  // 에러가 발생했을 때 표시할 메시지
  if (error) {
    return <div>Error: {error}</div>;
  }

  
  return (

    <Container>
      
      <div>
        <h1>View My Comments</h1>
        <br/>
        { topics.length === 0 ? (
          <p>내가 작성한 댓글이 없습니다</p>
        ) : (
          <ul>{topicsView}</ul>
        )}
      </div>

    </Container>

  );

}

export default GetMyComments;
