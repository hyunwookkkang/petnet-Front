import React, { useState, useEffect } from "react";
import { Card, Button } from "react-bootstrap";
import FavoriteModal from "./FavoriteModal";
import DeleteModal from "./DeleteModal";

const FavoritesPage = ({ userId }) => {
  const [favorites, setFavorites] = useState([]);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/map/favorites/${userId}`)
      .then((response) => response.json())
      .then((data) => setFavorites(data))
      .catch((error) => console.error("Error fetching favorites:", error));
  }, [userId]);

  const handleAddOrUpdateFavorite = (favoriteData) => {
    if (selectedFavorite) {
      // 수정 API 호출
      fetch(`/api/map/favorites/${selectedFavorite.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(favoriteData),
      })
        .then(() => {
          setFavorites((prev) =>
            prev.map((fav) =>
              fav.id === selectedFavorite.id ? { ...fav, ...favoriteData } : fav
            )
          );
          setSelectedFavorite(null);
        })
        .catch((error) => console.error("Error updating favorite:", error));
    } else {
      // 추가 API 호출
      fetch(`/api/map/favorites`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(favoriteData),
      })
        .then((response) => response.json())
        .then((newFavorite) => {
          setFavorites((prev) => [newFavorite, ...prev]);
        })
        .catch((error) => console.error("Error adding favorite:", error));
    }
  };

  const handleDeleteFavorite = () => {
    fetch(`/api/map/favorites/${selectedFavorite.id}`, {
      method: "DELETE",
    })
      .then(() => {
        setFavorites((prev) =>
          prev.filter((fav) => fav.id !== selectedFavorite.id)
        );
        setSelectedFavorite(null);
        setIsDeleteModalOpen(false);
      })
      .catch((error) => console.error("Error deleting favorite:", error));
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">내 즐겨찾기 목록</h3>
      <Button
        className="mb-3"
        onClick={() => {
          setSelectedFavorite(null);
          setIsFavoriteModalOpen(true);
        }}
      >
        즐겨찾기 추가하기
      </Button>

      {favorites.map((favorite, index) => (
        <Card key={index} className="mb-3">
          <Card.Body>
            <Card.Title>
              {favorite.isPublic ? "공개 🌟" : "비공개 🔒"} {favorite.name}
            </Card.Title>
            <Card.Text>저장된 장소 {favorite.placeCount}개</Card.Text>
            <Button
              variant="primary"
              className="me-2"
              onClick={() => {
                setSelectedFavorite(favorite);
                setIsFavoriteModalOpen(true);
              }}
            >
              수정
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setSelectedFavorite(favorite);
                setIsDeleteModalOpen(true);
              }}
            >
              삭제
            </Button>
          </Card.Body>
        </Card>
      ))}

      {/* 즐겨찾기 추가/수정 모달 */}
      <FavoriteModal
        show={isFavoriteModalOpen}
        onClose={() => setIsFavoriteModalOpen(false)}
        onSubmit={handleAddOrUpdateFavorite}
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

export default FavoritesPage;
