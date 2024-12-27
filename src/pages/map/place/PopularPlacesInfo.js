import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Card } from "react-bootstrap";

const PopularPlacesInfo = () => {
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [photoReferences, setPhotoReferences] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPopularPlaces = async () => {
      try {
        const response = await axios.get("/api/map/favorites/popular");
        setPopularPlaces(response.data);

        // 각 장소의 사진 참조를 가져옴
        response.data.forEach((place) => {
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

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;
  if (!popularPlaces.length) return <div className="text-center">표시할 인기 장소가 없습니다.</div>;

  const handleNavigation = (placeId) => {
    navigate(`/placeInfo/${placeId}`);
  };

  return (
    <Container
      fluid
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "800px",
        margin: "0 auto",
        padding: "10px",
        backgroundColor: "#F9ECE8",
        overflow: "visible", // 자식 콘텐츠가 잘리지 않도록 설정
        borderRadius: "15px", // 모서리 둥글게 만들기
      }}
    >
      <h2
        style={{
          marginBottom: "20px",
          fontWeight: "bold",
          textAlign: "center",
          color: "#363636",
        }}
      >
        🔥 인기 Top10 장소 🔥
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)", // 2열 그리드
          gap: "20px", // 카드 간격
        }}
      >
        {popularPlaces.map((place, index) => {
          const photoReference = photoReferences[place.placeId];
          const imageSrc = photoReference
            ? `/api/proxy/place/photo?photoReference=${photoReference}`
            : "https://via.placeholder.com/151";

          return (
            <Card
              key={place.placeId}
              onClick={() => handleNavigation(place.placeId)}
              style={{
                cursor: "pointer",
                padding: "10px",
                borderColor: "#feb98e",
                borderRadius: "10px",
                textAlign: "center",
                transition: "transform 0.2s",
                backgroundColor: "#ffffff", // 디버깅용 배경색
                minHeight: "200px", // 최소 높이 설정
              }}
            >
              <Card.Title
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  color:
                    index === 0
                      ? "#FF6347"
                      : index === 1
                      ? "#EEA092"
                      : index === 2
                      ? "#ECB392"
                      : "#363636",
                }}
              >
                <div>{index + 1}위</div> {place.placeName}
              </Card.Title>

              <Card.Img
                variant="top"
                src={imageSrc}
                alt={place.placeName}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover", // 이미지 비율 유지
                  borderRadius: "5px",
                  marginBottom: "15px",
                }}
              />
              <Card.Body>
                <Card.Text style={{ fontSize: "0.9rem", color: "#555" }}>
                  ❤️좋아요 {place.likeCount}개❤️ <br />
                  <div style={{ fontSize: "11px" }}>
                    🐈입장 {place.entrnPosblPetSizeValue}🐈
                  </div>
                  <div style={{ fontSize: "9px" }}>{place.rdnmadrNm}</div>
                </Card.Text>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </Container>
  );
};

export default PopularPlacesInfo;
