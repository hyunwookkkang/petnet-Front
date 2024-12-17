import React, { useEffect, useRef, useState } from "react";

import { useUser } from "../../contexts/UserContext";
import { showErrorToast, showSuccessToast } from '../../common/alert/CommonToast';
import CommonModal from "../../common/modal/CommonModal";
import useFetchAddComment from "./useFetchAddComment";

import "../../../styles/place/Modal.css";
import "../../../styles/community/Comment.css";
import { FaImage } from "react-icons/fa";
import { Form } from "react-bootstrap";


const CommentEditModal = ({showModal, setShowModal, topic, comment, oldComment}) => {
  
  const formRef = useRef(null); // form을 참조할 ref

  const { userId, nickname } = useUser();
  const { fetchAddComment, loading: addLoading } = useFetchAddComment();
  // const { fetchUpdateComment, loading: updateLoading } = useFetchUpdateComment();

  const [content, setContent] = useState('');


  // 폼 초기화
  useEffect(() => {
    if (oldComment) {
      setContent(oldComment.content);
    }

  }, [oldComment]);


  const addCommentHandler = async (e) => {
    e.preventDefault();
    
    const newComment = {
      'commentId': oldComment ? oldComment.commentId : '',
      'author': { 'userId': userId },
      'targetTopic' : { 'topicId' : topic.topicId },
      'targetComment' : { 'commentId' : comment ? comment.commentId : '' },
      'content': content
    };

    //setLoading(true);

    const submitComment = /*oldComment ? fetchUpdateComment :*/ fetchAddComment;
    try {
      await submitComment(newComment);
      setShowModal(false);
      showSuccessToast(`댓글이 저장되었습니다`);
    } 
    catch(err) {
      console.log("catch err: ", err)
      showErrorToast(`댓글 저장 중 오류가 발생했습니다`);
    }
  };


  const ModalBody = () => (
    <Form ref={formRef} onSubmit={addCommentHandler}>
      <p>
        <strong>[{topic.categoryStr}] {topic.title}</strong>
      </p>

      { comment ? (
        <p>{comment.title} {comment.targetComment.author.nickname}</p>
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
        disabled={addLoading /* updateLoading */}
      >
        저장
      </button>
    </div>
  );


  return (

    <CommonModal
      show = {showModal} 
      onHide = {() => setShowModal(false)}
      title = { "댓글 " + (oldComment ? "수정하기" : "작성하기") }
      body = {<ModalBody />}
      footer = {<ModalFooter />}
    />

  );

};

export default CommentEditModal;
