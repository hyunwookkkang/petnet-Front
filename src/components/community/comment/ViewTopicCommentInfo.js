import React, { useState } from "react";

import LoginModal from "../../common/modal/LoginModal";
import CommentAddModal from "./CommentAddModal";
import CommentUpdateModal from "./CommentUpdateModal";
import CommentDeleteModal from "./CommentDeleteModal";
import CommentVoteButton from "./CommentVoteButton";
import ViewTopicComments from "./ViewTopicComments";

import { useUser } from "../../contexts/UserContext";

import "../../../styles/Main.css";
import "../../../styles/community/Comment.css";


const ViewCommentInfo = ({comment, setComments, isReComment}) => {

  const { userId } = useUser(); // 사용자 ID 가져오기

  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [reCommentCount/*, setReCommentCount*/] = useState(comment.reCommentCount);
  const [reComments, setReComments] = useState([]);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


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

  // 답글 목록 갱신 -> 답글 수 갱신
  // const setReCommentsHandler = (newRecomments) => {
  //   setReComments(newRecomments);
  //   setReCommentCount(reComments.length);
  // }
  // 무한 랜더링 발생

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

      <span className="comment-username">
        {comment.author.nickname}
      </span>

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
        <img src={`/api/images/${comment.imageId}`} alt=""/>
      ) : (
        <p className="comment-content">{comment.content}</p>
      )}

    </div>
  );
  
  const CommentFooter = () => (
    <div className="comment-footer">

      <span className="comment-likes" style={{display: 'flex'}}>
        <CommentVoteButton 
          commentId={comment.commentId} 
          setLikeCount={setLikeCount} 
        />
        {likeCount}
      </span>

      { isReComment ? '' : (
        <button 
          className="comment-reply-button"
          onClick={() => addReCommentHandler()}
        >
          답글달기 ({reCommentCount})
        </button>
      )}

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
      { (comment.reCommentCount > 0) ? (
        <ViewTopicComments 
          targetTopic={null}
          targetComment={comment}
          comments={reComments}
          setComments={setReComments}
        />
      ) : '' }


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

export default ViewCommentInfo;
