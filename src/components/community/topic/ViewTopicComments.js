import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import { useUser } from "../../contexts/UserContext";
import useFetchGetTopicComments from "./useFetchGetTopicComments";

import "../../../styles/Main.css"; // 기존 스타일 재사용


const ViewTopicComments = ({topicId}) => {

  const { userId } = useUser(''); // 사용자 ID 가져오기

  const { fetchGetTopicComments, loading, error } = useFetchGetTopicComments();

  const [comments, setComments] = useState([]);

  // 페이지 초기화
  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetchGetTopicComments(topicId);
      setComments(response || []);
    };
    fetchComments();
  }, []);


  const commentsView = comments.map((comment) => (

    <div className="comment-container">
      {/* Header */}
      <div className="comment-header">
        <span className="comment-username">{comment.author.nickname}</span>
        <div className="comment-options">
          <span className="comment-option">수정</span>
          <span className="comment-option">삭제</span>
        </div>
      </div>

      {/* Comment Content */}
      <p className="comment-content">{comment.content}</p>

      {/* Footer */}
      <div className="comment-footer">
        <span className="comment-likes">❤️ {comment.likeCount}</span>
        <button className="comment-reply-button">답글달기</button>
        <span className="comment-date">
          {comment.updateDate ? '(수정됨) ' : ''} 
          {comment.addDateStr}
        </span>
      </div>
    </div>
    
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

    <div>

      <br/>
      <ul>
        { commentsView }
      </ul>

    </div>

  );

}

export default ViewTopicComments;
