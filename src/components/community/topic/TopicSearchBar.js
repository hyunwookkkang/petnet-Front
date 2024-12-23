import React, { useEffect, useRef, useState } from "react";
import { Form, ListGroup } from "react-bootstrap";

import useFetchGetHashtags from "./useFetchGetHashtags";

import "../../../styles/SearchBar.css"; // 검색 바 스타일 파일 (선택사항)


const TopicSearchBar = ({search, setSearch, focus}) => {

  const inputRef = useRef(null);
  
  const { fetchGetHashtags, /*loading: tagloading, error: tagError*/ } = useFetchGetHashtags();

  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [keyword, setKeyword] = useState('');
  
  const [tagSuggestions, setTagSuggestions] = useState([]); // 해시태그 자동완성


  // 검색 초기화
  useEffect(() => {
    if (search) {
      setCategory(search.category || '');
      setCondition(search.condition || '');
      setKeyword(search.keyword || '');
    }
  }, [search]);

  // 최초 열람 시 커서 위치
  useEffect(() => {
    if (inputRef.current && focus) {
      inputRef.current.focus();
    }
  }, [focus]);


  // 해시태그 자동완성
  useEffect(() => {
    const fetchSuggestions = async () => {
      // 조건 검사
      if (!keyword.trim() || condition !== "4") {
        setTagSuggestions([]);
        return;
      }
      // 해시태그 비동기 검색
      try {
        const resHashTags = await fetchGetHashtags(keyword);
        setTagSuggestions(resHashTags || []);
      } 
      catch (err) {
        console.error(err);
        setTagSuggestions([]);
      }
    };
    // 비동기 함수 호출
    fetchSuggestions();
  }, [keyword, condition, fetchGetHashtags]);


  const searchTopicHandler = (e) => {
    e.preventDefault();

    setSearch({
      "category": category,
      "condition": condition,
      "keyword": keyword
    });
  }


  return (

    <Form onSubmit={searchTopicHandler}>

      <Form.Group className="search-bar position-relative">

        <Form.Control
          type="text"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ paddingRight: '30px' }}
          ref={inputRef}
        />

        <ListGroup className="dropdown-suggestions search">
          {tagSuggestions.map((tagSuggestion, index) => (
            <ListGroup.Item
              key={index}
              onClick={() => setKeyword(tagSuggestion)}
            >
              {tagSuggestion}
            </ListGroup.Item>
          ))}
        </ListGroup>

        <button type="submit">🔍</button>

      </Form.Group>

      <div className="d-flex gap-4 justify-content-center">
        <Form.Group className="mb-2">
          <Form.Control 
            id="category" 
            as="select" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)} 
            style={{ width: '150px' }} 
          >
            <option value="">모든 카테고리</option>
            <option value="1">잡담</option>
            <option value="2">질문</option>
            <option value="3">후기</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Control 
            id="condition" 
            as="select" 
            value={condition} 
            onChange={(e) => setCondition(e.target.value)} 
            style={{ width: '150px' }} 
            required={keyword.trim()}
          >
            <option value="" disabled hidden>검색 기준</option>
            <option value="1">제목</option>
            <option value="2">본문</option>
            <option value="3">작성자</option>
            <option value="4">해시태그</option>
          </Form.Control>
        </Form.Group>
      </div>

    </Form>

  );

}

export default TopicSearchBar;

