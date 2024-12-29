import React, { useState } from "react";
import HeaderCashbook from "../../components/cashbook/HeaderCashbook";
import CashbookControl from "./CashbookControl"; // CashbookControl 컴포넌트 import
import GetExpensesLog from "./GetExpensesLog";
import AddExpenseLog from "../../pages/cashbook/AddExpenseLog";
import "../../styles/cashbook/CashbookMain.css";

const CashbookMain = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  return (
    <div className="cashbookMain-main-container">
      {/* 헤더나 추가적인 레이아웃 요소를 여기에 추가 */}
      <HeaderCashbook
        currentYear={year}
        currentMonth={month}
        setYear={setYear}
        setMonth={setMonth}
      />
      <GetExpensesLog year={year} month={month} />
      {/* CashbookControl 렌더링 */}
      <CashbookControl />
    </div>
  );
};

export default CashbookMain;
