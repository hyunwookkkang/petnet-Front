//react
import React from "react";
import { useNavigate } from "react-router-dom";
// Components
import SearchBar from "../../components/place/searchBar/SearchBar";
import PopularPlaces from "./place/PopularPlaces";
// Icons
import MapIcon from '@mui/icons-material/Map';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
// Context and Modals
import { useUser } from "../../components/contexts/UserContext";
import LoginModal from "../../components/common/modal/LoginModal";

function MapMain() {

  const navigate = useNavigate();
  const { userId } = useUser();
  const [showAlert, setShowAlert] = React.useState(false);

  // 동반지도 페이지 이동
  const handleNavigationToMap = () => {
    navigate("/placeMap");
  };

  // 내 즐겨찾기 페이지 이동
  const handleNavigationToFavorite = () => {
    if (!userId) {
      setShowAlert(true);
    } else {
      navigate("/placeFavorite");
    }
  };

  // handleSearch 함수 -> 검색 API를 호출 | 사용자 입력값 처리 
  // searchValue.trim()을 사용하여 공백만 입력된 경우를 처리
  const handleSearch = () => {
    navigate("/placeSearch");
  };

  // 입력 필드 클릭 시 검색 페이지로 이동
  const handleInputClick = () => {
    navigate("/placeSearch");
  };

  return (
    
    <div className="places-map-page">

      
      {/* 콘텐츠를 네비게이션 아래로 배치 */}
      <div className="content-wrapper">
        {/* 검색 바 */}
        {/* <div className="search-bar">
          <input type="text" placeholder="오늘은 어디를 갈까?" />
          <button>🔍</button>
        </div> */}
        <SearchBar placeholder="오늘은 어디를 갈까?" onSearch={handleSearch} />

        <br/><br/>

        {/* 지도 옵션 */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            margin: "20px 0",
          }}
        >
          {/* 동반지도 옵션 */}
          <div
            onClick={handleNavigationToMap}
            style={{
              backgroundColor: "#feb98e",
              padding: "20px",
              borderRadius: "15px",
              textAlign: "center",
              width: "40%",
              color: "white",
              cursor: "pointer",
              border: "1px solid #ddd",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
            aria-label="동반지도 이동"
          >
              <img
                  src="/assets/map/map-main-page.png"  // 이미지 경로 지정
                  alt="Map Icon"  // 이미지 설명
                  style={{
                    width: "4rem",  // 이미지 크기 조정
                    height: "auto",  // 비율에 맞게 높이 자동 조정
                  }}
                />
            <br/>
            <h3
              style={{
                fontSize: "1.25rem",
                color: "white",
                margin: 0,
              }}
            >
              
              동반지도
            </h3>
          </div>

          {/* 내 즐겨찾기 옵션 */}
          <div
            onClick={handleNavigationToFavorite}
            style={{
              backgroundColor: "#feb98e",
              padding: "20px",
              borderRadius: "15px",
              textAlign: "center",
              width: "40%",
              color: "white",
              cursor: "pointer",
              border: "1px solid #ddd",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
            aria-label="내 즐겨찾기 이동"
          >
            <img
                  src="/assets/map/map-favorite-main-page.png"  // 이미지 경로 지정
                  alt="Favorite Icon"  // 이미지 설명
                  style={{
                    width: "4rem",  // 이미지 크기 조정
                    height: "auto",  // 비율에 맞게 높이 자동 조정
                  }}
                />
                <br/>
            <h3
              style={{
                fontSize: "1.25rem",
                color: "white",
                margin: 0,
              }}
            >
              내 즐겨찾기
            </h3>
          </div>

          {/* 로그인 모달 */}
          <LoginModal showModal={showAlert} setShowModal={setShowAlert} />
        </div>

        {/* 인기 Top10 장소 */}
        <PopularPlaces />
      </div>
    </div>
  );
}

export default MapMain;
