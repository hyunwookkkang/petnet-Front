import React, { useState } from "react";
import "./ExpenseButtons.css";
import { Link } from "react-router-dom";

const ExpenseButtons = () => {
  const [activeButton, setActiveButton] = useState("manual"); // manual or auto

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
        <Link to="/AddExpenseAuto">펫넷 상점 지출내역</Link>
      </button>
    </div>
  );
};

export default ExpenseButtons;
