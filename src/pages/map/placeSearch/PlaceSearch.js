// PlaceSearch.js

import React, { useState, useEffect } from "react";
import { Container, InputGroup, FormControl, Button, ListGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../../../components/common/alert/CommonToast";
import { Box, Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import "../../../styles/place/PlaceSearch.css"; // 커스텀 스타일 파일 임포트

const PlaceSearch = () => {
  // 상태 변수 정의
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어
  const [searchType, setSearchType] = useState("지역"); // 검색 유형 (지역/장소)
  const [places, setPlaces] = useState([]); // 검색 결과
  const [hasMore, setHasMore] = useState(true); // 무한 스크롤 여부
  const [suggestions, setSuggestions] = useState([]); // 오토컴플리트 추천
  const [photoReferences, setPhotoReferences] = useState({}); // 사진 참조 관리
  const [googleApiKey, setGoogleApiKey] = useState(""); // Google Maps API 키
  const [map, setMap] = useState(null); // Google Maps 객체
  const [markers, setMarkers] = useState([]); // 지도에 표시된 마커 관리

  const navigate = useNavigate();

  // Google Maps API 키 가져오기
  useEffect(() => {
    fetch("/api/google/maps/key")
      .then((response) => response.text())
      .then((key) => {
        setGoogleApiKey(key);
        loadGoogleMaps(key);
      })
      .catch((error) => console.error("Error fetching Google Maps API Key:", error));
  }, []);

  // Google Maps 로드 함수
  const loadGoogleMaps = (key) => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
      script.async = true;
      script.defer = true;
      script.onload = () => initMap();
      document.body.appendChild(script);
    } else {
      initMap();
    }
  };

  // Google Maps 초기화 함수
  const initMap = () => {
    if (!window.google) {
      console.error("Google Maps API is not loaded.");
      return;
    }
    const googleMap = new window.google.maps.Map(document.getElementById("google-map"), {
      center: { lat: 37.5665, lng: 126.9780 }, // 서울 중심 좌표
      zoom: 12,
    });
    setMap(googleMap);
  };

  // 장소 검색 함수
  const handleSearch = async () => {
    if (!searchKeyword || !searchKeyword.trim()) {
      showErrorToast("검색어를 입력하세요.");
      return;
    }

    // API URL 구성
    const apiUrl =
      searchType === "지역"
        ? `/api/map/places/search/ctyprvnSignguNm?ctyprvnSignguNm=${encodeURIComponent(
            searchKeyword
          )}&offset=0&limit=10`
        : `/api/map/places/search/fcltyNm?fcltyNm=${encodeURIComponent(
            searchKeyword
          )}&offset=0&limit=10`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      // 데이터 형식 확인
      if (Array.isArray(data)) {
        setPlaces(data); // 데이터가 배열일 경우 상태 업데이트
        setHasMore(data.length === 10); // 데이터가 10개이면 더 불러올 수 있음
        updateMapMarkers(data); // 지도에 마커 표시
        fetchPhotoReferences(data); // 사진 참조 가져오기
      } else {
        console.error("응답 데이터가 배열이 아닙니다:", data);
        showErrorToast("검색 결과를 불러올 수 없습니다.");
        setPlaces([]); // 빈 배열로 초기화
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
      showErrorToast("장소 검색 중 오류가 발생했습니다.");
      setPlaces([]); // 에러 발생 시 빈 배열로 초기화
      setHasMore(false);
    }
  };

  // 지도에 마커 업데이트 함수
  const updateMapMarkers = (placesData) => {
    if (!map || !placesData.length) return;

    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    // 새 마커 추가
    const newMarkers = placesData
      .filter((place) => place.lcLa && place.lcLo) // 좌표가 있는 장소만 필터링
      .map((place) => {
        const marker = new window.google.maps.Marker({
          position: { lat: place.lcLa, lng: place.lcLo },
          map,
          title: place.fcltyNm,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div><strong>${place.fcltyNm}</strong><p>${place.operTime || ""}</p></div>`,
        });

        marker.addListener("click", () => infoWindow.open(map, marker));
        return marker;
      });

    setMarkers(newMarkers);

    // 지도 중심을 첫 번째 장소로 이동
    if (placesData[0].lcLa && placesData[0].lcLo) {
      map.setCenter({ lat: placesData[0].lcLa, lng: placesData[0].lcLo });
      map.setZoom(12);
    }
  };

  // 사진 참조 가져오기 함수
  const fetchPhotoReferences = async (placesData) => {
    const newPhotoRefs = {};

    await Promise.all(
      placesData.map(async (place) => {
        if (place.fcltyNm) {
          try {
            const fcltyNmEncoded = encodeURIComponent(place.fcltyNm);
            const photoRefUrl = `/api/google/place/photo-reference?fcltyNm=${fcltyNmEncoded}`;
            const response = await fetch(photoRefUrl);
            const ref = await response.text();
            const photoRef = ref && ref !== "null" ? ref : null;
            newPhotoRefs[place.placeId] = photoRef;
          } catch (error) {
            console.error(`Error fetching photo reference for ${place.fcltyNm}:`, error);
            newPhotoRefs[place.placeId] = null;
          }
        }
      })
    );

    setPhotoReferences((prev) => ({ ...prev, ...newPhotoRefs }));
  };

  // 오토컴플리트 요청 처리 함수
  const fetchSuggestions = async (input) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }

    const apiUrl =
      searchType === "지역"
        ? `/api/map/places/search/ctyprvnSignguNm?ctyprvnSignguNm=${encodeURIComponent(
            input
          )}&limit=5`
        : `/api/map/places/search/fcltyNm?fcltyNm=${encodeURIComponent(input)}&limit=5`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      const suggestionNames =
        searchType === "지역"
          ? data.map((place) => place.ctyprvnSignguNm) // 지역 이름만 가져오기
          : data.map((place) => place.fcltyNm); // 장소 이름만 가져오기

      setSuggestions([...new Set(suggestionNames)]); // 중복 제거
    } catch (error) {
      console.error("오토컴플리트 오류:", error);
      setSuggestions([]);
    }
  };

  // 무한 스크롤을 위한 추가 데이터 로드 함수
  const fetchMoreData = async () => {
    if (!hasMore) return;

    const offset = places.length;
    const apiUrl =
      searchType === "지역"
        ? `/api/map/places/search/ctyprvnSignguNm?ctyprvnSignguNm=${encodeURIComponent(
            searchKeyword
          )}&offset=${offset}&limit=10`
        : `/api/map/places/search/fcltyNm?fcltyNm=${encodeURIComponent(
            searchKeyword
          )}&offset=${offset}&limit=10`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        setPlaces((prevPlaces) => [...prevPlaces, ...data]);
        setHasMore(data.length === 10); // 데이터가 10개이면 더 불러올 수 있음
        updateMapMarkers(data); // 새 데이터에 대한 마커 추가
        fetchPhotoReferences(data); // 새 데이터에 대한 사진 참조 가져오기
      } else {
        setHasMore(false); // 더 이상 불러올 데이터가 없을 경우
      }
    } catch (error) {
      console.error("Error fetching more places:", error);
      setHasMore(false);
    }
  };

  // 필터링 함수
  const handleFilter = (newSearchType) => {
    console.log("Filtering by search type:", newSearchType);
    setSearchType(newSearchType);
    setPlaces([]);
    setHasMore(true);
    setPhotoReferences({});
    handleSearch(); // 필터 변경 시 즉시 검색 실행
  };

  return (
    <Container>
      <h3 className="text-center mt-4">장소 검색</h3>
      <InputGroup className="mb-3">
        <FormControl
          placeholder={`검색어를 입력하세요 (${searchType})`}
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
            fetchSuggestions(e.target.value); // 입력 시 추천 검색어 요청
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <Button variant="outline-secondary" onClick={handleSearch}>
          검색
        </Button>
      </InputGroup>
      <div className="suggestions">
        <ListGroup>
          {suggestions.map((suggestion, index) => (
            <ListGroup.Item
              key={index}
              action
              onClick={() => {
                setSearchKeyword(suggestion);
                handleSearch();
              }}
            >
              {suggestion}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <Box className="mb-3 d-flex justify-content-center">
        {/* 커스텀 클래스 적용 및 버튼 간 간격 조정 */}
        <Button
          className={`custom-button ${searchType === "지역" ? "active" : ""} me-2`}
          onClick={() => handleFilter("지역")}
        >
          지역별 검색
        </Button>
        <Button
          className={`custom-button ${searchType === "장소" ? "active" : ""}`}
          onClick={() => handleFilter("장소")}
        >
          장소 이름 검색
        </Button>
      </Box>
      {/* 지도 영역 */}
      <div id="google-map" style={{ width: "100%", height: "400px", marginBottom: "20px" }} />
      {/* 무한 스크롤 및 카드 리스트 */}
      <InfiniteScroll
        dataLength={places.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p style={{ textAlign: "center" }}>모든 데이터를 불러왔습니다.</p>}
      >
        <Grid container spacing={2}>
          {places.map((place) => {
            const photoRef = photoReferences[place.placeId];
            const imageSrc = photoRef
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${googleApiKey}&nocache=${new Date().getTime()}`
              : "https://via.placeholder.com/151";

            return (
              <Grid item xs={12} key={place.placeId}>
                <Link to={`/placeInfo/${place.placeId}`} style={{ textDecoration: "none" }}>
                  <Card className="common-card" sx={{ display: "flex", mb: 3 }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 151 }}
                      image={imageSrc}
                      alt={place.fcltyNm}
                      loading="lazy"
                    />
                    <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
                      <CardContent>
                        <Typography variant="h5" component="div" className="common-content common-title">
                          {place.fcltyNm}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="common-content common-title">
                          운영시간: {place.operTime || "정보 없음"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" className="common-content common-title">
                          거리: ~{(place.distance || 0).toFixed(1)}km
                        </Typography>
                      </CardContent>
                    </Box>
                  </Card>
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </InfiniteScroll>
    </Container>
  );
};

export default PlaceSearch;
