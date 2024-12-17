import React, { useState, useEffect } from "react";
import axios from "axios";

const PlaceImageFetcher = ({ place }) => {
    const [apiKey, setApiKey] = useState("");
    const [placeId, setPlaceId] = useState("");
    const [photoReference, setPhotoReference] = useState("");
    const [imageSrc, setImageSrc] = useState("");

    const { lcLa, lcLo, fcltyNm } = place; // 위도, 경도, 시설 이름 추출

    // Step 1: Fetch Google Maps API Key from Backend
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

    // Step 2: Fetch placeId using Nearby Search API
    useEffect(() => {
        if (!apiKey || !lcLa || !lcLo || !fcltyNm) {
            console.error("Required parameters (latitude, longitude, or facility name) are missing.");
            return;
        }

        const fetchPlaceId = async () => {
            try {
                const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
                const response = await axios.get(url, {
                    params: {
                        location: `${lcLa},${lcLo}`,
                        radius: 500, // 500m 반경
                        keyword: fcltyNm,
                        key: apiKey,
                    },
                });

                const results = response.data.results;
                if (results && results.length > 0) {
                    const firstPlaceId = results[0].place_id;
                    setPlaceId(firstPlaceId);
                    console.log("Place ID fetched:", firstPlaceId);
                } else {
                    console.error("No place found for the given parameters.");
                }
            } catch (error) {
                console.error("Error fetching Place ID:", error);
            }
        };

        fetchPlaceId();
    }, [apiKey, lcLa, lcLo, fcltyNm]);

    // Step 3: Fetch photoReference using Place Details API
    useEffect(() => {
        if (!apiKey || !placeId) return;

        const fetchPhotoReference = async () => {
            try {
                const url = `https://maps.googleapis.com/maps/api/place/details/json`;
                const response = await axios.get(url, {
                    params: {
                        placeid: placeId,
                        fields: "photos",
                        key: apiKey,
                    },
                });

                const photos = response.data.result.photos;
                if (photos && photos.length > 0) {
                    const firstPhotoReference = photos[0].photo_reference;
                    setPhotoReference(firstPhotoReference);
                    console.log("Photo Reference fetched:", firstPhotoReference);
                } else {
                    console.error("No photos found for the given Place ID.");
                }
            } catch (error) {
                console.error("Error fetching Photo Reference:", error);
            }
        };

        fetchPhotoReference();
    }, [placeId, apiKey]);

    // Step 4: Generate Image URL using Photo Reference
    useEffect(() => {
        if (!photoReference || !apiKey) return;

        const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoReference}&key=${apiKey}`;
        setImageSrc(imageUrl);
        console.log("Image URL generated:", imageUrl);
    }, [photoReference, apiKey]);

    return (
        <div>
            <h3>Facility Name: {fcltyNm || "No facility name provided"}</h3>
            <p>Latitude: {lcLa}</p>
            <p>Longitude: {lcLo}</p>
            <p>Place ID: {placeId || "Fetching..."}</p>
            {imageSrc ? (
                <img src={imageSrc} alt={fcltyNm || "Place"} style={{ width: "400px" }} />
            ) : (
                <p>Loading image...</p>
            )}
        </div>
    );
};

export default PlaceImageFetcher;
