import React, { useState } from "react";
import SlideDrawer from "../../components/cashbook/SlideDrawer";
import FloatingActionButton from "../../components/cashbook/FloatingActionButton";
import GetLoadExpenseLog from "../../pages/cashbook/GetLoadExpenseLog";

const CashbookControl = () => {
  const [activeScreen, setActiveScreen] = useState("manual");
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const toggleSlide = () => {
    setIsSlideOpen((prev) => !prev);
  };

  const handleSelectPurchase = (data) => {
    console.log("CashbookControl: handleSelectPurchase 호출", data);
    setSelectedData(data); // 선택된 데이터 저장
    setActiveScreen("manual"); // 수동 등록 화면으로 전환
    setIsSlideOpen(true); // 슬라이드 열기
  };

  return (
    <>
      {/* 수동 등록 버튼 */}
      <FloatingActionButton
        onClick={() => {
          console.log("플로팅 버튼 클릭!");
          setActiveScreen("manual"); // 기본 화면을 수동 등록으로 설정
          toggleSlide(); // 슬라이드 열기
        }}
      />

      {/* "펫넷 상점 지출내역" 버튼 클릭 시 GetLoadExpenseLog 표시 */}
      {/* 슬라이드 열기 */}
      <SlideDrawer
        isOpen={isSlideOpen} // SlideDrawer에 isSlideOpen 상태를 isOpen이라는 이름으로 전달
        onClose={() => setIsSlideOpen(false)} // SlideDrawer의 onClose 이벤트가 발생하면 isSlideOpen을 false로 설정
        activeScreen={activeScreen} // activeScreen 상태를 SlideDrawer에 전달
        setActiveScreen={setActiveScreen} // setActiveScreen 업데이트 함수를 SlideDrawer에 전달
        selectedData={selectedData} // selectedData 상태를 SlideDrawer에 전달
        onSelectPurchase={handleSelectPurchase} // handleSelectPurchase 함수를 SlideDrawer에 전달
      >
        {/* // handleSelectPurchase 함수를 GetLoadExpenseLog 컴포넌트에 onSelectPurchase라는 이름으로 전달 */}
        <GetLoadExpenseLog onSelectPurchase={handleSelectPurchase} />
      </SlideDrawer>
    </>
  );
};

export default CashbookControl;
