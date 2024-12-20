import React, { useState, useEffect } from "react";
import axios from "axios";
import { Carousel, Card, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../../styles/place/PopularPlaces.css"; // CSS 임포트

const PopularPlacesTop3 = () => {
    const [popularPlaces, setPopularPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCards, setVisibleCards] = useState(0);
    
    const navigate = useNavigate();

    useEffect(() => {
        axios
        .get("/api/map/favorites/popular")
        .then((response) => {
            const top3 = response.data.slice(0, 3);
            console.log("Fetched popular places:", top3); // 로그 추가
            setPopularPlaces(top3);
            setLoading(false);
        })
        .catch((error) => {
            console.error("Error fetching popular places:", error);
            setError("인기 장소를 불러오는 중 오류가 발생했습니다.");
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        // 카드 타이머 설정
        if (visibleCards < popularPlaces.length) {
            const timer = setTimeout(() => {
                setVisibleCards(visibleCards + 1);
            }, 300); // 0.3초
            return () => clearTimeout(timer); // 타이머 정리
        }
    }, [visibleCards, popularPlaces.length]);

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-danger">{error}</div>;

    const handleSeeMore = () => {
        navigate("/map-main");
    };

    const handleNavigation = (placeId) => {
        navigate(`/placeInfo/${placeId}`);
    };

    const getImageSrc = (place) => {
        // 이미지 URL이 없거나 유효하지 않은 경우 플레이스홀더 이미지 사용
        return place.imageUrl ? place.imageUrl : "https://via.placeholder.com/151";
    };

    return (
        <Container className="place-section"> {/* className 변경 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ textAlign: "left", paddingLeft: "4px", marginTop: "3px", marginBottom: "0px" }}>좋아요 인기 Top3 장소</h3>
                <span
                onClick={() => navigate("/map-main")}
                style={{
                    textAlign: "right",
                    cursor: "pointer",
                    color: "#FF6347",
                    fontSize: "14px",
                    fontWeight: "bold",
                    paddingRight: "1px",
                }}
                >
                더 보러가기 &gt;
                </span>
            </div>
                <p style={{ textAlign: "left", paddingLeft: "4px", margin: "0px", fontSize: "12px" }}>핫 한 장소 라인업, 이제 펫 넷에서!</p>

            
            <Carousel className="popular-place-carousel">
                {popularPlaces.map((place, index) => (
                <Carousel.Item key={place.placeId}>
                    <Card
                    className={`popular-place-card ${index < visibleCards ? 'visible' : ''}`}
                    onClick={() => handleNavigation(place.placeId)}
                    style={{
                        margin: "10px auto",
                        padding: "20px",
                        borderRadius: "10px",
                        textAlign: "center",
                        maxWidth: "300px",
                        overflow: "visible", // 카드 내부 컨텐츠 잘리지 않도록 설정
                        minHeight: "250px", // 최소 높이를 설정하여 텍스트 공간 확보
                    }}
                    >
                    <Card.Body
                        style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "space-between", // 텍스트와 이미지를 적절히 배치
                        height: "100%", // 부모 크기 채우기
                        }}
                    >
                        <Card.Title
                        style={{
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                            marginBottom: "15px",
                            textAlign: "center",
                            color:
                                index === 0 ? "#FF6347" :
                                index === 1 ? "#EEA092" :
                                index === 2 ? "#ECB392" :
                                "black" 
                        }}
                        >
                        👑{index + 1}위 {place.placeName}👑
                        </Card.Title>
                        <Card.Img
                        variant="top"
                        src={getImageSrc(place)}
                        alt={place.placeName}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "https://via.placeholder.com/151";
                        }}
                        style={{
                            width: "151px",
                            height: "151px",
                            objectFit: "cover",
                            borderRadius: "5px",
                            marginBottom: "15px",
                        }}
                        />
                    <Card.Text
                        style={{
                            fontSize: "0.9rem",
                            color: "#555",
                            textAlign: "center",
                            overflow: "visible",
                            lineHeight: "1.5",
                        }}
                        >
                        {`♥️ 좋아요 ${place.likeCount}개 ♥️`}<br/>
                        {`${place.rdnmadrNm}`}<br/>
                        {`🐈 반려동물 제한 몸무게 ${place.entrnPosblPetSizeValue} 🐈`}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Carousel.Item>
            ))}
        </Carousel>
            {/* <div className="button-container"> 
                <Button
                    onClick={handleSeeMore}
                    style={{
                        backgroundColor: "#FF6347", 
                        border: "none",
                        padding: "10px 20px",
                        fontSize: "1rem",
                        color: "#fff",
                        borderRadius: "10px",
                        transition: "background 0.3s ease",
                        margin: "0", // 마진을 0으로 설정
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#45a049")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#FF6347")}
                    aria-label="더 확인하러 가기"
                >
                    더 확인하러 가기!
                </Button> 
            </div>  */}
        </Container>
    );
};

export default PopularPlacesTop3;
