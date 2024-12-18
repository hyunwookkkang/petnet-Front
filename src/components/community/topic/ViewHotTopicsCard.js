import React from "react";
import { Link } from 'react-router-dom';
import { Container, Card } from "react-bootstrap";

import useFetchHotTopics from "./useFetchGetHotTopics";

import "../../../styles/Main.css"; // 기존 스타일 재사용


const ViewHotTopicsCard = () => {

  const { topics, loading, error } = useFetchHotTopics();
  
  // 로딩 중일 때 표시할 메시지
  if (loading) {
    return <div>Loading...</div>;
  }

  // 에러가 발생했을 때 표시할 메시지
  if (error) {
    return <div>Error: {error}</div>;
  }

  const topicsCardView = topics.map((topic) => (

    <ul className="list-unstyled" key={topic.topicId}>

      <Link className="link-unstyled" to={`/getTopic/${topic.topicId}`}>
        <li className="topic-section-item" >
          <strong>
            [{topic.categoryStr}] {topic.title}
          </strong>
          <br/>
          작성일: {topic.addDateStr}
          <br/>
          작성자: {topic.author.userId}
          <br/>
          좋아요수: {topic.likeCount}
        </li>
      </Link>

    </ul>

  ));

  return (

    <Container fluid className="mt-4">

          <Card className="topic-section">
            <Card.Body>

              <Card.Title className="section-title">
                금주의 인기글
              </Card.Title>

              {/* topics 배열을 순회하며 각 topic을 출력 */}
              { topicsCardView }

            </Card.Body>
          </Card>

    </Container>

  );

}

export default ViewHotTopicsCard;
