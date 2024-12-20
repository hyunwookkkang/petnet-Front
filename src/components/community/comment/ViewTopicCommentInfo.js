import React, { useState } from "react";

import LoginModal from "../../common/modal/LoginModal";
import CommentAddModal from "./CommentAddModal";
import CommentUpdateModal from "./CommentUpdateModal";
import CommentDeleteModal from "./CommentDeleteModal";
import CommentVoteButton from "./CommentVoteButton";

import { useUser } from "../../contexts/UserContext";

import "../../../styles/Main.css";
import "../../../styles/community/Comment.css";


const ViewTopicCommentInfo = ({comment, setComments, setReComments, reCommentCount}) => {

  const { userId, userRole } = useUser(); // 사용자 ID 가져오기

  const [likeCount, setLikeCount] = useState(comment.likeCount);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isAuthor = (userId === comment.author.userId);


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

  // 답글 쓰기 버튼 클릭 시 처리
  const addReCommentHandler = () => {
    // 로그인 검사
    if (!userId) {
      setShowLoginModal(true);
      return;
    }
    setShowAddModal(true);
  }

  // 댓글 수정 버튼 클릭 시 처리
  const updateCommentHandler = () => {
    // 작성자 검사
    if (!isAuthor) {
      console.log("댓글의 작성자가 아닙니다.");
      return;
    }
    setShowUpdateModal(true);
  }

  // 댓글 삭제 버튼 클릭 시 처리
  const deleteCommentHandler = () => {
    // 작성자 검사
    if (!isAuthor) {
      console.log("댓글의 작성자가 아닙니다.");
      return;
    }
    setShowDeleteModal(true);
  }


  return (

    <div className="comment-container">
      
      {/* Header */}
      <div className="comment-header">

        {/* 작성자 닉네임 */}
        <span>
          {comment.author.nickname}
        </span>

        <div className="comment-options">
          {/* 댓글 수정 버튼 */}
          { isAuthor ? (
            <span onClick={() => updateCommentHandler()}>
              수정
            </span>
          ) : '' }
          {/* 댓글 삭제 버튼 */}
          { (["0","1"].includes(userRole) || isAuthor) ? (
            <span onClick={() => deleteCommentHandler()}>
              삭제
            </span>
          ) : '' }
        </div>

      </div>

      {/* Content */}
      <div>
        { comment.imageId ? (
          <img 
            className="comment-image"
            src={`/api/images/${comment.imageId}`} 
            alt="&nbsp; < failed to load img file >"
          />
        ) : (
          <span>{comment.content}</span>
        )}
      </div>
      
      {/* Footer */}
      <div className="comment-footer">

        {/* 좋아요 버튼 및 좋아요 갯수 */}
        <span className="comment-likes">
          <CommentVoteButton 
            commentId={comment.commentId} 
            setLikeCount={setLikeCount} 
          />
          <div>
            { likeCount < 10000 ?
              likeCount
            : '9999+' }
          </div>
        </span>

        {/* 답글 작성 버튼 및 답글 갯수 */}
        { comment.targetComment ? '' : (
          <button 
            className="comment-reply-button"
            onClick={() => addReCommentHandler()}
          >
            <div>답글달기</div> 
            <div>
              ( { reCommentCount < 1000000 ?
                  reCommentCount
                : '999999+' } ) 
            </div>
          </button>
        )}

        {/* 작성일 */}
        <span className="comment-date">
          {comment.updateDate ? '(수정됨) ' : ''} 
          {comment.addDateStr}
        </span>

      </div>


      <CommentAddModal
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        targetTopic={comment.targetTopic}
        targetComment={comment}
        setComments={setReComments}
      />

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

export default ViewTopicCommentInfo;
