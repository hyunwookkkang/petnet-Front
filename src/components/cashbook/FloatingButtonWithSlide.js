import React, { useState } from "react";
import SlideDrawer from "./SlideDrawer";
import GetExpenseLog from "../../pages/cashbook/GetExpenseLog";
import ExpenseButtons from "./ExpenseButtons";
import GetLoadExpenseLog from "../../pages/cashbook/GetLoadExpenseLog";

// 플로팅 버튼과 슬라이드 관리 컴포넌트
const FloatingButtonWithSlide = ({ expenseId, onUpdate }) => {
  const [isSlideOpen, setIsSlideOpen] = useState(false); // 슬라이드 열림/닫힘 상태
  const [slideMode, setSlideMode] = useState("manual"); // 슬라이드 콘텐츠 모드 ('manual' or 'auto')

  // 슬라이드 열기/닫기 토글
  const toggleSlide = () => {
    setIsSlideOpen((prev) => !prev);
  };

  // 슬라이드 내부에서 보여줄 콘텐츠 결정
  const renderSlideContent = () => {
    console.log("Current Slide Mode:", slideMode);
    if (slideMode === "manual") {
      return <div>수동 모드용 콘텐츠(등록 폼 등)</div>;
    } else if (slideMode === "auto") {
      return (
        <GetLoadExpenseLog
          // 예: 여기서 지출 등록하면 onUpdate를 호출해 상위 state 갱신 가능
          onSelectPurchase={(purchase) => {
            onUpdate(purchase); // 등록 후 상위 컴포넌트 상태 갱신
          }}
        />
      );
    } else if (expenseId) {
      return <GetExpenseLog expenseId={expenseId} />;
    }
    return null;
  };

  return (
    <>
      {/* 슬라이드 토글 버튼 */}
      <button onClick={toggleSlide}>슬라이드 토글</button>

      {/* 슬라이드 오픈 상태일 때 SlideDrawer 렌더링 */}
      {isSlideOpen && (
        <SlideDrawer
          isOpen={isSlideOpen}
          onClose={toggleSlide}
          activeButton={slideMode} // slideMode를 activeButton으로 전달
          setActiveButton={setSlideMode} // setSlideMode를 setActiveButton으로 전달
        >
          {renderSlideContent()}
        </SlideDrawer>
      )}
    </>
  );
};

export default FloatingButtonWithSlide;
