import React, { useState } from "react";
import SlideDrawer from "./SlideDrawer";
import AddExpenseAuto from "./AddExpenseAuto";
import GetExpenseLog from "../../pages/cashbook/GetExpenseLog";

// 플로팅 버튼과 슬라이드 관리 컴포넌트
const FloatingButtonWithSlide = ({ expenseId }) => {
  const [isSlideOpen, setIsSlideOpen] = useState(false); // 슬라이드 열림/닫힘 상태
  const [slideMode, setSlideMode] = useState("manual"); // 슬라이드 콘텐츠 모드 ('manual' or 'auto')

  // 슬라이드 열기/닫기 토글
  const toggleSlide = () => {
    setIsSlideOpen((prev) => !prev);
  };

  // 슬라이드 내부에서 보여줄 콘텐츠 결정
  const renderSlideContent = () => {
    if (slideMode === "manual") {
      return <SlideDrawer isOpen={isSlideOpen} onClose={toggleSlide} />;
    } else if (slideMode === "auto") {
      return <AddExpenseAuto />;
    } else if (expenseId) {
      return <GetExpenseLog expenseId={expenseId} />;
    }
    return null;
  };

  return (
    <>
      {/* 상단 버튼 (지출 및 펫넷상점 지출내역) */}
      <div style={{ display: "flex", gap: "10px", margin: "10px" }}>
        <button
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: slideMode === "manual" ? "#ffecec" : "#f9f9f9",
            color: slideMode === "manual" ? "#ff5b5b" : "#333",
          }}
          onClick={() => setSlideMode("manual")} // '지출' 버튼 클릭
        >
          지출
        </button>
        <button
          style={{
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: slideMode === "auto" ? "#ffecec" : "#f9f9f9",
            color: slideMode === "auto" ? "#ff5b5b" : "#333",
          }}
          onClick={() => setSlideMode("auto")} // '펫넷상점 지출내역' 버튼 클릭
        >
          펫넷 상점 지출내역
        </button>
      </div>

      {/* 플로팅 버튼 */}
      <button
        onClick={toggleSlide}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          padding: "15px",
          borderRadius: "50%",
          backgroundColor: "#ff6b6b",
          color: "#fff",
          fontSize: "20px",
          border: "none",
          cursor: "pointer",
        }}
      >
        +
      </button>

      {/* 슬라이드 컴포넌트 */}
      {isSlideOpen && (
        <SlideDrawer isOpen={isSlideOpen} onClose={toggleSlide}>
          {renderSlideContent()} {/* 상태에 따라 슬라이드 내용 변경 */}
        </SlideDrawer>
      )}
    </>
  );
};

export default FloatingButtonWithSlide;
