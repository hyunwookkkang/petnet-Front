import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, ButtonGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../components/contexts/UserContext";
import FavoriteModal from "./FavoriteModal";
import DeleteModal from "./DeleteModal";
import { fetchFavorites, saveFavorite, deleteFavorite } from "./FavoriteCommon"; // 공통 로직

const Favorites = () => {
  const { userId, nickname } = useUser(); // UserContext에서 userId와 nickname 가져오기
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]); // 즐겨찾기 목록 상태
  const [selectedFavorite, setSelectedFavorite] = useState(null); // 선택된 즐겨찾기
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false); // 즐겨찾기 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // 삭제 모달 상태
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 즐겨찾기 목록 가져오기
  useEffect(() => {
    if(userId === null){
      //userId불러오기
      return;
    }
    
    if (!userId) {
      setError("로그인이 필요합니다."); // 로그인이 필요한 경우 처리
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
      return;
    }

    const fetchUserFavorites = async () => {
      try {
        setLoading(true);
        setError(null); // 에러 초기화
        const favoritesData = await fetchFavorites(userId); // 공통 API 호출
        setFavorites(favoritesData); // 즐겨찾기 목록 상태 업데이트
      } catch (error) {
        console.error("즐겨찾기 불러오기 오류:", error);
        setError("즐겨찾기 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserFavorites();
  }, [userId, navigate]);

  // 즐겨찾기 저장
  const handleSaveFavorite = async (favoriteData) => {
    try {
      const updatedFavorite = favoriteData.favoriteId
        ? await saveFavorite(favoriteData, userId) // 수정
        : await saveFavorite({ ...favoriteData, userId }); // 새로 저장

      setFavorites((prevFavorites) =>
        favoriteData.favoriteId
          ? prevFavorites.map((fav) =>
              fav.favoriteId === updatedFavorite.favoriteId ? updatedFavorite : fav
            )
          : [updatedFavorite, ...prevFavorites]
      );
      setIsFavoriteModalOpen(false); // 모달 닫기
    } catch (error) {
      console.error("즐겨찾기 저장 오류:", error);
      alert("즐겨찾기 저장 중 오류가 발생했습니다.");
    }
  };

  // 즐겨찾기 삭제
  const handleDeleteFavorite = async () => {
    try {
      await deleteFavorite(selectedFavorite.favoriteId); // 공통 로직 호출
      setFavorites((prevFavorites) =>
        prevFavorites.filter((fav) => fav.favoriteId !== selectedFavorite.favoriteId)
      );
      setIsDeleteModalOpen(false); // 모달 닫기
    } catch (error) {
      console.error("즐겨찾기 삭제 오류:", error);
      alert("즐겨찾기 삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" variant="primary" />
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">🐾 {nickname || "회원"}님의 즐겨찾기 목록 🐾</h3>
      <Button
        className="button-click"
        onClick={() => {
          setSelectedFavorite(null);
          setIsFavoriteModalOpen(true); // 추가 모달 열기
        }}
      >
        즐겨찾기 추가하기
      </Button>

      <div className="sections">
        {favorites.map((favorite) => (
          <Card key={favorite.favoriteId} className="mb-3">
            <Card.Body>
              <Card.Title>
                즐겨찾기 이름: {favorite.favoriteName}{" "}
                {favorite.isPublic ? "🌟 공개" : "🔒 비공개"}
              </Card.Title>
              <Card.Text>저장된 장소 {favorite.itemCount || 0}개</Card.Text>
              <ButtonGroup>
                <Button
                  className="button-click"
                  onClick={() => navigate(`/placeFavorite/${favorite.favoriteId}`)} // 상세보기 이동
                >
                  상세보기
                </Button>
                <Button
                  className="button-click"
                  onClick={() => {
                    setSelectedFavorite(favorite);
                    setIsFavoriteModalOpen(true); // 수정 모달 열기
                  }}
                >
                  수정
                </Button>
                <Button
                  className="button-click"
                  onClick={() => {
                    setSelectedFavorite(favorite);
                    setIsDeleteModalOpen(true); // 삭제 모달 열기
                  }}
                >
                  삭제
                </Button>
              </ButtonGroup>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* 즐겨찾기 추가/수정 모달 */}
      <FavoriteModal
        show={isFavoriteModalOpen}
        onClose={() => setIsFavoriteModalOpen(false)}
        onSubmit={handleSaveFavorite}
        favorite={selectedFavorite}
      />

      {/* 즐겨찾기 삭제 모달 */}
      <DeleteModal
        show={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteFavorite}
      />
    </div>
  );
};

export default Favorites;
