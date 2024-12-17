import React from 'react';
import { Button, Spinner } from 'react-bootstrap';

import { showErrorToast, showSuccessToast } from '../../common/alert/CommonToast';
import CommonModal from '../../common/modal/CommonModal';

import useFetchDeleteComment from './useFetchDeleteComment';

import "../../../styles/common/Button.css";


const CommentDeleteModal = ({showModal, setShowModal, prevComment, setComments}) => {

  const { fetchDeleteComment, loading, error } = useFetchDeleteComment();


  const deleteCommentHandler = async () => {
    try {
      await fetchDeleteComment(prevComment.commentId);
      // 댓글 목록에서 선택된 댓글 삭제
      setComments((prevComments) => 
        prevComments.filter((comment) => 
          comment.commentId !== prevComment.commentId
      ));
      setShowModal(false);
      showSuccessToast(`댓글이 삭제되었습니다`);
    }
    catch(err) {
      console.log(err)
      showErrorToast(`삭제 중 오류가 발생했습니다`);
    }
  };
  

  const LoadingMessage = () => (
    <div>
      <Spinner 
        animation="border" 
        role="status" 
        variant="primary" 
      />
    </div>
  );

  const ErrorMessage = () => (
    <div>
      오류 발생<br/>
      {error}
    </div>
  )

  const DeleteMessage = () => (
    <div>
      <strong>{prevComment.content}</strong>
      <br/>
      삭제된 댓글은 복구할 수 없습니다.<br/>
      정말 삭제하시겠습니까?
    </div>
  );


  const ModalBody = () => (
    error 
    ? <ErrorMessage />
    : (
        loading 
        ? <LoadingMessage />
        : <DeleteMessage />
      )
  );

  const ModalFooter = () => (
    <div style={{ display: 'flex', gap: '10px' }}>
      <Button
        className="modal-button"
        onClick={() => deleteCommentHandler()}
        disabled={loading}
      >
        삭제
      </Button>
      <Button
        className="modal-button-negative"
        onClick={() => setShowModal(false)}
      >
        닫기
      </Button>
    </div>
  );


  return (

    <div>
    
      <CommonModal
        show = {showModal} 
        onHide = {() => setShowModal(false)}
        title = "댓글 삭제"
        body = {<ModalBody />}
        footer = {<ModalFooter />}
      />

    </div>

  );

}

export default CommentDeleteModal;