import React, { useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import { Container } from "react-bootstrap";

import TopicSearchBar from "../../components/community/topic/TopicSearchBar";
import useFetchGetTopics from "../../components/community/topic/useFetchGetTopics";

import "../../styles/Main.css"; // 기존 스타일 재사용


const SearchTopics = () => {

  const location = useLocation();

  const { category, condition, keyword } = location.state || {};

  const { fetchGetTopics, error } = useFetchGetTopics();

  const [topics, setTopics] = useState([]);

  const [search, setSearch] = useState({
    "category": category || '',
    "condition": condition || '',
    "keyword": keyword || ''
  });


  useEffect(() => {
    // 페이지 초기화
    const fetchTopics = async () => {
      const response = await fetchGetTopics(search);
      setTopics(response || []);
    };
    fetchTopics();

  }, [fetchGetTopics, search]);


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


  // 에러가 발생했을 때 표시할 메시지
  if (error) {
    return <div>Error: {error}</div>;
  }


  return (

    <Container>

      <TopicSearchBar search={search} setSearch={setSearch} focus={true} />
      <br/>

      <div>
        { topics.length === 0 ? (
          <h5 className="community-empty-list">
            일치하는 게시글이 없습니다
          </h5>
        ) : (
          <ul style={{ paddingInlineStart: '0' }}>
            { topicsView }
          </ul>
        )}
      </div>

    </Container>

  );

}

export default SearchTopics;
