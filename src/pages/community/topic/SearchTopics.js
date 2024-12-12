import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Container, Form } from "react-bootstrap";

import SearchBar from "../../../components/common/searchBar/SearchBar";
import useFetchGetTopics from "../../../components/community/topic/useFetchGetTopics";

import "../../../styles/Main.css"; // 기존 스타일 재사용


const SearchTopics = () => {

  const { fetchGetTopics, loading, error } = useFetchGetTopics();

  const [topics, setTopics] = useState([]);

  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [keyword, setKeyword] = useState('');

  const [search, setSearch] = useState({
    "category": '',
    "condition": '',
    "keyword": ''
  });

  // 페이지 초기화
  useEffect(() => {

    const fetchTopics = async () => {
      const response = await fetchGetTopics(search);
      setTopics(response || []);
    };
    fetchTopics();
    
  }, [fetchGetTopics, search]);


  const searchTopicHandler = async (e) => {
    e.preventDefault();

    setKeyword("제목");

    setSearch({
      "category": category,
      "condition": condition,
      "keyword": keyword
    });
  }
  
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
        <h2>제목: {topic.title}</h2>
        <p>작성일: {topic.addDateStr}</p>
        <p>작성자: {topic.author.userId}</p>
        <p>댓글수: {topic.commentCount}</p>
      </Link>

    </div>

  ));

  return (

    <Container>

      <Form onSubmit={searchTopicHandler}>

        <Form.Group className="mb-4">
          <SearchBar/>
        </Form.Group>

        <div className="d-flex gap-4 justify-content-center">
          <Form.Group className="mb-2">
            <Form.Label htmlFor="category">카테고리</Form.Label>
            <Form.Control 
              id="category" 
              as="select" 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              style={{ width: '150px' }} 
            >
              <option value="">전체</option>
              <option value="1">잡담</option>
              <option value="2">질문</option>
              <option value="3">후기</option>
            </Form.Control>
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label htmlFor="condition">검색 기준</Form.Label>
            <Form.Control 
              id="condition" 
              as="select" 
              value={condition} 
              onChange={(e) => setCondition(e.target.value)} 
              style={{ width: '150px' }} 
            >
              <option value="" disabled hidden>검색기준</option>
              <option value="1">제목</option>
              <option value="2">본문</option>
              <option value="3">작성자</option>
              <option value="4">해시태그</option>
            </Form.Control>
          </Form.Group>
        </div>

      </Form>

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
