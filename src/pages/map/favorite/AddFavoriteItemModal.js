import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../../../components/common/alert/CommonToast";

const AddFavoriteItemModal = ({ show, onClose, placeId, onItemAdded }) => {
  const [favorites, setFavorites] = useState([]); // 즐겨찾기 목록
  const [selectedFavoriteId, setSelectedFavoriteId] = useState(""); // 선택된 즐겨찾기 ID
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const [creatingFavorite, setCreatingFavorite] = useState(false); // 새 즐겨찾기 추가 모드
  const [newFavoriteName, setNewFavoriteName] = useState(""); // 새 즐겨찾기 이름
  const [isPublic, setIsPublic] = useState(0);  //default = 0

    // 즐겨찾기 목록 불러오기
    const fetchFavorites = async () => {
        try {
        setLoading(true);
        const response = await axios.get("/api/map/favorites", { withCredentials: true });
        setFavorites(response.data);
        } catch (err) {
        console.error("Error fetching favorites:", err);
        setError("즐겨찾기 목록을 불러오는 중 오류가 발생했습니다.");
        } finally {
        setLoading(false);
        }
    };

    // 모달 열릴 때 목록 불러오기
    useEffect(() => {
        if (show) fetchFavorites();
    }, [show]);

    // 새 즐겨찾기 추가
    const handleCreateFavorite = async () => {
        if (!newFavoriteName.trim()) {
        showErrorToast("즐겨찾기 이름을 입력해주세요.");
        return;
        }

        try {
        setLoading(true);
        await axios.post(
            "/api/map/favorites",
            { favoriteName: newFavoriteName, isPublic: isPublic, maxListCount: null },
            { withCredentials: true }
        );
        showSuccessToast("새로운 즐겨찾기가 추가되었습니다.");
        setNewFavoriteName(""); // 입력 초기화
        setIsPublic(0); // 공개 여부 초기화화
        setCreatingFavorite(false);

        // 새 데이터 가져오기
        await fetchFavorites();
        } catch (error) {
        console.error("Error creating favorite:", error);
        showErrorToast("즐겨찾기 추가 중 오류가 발생했습니다.");
        } finally {
        setLoading(false);
        }
    };

    // 항목 추가
    const handleAddItem = async () => {
        try {
        const requestUrl = `/api/map/favorites/item/${placeId}`; // PathVariable 사용
        const params = { favoriteId: selectedFavoriteId }; // Query parameter로 전달
    
        console.log("Sending data to server:", requestUrl, params);
    
        await axios.post(requestUrl, null, {
            params, // favoriteId를 쿼리 파라미터로 전달
            withCredentials: true, // 인증이 필요한 경우
        });
    
        showSuccessToast("항목이 추가되었습니다.");
        onItemAdded(selectedFavoriteId);
        onClose(); // 모달 닫기
        } catch (error) {
        console.error("Error adding item:", error);
        showErrorToast("항목 추가 중 오류가 발생했습니다.");
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

            {/* 새 즐겨찾기 추가 */}
            {creatingFavorite ? (
            <Form>
                <Form.Group>
                <Form.Label>새로운 즐겨찾기 이름</Form.Label>
                <Form.Control
                    type="text"
                    value={newFavoriteName}
                    onChange={(e) => setNewFavoriteName(e.target.value)}
                    placeholder="즐겨찾기 이름을 입력하세요"
                />
                </Form.Group>
                <Form.Group>
                    <Form.Label>공개 여부</Form.Label>
                    <div>
                        <Form.Check
                        inline
                        type="radio"
                        label="공개"
                        name="isPublic"
                        value={1}
                        checked={isPublic === 1}
                        onChange={() => setIsPublic(1)}
                        style={{ accentColor: "#FF6347" }}
                        />
                        <Form.Check
                        inline
                        type="radio"
                        label="비공개"
                        name="isPublic"
                        value={0}
                        checked={isPublic === 0}
                        onChange={() => setIsPublic(0)}
                        style={{ accentColor: "#FF6347" }}
                        />
                    </div>
                    </Form.Group>
            </Form>
            ) : (
            <Form>
                <Form.Group>
                <Form.Label>추가할 즐겨찾기 선택</Form.Label>
                <Form.Control
                    as="select"
                    value={selectedFavoriteId}
                    onChange={(e) => setSelectedFavoriteId(e.target.value)}
                >
                    <option value="" disabled>
                    즐겨찾기를 선택해주세요
                    </option>
                    {favorites.map((item) => (
                    <option key={item.favoriteId} value={item.favoriteId}>
                        {item.favoriteName} ({item.isPublic ? "공개" : "비공개"})
                    </option>
                    ))}
                </Form.Control>
                </Form.Group>
            </Form>
            )}
        </Modal.Body>
        <Modal.Footer>
            
            {creatingFavorite ? (
            <Button 
                style={{ backgroundColor: "#EEA092 ", color: "#fff", border: "none" }} 
                onClick={handleCreateFavorite} disabled={loading}>
                새로 추가하기
            </Button>
            ) : (
            <>
                <Button 
                    style={{ backgroundColor: "#EEA092 ", color: "#fff", border: "none" }} 
                    onClick={() => setCreatingFavorite(true)} 
                    disabled={loading}>
                새 즐겨찾기 만들기
                </Button>
                <Button
                    style={{ backgroundColor: "#FF6347", color: "#fff", border: "none" }}
                    onClick={handleAddItem}
                    disabled={!selectedFavoriteId || loading}
                >
                추가하기
                </Button>
            </>
            )}
            <Button 
                style={{ backgroundColor: "#DCDCDC ", color: "#fff", border: "none" }}
                onClick={onClose} disabled={loading}
            >
            취소
            </Button>
        </Modal.Footer>
        </Modal>
    );
};

export default AddFavoriteItemModal;
