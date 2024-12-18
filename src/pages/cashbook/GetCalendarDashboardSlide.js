import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // 아이콘 사용을 위한 import
import {
  faBowlFood,
  faBone,
  faPaw,
  faBath,
  faScissors,
  faHospital,
  faHeart,
  faDog,
} from "@fortawesome/free-solid-svg-icons"; // 필요한 아이콘들 import
import {
  faCreditCard,
  faMobileAlt,
  faCashRegister,
} from "@fortawesome/free-solid-svg-icons"; // 필요한 아이콘들 추가
import "../../styles/cashbook/GetCalendarDashboardSlide.css";
import SlideDrawers from "../../components/cashbook/SlideDrawers"; // 슬라이드 컴포넌트 import

// 아이콘을 매핑하기 위한 객체
const categoryIcons = {
  사료: <FontAwesomeIcon icon={faBowlFood} />,
  간식: <FontAwesomeIcon icon={faBone} />,
  장난감: <FontAwesomeIcon icon={faPaw} />,
  산책용품: <FontAwesomeIcon icon={faDog} />,
  의류: <FontAwesomeIcon icon={faPaw} />,
  미용용품: <FontAwesomeIcon icon={faBath} />,
  병원비: <FontAwesomeIcon icon={faHospital} />,
  미용비: <FontAwesomeIcon icon={faScissors} />,
  기타: <FontAwesomeIcon icon={faHeart} />,
};

const paymentIcons = {
  카드결제: <FontAwesomeIcon icon={faCreditCard} />, // 카드 결제 아이콘 예시
  간편결제: <FontAwesomeIcon icon={faMobileAlt} />, // 간편 결제 아이콘 예시
  현금: <FontAwesomeIcon icon={faCashRegister} />, // 현금 아이콘 예시
};

function GetCalendarDashboardSlide({ selectedDate, expenses, onClose }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);

  const handleExpenseClick = (expenseId) => {
    setSelectedExpenseId(expenseId); // 클릭한 지출 ID 저장
    setIsDrawerOpen(true); // 슬라이드 열기
  };

  return (
    <div className="cashbook-Calendar-slide-drawer">
      {/* 슬라이드 상세보기 컴포넌트 */}
      <SlideDrawers
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        expenseId={selectedExpenseId}
        onUpdate={() => console.log("슬라이드 업데이트")}
      />
      <div className="cashbook-Calendar-slide-header">
        <button className="cashbook-Calendar-close-btn" onClick={onClose}>
          ×
        </button>
        <h2 className="cashbook-CalendarDetail-title-box">
          {selectedDate} (지출 내역)
        </h2>
        <h1 className="cashbook-CalendarDetail-small-box">
          일일 지출 합계:{" "}
          {expenses
            .reduce((sum, item) => sum + item.amount, 0)
            .toLocaleString()}{" "}
          원
        </h1>
      </div>
      <div className="cashbook-Calendar-slide-content">
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <div
              key={expense.expenseId}
              className="cashbook-Calendar-expense-item"
              onClick={() => handleExpenseClick(expense.expenseId)} // 클릭 시 상세보기
            >
              <p className="cashbook-Calendar-category">
                {categoryIcons[expense.expenseCategory]} 지출카테고리:{" "}
                {expense.expenseCategory}
              </p>
              <p className="cashbook-Calendar-content">
                지출내용: {expense.expenseContent}
              </p>
              <p className="cashbook-Calendar-amount">
                금액: {expense.amount.toLocaleString()} 원
              </p>
              <p className="cashbook-Calendar-payment">
                {paymentIcons[expense.paymentOption]} 결제수단:{" "}
                {expense.paymentOption}
              </p>
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
