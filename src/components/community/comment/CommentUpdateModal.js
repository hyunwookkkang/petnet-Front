import React, { useEffect, useState } from "react";

import { showErrorToast, showSuccessToast } from '../../common/alert/CommonToast';
import CommentEditModal from "./CommentEditModal";

import useFetchUpdateComment from "./useFetchUpdateComment";
import axios from "axios";


const CommentUpdateModal = ({showModal, setShowModal, prevComment, setPrevComment}) => {

  const { fetchUpdateComment, loading } = useFetchUpdateComment();

  const [imageFile, setImageFile] = useState(null);
  const [newComment, setNewComment] = useState(prevComment);


  useEffect(() => {
    // 이미지 데이터 가져오기 및 변환
    const fetchImage = async () => {
      // set query string
      const request = `/api/images/${prevComment.imageId}`;
      try {
        const response = await axios.get(request, {
          responseType: "blob",
        });
        // Blob 데이터를 File 객체로 변환
        const blob = response.data;
        const fileName = "image.jpg";
        const file = new File([blob], fileName, { type: blob.type });
        setImageFile(file);
      } 
      catch (err) {
        console.error("이미지를 가져오는 중 오류가 발생했습니다.", err);
      }
    };
    if (prevComment.imageId) {
      fetchImage();
    }
  }, [prevComment.imageId]);


  const updateCommentHandler = async (e) => {
    e.preventDefault();

    try {
      const resComment = await fetchUpdateComment(newComment, imageFile);
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
      loading={loading}
      onSubmit={updateCommentHandler}
      comment={newComment}
      setComment={setNewComment}
      imageFile={imageFile}
      setImageFile={setImageFile}
    />

  );

};

export default CommentUpdateModal;
