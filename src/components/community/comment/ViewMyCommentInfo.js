import React, { useEffect, useState } from "react";
import { FaImage, FaHeart } from "react-icons/fa";

import LoginModal from "../../common/modal/LoginModal";
import CommentUpdateModal from "./CommentUpdateModal";
import CommentDeleteModal from "./CommentDeleteModal";

import { useUser } from "../../contexts/UserContext";

import "../../../styles/Main.css";
import "../../../styles/community/Comment.css";
import { Link } from "react-router-dom";


const ViewMyCommentInfo = ({comment, setComments}) => {

  const { userId } = useUser(); // 사용자 ID 가져오기

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  useEffect(() => {
    // 로그인 검사
    if (!userId) {
      setShowLoginModal(true);
      return;
    }
  }, [userId]);


  // setComment 임의 지정
  const setComment = (newComment) => {
    setComments((prevComments) => 
      prevComments.map((prevComment) => 
        prevComment.commentId === newComment.commentId 
          ? newComment
          : prevComment
      )
    );
  }

  // 댓글 수정 버튼 클릭 시 처리
  const updateCommentHandler = () => {
    // 작성자 검사
    if (comment.author.userId !== userId) {
      console.log("댓글의 작성자가 아닙니다.");
      return;
    }
    setShowUpdateModal(true);
  }

  // 댓글 삭제 버튼 클릭 시 처리
  const deleteCommentHandler = () => {
    // 작성자 검사
    if (comment.author.userId !== userId) {
      console.log("댓글의 작성자가 아닙니다.");
      return;
    }
    setShowDeleteModal(true);
  }


  const CommentHeader = () => (
    <div className="comment-header">

      <Link className="comment-options" to={`/getTopic/${comment.targetTopic.topicId}`}>
        { comment.targetComment ? (
          `(댓글) ${comment.targetComment.content}`
        ) : (
          `[${comment.targetTopic.categoryStr}] ${comment.targetTopic.title}`
        )}
      </Link>

      { userId === comment.author.userId ? (
        <div className="comment-options">

          <span 
            className="comment-option"
            onClick={() => updateCommentHandler()}
          >
            수정
          </span>

          <span 
            className="comment-option" 
            onClick={() => deleteCommentHandler()}
          >
            삭제
          </span>

        </div>
      ) : '' }

    </div>
  );

  const CommentContent = () => (
    <div>

      { comment.imageId ? (
        <FaImage style={{ marginRight: '8px' }} />
      ) : ''}
      <p className="comment-content">{comment.content}</p>

    </div>
  );
  
  const CommentFooter = () => (
    <div className="comment-footer">

      <span className="comment-likes" style={{display: 'flex'}}>
        <FaHeart style={{ color: '#FF6347' }} />
        {comment.likeCount}
      </span>

      <span>
        답글 ({comment.reCommentCount})
      </span>

      <span className="comment-date">
        {comment.updateDate ? '(수정됨) ' : ''} 
        {comment.addDateStr}
      </span>

    </div>
  );


  return (

    <div className="comment-container">
      
      <CommentHeader />
      <CommentContent />
      <CommentFooter />


      <CommentUpdateModal
        showModal={showUpdateModal}
        setShowModal={setShowUpdateModal}
        prevComment={comment}
        setPrevComment={setComment}
      />

      <CommentDeleteModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        prevComment={comment}
        setComments={setComments}
      />

      <LoginModal 
        showModal={showLoginModal} 
        setShowModal={setShowLoginModal}
      />

    </div>

  );

}

export default ViewMyCommentInfo;
