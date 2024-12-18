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

    <ul className="list-unstyled" key={topic.topicId}>

      <Link className="link-unstyled" to={`/getTopic/${topic.topicId}`}>
        <li className="topic-section-item">
          <strong>{topic.title}</strong>
          <br/>
          작성일: {topic.addDateStr}
          <br/>
          작성자: {topic.author.userId}
          <br/>
          댓글수: {topic.commentCount}
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

    <Container fluid className="mt-4">

      <Card className="topic-section">
        <Card.Body>

          <Card.Title className="section-title">
            { topicCategory }
          </Card.Title>

          {/* topics 배열을 순회하며 각 topic을 출력 */}
          { topicsCardView }

        </Card.Body>
      </Card>

    </Container>

  );

}

export default ViewTopicsCard;
