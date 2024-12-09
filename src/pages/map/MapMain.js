//react
import React from "react";
import { useNavigate } from 'react-router-dom';
//components
import SearchBar from "../../components/common/searchBar/SearchBar";
//css
import "../../styles/Main.css"; // 기존 스타일 재사용


function MapMain() {

  const navigate = useNavigate();

  const handleNavigationToMap = () => {
    console.log(`Navigating`);
    navigate("/placeMap");
  };

  const handleNavigationToPlace =()=>{
    console.log('Place Info');
    navigate("/placeInfo");

  }
  const handleNavigationToFavorite =()=>{
    console.log('Place Info');
    navigate("/placeFavorite");

  }

  // handleSearch 함수 -> 검색 API를 호출 | 사용자 입력값 처리 
  // searchValue.trim()을 사용하여 공백만 입력된 경우를 처리
  const handleSearch = () => {
    console.log("검색 버튼 클릭!"); // 검색 로직 추가 가능
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
        <div className="map-options">
          <div className="option-box" onClick={handleNavigationToMap} style={{ cursor: "pointer" }}>
            동반지도
          </div>
          <div className="option-box" onClick={handleNavigationToFavorite} style={{ cursor: "pointer" }}>
            내 즐겨찾기</div>
        </div>

        {/* 안됭 ---> 장소목록테스트 */}
        <div className="map-options">
          <div className="option-box" onClick={handleNavigationToPlace} style={{cursor: "pointer"}}>장소상세보기테스트</div>
        </div>



        {/* 커뮤니티 박스
        <div className="community-box">
          <p>고민이 될 때? 다른 주인님들의 페이보릿 확인하기</p>
        </div> */}
      </div>
    </div>
  );
}

export default MapMain;

//fnfffkff