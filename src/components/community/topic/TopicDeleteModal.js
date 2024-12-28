import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Spinner } from 'react-bootstrap';

import { showErrorToast, showSuccessToast } from '../../common/alert/CommonToast';

import CommonModal from '../../common/modal/CommonModal';
import useFetchDeleteTopic from './useFetchDeleteTopic';

import "../../../styles/common/Button.css";


const TopicDeleteModal = ({showModal, setShowModal, topic}) => {

  const navigate = useNavigate();

  const { fetchDeleteTopic, loading, error } = useFetchDeleteTopic();


  const deleteTopicHandler = async () => {
    try {
      await fetchDeleteTopic(topic.topicId);
      navigate(`/community`);
      showSuccessToast(`게시글이 삭제되었습니다`);
    }
    catch(err) {
      console.log("catch err: ", err)
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
      <strong>{topic.title}</strong><br/>
      삭제된 게시글은 복구할 수 없습니다.<br/>
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
        onClick={() => deleteTopicHandler()}
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
        title = "게시글 삭제"
        body = {<ModalBody />}
        footer = {<ModalFooter />}
      />

    </div>

  );

}

export default TopicDeleteModal;