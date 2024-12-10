//react
import React, { useState } from "react";
//react bootstrap
import { Container, Row, Col, Image } from "react-bootstrap";

const Places = ({ places }) => {

  const [filteredPlaces, setFilteredPlaces] = useState([]); // 필터링된 장소 데이터
  const [hasMore, setHasMore] = useState(true); // 무한 스크롤 true
  const [map, setMap] = useState(null); // Google Map 객체
  const [category, setCategory] = useState("전체"); // 현재 선택된 카테고리
  const [userLocation, setUserLocation] = useState([]); // 사용자 위치 (기본값: 서울)

  if (!places || places.length === 0) {
    return <p>장소 데이터가 없습니다.</p>;
  }

  return (
    <Container>
      {places.map((place, index) => (
        <Row key={index} className="mb-3">
          <Col xs={4}>
            <Image
              src={`https://maps.googleapis.com/maps/api/place/photo?key=내지도키&photo_reference=${place.photoRef}`}
              thumbnail
            />
          </Col>
          <Col xs={8}>
            <h5>{place.fcltyNm}</h5>
            <p>운영시간: {place.operTime}</p>
            <p>거리: ~{(place.distance || 0).toFixed(1)}km</p>
          </Col>
        </Row>
      ))}
    </Container>
  );
};



export default Places;
