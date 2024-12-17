import React, { useState } from "react";

import { showErrorToast, showSuccessToast } from '../../common/alert/CommonToast';
import CommentEditModal from "./CommentEditModal";

import useFetchUpdateComment from "./useFetchUpdateComment";


const CommentUpdateModal = ({showModal, setShowModal, prevComment, setPrevComment}) => {

  const { fetchUpdateComment, loading } = useFetchUpdateComment();

  const [newComment, setNewComment] = useState(prevComment);


  const updateCommentHandler = async (e) => {
    e.preventDefault();

    try {
      const resComment = await fetchUpdateComment(newComment);
      setPrevComment(resComment);
      setShowModal(false);
      showSuccessToast(`댓글이 수정되었습니다`);
    } 
    catch(err) {
      console.error(err);
      showErrorToast(`댓글 수정 중 오류가 발생했습니다`);
    }
  };


  return (

    <CommentEditModal
      showModal={showModal}
      setShowModal={setShowModal}
      modalTitle={'댓글 수정하기'}
      comment={newComment}
      setComment={setNewComment}
      onSubmit={updateCommentHandler}
      loading={loading}
    />

  );

};

export default CommentUpdateModal;
