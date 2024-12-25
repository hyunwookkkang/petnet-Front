import React, { useRef } from "react";
import { Button, Form, Image } from "react-bootstrap";
import { FaImage, FaTimes } from "react-icons/fa";

import CommonModal from "../../common/modal/CommonModal";

import { useUser } from "../../contexts/UserContext";

import "../../../styles/place/Modal.css";
import "../../../styles/community/Comment.css";


const CommentEditModal = ({ showModal, setShowModal, modalTitle, loading, onSubmit, 
                              comment, setComment, imageFile, setImageFile }) => {
  
  const formRef = useRef(null); // form을 참조할 ref
  const imageRef = useRef(null); // input 요소 참조

  const { nickname } = useUser();


  const setContentHandler = (content) => {
    setComment((prevComment) => ({...prevComment, content: content}));
  }

  const imageInputClickHandler = () => {
    if (imageRef.current) {
      imageRef.current.click();
    }
  };
  

  const ModalHeader = () => (
    <div>
      <p>
        <strong>
          [{comment.targetTopic.categoryStr}] {comment.targetTopic.title}
        </strong>
      </p>
      { comment.targetComment ? (
        <p>{comment.targetComment.content}</p>
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
            <div className="comment-post-username">
              {nickname}
            </div>

            <input
              type="file"
              accept="image/*"
              ref={imageRef}
              style={{ display: "none" }} // 화면에 표시되지 않음
              onChange={(e) => setImageFile(e.target.files[0])}
            />

 
            <div className="comment-image-btns">
              { imageFile &&
                <Button 
                    variant='link'
                    className="image-del-button"
                    onClick={() => setImageFile(null)}
                  >
                    <FaTimes size={20} color="black" />
                </Button>
              }
              <button 
                type="button" 
                className="comment-post-image-button" 
                onClick={() => imageInputClickHandler()}
              >
                <FaImage size={20} />
              </button>
             </div>
          </div>
    
          { imageFile ? (
            <div className="review-textarea comment-post-content">
              <Image 
                className="comment-post-image"
                src={(URL.createObjectURL(imageFile))} 
                alt="imageFile" 
                rounded />
            </div>
          ) : (
            <textarea
              className="review-textarea comment-post-content"
              value={comment.content}
              onChange={(e) => setContentHandler(e.target.value)}
              placeholder="댓글 내용을 작성하세요. (500자 이내)"
              maxLength={500}
              required={!imageFile}
            />
          )}

        </Form>
      }
      footer = {<ModalFooter />}
    />

  );

};

export default CommentEditModal;
