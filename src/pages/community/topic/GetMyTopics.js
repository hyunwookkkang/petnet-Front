import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Container } from "react-bootstrap";

import { useUser } from "../../../components/contexts/UserContext";
import TopicSearchBar from "../../../components/community/topic/TopicSearchBar";
import useFetchGetMyTopics from "../../../components/community/topic/useFetchGetMyTopics";

import "../../../styles/Main.css"; // 기존 스타일 재사용


const GetMyTopics = () => {

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
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login"); // 로그인 페이지로 리다이렉트
      return;
    }

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
      
      <TopicSearchBar setSearch={setSearch}/>
      <br/>
      
      <div>
        <h1>View My Topics</h1>
        <br/>
        { topics.length === 0 ? (
          <p>내가 작성한 게시글이 없습니다</p> // topics가 빈 배열일 경우
        ) : (
          <ul>{topicsView}</ul> // topics 배열에 데이터가 있을 경우
        )}
      </div>

    </Container>

  );

}

export default GetMyTopics;
