import React, { useState, useEffect } from "react";
import axios from "axios";
import { Carousel, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../../styles/place/PopularPlaces.css"; // CSS 임포트

const PopularPlacesTop3 = () => {
    const [popularPlaces, setPopularPlaces] = useState([]);
    const [photoReferences, setPhotoReferences] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCards, setVisibleCards] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPopularPlaces = async () => {
        try {
            const response = await axios.get("/api/map/favorites/popular");
            const top3 = response.data.slice(0, 3);
            setPopularPlaces(top3);

            top3.forEach((place) => {
            fetchPhotoReference(place);
            });

            setLoading(false);
        } catch (error) {
            console.error("Error fetching popular places:", error);
            setError("인기 장소를 불러오는 중 오류가 발생했습니다.");
            setLoading(false);
        }
        };

        fetchPopularPlaces();
    }, []);

    const fetchPhotoReference = async (place) => {
        const { lcLa, lcLo, placeName } = place;

        if (!lcLa || !lcLo || !placeName) {
        console.error("Missing data to fetch photo reference:", place);
        return;
        }

        try {
        // Step 1: nearbysearch API 호출
        const nearbySearchUrl = `/api/proxy/place/nearbysearch?latitude=${lcLa}&longitude=${lcLo}&radius=500&keyword=${encodeURIComponent(placeName)}`;
        const nearbyResponse = await axios.get(nearbySearchUrl);

        if (nearbyResponse.data.status === "OK" && nearbyResponse.data.results.length > 0) {
            const firstPlaceId = nearbyResponse.data.results[0].place_id;

            // Step 2: Place Details API 호출
            const detailsUrl = `/api/proxy/place/details?placeId=${firstPlaceId}`;
            const detailsResponse = await axios.get(detailsUrl);

            if (
            detailsResponse.data.result &&
            detailsResponse.data.result.photos &&
            detailsResponse.data.result.photos.length > 0
            ) {
            const firstPhotoReference = detailsResponse.data.result.photos[0].photo_reference;

            // Step 3: photoReference 저장
            setPhotoReferences((prev) => ({
                ...prev,
                [place.placeId]: firstPhotoReference,
            }));
            }
        } else {
            console.error("No places found in nearbysearch for:", placeName);
        }
        } catch (error) {
        console.error("Error fetching photo reference:", error);
        }
    };

    useEffect(() => {
        // 카드 타이머 설정
        if (visibleCards < popularPlaces.length) {
        const timer = setTimeout(() => {
            setVisibleCards(visibleCards + 1);
        }, 300); // 0.3초
        return () => clearTimeout(timer); // 타이머 정리
        }
    }, [visibleCards, popularPlaces.length]);

    const getImageSrc = (placeId) =>
        photoReferences[placeId]
        ? `/api/proxy/place/photo?photoReference=${photoReferences[placeId]}`
        : "https://via.placeholder.com/151";

    const handleNavigation = (placeId) => {
        navigate(`/placeInfo/${placeId}`);
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="text-center text-danger">{error}</div>;

    return (
        <Container className="place-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ textAlign: "left", paddingLeft: "4px", marginTop: "3px", marginBottom: "0px" }}>
            좋아요 인기 Top3 장소
            </h3>
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
        <p
            style={{
            textAlign: "left",
            paddingLeft: "4px",
            margin: "0px",
            fontSize: "12px",
            }}
        >
            핫 한 장소 라인업, 이제 펫 넷에서!
        </p>

        <Carousel className="popular-place-carousel">
            {popularPlaces.map((place, index) => (
            <Carousel.Item key={place.placeId}>
                <Card
                className={`popular-place-card ${index < visibleCards ? "visible" : ""}`}
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
                        index === 0
                            ? "#FF6347"
                            : index === 1
                            ? "#EEA092"
                            : index === 2
                            ? "#ECB392"
                            : "black",
                    }}
                    >
                    👑{index + 1}위 {place.placeName}👑
                    </Card.Title>
                    <Card.Img
                    variant="top"
                    src={getImageSrc(place.placeId)}
                    alt={place.placeName}
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
                    {`♥️ 좋아요 ${place.likeCount}개 ♥️`} <br />
                    {`${place.rdnmadrNm}`} <br />
                    {`🐈 반려동물 제한 몸무게 ${place.entrnPosblPetSizeValue} 🐈`}
                    </Card.Text>
                </Card.Body>
                </Card>
            </Carousel.Item>
            ))}
        </Carousel>
        </Container>
    );
};

export default PopularPlacesTop3;
