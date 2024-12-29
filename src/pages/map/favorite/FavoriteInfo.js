import { useEffect, useState } from "react";
import { ListGroup, Spinner, Button, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const FavoriteInfo = () => {
  const { favoriteId } = useParams(); // URL에서 favoriteId 추출
    const navigate = useNavigate();
    const [places, setPlaces] = useState([]); // 장소 정보 리스트
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태

    // 즐겨찾기 정보 불러오기
    useEffect(() => {
        const fetchFavoriteInfo = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`/api/map/favorites/info`, {
            params: { favoriteId },
            });
            // 비어 있거나 유효하지 않은 항목 제거
            const validPlaces = response.data.filter(
            (place) => place && place.placeId && place.placeName
            );
            setPlaces(validPlaces); // 유효한 장소만 설정
        } catch (err) {
            console.error("Error fetching favorite info:", err);
            setError("즐겨찾기 정보를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
        };

        fetchFavoriteInfo();
    }, [favoriteId]);

    // 장소 삭제 핸들러
    const handleDeletePlace = async (placeId) => {
        try {
        await axios.delete(`/api/map/favorites/item/${placeId}`, {
            params: { favoriteId },
        });
        setPlaces((prevPlaces) =>
            prevPlaces.filter((place) => place.placeId !== placeId)
        ); // 삭제된 항목 필터링
        } catch (err) {
        console.error("Error deleting place:", err);
        setError("장소 삭제 중 오류가 발생했습니다.");
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
            <Alert variant="danger">{error}</Alert>
        </div>
        );
    }

    if (!places || places.length === 0) {
        return (
        <div className="text-center mt-4">
            <p>저장된 장소가 없습니다.</p>
            <Button style={{backgroundColor: "#FF6347", border: "none"}} 
                    onClick={() => navigate("/placeMap")}>
            항목 추가하기
            </Button>
        </div>
        );
    }

    return (
        <div className="container mt-4">
        <ListGroup>
            {places.map((place) => (
            <ListGroup.Item
                key={place.placeId}
                style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                }} // Flexbox 추가
            >
                <div
                onClick={() => navigate(`/placeInfo/${place.placeId}`)}
                style={{ cursor: "pointer", flex: 1 }}
                >
                <div>
                    <h2><strong>장소 이름:</strong> {place.placeName || "정보 없음"}</h2>
                </div>
                </div>
                <Button
                style={{
                    backgroundColor: "#DCDCDC",
                    color: "#fff",
                    border: "none",
                }}
                size="lg"
                onClick={() => handleDeletePlace(place.placeId)} // 삭제 핸들러 호출
                >
                삭제
                </Button>
            </ListGroup.Item>
            ))}
        </ListGroup>
        </div>
    );
};

export default FavoriteInfo;