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

  const purchaseData = {
    paidDate: "2024-12-10T20:31:58",
    paymentAmount: 13500,
    animalCategory: "개",
    productCategory: "장난감",
    productName: "강아지 장난감",
    paymentMethod: "card",
    comment: "테스트 메모",
  };

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
                  onSelectPurchase(log);
                } else {
                  console.error("onSelectPurchase가 정의되지 않았습니다.");
                }
              }}
              className="cashbook-purchase-item"
            >
              <div className="cashbook-content">{log.expenseContent}</div>
              <div className="cashbook-date">
                날짜: {new Date(log.expenseDate).toLocaleString()}
              </div>
              <div className="cashbook-amount">
                금액: <span>{log.amount}원</span>
              </div>
              <div className="cashbook-payment-option">
                결제수단: {log.paymentOption}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default GetLoadExpenseLog;
