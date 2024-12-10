import React, { useState, useEffect } from "react";
import ExpenseButtons from "./ExpenseButtons";

// AddExpenseAuto 컴포넌트
const AddExpenseAuto = ({ isOpen, onClose }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [amount, setAmount] = useState("");
  const [animalCategory, setAnimalCategory] = useState("선택");
  const [expenseCategory, setExpenseCategory] = useState("선택");
  const [expenseContent, setExpenseContent] = useState("");
  const [paymentOption, setPaymentOption] = useState("선택");
  const [memo, setMemo] = useState("");

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식
      const currentTime = now.toTimeString().split(" ")[0].slice(0, 5); // 'HH:MM' 형식

      setDate(currentDate);
      setTime(currentTime);
      resetFields();
    }
  }, [isOpen]);

  // 입력 필드 초기화 함수
  const resetFields = () => {
    setAmount("");
    setAnimalCategory("선택");
    setExpenseCategory("선택");
    setExpenseContent("");
    setPaymentOption("선택");
    setMemo("");
  };

  // 거래내역 불러오기 버튼 클릭 이벤트
  const handleFetchTransactions = () => {
    alert("거래내역 불러오기 버튼이 클릭되었습니다!");
    // 이후 거래내역을 가져오는 API 연동 구현 가능
  };

  // 저장 버튼 클릭 시 데이터 처리
  const handleSave = async () => {
    if (
      !amount ||
      !animalCategory ||
      !expenseCategory ||
      !expenseContent ||
      !paymentOption
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    const data = {
      date,
      time,
      amount,
      animalCategory,
      expenseCategory,
      expenseContent,
      paymentOption,
      memo,
    };

    try {
      const response = await fetch(
        `http://localhost:8000/api/cashbook/expense/addAutoExpenseLog`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        alert("지출이 성공적으로 등록되었습니다!");
      } else {
        alert("지출 등록에 실패했습니다.");
      }
    } catch (error) {
      alert("API 요청 중 오류가 발생했습니다.");
    }

    onClose(); // 저장 후 슬라이드 닫기
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: isOpen ? 0 : "-100%",
        width: "400px",
        height: "100%",
        backgroundColor: "#fff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        zIndex: 1300,
        transition: "right 0.3s ease-in-out",
      }}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "20px",
          left: "350px",
          backgroundColor: "transparent",
          border: "none",
          fontSize: "24px",
          cursor: "pointer",
        }}
      >
        ×
      </button>

      <ExpenseButtons style={{ margin: "20px 0" }} />

      {/* 상단 버튼 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "20px",
        }}
      >
        <button
          style={{
            backgroundColor: "#ffecec",
            border: "1px solid #ff5b5b",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
            color: "#ff5b5b",
            fontWeight: "bold",
          }}
        >
          지출
        </button>
        <button
          style={{
            backgroundColor: "#f9f9f9",
            border: "1px solid #ccc",
            padding: "10px 20px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          펫넷 상점 지출내역
        </button>
      </div>

      {/* 거래내역 불러오기 버튼 */}
      <button
        onClick={handleFetchTransactions}
        style={{
          display: "block",
          width: "100%",
          padding: "10px",
          marginBottom: "20px",
          backgroundColor: "#FF6F00",
          border: "none",
          borderRadius: "4px",
          color: "#fff",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        거래내역 불러오기
      </button>

      {/* 날짜와 시간 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          top: "40px",
          marginBottom: "10px",
          margin: "30px 0",
        }}
      >
        <div>
          <label>날짜</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
          />
        </div>
        <div>
          <label>시간</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      {/* 나머지 입력 필드 */}
      <div style={{ marginBottom: "25px" }}>
        <label>금액</label>
        <input
          type="number"
          placeholder="금액 입력"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "25px" }}>
        <label>동물 카테고리</label>
        <select
          value={animalCategory}
          onChange={(e) => setAnimalCategory(e.target.value)}
          style={inputStyle}
        >
          <option value="">카테고리를 선택하세요</option>
          <option value="개">개</option>
          <option value="고양이">고양이</option>
        </select>
      </div>

      <div style={{ marginBottom: "25px" }}>
        <label>지출 카테고리</label>
        <select
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
          style={inputStyle}
        >
          <option value="">카테고리를 선택하세요</option>
          <option value="사료">사료</option>
          <option value="간식">간식</option>
          <option value="장난감">장난감</option>
          <option value="산책용품">산책용품</option>
          <option value="의류">의류</option>
          <option value="미용용품">미용용품</option>
          <option value="위생용품">위생용품</option>
          <option value="병원비">병원비</option>
          <option value="미용비">미용비</option>
          <option value="기타">기타</option>
        </select>
      </div>

      <div style={{ marginBottom: "25px" }}>
        <label>지출 내용</label>
        <input
          type="text"
          placeholder="지출 내용을 입력하세요"
          value={expenseContent}
          onChange={(e) => setExpenseContent(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: "25px" }}>
        <label>결제 수단</label>
        <select
          value={paymentOption}
          onChange={(e) => setPaymentOption(e.target.value)}
          style={inputStyle}
        >
          <option value="">카테고리를 선택하세요</option>
          <option value="카드결제">카드결제</option>
          <option value="간편결제">간편결제</option>
          <option value="현금">현금</option>
        </select>
      </div>

      <div style={{ marginBottom: "25px" }}>
        <label>메모</label>
        <input
          type="text"
          placeholder="메모를 입력하세요"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          style={inputStyle}
        />
      </div>

      {/* 저장 버튼 */}
      <button
        onClick={handleSave}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#FF6F00",
          border: "none",
          borderRadius: "4px",
          color: "#fff",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        저장
      </button>
    </div>
  );
};

// 입력 필드 스타일 공통화
const inputStyle = {
  display: "block",
  width: "100%",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  marginTop: "5px",
}; //여기까지

export default AddExpenseAuto;
