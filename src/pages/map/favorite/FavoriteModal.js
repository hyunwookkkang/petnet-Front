import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const FavoriteModal = ({ show, onClose, onSubmit, favorite }) => {
  const [formData, setFormData] = useState({
    name: favorite?.name || "",
    isPublic: favorite?.isPublic || true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "isPublic" ? value === "true" : value,
    }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{favorite ? "즐겨찾기 수정하기" : "즐겨찾기 추가하기"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>즐겨찾기 이름</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="즐겨찾기 이름을 입력하세요"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>공개 여부</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="공개"
                name="isPublic"
                value={true}
                checked={formData.isPublic === true}
                onChange={handleChange}
              />
              <Form.Check
                inline
                type="radio"
                label="비공개"
                name="isPublic"
                value={false}
                checked={formData.isPublic === false}
                onChange={handleChange}
              />
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {favorite ? "수정하기" : "추가하기"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FavoriteModal;
