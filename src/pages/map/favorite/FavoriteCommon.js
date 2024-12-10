import axios from "axios";

export const fetchFavorites = async (userId) => {
    const response = await axios.get(`/api/map/favorites`);
    return response.data;
};

export const saveFavorite = async (favoriteData, userId) => {
    const method = favoriteData.favoriteId ? "put" : "post";
    const url = favoriteData.favoriteId
        ? `/api/map/favorites/${favoriteData.favoriteId}`
        : `/api/map/favorites`;

    const response = await axios[method](url, { ...favoriteData, userId });
    return response.data;
    };

export const deleteFavorite = async (favoriteId) => {
    await axios.delete(`/api/map/favorites/${favoriteId}`);
};
