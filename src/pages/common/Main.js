import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "../../styles/Main.css";

// Import Components
import PopularPlacesTop3 from "./../map/place/PopularPlacesTop3";
import MainImage from "./MainImage";
import ViewHotTopicsCard from "../../components/community/topic/ViewHotTopicsCard";
import ViewTopicsCard from "../../components/community/topic/ViewTopicsCard";

function AdBanner({ onAdEnd }) {
  return (
    <div
      className="ad-banner"
      style={{
        position: "fixed", // 화면 전체 덮기
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)", // 어두운 배경 (선택 사항)
        zIndex: 9999, // 네비게이션 바 위로 올리기
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <video
        width="80%"
        height="auto"
        autoPlay
        muted
        loop={false}
        onEnded={onAdEnd}
      >
        <source src="/assets/main/Loading-main.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}


function Main() {
  const navigate = useNavigate();
  const [imageIndex, setImageIndex] = useState(0);
  const [showAd, setShowAd] = useState(() => {
    // 광고를 이미 봤는지 localStorage 확인
    return localStorage.getItem("adWatched") !== "true";
  });
  const handleNavigation = (path) => {
    console.log(`Navigating to ${path}`);
    navigate(path);
  };

  const images = [
    "/assets/common/cat1.png", // 첫 번째 이미지
    "/assets/common/cat2.png", // 두 번째 이미지
  ];

  // 광고가 끝났을 때 처리
  const handleAdEnd = () => {
    setShowAd(false); // 광고 숨기기
    localStorage.setItem("adWatched", "true"); // 광고 본 상태를 localStorage에 저장
  };

  

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 500);

    // 컴포넌트가 unmount 될 때 interval을 클리어
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="main-page">
      {showAd ? (
        <AdBanner onAdEnd={handleAdEnd} />
      ) : (
        <>
          <br />
          <MainImage />

          {/* 아이콘 네비게이션 */}
          <nav className="main-icon-navigation">
            <div className="icon-sections">
              {/* 아이콘 1: 커뮤니티 */}
              <NavLink
                to="/community"
                className={({ isActive }) =>
                  isActive ? "nav-icon-item active" : "nav-icon-item"
                }
              >
                <img
                  src="/assets/mainIcon/commu-ion.png"
                  alt="커뮤니티"
                  style={{ width: "70px", height: "70px" }}
                />
                <div className="icon-label">커뮤니티</div>
              </NavLink>

              {/* 아이콘 2: 동반지도 */}
              <NavLink
                to="/placeMap"
                className={({ isActive }) =>
                  isActive ? "nav-icon-item active" : "nav-icon-item"
                }
              >
                <img
                  src="/assets/mainIcon/placeMap-icon.png"
                  alt="동반지도"
                  style={{ width: "70px", height: "70px" }}
                />
                <div className="icon-label">동반지도</div>
              </NavLink>

              {/* 아이콘 3: 쇼핑몰 */}
              <NavLink
                to="/shop/products"
                className={({ isActive }) =>
                  isActive ? "nav-icon-item active" : "nav-icon-item"
                }
              >
                <img
                  src="/assets/mainIcon/shop-icon.png"
                  alt="쇼핑몰"
                  style={{ width: "70px", height: "70px" }}
                />
                <div className="icon-label">쇼핑몰</div>
              </NavLink>

              {/* 아이콘 4: 포인트샵 */}
              <NavLink
                to="/pointshop-page"
                className={({ isActive }) =>
                  isActive ? "nav-icon-item active" : "nav-icon-item"
                }
              >
                <img
                  src="/assets/mainIcon/pointshop-icon.png"
                  alt="포인트샵"
                  style={{ width: "70px", height: "70px" }}
                />
                <div className="icon-label">포인트샵</div>
              </NavLink>

              {/* 아이콘 5: 가계부 */}
              <NavLink
                to="/cashbook"
                className={({ isActive }) =>
                  isActive ? "nav-icon-item active" : "nav-icon-item"
                }
              >
                <img
                  src="/assets/mainIcon/cash-icon.png"
                  alt="가계부"
                  style={{ width: "70px", height: "70px" }}
                />
                <div className="icon-label">가계부</div>
              </NavLink>

              {/* 아이콘 6: 퀴즈 */}
              <NavLink
                to="/pointQuiz"
                className={({ isActive }) =>
                  isActive ? "nav-icon-item active" : "nav-icon-item"
                }
              >
                <img
                  src="/assets/mainIcon/quiz-icon.png"
                  alt="퀴즈"
                  style={{ width: "70px", height: "70px" }}
                />
                <div className="icon-label">퀴즈</div>
              </NavLink>

              {/* 아이콘 7: 지도검색 */}
              <NavLink
                to="/placeSearch"
                className={({ isActive }) =>
                  isActive ? "nav-icon-item active" : "nav-icon-item"
                }
              >
                <img
                  src="/assets/mainIcon/placeMap-search-icon.png"
                  alt="장소검색"
                  style={{ width: "70px", height: "70px" }}
                />
                <div className="icon-label">장소검색</div>
              </NavLink>

              {/* 아이콘 : 주문내역 */}
              <NavLink
                to="/my/orders"
                className={({ isActive }) =>
                  isActive ? "nav-icon-item active" : "nav-icon-item"
                }
              >
                <img
                  src="/assets/mainIcon/shop-oder-icon.png"
                  alt="주문내역"
                  style={{ width: "70px", height: "70px" }}
                />
                <div className="icon-label">주문내역</div>
              </NavLink>
            </div>
          </nav>

          {/* 이미지 슬라이드 */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <img src={images[imageIndex]} alt="슬라이드 이미지" />
          </div>

          {/* 섹션들 */}
          <div className="sections">

            <br/>
            <PopularPlacesTop3 />
            <br/>

            <br/>
            <ViewTopicsCard category='hot' title="금주의 인기 게시글" />
            <br/>

            {/* <h2 style= {{textAlign: "left"}}>포인트 상점</h2> */}
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

            <br/>
            {/* <h2 style= {{textAlign: "left"}}>가계부</h2> */}
            <div
              className="section"
              onClick={() => handleNavigation("/cashbook")}
              style={{cursor:"pointer"}}
              >
              <h2>가계부</h2>
              <p>이번 달 막내한테 얼마나 썼을까? 클릭해서 확인하기!</p>
            </div>
            <br/>

            <br/>
            {/* <h2 style= {{textAlign: "left"}}>쇼핑몰</h2> */}
            <div 
              className="section"
              onClick={() => handleNavigation("/shop/products")}
              style={{ cursor: "pointer"}}>
              <h2>쇼핑몰</h2>
              <p>오늘의 할인상품은? 클릭해서 확인하기!</p>
            </div>
            <br/>
              
          </div>
        </>
      )}
    </div>
  );
}

export default Main;
