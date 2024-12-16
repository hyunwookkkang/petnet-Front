import React from "react";
import "../../styles/cashbook/ExpenseButtons.css";
import { useUser } from "../../components/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import GetLoadExpenseLog from "../../pages/cashbook/GetLoadExpenseLog";

// activeButton, setActiveButton를 props로 받아오는 형태
const ExpenseButtons = ({ activeButton, setActiveButton }) => {
  const { userId } = useUser("");

  return (
    <div className="expense-buttons">
      <button
        className={`expense-btn ${activeButton === "manual" ? "active" : ""}`}
        onClick={() => {
          console.log("지출 버튼 클릭됨!");
          setActiveButton("manual");
        }}
      >
        지출
      </button>
      <button
        className={`expense-btn ${activeButton === "auto" ? "active" : ""}`}
        onClick={() => {
          console.log("펫넷 상점 지출내역 버튼 클릭됨!");
          setActiveButton("auto");
        }}
      >
        펫넷 상점 지출내역
      </button>
    </div>
  );
};

export default ExpenseButtons;
