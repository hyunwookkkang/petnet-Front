import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Carousel from "react-bootstrap/Carousel";
import { Container, Card } from "react-bootstrap";

const PopularPlaces = () => {
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/map/favorites/popular")
      .then((response) => {
        console.log(response.data); // 데이터 확인용 로그
        setPopularPlaces(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching popular places:", error);
        setError("인기 장소를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-danger">{error}</div>;
  if (!popularPlaces.length)
    return <div className="text-center">표시할 인기 장소가 없습니다.</div>;

  const handleNavigation = (placeId) => {
    navigate(`/placeInfo/${placeId}`);
  };

  return (
    <Container
      fluid
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#F9ECE8",
        borderRadius: "15px",
      }}
    >
      <div
  style={{
    display: "flex",  // flexbox를 사용하여 가로로 정렬
    justifyContent: "space-between",  // 왼쪽은 왼쪽 정렬, 오른쪽은 오른쪽 정렬
    alignItems: "center",  // 세로 정렬 (기본값: 상단 정렬)
    marginBottom: "20px",
  }}
>
  <div
    style={{
      fontSize: "20px",
      fontWeight: "bold",
      textAlign: "left",
      color: "#363636",
    }}
  >
    인기 Top10 장소
  </div>

  <div
    onClick={() => navigate("/popularPlacesInfo")}
    style={{
      cursor: "pointer",
      color: "#FF6347",
      fontSize: "14px",
      fontWeight: "bold",
    }}
  >
    전체보기 &gt;
  </div>
</div>
      
      <Carousel
        className="carousel"
        interval={3000}
        fade={false}
        indicators={true}
        controls={true}
        style={{
          height: "100%",
          overflow: "hidden",
        }}
      >
        {popularPlaces.map((place, index) => (
          <Carousel.Item key={place.placeId}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Card
                onClick={() => handleNavigation(place.placeId)}
                style={{
                  cursor: "pointer",
                  padding: "20px",
                  borderColor: "#feb98e",
                  borderRadius: "10px",
                  textAlign: "center",
                  backgroundColor: "#ffffff",
                  width: "90%", // 카드 너비 설정
                  maxWidth: "400px", // 카드 최대 크기 제한
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  overflow: "hidden",
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
                    marginBottom: "15px",
                  }}
                >
                  <div>{index + 1}위</div> {place.placeName}
                </Card.Title>

                <Card.Img
                  variant="top"
                  src={place.imageUrl || "https://via.placeholder.com/151"}
                  alt={place.placeName}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "5px",
                    marginBottom: "15px",
                  }}
                />
                <Card.Body>
                  <Card.Text
                    style={{
                      fontSize: "0.9rem",
                      color: "#555",
                      lineHeight: "1.5",
                    }}
                  >
                    ❤️좋아요 {place.likeCount}개❤️ <br />
                    <div style={{ fontSize: "11px" }}>
                      🐈입장 {place.entrnPosblPetSizeValue}🐈
                    </div>
                    <div style={{ fontSize: "9px" }}>{place.rdnmadrNm}</div>
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default PopularPlaces;
