import React from "react";
import { Link } from 'react-router-dom';
import { Card } from "react-bootstrap";
import { FaThumbsUp } from "react-icons/fa";

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

            <span className="comment-likes">
              <FaThumbsUp style={{ fontSize: '12' }}/>
              <div>
                { topic.likeCount < 10000 ?
                  topic.likeCount
                : '9999+' }
              </div>
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

  return (

    <Card className="topic-section container">

      <Card.Body>

        <Card.Title className="section-title">
          금주의 인기글
        </Card.Title>

        {/* topics 배열을 순회하며 각 topic을 출력 */}
        { topicsCardView }

      </Card.Body>

    </Card>

  );

}

export default ViewHotTopicsCard;
