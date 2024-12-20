import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Container, ButtonGroup, Button } from "react-bootstrap";
import { Box, Card, CardContent, Typography, CardMedia } from "@mui/material";
import "../../../styles/common/Font.css";
import "../../../styles/common/Card.css";
import "../../../styles/place/Place.css";


const PlaceMap = ({ dbFcltyNm }) => {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [map, setMap] = useState(null);
  const [category, setCategory] = useState("전체");
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null });
  const [photoReferences, setPhotoReferences] = useState({});
  const [googleApiKey, setGoogleApiKey] = useState("");

  // Fetch Google Maps API Key
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await fetch("/api/google/maps/key");
        const apiKey = await response.text();
        setGoogleApiKey(apiKey);
        console.log("Google API Key fetched:", apiKey);
      } catch (error) {
        console.error("Error fetching Google API Key:", error);
      }
    };

    fetchApiKey();
  }, []);

  // Fetch user location
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

  useEffect(() => {
    if (!googleApiKey || !userLocation.lat || !userLocation.lng) return;
  
    const scriptId = "google-maps-script";
    
    // Google Maps 스크립트 로드 함수
    const loadGoogleMapsScript = () => {
      if (document.getElementById(scriptId)) {
        // 스크립트가 이미 로드된 경우
        window.initMap && window.initMap();
        return;
      }
  
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey}&callback=initMap`;
      script.async = true;
      script.defer = true;
  
      // 전역 함수 등록
      window.initMap = () => {
        const googleMap = new window.google.maps.Map(
          document.getElementById("google-map"),
          {
            center: { lat: userLocation.lat, lng: userLocation.lng },
            zoom: 12,
          }
        );
        setMap(googleMap);
        console.log("Google Map initialized.");
      };
  
      document.body.appendChild(script);
    };
  
    loadGoogleMapsScript();
  }, [googleApiKey, userLocation]);
  

  // Fetch places from the server
  const fetchPlaces = (offset = 0) => {
    if (!userLocation.lat || !userLocation.lng) return;

    const categoryParam = category === "전체" ? "" : category;
    const fcltyParam = dbFcltyNm ? `&fcltyNm=${encodeURIComponent(dbFcltyNm)}` : "";

    const url = `/api/map/places?offset=${offset}&limit=10&latitude=${userLocation.lat}&longitude=${userLocation.lng}&category=${encodeURIComponent(categoryParam)}${fcltyParam}`;
    console.log("Fetching places from:", url);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setPlaces((prevPlaces) => [...prevPlaces, ...data]);
          setFilteredPlaces((prevPlaces) => [...prevPlaces, ...data]);

          // Fetch photo references for each place
          data.forEach((place) => {
            fetchPhotoReference(place);
          });
        }
      })
      .catch((error) => console.error("Error fetching places:", error));
  };

  const fetchPhotoReference = async (place) => {
    const { lcLa, lcLo, fcltyNm } = place;

    if (!lcLa || !lcLo || !fcltyNm) {
      console.error("Missing data to fetch photo reference:", place);
      return;
    }

    try {
      const nearbySearchUrl = `/api/proxy/place/nearbysearch?latitude=${lcLa}&longitude=${lcLo}&radius=500&keyword=${encodeURIComponent(fcltyNm)}`;
      console.log("Request URL:", nearbySearchUrl);

      const response = await fetch(nearbySearchUrl);
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const firstPlaceId = data.results[0].place_id;

        // Fetch place details to get photo reference
        const detailsUrl = `/api/proxy/place/details?placeId=${firstPlaceId}`;
        console.log("Details URL:", detailsUrl);

        const detailsResponse = await fetch(detailsUrl);
        const detailsData = await detailsResponse.json();

        if (detailsData.result && detailsData.result.photos && detailsData.result.photos.length > 0) {
          const firstPhotoReference = detailsData.result.photos[0].photo_reference;
          setPhotoReferences((prev) => ({
            ...prev,
            [place.placeId]: firstPhotoReference,
          }));
          console.log("Photo Reference fetched:", firstPhotoReference);
        } else {
          console.error("No photos found for the given Place ID.");
        }
      } else {
        console.error("No place found for:", fcltyNm);
      }
    } catch (error) {
      console.error("Error fetching photo reference:", error);
    }
  };

  // Reload places when user location or category changes
  useEffect(() => {
    if (userLocation.lat && userLocation.lng) {
      setPlaces([]);
      setFilteredPlaces([]);
      setHasMore(true);
      setPhotoReferences({});
      fetchPlaces(0);
    }
  }, [userLocation, category]);

  // Handle category filter
  const handleFilter = (selectedCategory) => {
    setCategory(selectedCategory);
    setPlaces([]);
    setFilteredPlaces([]);
    setHasMore(true);
  };

  // Update markers on the map
  useEffect(() => {
    if (!map || !filteredPlaces.length) return;
  
    filteredPlaces.forEach((place) => {
      if (place.lcLa && place.lcLo) {
        // 카테고리에 따라 마커 아이콘 설정
        let markerIcon = "";
        if (place.ctgryThreeNm  === "카페") {
          markerIcon = "/assets/map/caffe.png";
        } else if (place.ctgryThreeNm  === "식당") {
          markerIcon = "/assets/map/food.png";
        } else if (place.ctgryThreeNm  === "여행지") {
          markerIcon ="/assets/map/travel.png";
        } else {
          markerIcon = ""; // 기본 마커를 사용
        }

        console.log("Custom Marker Icon:", markerIcon);
        console.log("Place Object:", place);
        console.log("Place Category:", place.ctgryThreeNm )
  
        // 마커 생성
        const marker = new window.google.maps.Marker({
          position: { lat: place.lcLa, lng: place.lcLo },
          map,
          icon: markerIcon, // 커스텀 아이콘 설정
        });
  
        // 인포 윈도우 설정
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div><strong>${place.fcltyNm}</strong><p>${place.operTime || ""}</p></div>`,
        });
  
        // 마커 클릭 이벤트
        marker.addListener("click", () => infoWindow.open(map, marker));
      }
    });
  }, [filteredPlaces, map]);
  

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
