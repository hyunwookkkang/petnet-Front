import React, { useEffect, useState } from "react";
import "../../styles/cashbook/GetLoadExpenseLog.css";
import { useUser } from "../../components/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { fetchPurchaseLogs } from "./GetLoadExpenseLogAPI"; // API 함수 가져오기

const GetLoadExpenseLog = ({ onSelectPurchase }) => {
  const [purchaseLogs, setPurchaseLogs] = useState([]);
  const { userId } = useUser(""); // 사용자 ID 가져오기
  const navigate = useNavigate();

  // userId 유효성 확인 및 리다이렉트
  useEffect(() => {
    console.log("현재 userId:", userId);
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    }
  }, [userId, navigate]);

  // 데이터 가져오기
  useEffect(() => {
    if (userId) {
      console.log("fetchPurchaseLogs 호출");
      fetchPurchaseLogs(setPurchaseLogs, userId); // 데이터 가져오기
    }
  }, [userId]);

  return (
    <div className="cashbook-get-load-expense-log">
      <h3 className="cashbook-title">펫넷 상점 주문 내역</h3>
      <ul className="cashbook-purchase-list">
        {purchaseLogs.length === 0 ? (
          <p className="cashbook-empty-message">주문 내역이 없습니다.</p>
        ) : (
          purchaseLogs.map((log, index) => (
            <li
              key={index}
              onClick={() => {
                if (onSelectPurchase) {
                  console.log("onSelectPurchase 호출됨:", log);
                  onSelectPurchase(log); // 부모의 handleOpenSlideWithData 호출
                } else {
                  console.error("onSelectPurchase가 정의되지 않았습니다.");
                }
              }}
              className="cashbook-purchase-item"
            >
              {/* 지출 내용 */}
              <div className="cashbook-content">
                <strong>지출 내용:</strong> {log.expenseContent || "미입력"}
              </div>

              {/* 날짜 */}
              <div className="cashbook-date">
                <strong>날짜:</strong>{" "}
                {log.expenseDate
                  ? new Date(log.expenseDate).toLocaleDateString()
                  : "미입력"}
              </div>

              {/* 시간 */}
              <div className="cashbook-time">
                <strong>시간:</strong>{" "}
                {log.expenseDate
                  ? new Date(log.expenseDate).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit", // 초 단위까지 추가
                    })
                  : "미입력"}
              </div>

              {/* 금액 */}
              <div className="cashbook-amount">
                <strong>금액:</strong> {log.amount ? `${log.amount}원` : "0원"}
              </div>

              {/* 동물 카테고리 */}
              <div className="cashbook-animal-category">
                <strong>동물 카테고리:</strong> {log.animalCategory || "미입력"}
              </div>

              {/* 지출 카테고리 */}
              <div className="cashbook-expense-category">
                <strong>지출 카테고리:</strong>{" "}
                {log.expenseCategory || "미입력"}
              </div>

              {/* 결제 수단 */}
              <div className="cashbook-payment-option">
                <strong>결제 수단:</strong> {log.paymentOption || "미입력"}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default GetLoadExpenseLog;
