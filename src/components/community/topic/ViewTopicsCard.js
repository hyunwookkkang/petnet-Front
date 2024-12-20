import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { Container, Card } from "react-bootstrap";

import useFetchGetTopics from "./useFetchGetTopics";

import "../../../styles/Main.css"; // 기존 스타일 재사용
import useFetchGetHotTopics from "./useFetchGetHotTopics";
import { FaThumbsUp } from "react-icons/fa";


const ViewTopicsCard = ({category, title}) => {

  const { fetchGetTopics, loading: cLoading, error: cError } = useFetchGetTopics();
  const { fetchGetHotTopics, loading: hLoading, error: hError } = useFetchGetHotTopics();

  const [topics, setTopics] = useState([]);


  // 페이지 초기화
  useEffect(() => {
    const search = {
      "category": category
    }
    const fetchTopics = (category === 'hot') ? fetchGetHotTopics : fetchGetTopics;

    const callFetchTopics = async () => {
      const response = await fetchTopics(search);
      setTopics(response || []);
    };
    callFetchTopics();

  },[category, fetchGetTopics, fetchGetHotTopics]);


  const TopicLikeCount = ({likeCount}) => {
    return (
      <span className="comment-likes">
        <FaThumbsUp style={{ fontSize: '12' }}/>
        <div>
          { likeCount < 10000 ?
            likeCount : '9999+' }
        </div>
      </span>
    );
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
            <span className="topics-comments">
              댓글 {topic.commentCount}
            </span>
          </div>
          
          <div className="topics-footer">
            { category === 'hot' ? ( 
              <TopicLikeCount likeCount={topic.likeCount} />
            ): (
              <span className="topics-author">
                {topic.author.nickname}
              </span>
            )}
            <span className="topics-date">
              {topic.addDateYMD}
            </span>
          </div>

        </li>
      </Link>
      
    </ul>
  ));

  
  // 로딩 중일 때 표시할 메시지
  if (cLoading || hLoading) {
    return <div>Loading...</div>;
  }

  // 에러가 발생했을 때 표시할 메시지
  if (cError || hError) {
    return <div>Error: { cError || hError }</div>;
  }


  return (

    <Card className="topic-section container">

        <Card.Body>

          <Card.Title className="section-title">
            { title }
          </Card.Title>

          {/* topics 배열을 순회하며 각 topic을 출력 */}
          { topicsCardView }

        </Card.Body>
        
    </Card>

  );

}

export default ViewTopicsCard;
