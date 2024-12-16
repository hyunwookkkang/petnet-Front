import React from "react";
import "../../styles/cashbook/GetCalendarDashboardSlide.css"; // 스타일 정의

function GetCalendarDashboardSlide({ selectedDate, expenses, onClose }) {
  console.log("슬라이드 컴포넌트 렌더링됨");
  console.log("전달받은 날짜:", selectedDate);
  console.log("전달받은 데이터:", expenses);
  return (
    <div className="slide-drawer">
      <div className="slide-header">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2>{selectedDate} (지출 내역)</h2>
        <p>
          일일 지출 합계:{" "}
          {expenses
            .reduce((sum, item) => sum + item.amount, 0)
            .toLocaleString()}{" "}
          원
        </p>
      </div>
      <div className="slide-content">
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <div key={expense.expenseId} className="expense-item">
              <p className="category">카테고리: {expense.expenseCategory}</p>
              <p className="content">내용: {expense.expenseContent}</p>
              <p className="amount">
                금액: {expense.amount.toLocaleString()} 원
              </p>
              <p className="payment">결제수단: {expense.paymentOption}</p>
            </div>
          ))
        ) : (
          <p>지출 내역이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default GetCalendarDashboardSlide;
