import React, { useState, useEffect } from "react";
import axios from "axios";
import { ListGroup, Image, Container, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../../styles/place/PopularPlaces.css"; // 스타일 파일 임포트

const PopularPlaces = () => {
  const [popularPlaces, setPopularPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/api/map/favorites/popular")
      .then((response) => {
        setPopularPlaces(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching popular places:", error);
        setError("인기 장소를 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-danger">{error}</div>;
  }

  return (
    <Container fluid className="mt-4 content-wrapper">
      <Card className="popular-places-card">
        <Card.Header className="text-center mb-4 custom-font">
          🔥좋아요 인기 Top10 장소!🔥
        </Card.Header>
        <ListGroup variant="flush" className="popular-places-list">
          {popularPlaces.map((place, index) => (
            <ListGroup.Item key={place.placeId} className="popular-place-item">
              <Link to={`/place/${place.placeId}`} className="place-link">
                {place.imageUrl && (
                  <Image
                    src={place.imageUrl}
                    alt={place.placeName}
                    rounded
                    className="place-avatar"
                  />
                )}
                <div className="place-details">
                  <h5 className="place-name">{`${index + 1}위: ${place.placeName}`}</h5>
                  <p className="place-like">{`좋아요: ${place.likeCount}`}</p>
                </div>
              </Link>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </Container>
  );
};

export default PopularPlaces;
