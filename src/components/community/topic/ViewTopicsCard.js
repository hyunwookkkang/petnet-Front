import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Container, Card } from "react-bootstrap";

import useFetchGetTopics from "./useFetchGetTopics";

import "../../../styles/Main.css"; // 기존 스타일 재사용


const ViewTopicsCard = ({category}) => {

  const { fetchGetTopics, loading, error } = useFetchGetTopics();

  const [topicCategory, setTopicCategory] = useState('');
  const [topics, setTopics] = useState([]);

  // 페이지 초기화
  useEffect(() => {
    const search = {
      "category": category
    }

    switch(category) {
      case '1': setTopicCategory('잡담'); break;
      case '2': setTopicCategory('질문'); break;
      case '3': setTopicCategory('후기'); break;
      default: setTopicCategory('???');
    }

    const fetchTopics = async () => {
      const response = await fetchGetTopics(search);
      setTopics(response || []);
    };
    fetchTopics();

  },[fetchGetTopics, category]);
  

  const topicsCardView = topics.map((topic) => (

    <ul 
      key={topic.topicId}
      className="list-unstyled" 
      style={{ marginBottom: '0' }}
    >

      <Link className="link-unstyled" to={`/getTopic/${topic.topicId}`}>
        <li className="topic-section-item">

          <div className="topics-header">
            <strong className="topics-title">
              [{topic.categoryStr}] {topic.title}
            </strong>

            <span className="topics-comments">
              댓글 {topic.commentCount}
            </span>
          </div>
            
          <div className="topics-footer">
            <span className="topics-author">
              {topic.author.nickname}
            </span>

            <span className="topics-date">
              {topic.addDateYMD}
            </span>
          </div>

        </li>
      </Link>
      
    </ul>

  ));

  
  // 로딩 중일 때 표시할 메시지
  if (loading) {
    return <div>Loading...</div>;
  }

  // 에러가 발생했을 때 표시할 메시지
  if (error) {
    return <div>Error: {error}</div>;
  }


  return (

    <Card className="topic-section container">

        <Card.Body>

          <Card.Title className="section-title">
            { topicCategory }
          </Card.Title>

          {/* topics 배열을 순회하며 각 topic을 출력 */}
          { topicsCardView }

        </Card.Body>
        
    </Card>

  );

}

export default ViewTopicsCard;
