import React, { useState, useEffect } from "react";
import ExpenseButtons from "./ExpenseButtons"; // 버튼 컴포넌트
import GetLoadExpenseLog from "../../pages/cashbook/GetLoadExpenseLog"; // 자동 등록 컴포넌트
import "../../styles/cashbook/SlideDrawer.css";
import AddExpenseLog from "../../pages/cashbook/AddExpenseLog"; // AddExpenseLog 컴포넌트 import

const SlideDrawer = ({
  activeScreen, // activeScreen으로 변경
  setActiveScreen, // setActiveScreen 전달
  isOpen,
  onClose,
  selectedData, // 선택된 지출 내역을 받아오는 prop
  onAddExpense,
  onSelectPurchase, // 이 함수는 GetLoadExpenseLog에만 전달

  // handleSelectPurchase 전달
}) => {
  // 슬라이드 열기/닫기 효과를 위한 상태
  const [isSliding, setIsSliding] = useState(isOpen);

  useEffect(() => {
    // 슬라이드 열림/닫힘 상태 관리
    if (isOpen) {
      setIsSliding(true); // 슬라이드가 열릴 때
    } else {
      setTimeout(() => setIsSliding(false), 800); // 슬라이드 닫힐 때 딜레이를 두고 상태 변경
    }
  }, [isOpen]);

  useEffect(() => {
    console.log("selectedData 업데이트됨:", selectedData);
  }, [selectedData]); // selectedData 값이 바뀔 때마다 확인

  return (
    <div className={`slide-drawer ${isOpen ? "open" : ""}`}>
      {/* 닫기 버튼 */}
      <button onClick={onClose} className="cashbook-close-button">
        ×
      </button>

      {/* 지출 등록 방식 (자동/수동) 버튼 */}
      <ExpenseButtons
        activeScreen={activeScreen}
        setActiveScreen={(screen) => {
          console.log("ExpenseButtons: activeScreen 변경 전:", activeScreen);
          setActiveScreen(screen);
          console.log("ExpenseButtons: activeScreen 변경 후:", screen);
        }}
      />
      {/* 자동 등록 화면 */}
      {/* 자동 등록 화면 */}
      {activeScreen === "auto" && (
        <GetLoadExpenseLog onSelectPurchase={onSelectPurchase} /> // onSelectPurchase 함수를 GetLoadExpenseLog에 전달
      )}

      {/* 수동 등록 화면 */}
      {activeScreen === "manual" && (
        // activeScreen 값이 "manual"일 경우에만 실행
        <AddExpenseLog
          isOpen={isOpen}
          onClose={onClose} // onClose 이벤트를 AddExpenseLog에 전달
          onAddExpense={onAddExpense} // onAddExpense 함수를 AddExpenseLog에 전달
          selectedData={selectedData} // 선택된 데이터를 AddExpenseLog에 전달
          activeScreen={activeScreen} // 화면 상태를 AddExpenseLog에 전달
          setActiveScreen={setActiveScreen} // 화면 상태 업데이트 함수를 AddExpenseLog에 전달
        />
      )}
    </div>
  );
};

export default SlideDrawer;

//AddExpenseLog 컴포넌트는 이제 **SlideDrawer.js**에 포함되어 자동 등록과 수동 등록 화면을 다룰 수 있다.
//AddExpenseLog 컴포넌트는 isOpen, onClose, onAddExpense, selectedData 등의 props를 전달받고, 상태를 관리하면서 지출을 등록할 수 있다.
//**SlideDrawer.js**에서는 activeButton 상태에 따라 AddExpenseLog (수동 등록 화면) 또는 GetLoadExpenseLog (자동 등록 화면)을 표시한다.
//AddExpenseLog는 isOpen, onClose, onAddExpense, selectedData 등의 props를 통해 슬라이드의 열림 상태 및 지출 등록 데이터를 처리할 수 있습니다.
//selectedData는 이미 선택된 데이터를 자동 등록에서 가져오는 값으로, 수동 등록에서도 해당 데이터를 불러와서 사용할 수 있게 됩니다.
//이렇게 하면 **SlideDrawer.js**에서 **AddExpenseLog**를 불러와서, 수동 등록 화면에 지출 등록 폼을 표시할 수 있습니다.
