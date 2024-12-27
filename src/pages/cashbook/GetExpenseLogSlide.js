import React, { useState, useEffect } from "react";
import "../../styles/cashbook/GetExpenseLog.css";

const GetExpenseLogSlide = ({
  isOpen,
  onClose,
  selectedExpense,
  onUpdate = () => {},
}) => {
  const [isSliding, setIsSliding] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setIsSliding(true);
    } else {
      setTimeout(() => setIsSliding(false), 800);
    }
  }, [isOpen]);

  return (
    <div className={`expense-log-slide ${isOpen ? "open" : ""}`}>
      <button onClick={onClose} className="expense-log-close-button">
        ×
      </button>

      <h2 className="expense-log-title">지출 상세 정보</h2>

      {selectedExpense ? (
        <div className="expense-log-details">
          {/* 날짜와 시간 */}
          <div className="cashbook-date-time-row">
            {/* 날짜 */}
            <div className="cashbook-field">
              <label>날짜</label>
              <input
                type="date"
                value={
                  selectedExpense.expenseDate
                    ? selectedExpense.expenseDate.split("T")[0]
                    : ""
                }
                disabled
              />
            </div>

            {/* 시간 */}
            <div className="cashbook-field">
              <label>시간</label>
              <input
                type="time"
                value={
                  selectedExpense.expenseDate
                    ? selectedExpense.expenseDate.split("T")[1].slice(0, 5)
                    : ""
                }
                disabled
              />
            </div>
          </div>

          {/* 금액 */}
          <div className="cashbook-field">
            <label>금액</label>
            <input type="number" value={selectedExpense.amount} disabled />
          </div>

          {/* 동물 카테고리 */}
          <div className="cashbook-field">
            <label>동물 카테고리</label>
            <input
              type="text"
              value={selectedExpense.animalCategory}
              disabled
            />
          </div>

          {/* 지출 카테고리 */}
          <div className="cashbook-field">
            <label>지출 카테고리</label>
            <input
              type="text"
              value={selectedExpense.expenseCategory}
              disabled
            />
          </div>

          {/* 결제 수단 */}
          <div className="cashbook-field">
            <label>결제 수단</label>
            <input type="text" value={selectedExpense.paymentOption} disabled />
          </div>

          {/* 메모 */}
          <div className="cashbook-field">
            <label>메모</label>
            <input type="text" value={selectedExpense.memo} disabled />
          </div>

          {/* 닫기 버튼 */}
          <div className="cashbook-actions">
            <button className="cashbook-close-btn" onClick={onClose}>
              닫기
            </button>
          </div>
        </div>
      ) : (
        <p className="expense-log-no-data">선택된 지출 내역이 없습니다.</p>
      )}
    </div>
  );
};

export default GetExpenseLogSlide;
