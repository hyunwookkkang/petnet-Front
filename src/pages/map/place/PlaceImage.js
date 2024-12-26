import React, { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import "../../../styles/Carousel.css";

const PlaceImage = ({ place }) => {
  const [photoReferences, setPhotoReferences] = useState([]);
  const [apiKey, setApiKey] = useState("");

  // Fetch API Key from Backend
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        const response = await axios.get("/api/google/maps/key");
        setApiKey(response.data);
        console.log("Google API Key fetched:", response.data);
      } catch (error) {
        console.error("Error fetching API Key:", error);
      }
    };

    fetchApiKey();
  }, []);

  useEffect(() => {
    const fetchPlacePhotos = async () => {
      if (!place || !place.lcLa || !place.lcLo || !place.fcltyNm) {
        console.error("Missing required place data.");
        return;
      }

      const { lcLa, lcLo, fcltyNm } = place;

      try {
        // Step 1: Fetch placeId using Nearby Search API via proxy
        const nearbySearchUrl = `/api/proxy/place/nearbysearch`;
        const nearbyResponse = await axios.get(nearbySearchUrl, {
          params: {
            latitude: lcLa,
            longitude: lcLo,
            radius: 500,
            keyword: fcltyNm,
          },
        });

        const placeId = nearbyResponse.data.results?.[0]?.place_id;
        if (!placeId) {
          console.error("No placeId found for the given place.");
          return;
        }

        // Step 2: Fetch photo references using Place Details API via proxy
        const detailsUrl = `/api/proxy/place/details`;
        const detailsResponse = await axios.get(detailsUrl, {
          params: {
            placeId: placeId,
          },
        });

        const photos = detailsResponse.data.result?.photos;
        if (photos && photos.length > 0) {
          const photoRefs = photos.slice(0, 5).map((photo) => photo.photo_reference);
          setPhotoReferences(photoRefs); // 최대 5개의 사진만 저장
        } else {
          console.error("No photos found for the given place.");
        }
      } catch (error) {
        console.error("Error fetching place photos:", error);
      }
    };

    fetchPlacePhotos();
  }, [place]);

  // Generate image URLs from photo references
  const images = photoReferences.map(
    (photoReference) =>
      `/api/proxy/place/photo?photoReference=${photoReference}` // Proxy endpoint to fetch photos
  );

  return (
    <Carousel className="carousel" interval={3000} fade={false} indicators controls>
      {images.length > 0 ? (
        images.map((image, index) => (
          <Carousel.Item key={index}>
              <img src={image} alt={`Slide ${index + 1}`} className="d-block w-100" />
          </Carousel.Item>
        ))
      ) : (
        <p>Loading images...</p>
      )}
    </Carousel>
  );
};

export default PlaceImage;