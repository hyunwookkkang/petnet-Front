import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const AddFavoriteItemModal = ({ show, onClose, placeId, onAddItem }) => {
  const [favorites, setFavorites] = useState([]); // 즐겨찾기 목록
  const [selectedFavoriteId, setSelectedFavoriteId] = useState(null); // 선택된 즐겨찾기 ID
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

    // 즐겨찾기 목록 불러오기
    useEffect(() => {
        if (show) {
        const fetchFavorites = async () => {
            try {
            setLoading(true);
            setError(null);
            const response = await axios.get("/api/map/favorites", {
                withCredentials: true, // 쿠키를 사용하여 인증
            });
            setFavorites(response.data);
            } catch (err) {
            console.error("Error fetching favorites:", err);
            setError("즐겨찾기 목록을 불러오는 중 오류가 발생했습니다.");
            } finally {
            setLoading(false);
            }
        };

        fetchFavorites();
        }
    }, [show]);

    const handleAddItem = async () => {
        try {
        await onAddItem(selectedFavoriteId); // 부모 컴포넌트에서 받은 onAddItem 호출
        setSelectedFavoriteId(null); // 선택 초기화
        onClose(); // 모달 닫기
        } catch (error) {
        console.error("Error adding item:", error);
        setError("항목 추가 중 오류가 발생했습니다.");
        }
    };

    return (
        <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>즐겨찾기에 항목 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {loading && (
            <div className="text-center">
                <Spinner animation="border" variant="primary" />
                <p>로딩 중...</p>
            </div>
            )}
            {error && <Alert variant="danger">{error}</Alert>}
            {!loading && !error && (
            <Form>
                <Form.Group>
                <Form.Label>추가할 즐겨찾기를 선택하세요:</Form.Label>
                <Form.Control
                    as="select"
                    value={selectedFavoriteId || ""}
                    onChange={(e) => setSelectedFavoriteId(e.target.value)}
                >
                    <option value="" disabled>
                    즐겨찾기 선택
                    </option>
                    {favorites.map((favorite) => (
                    <option key={favorite.favoriteId} value={favorite.favoriteId}>
                        {favorite.favoriteName} ({favorite.isPublic ? "공개" : "비공개"})
                    </option>
                    ))}
                </Form.Control>
                </Form.Group>
            </Form>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose} disabled={loading}>
            취소
            </Button>
            <Button
            variant="primary"
            onClick={handleAddItem}
            disabled={loading || !selectedFavoriteId}
            >
            추가하기
            </Button>
        </Modal.Footer>
        </Modal>
    );
};

export default AddFavoriteItemModal;
