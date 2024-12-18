import React, { useRef } from "react";
import { Form } from "react-bootstrap";
import { FaImage } from "react-icons/fa";

import CommonModal from "../../common/modal/CommonModal";

import { useUser } from "../../contexts/UserContext";

import "../../../styles/place/Modal.css";
import "../../../styles/community/Comment.css";


const CommentEditModal = ({ showModal, setShowModal, modalTitle, 
                            comment, setComment, onSubmit, loading }) => {
  
  const formRef = useRef(null); // form을 참조할 ref

  const { nickname } = useUser();


  const setContentHandler = (content) => {
    setComment((prevComment) => ({...prevComment, content: content}));
  }
  

  const ModalHeader = () => (
    <div>
      <p>
        <strong>
          [{comment.targetTopic.categoryStr}] {comment.targetTopic.title}
        </strong>
      </p>
      { comment.targetComment ? (
        <p>
          {comment.targetComment.title} {comment.targetComment.author.nickname}
        </p>
      ) : '' }
    </div>
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
        disabled={loading}
      >
        저장
      </button>
    </div>
  );


  return (

    <CommonModal
      show = {showModal} 
      onHide = {() => setShowModal(false)}
      title = {modalTitle}
      body = {
        <Form ref={formRef} onSubmit={onSubmit}>
        
          <ModalHeader />
    
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
            value={comment.content}
            onChange={(e) => setContentHandler(e.target.value)}
            placeholder="댓글 내용을 작성하세요. (500자 이내)"
            maxLength={500}
            required
          />

        </Form>
      }
      footer = {<ModalFooter />}
    />

  );

};

export default CommentEditModal;
