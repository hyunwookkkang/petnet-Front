import { Link } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Container, ButtonGroup, Button } from "react-bootstrap";
import { Box, Card, CardContent, Typography, CardMedia } from "@mui/material";
import "../../../styles/common/Font.css";
import "../../../styles/common/Card.css";
import "../../../styles/place/Place.css";


const PlaceMap = () => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [map, setMap] = useState(null);
  const [category, setCategory] = useState("전체");
  const [userLocation, setUserLocation] = useState({ lat: 37.5665, lng: 126.9780 });
  const [googleApiKey, setGoogleApiKey] = useState("");

  /*
    API Key 호출시 주의사항
      * googleApiKey가 설정된 후에만 Google Maps 스크립트를 로드하도록
      * API 키와 사용자 위치가 모두 준비된 후에 지도 초기화를 수행
  */

  // API Key 호출
  useEffect(() => {
    fetch("/api/google/maps/key")
      .then((response) => response.text())
      .then((key) => {
        setGoogleApiKey(key);
      })
      .catch((error) => console.error("Error fetching Google Maps API Key:", error));
  }, []);

  // 사용자 위치 정보 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  }, []);

  // Google Maps 초기화
  useEffect(() => {
    if (!googleApiKey || !userLocation) return; // 수정: API 키와 위치 정보가 준비된 후 실행

    const initMap = () => {
      const googleMap = new window.google.maps.Map(document.getElementById("google-map"), {
        center: userLocation,
        zoom: 12,
      });
      setMap(googleMap);
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}`;
      script.async = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, [googleApiKey, userLocation]); // 수정: API 키와 위치 정보를 의존성으로 추가

  // 장소 데이터 가져오기
  const fetchPlaces = (offset = 0) => {
    fetch(
      `/api/map/places?offset=${offset}&limit=10&latitude=${userLocation.lat}&longitude=${userLocation.lng}&category=${category === "전체" ? "" : category}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setPlaces((prevPlaces) => [...prevPlaces, ...data]);
          setFilteredPlaces((prevPlaces) => [...prevPlaces, ...data]);
        }
      })
      .catch((error) => console.error("Error fetching places:", error));
  };

  // Google Maps에 마커 업데이트
  useEffect(() => {
    if (!map || !filteredPlaces.length) return; // 수정: 지도와 장소 데이터가 준비된 후 실행

    filteredPlaces.forEach((place) => {
      if (place.lcLa && place.lcLo) {
        const marker = new window.google.maps.Marker({
          position: { lat: place.lcLa, lng: place.lcLo },
          map,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div><strong>${place.fcltyNm}</strong><p>${place.operTime}</p></div>`,
        });

        marker.addListener("click", () => infoWindow.open(map, marker));
      }
    });
  }, [filteredPlaces, map]);

  // 필터링 처리
  const handleFilter = (category) => {
    setCategory(category);
    setPlaces([]);
    setFilteredPlaces([]);
    setHasMore(true);
    fetchPlaces(0);
  };

  useEffect(() => {
    setPlaces([]);
    setFilteredPlaces([]);
    setHasMore(true);
    fetchPlaces(0);
  }, [userLocation, category]);

  return (
    <Container>
      <ButtonGroup className="place-button-group" style={{ marginBottom: "10px" }}>
        <Button className="place-button-click" onClick={() => handleFilter("전체")}>
          전체
        </Button>
        <Button className="place-button-click" onClick={() => handleFilter("식당")}>
          식당
        </Button>
        <Button className="place-button-click" onClick={() => handleFilter("카페")}>
          카페
        </Button>
        <Button className="place-button-click" onClick={() => handleFilter("여행지")}>
          여행지
        </Button>
      </ButtonGroup>

      <div id="google-map" style={{ width: "100%", height: "400px", marginBottom: "20px" }} />

      <InfiniteScroll
        dataLength={filteredPlaces.length}
        next={() => fetchPlaces(filteredPlaces.length)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p style={{ textAlign: "center" }}>모든 데이터를 불러왔습니다.</p>}
      >
        <Container>
          {filteredPlaces.map((place, index) => {
            const photoReference = photoReferences[place.placeId];
            const imageSrc = photoReference
              ? `/api/proxy/place/photo?photoReference=${photoReference}`
              : "https://via.placeholder.com/151";

            return (
              <Link
                to={{
                  pathname: `/placeInfo/${place.placeId}`,
                  state: { photoReferences: photoReferences[place.placeId] || [] },
                }}
                key={index}
                style={{ textDecoration: "none" }}
              >
                <Card sx={{ display: "flex", mb: 3 }} className="common-card">
                  <CardMedia
                    component="img"
                    sx={{ width: 151 }}
                    image={imageSrc}
                    alt={place.fcltyNm}
                  />
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardContent>
                    <div style={{fontSize: '18px'}}>{place.fcltyNm}</div>
                    <div style={{fontSize: '14px'}}>나와의 거리: ~{(place.distance || 0).toFixed(1)}km</div>
                    <div style={{fontSize: '11px'}}>{place.operTime}</div>
                    <div style={{fontSize: '9px'}}>{place.rdnmadrNm}</div>
                    </CardContent>
                  </Box>
                </Card>
              </Link>
            );
          })}
        </Container>
      </InfiniteScroll>
    </Container>
  );
};

export default PlaceMap;
