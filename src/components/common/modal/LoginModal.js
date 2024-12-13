import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

import CommonModal from './CommonModal';

import "../../../styles/common/Button.css";

const LoginModal = ({showModal, setShowModal, message, required}) => {

  const navigate = useNavigate();

  return (
      
    <CommonModal
      show = {showModal} 
      onHide = {() => setShowModal(false)}
      title = "로그인 필요"
      body = {message ? (
        <div>{message}</div>
      ) : (
        <div> 
          로그인이 필요한 서비스입니다.<br/>
          로그인 화면으로 이동합니다.
        </div>
      )}
      footer = {
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            className="modal-button"
            onClick={() => {
              setShowModal(false);
              navigate("/login");
            }}
          >
            로그인
          </Button>
          
          { !required && (
            <Button
              className="modal-button-negative"
              onClick={() => setShowModal(false)}
            >
              닫기
            </Button>
          )}
        </div>
      }
    />

  );

}

export default LoginModal;