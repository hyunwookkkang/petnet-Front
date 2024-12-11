import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const FavoriteModal = ({ show, onClose, onSubmit, favorite }) => {
  const [formData, setFormData] = useState({
    favoriteName: "",
    isPublic: 0,
    maxListCount: "",
  });

  // favorite 값 변경 시 초기화
  useEffect(() => {
    setFormData({
      favoriteName: favorite?.favoriteName || "",
      isPublic: favorite?.isPublic || 0,
      maxListCount: favorite?.maxListCount || "",
    });
  }, [favorite]);

  // 입력 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "isPublic"
          ? parseInt(value, 10) // 공개 여부는 정수로 변환
          : name === "maxListCount"
          ? value === "" // 숫자 필드가 비어 있을 경우
            ? ""
            : parseInt(value, 10) || 0 // 숫자로 변환하거나 기본값 0
          : value, // 그 외 문자열
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = () => {
    if (!formData.favoriteName.trim()) {
      alert("즐겨찾기 이름을 입력해주세요.");
      return;
    }
    if (formData.maxListCount !== "" && formData.maxListCount <= 0) {
      alert("최대 리스트 개수는 1 이상이어야 합니다.");
      return;
    }
    const dataToSubmit = {
      ...formData,
      favoriteId: favorite?.favoriteId || null, // 수정 시 favoriteId 포함
    };
    onSubmit(dataToSubmit);
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {favorite ? "즐겨찾기 수정하기" : "즐겨찾기 추가하기"}
        </Modal.Title>
        {/* <Modal.Title>
          {favorite ? "즐겨찾기 수정하기" : "즐겨찾기 추가하기"}
        </Modal.Title> */}
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
              min="1"
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
