// src/components/place/PopularPlacesTop3.js

import React, { useState, useEffect } from "react";
import axios from "axios";
import { ListGroup, Image, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/place/PopularPlaces.css"; // 기존 스타일 파일 사용

const PopularPlacesTop3 = () => {
    const [popularPlaces, setPopularPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        axios
        .get("/api/map/favorites/popular")
        .then((response) => {
            const top3 = response.data.slice(0, 3);
            setPopularPlaces(top3);
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

    const handleSeeMore = () => {
        navigate("/map-main");
    };

    return (
        <div className="popular-section"> {/* 섹션 스타일 적용 */}
        <h2 className="custom-font">🔥 좋아요 인기 Top3 장소! 🔥</h2>
        <ListGroup className="popular-places-list" style={{ margin: "10px 0" }}>
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
                    <p className="place-like">{`♥️좋아요♥️: ${place.likeCount}`}</p>
                </div>
                </Link>
            </ListGroup.Item>
            ))}
        </ListGroup>
        <Button className="see-more-button" onClick={handleSeeMore}>
            더 확인하러 가기!
        </Button>
        </div>
    );
};

export default PopularPlacesTop3;
