import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Container, ButtonGroup, Button } from "react-bootstrap";
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material";
import "../../../styles/common/Font.css";
import "../../../styles/common/Card.css";


const PlaceMap = ({ dbFcltyNm }) => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [map, setMap] = useState(null);
  const [category, setCategory] = useState("전체");
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [photoReferences, setPhotoReferences] = useState({});

  useEffect(() => {
    fetch("/api/google/maps/key")
      .then((response) => response.text())
      .then((key) => {
        setGoogleApiKey(key);
        console.log("Google API Key fetched:", key);
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
          console.log("User location fetched:", latitude, longitude);
        },
        (error) => console.error("Error fetching location:", error)
      );
    }
  }, []);

  // Google Maps 초기화
  useEffect(() => {
    if (!googleApiKey || !userLocation.lat || !userLocation.lng) return;
    const initMap = () => {
      const googleMap = new window.google.maps.Map(
        document.getElementById("google-map"),
        { center: { lat: userLocation.lat, lng: userLocation.lng }, zoom: 12 }
      );
      console.log("Google Map initialized at:", userLocation);
      setMap(googleMap);
    };

    if (!window.google || !window.google.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, [googleApiKey, userLocation]);

  const fetchPlaces = (offset = 0) => {
    if (!googleApiKey) return;
    if (!userLocation.lat || !userLocation.lng) return;

    const categoryParam = category === "전체" ? "" : category;
    const fcltyParam = dbFcltyNm ? `&fcltyNm=${encodeURIComponent(dbFcltyNm)}` : "";

    const url = `/api/map/places?offset=${offset}&limit=10&latitude=${userLocation.lat}&longitude=${userLocation.lng}&category=${encodeURIComponent(categoryParam)}${fcltyParam}`;
    console.log("Fetching places from:", url);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log("Places fetched:", data);
        if (data.length === 0) {
          setHasMore(false);
        } else {
          // DB에서 받은 places
          setPlaces((prevPlaces) => {
            const merged = [...prevPlaces, ...data];
            console.log("All places after adding new batch:", merged);
            return merged;
          });
          setFilteredPlaces((prevPlaces) => {
            const merged = [...prevPlaces, ...data];
            console.log("Filtered places after adding new batch:", merged);
            return merged;
          });

          // 각 장소 별 photo_reference 조회
          data.forEach((place) => {
            const fcltyNmEncoded = encodeURIComponent(place.fcltyNm);
            const photoRefUrl = `/api/google/place/photo-reference?fcltyNm=${fcltyNmEncoded}`;
            fetch(photoRefUrl)
              .then(res => res.text())
              .then(ref => {
                const photoRef = (ref && ref !== "null") ? ref : null;
                setPhotoReferences(prev => ({ ...prev, [place.placeId]: photoRef }));
              })
              .catch(err => console.error("Error fetching photo reference:", err));
          });
        }
      })
      .catch((error) => console.error("Error fetching places:", error));
  };

  // userLocation, category, googleApiKey 변경 시 places 재조회
  useEffect(() => {
    console.log("Attempting to fetch places due to changes:", userLocation, category, googleApiKey);
    if (userLocation.lat && userLocation.lng && googleApiKey) {
      setPlaces([]);
      setFilteredPlaces([]);
      setHasMore(true);
      setPhotoReferences({});
      fetchPlaces(0);
    }
  }, [userLocation, category, googleApiKey]);

  const handleFilter = (category) => {
    console.log("Filtering by category:", category);
    setCategory(category);
    setPlaces([]);
    setFilteredPlaces([]);
    setHasMore(true);
    setPhotoReferences({});
  };

  // filteredPlaces 변경 시 지도에 마커 표시
  useEffect(() => {
    if (!map || !filteredPlaces.length) return;
    console.log("Updating markers on the map with filteredPlaces:", filteredPlaces);

    filteredPlaces.forEach((place) => {
      if (place.lcLa && place.lcLo) {
        const marker = new window.google.maps.Marker({
          position: { lat: place.lcLa, lng: place.lcLo },
          map,
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div><strong>${place.fcltyNm}</strong><p>${place.operTime || ""}</p></div>`,
        });

        marker.addListener("click", () => infoWindow.open(map, marker));
      }
    });
  }, [filteredPlaces, map]);

  return (
    <Container>
      <ButtonGroup className="button-group" style={{ marginBottom: "10px" }}>
        <Button className="button-click" onClick={() => handleFilter("전체")}>
          전체
        </Button>
        <Button className="button-click" onClick={() => handleFilter("식당")}>
          식당
        </Button>
        <Button className="button-click" onClick={() => handleFilter("카페")}>
          카페
        </Button>
        <Button className="button-click" onClick={() => handleFilter("여행지")}>
          여행지
        </Button>
      </ButtonGroup>

      <div
        id="google-map"
        style={{ width: "100%", height: "400px", marginBottom: "20px" }}
      />

      <InfiniteScroll
        dataLength={filteredPlaces.length}
        next={() => fetchPlaces(filteredPlaces.length)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p style={{ textAlign: "center" }}>모든 데이터를 불러왔습니다.</p>}
      >
        <Container>
          {filteredPlaces.map((place, index) => {
            const photoRef = photoReferences[place.placeId];
            const imageSrc = photoRef
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${googleApiKey}&nocache=${new Date().getTime()}`
              : "https://via.placeholder.com/151";

            return (
              <Link
                to={`/place/${place.placeId}`}
                key={index}
                style={{ textDecoration: "none" }}
              >
                <Card key={index} sx={{ display: "flex", mb: 3 }} className="common-card">
                  <CardMedia
                    component="img"
                    sx={{ width: 151 }}
                    image={imageSrc}
                    alt={place.fcltyNm}
                  />
                  <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <CardContent>
                      <Typography component="div" variant="h5"  className="common-content common-title">
                        <h3>{place.fcltyNm}</h3>
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary" className="common-content common-title">
                        운영시간: {place.operTime}
                      </Typography>
                      <Typography variant="subtitle1" color="text.secondary"  className="common-content common-title">
                        거리: ~{(place.distance || 0).toFixed(1)}km
                      </Typography>
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
