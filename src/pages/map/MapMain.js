import React from "react";
import { useNavigate } from "react-router-dom";
// Components
import SearchBar from "../../components/place/searchBar/SearchBar";
import PopularPlaces from "./place/PopularPlaces";
// CSS
import "../../styles/Main.css"; // 기존 스타일 재사용
import PlaceImage from './place/PlaceImage';
import Places from './place/Places';

import MapIcon from '@mui/icons-material/Map';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function MapMain() {
  const navigate = useNavigate();

  // 동반지도 페이지 이동
  const handleNavigationToMap = () => {
    console.log("Navigating to Place Map");
    navigate("/placeMap");
  };

  // 내 즐겨찾기 페이지 이동
  const handleNavigationToFavorite = () => {
    console.log("Navigating to Favorites");
    navigate("/placeFavorite");
  };

  // 장소 상세보기 테스트 페이지 이동
  const handleNavigationToPlace = () => {
    console.log("Navigating to Place Info");
    navigate("/placeInfo");
  };

  // 검색 버튼 클릭 시 처리
  const handleSearch = () => {
    console.log("Navigating to Place Search via Search Button");
    navigate("/placeSearch");
  }

  // 입력 필드 클릭 시 검색 페이지로 이동
  const handleInputClick = () => {
    console.log("Navigating to Place Search via Input Click");
    navigate("/placeSearch");
  }

  return (
    <div className="places-map-page">
      {/* 콘텐츠를 네비게이션 아래로 배치 */}
      <div className="content-wrapper">
        {/* 검색 바 */}
        <SearchBar
          placeholder="오늘은 어디를 갈까?"
          onSearch={handleSearch}
          onInputClick={handleInputClick}
        />
        <br />
        <br />

        {/* 지도 옵션 */}
        <div className="map-options">
          <div
            className="option-box"
            onClick={handleNavigationToMap}
            style={{ cursor: "pointer" }}
          >
            <strong><MapIcon/></strong>
            <h3>동반지도</h3>
          </div>
          <div
            className="option-box"
            onClick={handleNavigationToFavorite}
            style={{ cursor: "pointer" }}
          >
            <strong><FavoriteBorderIcon/></strong>
            <h3>내 즐겨찾기</h3>
          </div>
          
        </div>
{/* 인기 Top10 장소 */}
<PopularPlaces />

      </div>
    </div>
  );
}

export default MapMain;
