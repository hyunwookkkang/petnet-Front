import { useEffect, useState } from "react";
import { ListGroup, Spinner, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const FavoriteInfo = () => {
    const { favoriteId } = useParams(); // URL에서 favoriteId 추출
    const navigate = useNavigate();
    const [places, setPlaces] = useState([]); // 장소 정보 리스트
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavoriteInfo = async () => {
        try {
            const response = await fetch(`/api/map/favorites/info?favoriteId=${favoriteId}`);
            const data = await response.json();
            setPlaces(data); // 장소 리스트 설정
        } catch (error) {
            console.error("Error fetching favorite info:", error);
        } finally {
            setLoading(false);
        }
        };
        fetchFavoriteInfo();
    }, [favoriteId]);

    if (loading) {
        return (
        <div className="text-center mt-4">
            <Spinner animation="border" variant="primary" />
            <p>로딩 중...</p>
        </div>
        );
    }

    if (!places || places.length === 0) {
        return (
        <div className="text-center mt-4">
            <p>저장된 장소가 없습니다.</p>
            <Button variant="primary" onClick={() => navigate("/placeMap")}>
            항목 추가하기
            </Button>
        </div>
        );
    }

    return (
        <div className="container mt-4">
        <h3 className="text-center mb-4">즐겨찾기 ID: {favoriteId}</h3>
        <ListGroup>
            {places.map((place) => (
            <ListGroup.Item
                key={place.itemId}
                onClick={() => navigate(`/place/${place.placeId}`)}
                style={{ cursor: "pointer" }}
            >
                <div>
                <strong>장소 이름:</strong> {place.placeName || "정보 없음"}
                </div>
                <div>
                <strong>운영 시간:</strong> {place.operTime || "정보 없음"}
                </div>
            </ListGroup.Item>
            ))}
        </ListGroup>
        </div>
    );
};

export default FavoriteInfo;
