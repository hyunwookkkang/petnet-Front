import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Container } from "react-bootstrap";

import TopicSearchBar from "../../../components/community/topic/TopicSearchBar";
import useFetchGetTopics from "../../../components/community/topic/useFetchGetTopics";

import "../../../styles/Main.css"; // 기존 스타일 재사용


const SearchTopics = () => {

  const { fetchGetTopics, error } = useFetchGetTopics();

  const [topics, setTopics] = useState([]);

  const [search, setSearch] = useState({
    "category": '',
    "condition": '',
    "keyword": ''
  });

  useEffect(() => {
    // 페이지 초기화
    const fetchTopics = async () => {
      const response = await fetchGetTopics(search);
      setTopics(response || []);
    };
    fetchTopics();

  }, [fetchGetTopics, search]);


  // 에러가 발생했을 때 표시할 메시지
  if (error) {
    return <div>Error: {error}</div>;
  }

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


  return (

    <Container>

      <TopicSearchBar setSearch={setSearch}/>
      <br/>
      
      <div>
        <br/>
        { topics.length === 0 ? (
          <p>게시글이 없습니다</p> // topics가 빈 배열일 경우
        ) : (
          <ul>{topicsView}</ul> // topics 배열에 데이터가 있을 경우
        )}
      </div>

    </Container>

  );

}

export default SearchTopics;
