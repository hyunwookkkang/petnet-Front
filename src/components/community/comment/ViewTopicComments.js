import React, { useEffect, useState } from "react";

import { useUser } from "../../contexts/UserContext";
import LoginModal from "../../common/modal/LoginModal";
import CommentEditModal from "./CommentEditModal";
import CommentDeleteModal from "./CommentDeleteModal";

import useFetchGetTopicComments from "./useFetchGetTopicComments";

import "../../../styles/Main.css";
import "../../../styles/community/Comment.css";


const ViewTopicComments = ({targetTopic}) => {

  const { userId } = useUser(''); // 사용자 ID 가져오기
  const { fetchGetTopicComments, loading, error } = useFetchGetTopicComments();

  const [comments, setComments] = useState([]);
  const [prevComment, setPrevComment] = useState(null);
  const [targetComment, setTargetComment] = useState(null);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  // 페이지 초기화
  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetchGetTopicComments(targetTopic.topicId);
      setComments(response || []);
    };
    fetchComments();
  }, [fetchGetTopicComments, targetTopic]);


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


  const CommentsHeader = () => (
    <div className="post-comments-bar">
      <span className="comment-count">댓글 ({targetTopic.commentCount})</span>
      <button 
        className="view-comments-button" 
        onClick={() => addCommentClickHandler(null)}
      >
        댓글 쓰기
      </button>
    </div>
  );

  const commentsView = comments.map((comment) => (

    <div key={comment.commentId} className="comment-container">

      {/* Header */}
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

      {/* Comment Content */}
      <p className="comment-content">{comment.content}</p>

      {/* Footer */}
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



      {/* ReComment(답글)s */}
      { comment.reCommentCount.length > 0 && (

        <div className="replies-container">
          {comment.replies.map((reply) => (
            <div key={reply.commentId} className="reply-container">
              <div className="comment-header">
                <span className="comment-username">{reply.author.nickname}</span>
                <div className="comment-options">
                  <span
                    className="comment-option"
                    onClick={() => updateCommentClickHandler(reply)}
                  >
                    수정
                  </span>
                  <span
                    className="comment-option"
                    onClick={() => deleteCommentClickHandler(reply)}
                  >
                    삭제
                  </span>
                </div>
              </div>
              <p className="comment-content">{reply.content}</p>
              <div className="comment-footer">
                <span className="comment-likes">❤️ {reply.likeCount}</span>
                <span className="comment-date">
                  {reply.updateDate ? '(수정됨) ' : ''}
                  {reply.addDateStr}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}



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
      
      <CommentsHeader />
      <ul>
        { commentsView }
      </ul>


      <CommentEditModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        targetTopic={targetTopic}
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

export default ViewTopicComments;
