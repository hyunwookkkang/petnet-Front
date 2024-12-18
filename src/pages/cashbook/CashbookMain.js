import React, { useState } from "react";
import HeaderCashbook from "../../components/cashbook/HeaderCashbook";
import GetExpensesLog from "./GetExpensesLog";
import SlideDrawer from "../../components/cashbook/SlideDrawer";

const CashbookMain = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  return (
    <div>
      <HeaderCashbook
        currentYear={year}
        currentMonth={month}
        setYear={setYear}
        setMonth={setMonth}
      />
      <GetExpensesLog year={year} month={month} />
      {/* 공통 플로팅 버튼과 슬라이드 */}
    </div>
  );
};

export default CashbookMain;

//FloatingButtonWithSlide :플로팅 버튼과 슬라이드를 하나로 묶은 컴포넌트, CashbookMain 페이지에 추가되어 지출 등록 기능을 제공
//HeaderCashbook: 연도와 월 선택가능
//GetExpensesLog: 해당 월의 지출목록을 표시
//FloatingButtonWithSlide : 지출 등록을 위한 버튼 및 슬라이드.
