import React, { useEffect, useState } from "react";
import { Container, Row, Col, Image, ButtonGroup, Button } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

const Products = () => {
  const [places, setPlaces] = useState([]); // 전체 장소 데이터
  const [filteredPlaces, setFilteredPlaces] = useState([]); // 필터링된 장소 데이터
  const [hasMore, setHasMore] = useState(true); // 무한 스크롤 true
  const [map, setMap] = useState(null); // Google Map 객체
  const [category, setCategory] = useState("전체"); // 현재 선택된 카테고리
  const [userLocation, setUserLocation] = useState({ lat: 37.5665, lng: 126.9780 }); // 사용자 위치 (기본값: 서울)



  // 상품 데이터 가져오기
  const fetchProducts = (params) => {

      // 1. 필터링해서 쿼리 문자열 생성
    const queryString = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== "") // 값이 비어있지 않은 경우만
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`) // key=value 형태로 변환
    .join("&");

    // 현재 사용자 위치를 기반으로 장소를 가져옴
    fetch(productsRequest)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          setHasMore(false); // 데이터가 없으면 무한 스크롤 멈춤
        } else {
          setPlaces((prevPlaces) => [...prevPlaces, ...data]);
          setFilteredPlaces((prevPlaces) => [...prevPlaces, ...data]);
        }
      })
      .catch((error) => console.error("Error fetching places:", error));
  };
  
  // Google Map 초기화
  useEffect(() => {
    const initMap = () => {
      const googleMap = new window.google.maps.Map(document.getElementById("google-map"), {
        center: userLocation, // 사용자 위치를 지도 중심으로 설정
        zoom: 12,
      });
      setMap(googleMap);
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=지도키`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, [userLocation]);

  // Google Map에 마커 업데이트
useEffect(() => {
  if (map) {
    filteredPlaces.forEach((place) => {
      if (place.lcLa && place.lcLo) {
        // 기본 마커를 추가
        const marker = new window.google.maps.Marker({
          position: { lat: place.lcLa, lng: place.lcLo },
          map,
        });

        // 정보창 추가
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div><strong>${place.fcltyNm}</strong><p>${place.operTime}</p></div>`,
        });

        // 마커 클릭 이벤트 추가
        marker.addListener("click", () => infoWindow.open(map, marker));
      }
    });
  }
}, [filteredPlaces, map]);


  // 필터링 처리
  const handleFilter = (category) => {
    setCategory(category);
    setPlaces([]); // 기존 데이터 초기화
    setFilteredPlaces([]); // 필터된 데이터 초기화
    setHasMore(true); // 무한 스크롤 초기화
    fetchPlaces(0); // 필터링된 데이터로 다시 가져오기
  };

  useEffect(() => {
    // 초기 데이터 로드
    fetchPlaces(0); // 전체 조회
  }, [userLocation, category]);

  return (
    <Container>
      {/* 카테고리 필터 버튼 */}
      <ButtonGroup className="button-group">
      <Button className="button-click" onClick={() => handleFilter("전체")}>전체</Button>
      <Button className="button-click" onClick={() => handleFilter("식당")}>식당</Button>
      <Button className="button-click" onClick={() => handleFilter("카페")}>카페</Button>
      <Button className="button-click" onClick={() => handleFilter("여행지")}>여행지</Button>
      </ButtonGroup>

      {/* Google Map */}
      <div id="google-map" style={{ width: "100%", height: "400px", marginBottom: "20px" }} />

      {/* 장소 리스트 */}
      {/* 무한스크롤 시작 --> npm install --save react-infinite-scroll-component 
        * loader= 사용해서 로딩할 때 메세지 출력
        * hasMore= 받아올 값이 남았는가?
        * endMessage= 더이상 가져올 데이터가 없을 때 나옴
      */}
      <InfiniteScroll
        dataLength={filteredPlaces.length}
        next={() => fetchPlaces(filteredPlaces.length)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}    
        endMessage={<p style={{ textAlign: "center" }}>모든 데이터를 불러왔습니다.</p>}
      >
        <Container>
          {/**https://mui.com/material-ui/react-drawer/ */}
          {filteredPlaces.map((place, index) => (
            <Row key={index} className="mb-3">
              <Col xs={4}>
                <Image
                  src={`https://maps.googleapis.com/maps/api/place/photo?key=지도키A&photo_reference=${place.photoRef}`}
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
      </InfiniteScroll>
      {/* 무한스크롤끝 */}
    </Container>
  );
};

export default Products;
