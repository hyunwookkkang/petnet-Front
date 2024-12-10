import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Components
import SearchBar from "../../components/place/searchBar/SearchBar";
// CSS
import "../../styles/Main.css"; // 기존 스타일 재사용
import PlaceImage from './place/PlaceImage';
import Places from './place/Places';

function MapMain() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState(""); // 검색어 상태

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
  const handleSearch = (value) =>{
    if(!value || !value.trim()){
      alert("검색어를 입력하세요");
      return;
    }
    console.log(`검색 버튼 클릭: ${value.trim()}`);
    // 검색 결과 페이지로 이동
    navigate(`/placeSearch?query=${value.trim()}`);
  }

  return (
    <div className="places-map-page">
      {/* 콘텐츠를 네비게이션 아래로 배치 */}
      <div className="content-wrapper">
        {/* 검색 바 */}
        <SearchBar
          placeholder="오늘은 어디를 갈까?"
          onSearch={(value) => handleSearch(value)}
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
            동반지도
          </div>
          <div
            className="option-box"
            onClick={handleNavigationToFavorite}
            style={{ cursor: "pointer" }}
          >
            내 즐겨찾기
          </div>
        </div>

        {/* 장소 목록 테스트 */}
        {/* <div className="map-options">
          <div
            className="option-box"
            onClick={handleNavigationToPlace}
            style={{ cursor: "pointer" }}
          >
            장소상세보기테스트
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default MapMain;
