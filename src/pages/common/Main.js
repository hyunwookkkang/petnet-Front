import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "../../styles/Main.css";

//Icons
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';  // 커뮤니티
import MapIcon from '@mui/icons-material/Map';  // 동반지도
import LocalMallIcon from '@mui/icons-material/LocalMall';  // 쇼핑몰
import StorefrontIcon from '@mui/icons-material/Storefront';  // 포인트샵
import SavingsIcon from '@mui/icons-material/Savings';  // 가계부
import QuizIcon from '@mui/icons-material/Quiz';  // 퀴즈
import SearchIcon from '@mui/icons-material/Search';  //지도찾기
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';  //주문내역

//Import-Component
import PopularPlacesTop3 from './../map/place/PopularPlacesTop3';
import MainImage from "./MainImage";


function Main() {
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);

  const handleNavigation = (path) => {
    console.log(`Navigating to ${path}`);
    navigate(path);
  };

  const images = [
    '/assets/common/santa-cat1.png', // 첫 번째 이미지
    '/assets/common/santa-cat2.png'  // 두 번째 이미지
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 500);

    // 컴포넌트가 unmount 될 때 interval을 클리어
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-page">
      <br/>
      <MainImage />
      
      {/* 콘텐츠를 네비게이션 아래로 배치 
      <div className="content-wrapper"></div>*/}

      {/* 네비게이션 바 (필요 시 주석 해제) */}
      {/* <Navigation /> */}

      {/* 아이콘 네비게이션 */}
      <nav className="main-icon-navigation">
        <div className="icon-sections">
          {/* 아이콘 1: 커뮤니티 */}
          <NavLink
            to="/community"
            className={({ isActive }) => (isActive ? "nav-icon-item active" : "nav-icon-item")}
          >
            <LocalLibraryIcon style={{ fontSize: "40px", color: "#feb98e" }} />
            <div className="icon-label">커뮤니티</div>
          </NavLink>

          {/* 아이콘 2: 동반지도 */}
          <NavLink
            to="/placeMap"
            className={({ isActive }) => (isActive ? "nav-icon-item active" : "nav-icon-item")}
          >
            <MapIcon style={{ fontSize: "40px", color: "#feb98e" }} />
            <div className="icon-label">동반지도</div>
          </NavLink>

          {/* 아이콘 3: 쇼핑몰 */}
          <NavLink
            to="/shop/products"
            className={({ isActive }) => (isActive ? "nav-icon-item active" : "nav-icon-item")}
          >
            <LocalMallIcon style={{ fontSize: "40px", color: "#feb98e" }} />
            <div className="icon-label">쇼핑몰</div>
          </NavLink>

          {/* 아이콘 4: 포인트샵 */}
          <NavLink
            to="/pointshop-page"
            className={({ isActive }) => (isActive ? "nav-icon-item active" : "nav-icon-item")}
          >
            <StorefrontIcon style={{ fontSize: "40px", color: "#feb98e" }} />
            <div className="icon-label">포인트샵</div>
          </NavLink>

          {/* 아이콘 5: 가계부 */}
          <NavLink
            to="/cashbook"
            className={({ isActive }) => (isActive ? "nav-icon-item active" : "nav-icon-item")}
          >
            <SavingsIcon style={{ fontSize: "40px", color: "#feb98e" }} />
            <div className="icon-label">가계부</div>
          </NavLink>

          {/* 아이콘 6: 퀴즈 */}
          <NavLink
            to="/pointQuiz"
            className={({ isActive }) => (isActive ? "nav-icon-item active" : "nav-icon-item")}
          >
            <QuizIcon style={{ fontSize: "40px", color: "#feb98e" }} />
            <div className="icon-label">퀴즈</div>
          </NavLink>

          {/* 아이콘 7: 지도검색 */}
          <NavLink
            to="/placeSearch"
            className={({ isActive }) => (isActive ? "nav-icon-item active" : "nav-icon-item")}
          >
            <SearchIcon style={{ fontSize: "40px", color: "#feb98e" }} />
            <div className="icon-label">장소검색</div>
          </NavLink>

          {/* 아이콘 : 주문내역  */}
          <NavLink
            to="/my/orders"
            className={({ isActive }) => (isActive ? "nav-icon-item active" : "nav-icon-item")}
          >
            <ShoppingBasketOutlinedIcon style={{ fontSize: "40px", color: "#feb98e" }} />
            <div className="icon-label">주문내역</div>
          </NavLink>
        </div>
      </nav>

      {/* 이미지 슬라이드 */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        marginTop: '20px'
      }}>
        <img src={images[imageIndex]} alt="슬라이드 이미지" /> 
      </div>

      {/* 섹션들 */}
      <div className="sections">
      <h2 style= {{textAlign: "left"}}>포인트 상점</h2>
        <div
          className="section"
          onClick={() => handleNavigation("/pointshop-page")}
          style={{ cursor: "pointer" }}
        >
          <h2>포인트 상점</h2>
          <p>
            포인트로 행복을 쇼핑하세요!<br />
            포인트 확인부터 기프티콘 구매까지, 손쉽게 원하는 것을 찾아보세요.
          </p>
          
        </div>

        <br/>
        <h2 style= {{textAlign: "left"}}>가계부</h2>
        <div
          className="section"
          onClick={() => handleNavigation("/cashbook")}
          style={{cursor:"pointer"}}
          >
          <h2>가계부</h2>
          <p>이번 달 막내한테 얼마나 썼을까? 클릭해서 확인하기!</p>
        </div>

        <br/>
        <h2 style= {{textAlign: "left"}}>쇼핑몰</h2>
        <div 
          className="section"
          onClick={() => handleNavigation("/shop/products")}
          style={{ cursor: "pointer"}}>
          <h2>쇼핑몰</h2>
          <p>오늘의 할인상품은? 클릭해서 확인하기!</p>
        </div>

        <br/>
        <h2 style= {{textAlign: "left"}}>커뮤니티</h2>
        <div 
          className="section"
          onClick={() => handleNavigation("/community")}
          style={{ cursor: "pointer" }}
        >
          <h2>커뮤니티</h2>
          <p>이거 뭐가 좋아요? 궁금할 땐 모두와 함께 이야기해봐요!</p>
        </div>

        <br/>
        <h2 style= {{textAlign: "left"}}>장소지도</h2>
        <PopularPlacesTop3/>
        {/*<div
          className="section"
          onClick={() => handleNavigation("/map-main")}
          style={{ cursor: "pointer" }}
        >
          {/* <p>막내와 함께 떠나자! 주변에는 펫넷지도!</p>
          
        </div>
        <div
          className="section"
          onClick={() => handleNavigation("/component-main")}
          style={{ cursor: "pointer" }}
        >
          <h2>컴포넌트모음</h2>
        </div> */}
      </div>
    </div>
  );
}

export default Main;
