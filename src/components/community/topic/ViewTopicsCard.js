import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Card } from "react-bootstrap";
import { FaThumbsUp } from "react-icons/fa";

import useFetchGetTopics from "./useFetchGetTopics";
import useFetchGetHotTopics from "./useFetchGetHotTopics";

import "../../../styles/Main.css"; // 기존 스타일 재사용


const ViewTopicsCard = ({category, title, description}) => {

  const { fetchGetTopics /* , loading: cLoading, error: cError */ } = useFetchGetTopics();
  const { fetchGetHotTopics /* , loading: hLoading, error: hError */ } = useFetchGetHotTopics();

  const [topics, setTopics] = useState([]);

  const navigate = useNavigate();
  


  // 페이지 초기화
  useEffect(() => {
    const search = {
      "category": category,
      "offset": 4
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


  return (

    <Card className="topic-section container">

        <Card.Body>

          <Card.Title className="section-title" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom:"0px" }}>
            <h3 style={{marginBottom:"0px"}}>{ title }</h3>
            <span
                onClick={() => navigate("/community")}
                style={{
                  cursor: "pointer",
                  color: "#FF6347",
                  fontSize: "14px",
                  fontWeight: "bold",
                  }}
              >
                더 보러가기 &gt;
              </span>
          </Card.Title>

            {description && (
            <div
              style={{
                textAlign: "left",
                paddingLeft: "4px",
                margin: "0px 0 15px 0",
                fontSize: "12px",
              }}
            >
              {description}
            </div>
            )}

          { topics.length === 0 ? ( 
            <h6><br/>아직 {title}이 없어요</h6>
          ) : (
            topicsCardView
          )}

        </Card.Body>
        
    </Card>

  );

}

export default ViewTopicsCard;
