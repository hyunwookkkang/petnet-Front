import React, { useState, useEffect } from "react";
import { Container, InputGroup, FormControl, Button, ListGroup } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { Box, Card, CardContent, CardMedia, Typography, Grid } from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import { showErrorToast } from "../../../components/common/alert/CommonToast";
import "../../../styles/place/PlaceSearch.css";

const PlaceSearch = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchType, setSearchType] = useState("지역");
  const [places, setPlaces] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [photoReferences, setPhotoReferences] = useState({});
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch("/api/google/maps/key");
        const apiKey = await response.text();
        setGoogleApiKey(apiKey);
        loadGoogleMaps(apiKey);
      } catch (error) {
        console.error("Error fetching Google API Key:", error);
      }
    };

    fetchApiKey();
  }, []);

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

  const initMap = () => {
    if (!window.google) {
      console.error("Google Maps API is not loaded.");
      return;
    }
    const googleMap = new window.google.maps.Map(document.getElementById("google-map"), {
      center: userLocation.lat && userLocation.lng ? userLocation : { lat: 37.5665, lng: 126.9780 },
      zoom: 12,
    });
    setMap(googleMap);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => console.error("Error fetching location:", error)
      );
    }
  }, []);

  const updateMapMarkers = (placesData) => {
    if (!map || !placesData.length) return;

    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    const newMarkers = placesData.map((place) => {
      if (!place.lcLa || !place.lcLo) return null;

      const marker = new window.google.maps.Marker({
        position: { lat: place.lcLa, lng: place.lcLo },
        map,
        title: place.fcltyNm,
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div><strong>${place.fcltyNm}</strong><p>${place.operTime || "운영시간 정보 없음"}</p></div>`,
      });

      marker.addListener("click", () => infoWindow.open(map, marker));
      return marker;
    });

    setMarkers(newMarkers);

    if (placesData[0].lcLa && placesData[0].lcLo) {
      map.setCenter({ lat: placesData[0].lcLa, lng: placesData[0].lcLo });
      map.setZoom(14);
    }
  };

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      showErrorToast("검색어를 입력하세요.");
      return;
    }

    if (!userLocation.lat || !userLocation.lng) {
      showErrorToast("위치 정보를 가져오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const apiUrl =
      searchType === "지역"
        ? `/api/map/places/search/ctyprvnSignguNm?ctyprvnSignguNm=${encodeURIComponent(
            searchKeyword
          )}&offset=0&limit=10&latitude=${userLocation.lat}&longitude=${userLocation.lng}`
        : `/api/map/places/search/fcltyNm?fcltyNm=${encodeURIComponent(
            searchKeyword
          )}&offset=0&limit=10&latitude=${userLocation.lat}&longitude=${userLocation.lng}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (Array.isArray(data)) {
        setPlaces(data);
        setHasMore(data.length === 10);
        updateMapMarkers(data);
        fetchPhotoReferences(data);
      } else {
        console.error("응답 데이터가 배열이 아닙니다:", data);
        showErrorToast("검색 결과를 불러올 수 없습니다.");
        setPlaces([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching places:", error);
      showErrorToast("장소 검색 중 오류가 발생했습니다.");
      setPlaces([]);
      setHasMore(false);
    }
  };

  const fetchPhotoReferences = async (placesData) => {
    const newPhotoRefs = {};

    await Promise.all(
      placesData.map(async (place) => {
        if (place.fcltyNm) {
          try {
            const nearbySearchUrl = `/api/proxy/place/nearbysearch?latitude=${place.lcLa}&longitude=${place.lcLo}&radius=500&keyword=${encodeURIComponent(
              place.fcltyNm
            )}`;
            const nearbyResponse = await fetch(nearbySearchUrl);
            const nearbyData = await nearbyResponse.json();

            if (nearbyData.status === "OK" && nearbyData.results.length > 0) {
              const firstPlaceId = nearbyData.results[0].place_id;
              const detailsUrl = `/api/proxy/place/details?placeId=${firstPlaceId}`;
              const detailsResponse = await fetch(detailsUrl);
              const detailsData = await detailsResponse.json();

              if (
                detailsData.result &&
                detailsData.result.photos &&
                detailsData.result.photos.length > 0
              ) {
                const firstPhotoReference = detailsData.result.photos[0].photo_reference;
                newPhotoRefs[place.placeId] = firstPhotoReference;
              }
            }
          } catch (error) {
            console.error(`Error fetching photo reference for ${place.fcltyNm}:`, error);
          }
        }
      })
    );

    setPhotoReferences((prev) => ({ ...prev, ...newPhotoRefs }));
  };

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
          ? data.map((place) => place.ctyprvnSignguNm)
          : data.map((place) => place.fcltyNm);

      setSuggestions([...new Set(suggestionNames)]);
    } catch (error) {
      console.error("오토컴플리트 오류:", error);
      setSuggestions([]);
    }
  };

  const fetchMoreData = async () => {
    if (!hasMore) return;

    const offset = places.length;
    const apiUrl =
      searchType === "지역"
        ? `/api/map/places/search/ctyprvnSignguNm?ctyprvnSignguNm=${encodeURIComponent(
            searchKeyword
          )}&offset=${offset}&limit=10&latitude=${userLocation.lat}&longitude=${userLocation.lng}`
        : `/api/map/places/search/fcltyNm?fcltyNm=${encodeURIComponent(
            searchKeyword
          )}&offset=${offset}&limit=10&latitude=${userLocation.lat}&longitude=${userLocation.lng}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (Array.isArray(data)) {
        setPlaces((prevPlaces) => [...prevPlaces, ...data]);
        setHasMore(data.length === 10);
        fetchPhotoReferences(data);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more places:", error);
      setHasMore(false);
    }
  };

  const handleFilter = (newSearchType) => {
    setSearchType(newSearchType);
    setPlaces([]);
    setHasMore(true);
    fetchSuggestions("");
    handleSearch();
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
            fetchSuggestions(e.target.value);
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
      {suggestions.length > 0 && (
        <ListGroup className="autocomplete-suggestions">
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
      )}
      <Box className="mb-3 d-flex justify-content-center">
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
      <div id="google-map" style={{ width: "100%", height: "400px", marginBottom: "20px" }} />
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
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${googleApiKey}`
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
                          🐈 반려동물 제한 몸무게: {place.entrnPosblPetSizeValue || "정보 없음"} 🐈
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
