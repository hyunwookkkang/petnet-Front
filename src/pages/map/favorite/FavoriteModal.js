import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const FavoriteModal = ({ show, onClose, onSubmit, favorite }) => {
  const [formData, setFormData] = useState({
    favoriteName: favorite?.favoriteName || "",
    isPublic: favorite?.isPublic || 0,
    maxListCount: favorite?.maxListCount || "",
  });

  useEffect(() => {
    if (favorite) {
      setFormData({
        favoriteName: favorite.favoriteName,
        isPublic: favorite.isPublic,
        maxListCount: favorite.maxListCount || "",
      });
    } else {
      setFormData({
        favoriteName: "",
        isPublic: 0,
        maxListCount: "",
      });
    }
  }, [favorite]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "isPublic" ? parseInt(value, 10) : value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.favoriteName.trim()) {
      alert("즐겨찾기 이름을 입력해주세요.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {favorite ? "즐겨찾기 수정하기" : "즐겨찾기 추가하기"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>즐겨찾기 이름</Form.Label>
            <Form.Control
              type="text"
              name="favoriteName"
              value={formData.favoriteName}
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
                value={1}
                checked={formData.isPublic === 1}
                onChange={handleChange}
              />
              <Form.Check
                inline
                type="radio"
                label="비공개"
                name="isPublic"
                value={0}
                checked={formData.isPublic === 0}
                onChange={handleChange}
              />
            </div>
          </Form.Group>
          {/* <Form.Group className="mb-3">
            <Form.Label>최대 리스트 개수</Form.Label>
            <Form.Control
              type="number"
              name="maxListCount"
              value={formData.maxListCount}
              onChange={handleChange}
              placeholder="최대 리스트 개수를 입력하세요"
            />
          </Form.Group> */}
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
