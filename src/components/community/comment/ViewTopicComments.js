import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import { useUser } from "../../contexts/UserContext";
import useFetchGetTopicComments from "./useFetchGetTopicComments";

import "../../../styles/Main.css";
import "../../../styles/community/Comment.css";
import CommentEditModal from "./CommentEditModal";
import LoginModal from "../../common/modal/LoginModal";


const ViewTopicComments = ({topic, commentCount}) => {

  const { userId } = useUser(''); // 사용자 ID 가져오기

  const { fetchGetTopicComments, loading, error } = useFetchGetTopicComments();

  const [comments, setComments] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);


  // 페이지 초기화
  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetchGetTopicComments(topic.topicId);
      setComments(response || []);
    };
    fetchComments();
  }, [fetchGetTopicComments, topic]);


  // 댓글 쓰기 버튼 클릭 시 처리
  const addCommentClickHandler = () => {
    // 로그인 검사
    if (!userId) {
      setShowLoginModal(true);
      return;
    }
    setShowAddModal(true)
  }


  const commentsView = comments.map((comment) => (

    <div key={comment.commentId} className="comment-container">

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
      
      <div className="post-comments-bar">
        <span className="comment-count">댓글 ({commentCount})</span>
        <button className="view-comments-button" onClick={() => addCommentClickHandler()}>
          댓글 쓰기
        </button>
      </div>

      <br/>
      <ul>
        { commentsView }
      </ul>


      <CommentEditModal
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        topic={topic}
        comment={null}
        oldComment={null}
      />

      <LoginModal 
        showModal={showLoginModal} 
        setShowModal={setShowLoginModal}
      />

    </div>

  );

}

export default ViewTopicComments;
