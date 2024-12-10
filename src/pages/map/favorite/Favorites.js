import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, ButtonGroup } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 리다이렉트를 위해 useNavigate 사용
import { useUser } from "../../../components/contexts/UserContext";
import FavoriteModal from "./FavoriteModal";
import DeleteModal from "./DeleteModal";

const Favorites = () => {
  //const { userId } = useUser(); // 사용자 ID 가져오기
  //////////////user값 가져오기///////////////////////
  const {userId, nickname} = useUser();
  //필요시 const {userId, nickname, myPoint} = useUser();
  const [favorites, setFavorites] = useState([]);
  ///////////////////////////////////////////////////
  const navigate = useNavigate(); // 리다이렉트를 위한 navigate 함수
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 즐겨찾기 목록 가져오기
  
  useEffect(() => {
    if(userId === null){
      //userId불러오기
      return;
    }

    if (!userId) {
      setError("로그인이 필요합니다."); // 에러 상태
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login"); // 로그인 페이지로 리다이렉트
      return;
    }

    const fetchFavorites = async () => {
      try {
        setLoading(true); // 로딩 시작
        setError(null); // 에러 초기화
        const response = await axios.get(`/api/map/favorites/${userId}`);
        setFavorites(response.data); // 즐겨찾기 목록 상태 업데이트
      } catch (error) {
        console.error("즐겨찾기 불러오기 오류:", error);
        setError("즐겨찾기 목록을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchFavorites();
  }, [userId, navigate]);

  // 즐겨찾기 저장
  const handleSaveFavorite = async (favoriteData) => {
    try {
      const method = selectedFavorite ? "put" : "post";
      const url = selectedFavorite
        ? `/api/map/favorites/${selectedFavorite.favoriteId}`
        : `/api/map/favorites`;

      const response = await axios[method](url, { ...favoriteData, userId });

      if (method === "post") {
        setFavorites((prev) => [response.data, ...prev]);
      } else {
        setFavorites((prev) =>
          prev.map((fav) =>
            fav.favoriteId === response.data.favoriteId
              ? response.data
              : fav
          )
        );
      }

      setSelectedFavorite(null);
      setIsFavoriteModalOpen(false);
    } catch (error) {
      console.error("즐겨찾기 저장 오류:", error);
      alert("즐겨찾기 저장 중 오류가 발생했습니다.");
    }
  };

  // 즐겨찾기 삭제
  const handleDeleteFavorite = async () => {
    try {
      await axios.delete(`/api/map/favorites/${selectedFavorite.favoriteId}`);
      setFavorites((prev) =>
        prev.filter((fav) => fav.favoriteId !== selectedFavorite.favoriteId)
      );
      setSelectedFavorite(null);
      setIsDeleteModalOpen(false);
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
      <h3 className="text-center mb-4">🐾 {nickname}님의 즐겨찾기 목록🐾 </h3>
      <Button
        className="mb-3"
        onClick={() => {
          setSelectedFavorite(null);
          setIsFavoriteModalOpen(true);
        }}
      >
        즐겨찾기 추가하기
      </Button>

      <div className="sections">
      
      {favorites.map((favorite) => (
        <Card key={favorite.favoriteId}>
          <Card.Body className="section">
            <Card.Title>
              즐겨찾기 이름: {favorite.favoriteName}<br/> 
              {favorite.isPublic ? "공개 🌟" : "비공개 🔒"} 
            </Card.Title>
            <Card.Text>저장된 장소 {favorite.itemCount}개</Card.Text>

          <ButtonGroup className="button-group">

          </ButtonGroup>
          <Button
            
            className="button-click">
              상세보기
            </Button>

            <Button
              
              className="button-click"
              onClick={() => {
                setSelectedFavorite(favorite);
                setIsFavoriteModalOpen(true);
              }}
            >
              수정
            </Button>

            <Button
              className="button-click"
              
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

      </div>
      <FavoriteModal
        show={isFavoriteModalOpen}
        onClose={() => setIsFavoriteModalOpen(false)}
        onSubmit={handleSaveFavorite}
        favorite={selectedFavorite}
      />

      <DeleteModal
        show={isDeleteModalOpen}
        onClose={()=> setIsDeleteModalOpen(false)}
        onDelete={handleDeleteFavorite}
      />
    </div>
  );
};

export default Favorites;
