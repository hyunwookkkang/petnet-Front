import React, { useState, useEffect } from "react";
import { Container, InputGroup, FormControl, Button, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PlaceSearch = () => {
  const [searchKeyword, setSearchKeyword] = useState(""); // 검색어
  const [searchType, setSearchType] = useState("지역"); // 검색 유형 (지역/장소)
  const [places, setPlaces] = useState([]); // 검색 결과
  const [suggestions, setSuggestions] = useState([]); // 오토컴플리트 추천
  const [map, setMap] = useState(null); // Google Maps 객체
  const [markers, setMarkers] = useState([]); // 지도에 표시된 마커 관리
    const navigate = useNavigate();

    const [googleApiKey, setGoogleApiKey] = useState(""); // Google Maps API 키

    // Google Maps 초기화
    useEffect(() => {
        fetch("/api/google/maps/key")
        .then((response) => response.text())
        .then((key) => {
            setGoogleApiKey(key);
            loadGoogleMaps(key);
        })
        .catch((error) => console.error("Error fetching Google Maps API Key:", error));
    }, []);

    const loadGoogleMaps = (key) => {
        if (!window.google) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${key}`;
        script.async = true;
        script.onload = () => initMap();
        document.body.appendChild(script);
        } else {
        initMap();
        }
    };

    const initMap = () => {
        const googleMap = new window.google.maps.Map(document.getElementById("google-map"), {
        center: { lat: 37.5665, lng: 126.9780 },
        zoom: 12,
        });
        setMap(googleMap);
    };

    const handleSearch = async () => {
        if (!searchKeyword || !searchKeyword.trim()) {
        alert("검색어를 입력하세요.");
        return;
        }

        const apiUrl =
        searchType === "지역"
            ? `/api/map/places/search/ctyprvnSignguNm?ctyprvnSignguNm=${searchKeyword}`
            : `/api/map/places/search/fcltyNm?fcltyNm=${searchKeyword}`;

        try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        // 데이터 형식 확인
        if (Array.isArray(data)) {
            setPlaces(data); // 데이터가 배열일 경우 상태 업데이트
            updateMapMarkers(data); // 지도에 마커 표시
        } else {
            console.error("응답 데이터가 배열이 아닙니다:", data);
            alert("검색 결과를 불러올 수 없습니다.");
            setPlaces([]); // 빈 배열로 초기화
        }
        } catch (error) {
        console.error("Error fetching places:", error);
        alert("장소 검색 중 오류가 발생했습니다.");
        setPlaces([]); // 에러 발생 시 빈 배열로 초기화
        }
    };

    const updateMapMarkers = (places) => {
        if (!map || !places.length) return;

        // 기존 마커 제거
        markers.forEach((marker) => marker.setMap(null));
        setMarkers([]);

        // 새 마커 추가
        const newMarkers = places.map((place) => {
        const marker = new window.google.maps.Marker({
            position: { lat: place.lcLa, lng: place.lcLo },
            map,
            title: place.fcltyNm,
        });

        const infoWindow = new window.google.maps.InfoWindow({
            content: `<div><strong>${place.fcltyNm}</strong><p>${place.operTime}</p></div>`,
        });

        marker.addListener("click", () => infoWindow.open(map, marker));
        return marker;
        });

        setMarkers(newMarkers);

        // 지도 중심을 첫 번째 장소로 이동
        map.setCenter({ lat: places[0].lcLa, lng: places[0].lcLo });
        map.setZoom(12);
    };

    // 오토컴플리트 요청 처리
    const fetchSuggestions = async (input) => {
        if (!input.trim()) {
        setSuggestions([]);
        return;
        }

        const apiUrl =
        searchType === "지역"
            ? `/api/map/places/search/ctyprvnSignguNm?ctyprvnSignguNm=${input}`
            : `/api/map/places/search/fcltyNm?fcltyNm=${input}`;

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

    return (
        <Container>
        <h3 className="text-center mt-4">장소 검색</h3>
        <InputGroup className="mb-3">
            <FormControl
            placeholder="검색어를 입력하세요 (예: 강남구, 토리카페)"
            value={searchKeyword}
            onChange={(e) => {
                setSearchKeyword(e.target.value);
                fetchSuggestions(e.target.value); // 입력 시 추천 검색어 요청
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
        <div className="mb-3">
            <Button variant="primary" onClick={() => setSearchType("지역")} active={searchType === "지역"}>
            지역별 검색
            </Button>
            <Button variant="secondary" onClick={() => setSearchType("장소")} active={searchType === "장소"}>
            장소 이름 검색
            </Button>
        </div>
        <div id="google-map" style={{ width: "100%", height: "400px", marginBottom: "20px" }} />
        <ul>
            {places.map((place) => (
            <li key={place.placeId} onClick={() => navigate(`/place/${place.placeId}`)}>
                {place.fcltyNm} - {place.operTime}
            </li>
            ))}
        </ul>
        </Container>
    );
};

export default PlaceSearch;
