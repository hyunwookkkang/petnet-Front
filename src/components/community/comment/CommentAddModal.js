import React, { useState } from "react";

import { showErrorToast, showSuccessToast } from '../../common/alert/CommonToast';
import CommentEditModal from "./CommentEditModal";

import { useUser } from "../../contexts/UserContext";
import useFetchAddComment from "./useFetchAddComment";


const CommentAddModal = ({showModal, setShowModal, targetTopic, targetComment, setComments}) => {
  
  const { userId } = useUser();
  const { fetchAddComment, loading } = useFetchAddComment();

  const [newComment, setNewComment] = useState({
    'commentId': '',
    'author': { 'userId': userId },
    'targetTopic': targetTopic,
    'targetComment': targetComment,
    'content': ''
  });


  const addCommentHandler = async (e) => {
    e.preventDefault();

    const setCommentHandler = (comment) => {
      setComments((prevComments) => [...prevComments, comment]);
    }

    try {
      const resComment = await fetchAddComment(newComment);
      setCommentHandler(resComment);
      setShowModal(false);
      showSuccessToast(`댓글이 등록되었습니다`);
    } 
    catch(err) {
      console.error(err);
      showErrorToast(`댓글 등록 중 오류가 발생했습니다`);
    }
  };


  return (

    <CommentEditModal
      showModal={showModal}
      setShowModal={setShowModal}
      modalTitle={'댓글 등록하기'}
      comment={newComment}
      setComment={setNewComment}
      onSubmit={addCommentHandler}
      loading={loading}
    />

  );

};

export default CommentAddModal;
