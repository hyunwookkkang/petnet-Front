import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { FaImage } from "react-icons/fa";

import { useUser } from "../../contexts/UserContext";
import { showErrorToast, showSuccessToast } from '../../common/alert/CommonToast';
import CommonModal from "../../common/modal/CommonModal";

import useFetchAddComment from "./useFetchAddComment";
import useFetchUpdateComment from "./useFetchUpdateComment";

import "../../../styles/place/Modal.css";
import "../../../styles/community/Comment.css";


const CommentEditModal = ({showModal, setShowModal, targetTopic, targetComment, prevComment, setComments}) => {
  
  const formRef = useRef(null); // form을 참조할 ref

  const { userId, nickname } = useUser();
  const { fetchAddComment, loading: addLoading } = useFetchAddComment();
  const { fetchUpdateComment, loading: updateLoading } = useFetchUpdateComment();

  const [commentId, setCommentId] = useState('');
  const [targetTopicInfo, setTargetTopicInfo] = useState(null);
  const [targetCommentInfo, setTargetCommentInfo] = useState(null);
  const [content, setContent] = useState('');


  // 폼 초기화
  useEffect(() => {
    if (prevComment) {
      // 기존 댓글 수정 시 초기화
      setCommentId(prevComment.commentId);
      setTargetTopicInfo(prevComment.targetTopic);
      setTargetCommentInfo(prevComment.targetComment);
      setContent(prevComment.content);
    }
    else {
      // 신규 댓글 작성 시 초기화
      setCommentId('');
      setTargetCommentInfo(targetComment);
      setTargetTopicInfo(targetTopic);
      setContent('');
    }
  }, [prevComment, targetTopic, targetComment]);


  const submitCommentHandler = async (e) => {
    e.preventDefault();
    
    const newComment = {
      'commentId': commentId,
      'author': { 'userId': userId },
      'targetTopic' : targetTopicInfo,
      'targetComment' : targetCommentInfo,
      'content': content
    };

    const submitComment = prevComment ? fetchUpdateComment : fetchAddComment;
    const modifyComments = prevComment ? modifyUpdateComment : modifyAddComment;
    try {
      const resComment = await submitComment(newComment);
      modifyComments(resComment);
      setShowModal(false);
      showSuccessToast(`댓글이 저장되었습니다`);
    } 
    catch(err) {
      console.error(err);
      showErrorToast(`댓글 저장 중 오류가 발생했습니다`);
    }
  };

  const modifyAddComment = (newComment) => {
    setComments((prevComments) => [...prevComments, newComment]);
  }

  const modifyUpdateComment = (newComment) => {
    setComments((prevComments) => 
      prevComments.map((comment) => 
        comment.commentId === newComment.commentId 
          ? newComment
          : comment
      )
    );
  }


  const ModalBody = () => (
    <Form ref={formRef} onSubmit={submitCommentHandler}>
      <p>
        <strong>[{targetTopicInfo.categoryStr}] {targetTopicInfo.title}</strong>
      </p>

      { targetCommentInfo ? (
        <p>{targetCommentInfo.title} {targetCommentInfo.author.nickname}</p>
      ) : '' }

      <div className="comment-post-header">
        <div className="comment-post-username">{nickname}</div>
        <button 
          type="button" 
          className="comment-post-image-button" 
          /*onClick={() => alert('이미지 핸들')}*/>
          <FaImage size={20} />
        </button>
      </div>

      <textarea
        className="review-textarea comment-post-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글 내용을 작성하세요. (500자 이내)"
        maxLength={500}
        required
      />
    </Form>
  );

  const ModalFooter = () => (
    <div>
      <button 
        className="modal-cancel" 
        onClick={() => setShowModal(false)}
      >
        취소
      </button>
      <button 
        className="modal-submit" 
        type="button"
        onClick={() => formRef.current?.requestSubmit()}
        disabled={ addLoading || updateLoading }
      >
        저장
      </button>
    </div>
  );


  return (

    <CommonModal
      show = {showModal} 
      onHide = {() => setShowModal(false)}
      title = { "댓글 " + (prevComment ? "수정하기" : "작성하기") }
      body = {<ModalBody />}
      footer = {<ModalFooter />}
    />

  );

};

export default CommentEditModal;
