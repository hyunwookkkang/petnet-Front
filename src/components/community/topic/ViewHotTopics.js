import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import useFetchGetHotTopics from "./useFetchGetHotTopics";

import "../../../styles/Main.css"; // 기존 스타일 재사용
import { FaThumbsUp } from "react-icons/fa";


const ViewHotTopics = () => {

  const { fetchGetHotTopics /*, loading, error */ } = useFetchGetHotTopics();
    
  const [topics, setTopics] = useState([]);


  // 페이지 초기화
  useEffect(() => {
    const fetchTopics = async () => {
      const response = await fetchGetHotTopics();
      setTopics(response || []);
    };
    fetchTopics();
  },[fetchGetHotTopics]);


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

  const topicsView = topics.map((topic) => (
    <div key={topic.topicId}>

      <Link className="link-unstyled" to={`/getTopic/${topic.topicId}`}>
        <li className="topics-normal-item">
          <div className="topics-header">
            <strong className="topics-title">[{topic.categoryStr}] {topic.title}</strong>
            <span className="topics-comments">댓글 {topic.commentCount}</span>
          </div>
          <div className="topics-footer">
            <span className="topics-author">
              <TopicLikeCount likeCount={topic.likeCount} />
            </span>
            <span className="topics-date">{topic.addDateStr}</span>
          </div>
        </li>
      </Link>

    </div>
  ));

  
  return (

    <div>

      <h1 style={{ margin: "15px" }}>
        금주의 인기 게시글
      </h1>
      
      
      { topics.length === 0 ? (
        <h5 className="community-empty-list">
          <br/>
          아직 금주의 인기 게시글이 없어요
        </h5>      
      ) : (
        <ul style={{ paddingInlineStart: '0' }}>
          { topicsView }
        </ul> // topics 배열에 데이터가 있을 경우
      )}

    </div>

  );

}

export default ViewHotTopics;
