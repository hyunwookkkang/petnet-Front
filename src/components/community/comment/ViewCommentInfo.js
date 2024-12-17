import React, { useState } from "react";

import { useUser } from "../../contexts/UserContext";
import LoginModal from "../../common/modal/LoginModal";
import CommentEditModal from "./CommentEditModal";
import CommentDeleteModal from "./CommentDeleteModal";

import "../../../styles/Main.css";
import "../../../styles/community/Comment.css";


const ViewCommentInfo = ({comment, setComments}) => {

  const { userId } = useUser(''); // 사용자 ID 가져오기

  const [prevComment, setPrevComment] = useState(null);
  const [targetComment, setTargetComment] = useState(null);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  // 댓글 쓰기 버튼 클릭 시 처리
  const addCommentClickHandler = (pickedComment) => {
    // 로그인 검사
    if (!userId) {
      setShowLoginModal(true);
      return;
    }
    // 정보 초기화
    setTargetComment(pickedComment);
    setPrevComment(null);
    setShowEditModal(true);
  }

  // 댓글 수정 버튼 클릭 시 처리
  const updateCommentClickHandler = (pickedComment) => {
    // 작성자 검사
    if (pickedComment.author.userId !== userId) {
      console.log("댓글의 작성자가 아닙니다.");
      return;
    }
    // 정보 초기화
    setTargetComment(null);
    setPrevComment(pickedComment);
    setShowEditModal(true);
  }

  // 댓글 삭제 버튼 클릭 시 처리
  const deleteCommentClickHandler = (pickedComment) => {
    // 작성자 검사
    if (pickedComment.author.userId !== userId) {
      console.log("댓글의 작성자가 아닙니다.");
      return;
    }
    // 정보 초기화
    setTargetComment(null);
    setPrevComment(pickedComment);
    setShowDeleteModal(true)
  }


  const CommentHeader = () => (
    <div className="comment-header">
      <span className="comment-username">{comment.author.nickname}</span>
      <div className="comment-options">
        <span 
          className="comment-option"
          onClick={() => updateCommentClickHandler(comment)}
        >
          수정
        </span>
        <span 
          className="comment-option" 
          onClick={() => deleteCommentClickHandler(comment)}
        >
          삭제
        </span>
      </div>
    </div>
  );

  const CommentContent = () => (
    <p className="comment-content">{comment.content}</p>
  );
  
  const CommentFooter = () => (
    <div className="comment-footer">
      <span className="comment-likes">❤️ {comment.likeCount}</span>
      <button 
        className="comment-reply-button"
        onClick={() => addCommentClickHandler(comment)}
      >
        답글달기 ({comment.reCommentCount})
      </button>
      <span className="comment-date">
        {comment.updateDate ? '(수정됨) ' : ''} 
        {comment.addDateStr}
      </span>
    </div>
  );


  return (

    <div>
      
      <div key={comment.commentId} className="comment-container">
        <CommentHeader />
        <CommentContent />
        <CommentFooter />
      </div>


      <CommentEditModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        targetTopic={null}
        targetComment={targetComment}
        prevComment={prevComment}
        setComments={setComments}
      />

      <CommentDeleteModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        prevComment={prevComment}
        setComments={setComments}
      />

      <LoginModal 
        showModal={showLoginModal} 
        setShowModal={setShowLoginModal}
      />

    </div>

  );

}

export default ViewCommentInfo;
