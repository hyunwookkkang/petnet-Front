import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom"; // React Router의 useNavigate 가져오기
import { CiLogin } from "react-icons/ci"; // 로그인 아이콘
import { CiLogout } from "react-icons/ci"; //로그아웃 아이콘
import { SlActionUndo } from "react-icons/sl"; // 뒤로가기 아이콘
import "../../../styles/Navigation.css"; // 네비게이션 CSS
import axios from "axios";
import { useUser } from "../../contexts/UserContext";

function TopNavigation() {
  const {userId} = useUser();
  const navigate = useNavigate();
  const [isHidden, setIsHidden] = useState(false); // 숨김 상태 관리
  const [lastScrollY, setLastScrollY] = useState(0); // 마지막 스크롤 위치
  const topNavRef = useRef(null); // 네비게이션 높이를 참조하기 위한 Ref

  // 뒤로가기
  const handleGoBack = () => {
    navigate(-1);
  };

  // 메인 페이지로 이동
  const handleNavigateToMain = () => {
    navigate("/");
  };

  // 로그인
  const handleNavigationToLogin = (path) => {
    navigate(path);
  };

  // 로그아웃
  const handleLogout = async () =>{
    try {
      await axios.post("/api/users/logout", {}, { withCredentials: true });
      alert("로그아웃되었습니다.");
      navigate("/"); // 로그아웃 후 메인페이지로이동
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      alert("로그아웃에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 스크롤 이벤트 처리
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHidden(true); // 스크롤 내릴 때 숨김
      } else {
        setIsHidden(false); // 스크롤 올릴 때 표시
      }
      setLastScrollY(currentScrollY); // 현재 스크롤 위치 업데이트
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // 상단 여백 동적 설정
  useEffect(() => {
    const topNavHeight = topNavRef.current?.offsetHeight || 60; // 네비게이션 높이 계산
    document.documentElement.style.setProperty(
      "--top-navigation-height",
      `${topNavHeight}px`
    );
  }, []);

  return (
    <>
      <header
        className={`top-navigation ${isHidden ? "hidden" : ""}`}
        ref={topNavRef}
      >
        {/* 뒤로가기 버튼 */}
        <button className="nav-back-btn" onClick={handleGoBack}>
          <SlActionUndo />
        </button>

        {/* 펫 넷 로고 */}
        <h1 className="app-title" onClick={handleNavigateToMain}>
          펫 넷
        </h1>
        {userId ? (
          <div
              className="notification-icon"
              onClick={handleLogout}
            >
              <CiLogout size={24} />
          </div>
          ):(
          <div
            className="notification-icon"
            onClick={() => handleNavigationToLogin("/login")}
          >
          <CiLogin size={26} />
        </div>
        )}


      </header>

      {/* 메인 콘텐츠 */}
      <div className="content-wrapper">
        {/* 콘텐츠 내용 */}
      </div>
    </>
  );
}

export default TopNavigation;
