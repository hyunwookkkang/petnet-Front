import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../../styles/Main.css";
import dogCatImage from './파비콘이 될 놈.png';

function Main() {
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);

  const handleNavigation = (path) => {
    console.log(`Navigating to ${path}`);
    navigate(path);
  };

  const images = [
      '/assets/common/cat1.png', // 첫 번째 이미지
      '/assets/common/cat2.png'  // 두 번째 이미지
    ];
  
    useEffect(() => {
      const interval = setInterval(() => {
        setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 500);
  
      // 컴포넌트가 unmount 될 때 interval을 클리어
      return () => clearInterval(interval);
    }, []);


  return (
    <div className="places-map-page">
      
      {/* 콘텐츠를 네비게이션 아래로 배치 */}
      <div className="content-wrapper"></div>

      <img src={dogCatImage} alt="귀여워" className="section-image"/>
      <div style={{
        display: 'flex',            // Flexbox를 사용하여 중앙 정렬
        justifyContent: 'center',   // 수평 중앙 정렬
        alignItems: 'center',       // 수직 중앙 정렬
        textAlign: 'center'         // 텍스트 중앙 정렬
      }}>
        <img src={images[imageIndex]} alt="Image" /> 
      </div>

      <div className="sections">
        <div
          className="section"
          onClick={() => handleNavigation("/pointshop-page")} // 장소지도로 네비게이션
          style={{ cursor: "pointer" }}
        >
          <h2>포인트 상점</h2>
          <p>포인트 상점</p>
        </div>

        <div
          className="section"
          onClick={() => handleNavigation("/cashbook")}
          style={{cursor:"pointer"}}
          >
          <h2>가계부</h2>
          <p>이번 달 막내한테 얼마나 썼을까? 클릭해서 확인하기!</p>
        </div>

        <div 
          className="section"
          onClick={() => handleNavigation("/shop/products")}
          style={{ cursor: "pointer"}}>
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
