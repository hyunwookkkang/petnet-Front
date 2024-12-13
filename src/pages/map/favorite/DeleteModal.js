import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteModal = ({ show, onClose, onDelete }) => (
  <Modal show={show} onHide={onClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>즐겨찾기 삭제</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      정말로 삭제하시겠습니까? 삭제된 목록은 복구할 수 없습니다.
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        취소
      </Button>
      <Button style={{ backgroundColor: "#ff6347", color: "#fff", border: "none"}}  onClick={onDelete}>
        삭제
      </Button>
    </Modal.Footer>
  </Modal>
);

export default DeleteModal;
