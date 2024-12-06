import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Main.css";

function Main() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    console.log(`Navigating to ${path}`);
    navigate(path);
  };


  return (
    <div className="places-map-page">
      
      {/* 콘텐츠를 네비게이션 아래로 배치 */}
      <div className="content-wrapper"></div>

      <div className="sections">
        <div className="section">
          <h2>포인트 상점</h2>
          <p>포인트 상점</p>
        </div>

        <div className="section">
          <h2>가계부</h2>
          <p>이번 달 막내한테 얼마나 썼을까? 클릭해서 확인하기!</p>
        </div>

        <div className="section">
          <h2>쇼핑몰</h2>
          <p>오늘의 할인상품은? 클릭해서 확인하기!</p>
        </div>

        <div 
          className="section"
          onClick={() => handleNavigation("/community")} // 커뮤니티 네비게이션
          style={{ cursor: "pointer" }}
        >
          <h2>커뮤니티</h2>
          <p>이거 뭐가 좋아요? 궁금할 땐 모두와 함께 이야기해봐요!</p>
        </div>

        <div
          className="section"
          onClick={() => handleNavigation("/map-main")} // 장소지도로 네비게이션
          style={{ cursor: "pointer" }}
        >
          <h2>장소지도</h2>
          <p>막내와 함께 떠나자! 주변에는 펫넷지도!</p>
        </div>
        <div
          className="section"
          onClick={() => handleNavigation("/component-main")} // 장소지도로 네비게이션
          style={{ cursor: "pointer" }}
        >
          <h2>컴포넌트모음</h2>
        </div>
      </div>
    </div>

    
  );
}

export default Main;
