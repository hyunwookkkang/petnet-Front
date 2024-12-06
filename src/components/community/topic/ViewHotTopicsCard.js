import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Container, Card } from "react-bootstrap";

import "../../../styles/Main.css"; // 기존 스타일 재사용
import useFetchHotTopics from "./useFetchHotTopics";


const ViewHotTopicsCard = () => {

  const { topics, loading, error } = useFetchHotTopics();
  

  const openTopicInfo = (topicId) => {
    // useNavigate
    console.log("open topic info : ", topicId)
  }
  
  
  // 로딩 중일 때 표시할 메시지
  if (loading) {
    return <div>Loading...</div>;
  }

  // 에러가 발생했을 때 표시할 메시지
  if (error) {
    return <div>Error: {error}</div>;
  }

  // add_date -> yyyy-mm-dd hh:mm:dd
  const topicAddDateHandler = (topic) => { 
    return topic.addDateYMD + " " + topic.addDateHMS; 
  }

  const topicsCardView = topics.map((topic) => (

    <ul 
      key={topic.topicId}
      className="list-unstyled" 
      onClick={() => openTopicInfo(topic.topicId)}
    >
      <li className="topic-section-item">
        <strong>
          제목: {topic.title}
        </strong>
        <br/>
        작성일: {topicAddDateHandler(topic)}
        <br/>
        작성자: {topic.authorId}
        <br/>
        댓글수: {topic.commentCount}
      </li>
    </ul>

  ));

  return (

    <Container fluid className="mt-4 content-wrapper">

          <Card className="topic-section">
            <Card.Body>

              <Card.Title className="section-title">
                BootStrap Card사용 
                <br/>
                Main.css의 MyPage CSS사용
                <br/>
                View Topics Card
                <br/>
                금주의 인기글
              </Card.Title>

              <br/>
              {/* topics 배열을 순회하며 각 topic을 출력 */}
              { topicsCardView }

            </Card.Body>
          </Card>

    </Container>

  );

}

export default ViewHotTopicsCard;
