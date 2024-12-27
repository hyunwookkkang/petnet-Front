import React, { useState, useEffect } from "react";
import ExpenseButtons from "./ExpenseButtons";

// SlideDrawer 컴포넌트
const SlideDrawer = ({ isOpen, onClose }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const resetFields = () => {
    setAmount("");
    setAnimalCategory("선택");
    setExpenseCategory("선택");
    setExpenseContent("");
    setPaymentOption("선택");
    setMemo("");
  };

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0]; // 'YYYY-MM-DD' 형식
      const currentTime = now.toTimeString().split(" ")[0].slice(0, 5); // 'HH:MM' 형식

      setDate(currentDate);
      setTime(currentTime);
      resetFields(); // 나머지 필드 초기화
    }
  }, [isOpen]);
  const [userId, setUserId] = useState("user01"); // 현재 로그인된 사용자 ID (테스트용)
  const [amount, setAmount] = useState("");
  const [animalCategory, setAnimalCategory] = useState("선택");
  const [expenseCategory, setExpenseCategory] = useState("선택");
  const [expenseContent, setExpenseContent] = useState("");
  const [paymentOption, setPaymentOption] = useState("선택");
  const [memo, setMemo] = useState("");

  // 저장 버튼 클릭 시 데이터 처리
  const handleSave = async () => {
    console.log("현재 상태 값들:", {
      amount,
      animalCategory,
      expenseCategory,
      expenseContent,
      paymentOption,
    });
    // 유효성 검사 추가 (필수 항목)
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

    if (animalCategory === "" || expenseCategory === "") {
      alert("카테고리를 선택해주세요.");
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

    // API 호출을 위해 fetch 사용
    try {
      const response = await fetch(
        `http://localhost:8000/api/cashbook/expense/addExpenseLog`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        console.log("지출 등록 성공");
        alert("지출이 성공적으로 등록되었습니다!");
      } else {
        console.error("지출 등록 실패", response);
        alert("지출 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
      alert("API 요청 중 오류가 발생했습니다.");
    }

    onClose(); // 저장 후 슬라이드 닫기
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: isOpen ? 0 : "-100%", // 슬라이드 열리고 닫히는 효과
        width: "400px",
        height: "100%",
        backgroundColor: "#fff",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        zIndex: 1300,
        transition: "right 0.3s ease-in-out", // 슬라이드 애니메이션
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

      {/* 폼 입력 필드들 */}
      <ExpenseButtons style={{ margin: "20px 0" }} />

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

      {/* 금액 */}
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

      {/* 동물 카테고리 */}
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

      {/* 지출 카테고리 */}
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

      {/* 지출 내용 */}
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

      {/* 결제 수단 */}
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

      {/* 메모 */}
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

// 입력 스타일 공통화
const inputStyle = {
  display: "block",
  width: "100%",
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  marginTop: "5px",
};

// 플로팅 버튼 컴포넌트
// - 페이지에서 항상 고정된 위치에 표시되는 둥근 버튼
const FloatingActionButton = ({ onClick }) => (
  <button
    onClick={onClick} // 버튼 클릭 시 onClick 함수가 실행되도록 설정
    style={{
      position: "fixed", // 화면에서 고정 위치에 배치 (스크롤을 따라 움직이지 않음)
      bottom: "200px", // 화면 하단에서 200px 위쪽에 배치
      left: "20px", // 화면 우측에서 20px 떨어지게 배치
      width: "60px", // 버튼 너비를 60px로 설정
      height: "60px", // 버튼 높이를 60px로 설정
      borderRadius: "50%", // 버튼을 원형으로 만들기 위해 50%로 설정
      backgroundColor: "rgb(35, 22, 216)", // 버튼 배경색을 주황색으로 설정
      color: "#fff", // 버튼의 텍스트 색을 흰색으로 설정
      fontSize: "30px", // 버튼의 텍스트 크기를 30px로 설정
      border: "none", // 버튼의 기본 테두리를 제거
      cursor: "pointer", // 버튼에 마우스를 올리면 포인터로 변경 (클릭 가능함을 표시)
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // 버튼에 그림자 효과 추가 (살짝 떠 있는 느낌)
    }}
  >
    + {/* 버튼 안에 "+" 아이콘을 표시 */}
  </button>
);

// 전체 앱 컴포넌트
// - 슬라이드가 열리고 닫히는 상태를 관리하는 컴포넌트
const App = () => {
  const [isSlideOpen, setIsSlideOpen] = useState(false); // 슬라이드의 열림/닫힘 상태를 관리하는 state

  // 슬라이드 열기/닫기 토글 함수
  // - 슬라이드의 상태가 true이면 닫고, false이면 열리도록 상태를 변경
  const toggleSlide = () => setIsSlideOpen((prev) => !prev);

  return (
    <>
      {/* 플로팅 버튼 */}
      {/* FloatingActionButton 컴포넌트를 렌더링하고, 클릭 시 toggleSlide 함수를 실행 */}
      <FloatingActionButton onClick={toggleSlide} />

      {/* 슬라이드 컴포넌트 */}
      {/* SlideDrawer 컴포넌트를 렌더링하고, 슬라이드 열기/닫기 상태와 닫기 함수 전달 */}
      <SlideDrawer isOpen={isSlideOpen} onClose={toggleSlide} />
    </>
  );
};

export default App;
