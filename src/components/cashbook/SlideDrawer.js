import React, { useState, useEffect } from "react";
import ExpenseButtons from "./ExpenseButtons";
import "../../styles/cashbook/SlideDrawer.css";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import GetLoadExpenseLog from "../../pages/cashbook/GetLoadExpenseLog";
import AnimalCategoryDropdown from "./AnimalCategoryDropdown";
import ExpenseCategoryDropdown from "./ExpenseCategoryDropdown";
import PaymentCategoryDropdown from "./PaymentCategoryDropdown";
import {
  showSuccessToast,
  showErrorToast,
} from "../../components/common/alert/CommonToast";

// SlideDrawer 컴포넌트
const SlideDrawer = ({
  isOpen,
  onClose,
  onAddExpense = () => {},
  activeButton,
  setActiveButton,
  purchaseData, // <-- App에서 전달받은 purchaseData
}) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [amount, setAmount] = useState("");
  const [animalCategory, setAnimalCategory] = useState("선택");
  const [expenseCategory, setExpenseCategory] = useState("선택");
  const [expenseContent, setExpenseContent] = useState("");
  const [paymentOption, setPaymentOption] = useState("선택");
  const [memo, setMemo] = useState("");

  const { userId } = useUser(); // 사용자 ID 가져오기
  const navigate = useNavigate();

  useEffect(() => {
    console.log(userId);
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login"); // 로그인 페이지로 리다이렉트
      return;
    }
  }, [userId, navigate]);

  // ★ [핵심] 클릭된 카드 데이터를 입력 폼에 자동으로 채우는 함수
  const handleSelectPurchase = (purchaseData) => {
    console.log("선택된 데이터:", purchaseData);

    //////////////////////////////////////////////////////////////////////////
    // purchaseData가 있을 때 입력 필드에 반영
    // 날짜 및 시간 파싱
    const dateObj = new Date(purchaseData.paidDate);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const parsedDate = `${year}-${month}-${day}`;

    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const parsedTime = `${hours}:${minutes}`;

    // 폼 데이터에 값 넣기
    setDate(parsedDate);
    setTime(parsedTime);
    setAmount(purchaseData.paymentAmount);
    setAnimalCategory(purchaseData.animalCategory || "선택");
    setExpenseCategory(purchaseData.productCategory || "선택");
    setExpenseContent(purchaseData.productName || "");
    setPaymentOption(purchaseData.paymentMethod || "선택");
  };
  //////////////////////////////////////////////////////////////////////////

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

  const handleSaveExpense = async () => {
    const data = {
      userId,
      amount,
      animalCategory,
      expenseCategory,
      expenseContent,
      paymentOption,
      expenseDate: `${date}T${time}:00`,
      memo,
    };

    if (
      !amount ||
      !animalCategory ||
      !expenseCategory ||
      !expenseContent ||
      !paymentOption ||
      !date
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    if (animalCategory === "" || expenseCategory === "") {
      alert("카테고리를 선택해주세요.");
      return;
    }

    try {
      const response = await fetch(`/api/cashbook/expense/addExpenseLog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const parsedData = await response.json(); // 바로 JSON 파싱
        console.log("응답 데이터:", parsedData);
        onAddExpense(parsedData.expense); // 새로 등록된 데이터 전달
        const newExpense = parsedData.expense;
        console.log("onAddExpense  호출 전:", newExpense);
        onAddExpense(newExpense); // 새로 등록된 하나의 expense 객체만 onAddExpense  넘긴다.
        console.log("onAddExpense  호출됨:", newExpense);
        showSuccessToast("지출등록되었습니다!");
      } else {
        console.error("지출 등록 실패, 응답 상태:", response.status);
        showErrorToast("지출등록에 실패했습니다.!");
      }
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
      showErrorToast("지출등록에 실패했습니다.");
    } finally {
      onClose();
    }
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
        overflowY: "auto", // 스크롤 추가
        borderTopLeftRadius: "20px", // 왼쪽 상단 둥글게
        borderBottomLeftRadius: "20px", // 왼쪽 하단 둥글게
        borderTopRightRadius: "0", // 오른쪽 상단 둥글지 않게
        borderBottomRightRadius: "0", // 오른쪽 하단 둥글지 않게
      }}
    >
      {/* 닫기 버튼 */}
      <button
        className=".cashbook-slide-drawer-add .close-button"
        onClick={onClose}
        style={{
          position: "absolute",
          top: "15px",
          right: "40px",
          fontSize: "1.4rem",
          color: "black",
          border: "none",
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          cursor: "pointer",
        }}
      >
        ×
      </button>
      {/* 폼 입력 필드들 */}
      {/* 지출 버튼들 */}
      <ExpenseButtons
        activeButton={activeButton}
        setActiveButton={setActiveButton}
      />

      {/* 카드 클릭 시 폼에 값 채우기 */}
      {activeButton === "auto" && (
        <GetLoadExpenseLog onSelectPurchase={handleSelectPurchase} />
      )}

      {activeButton === "manual" && (
        <>
          {/* 날짜와 시간 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              top: "40px",
              marginBottom: "10px",
              margin: "30px 0",
              width: "150px",
              gap: "60px",
            }}
          >
            <div>
              <label>날짜</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  display: "block",
                  width: "130px" /* 날짜 입력폼 너비 설정 */,
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  marginTop: "5px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label>시간</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                style={{
                  display: "block",
                  width: "150px" /* 시간 입력폼 너비 설정 */,
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  marginTop: "5px",
                  boxSizing: "border-box",
                }}
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
            <AnimalCategoryDropdown onSelect={setAnimalCategory} />
          </div>
          {/* 지출 카테고리 */}
          <div style={{ marginBottom: "25px" }}>
            <ExpenseCategoryDropdown onSelect={setExpenseCategory} />
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
            <PaymentCategoryDropdown onSelect={setPaymentOption} />
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
            onClick={handleSaveExpense}
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
        </>
      )}
    </div>
  );
};

// 입력 스타일 공통화
const inputStyle = {
  display: "block",
  width: "100%",
  maxWidth: "400px", // 최대 너비를 400px로 제한 (원하는 값으로 설정 가능)
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  marginTop: "5px",
  boxSizing: "border-box", // 패딩과 테두리를 너비에 포함
};

// 플로팅 버튼 컴포넌트
// - 페이지에서 항상 고정된 위치에 표시되는 둥근 버튼
const FloatingActionButton = ({ onClick }) => (
  <button
    className="cashbook-floating-action-button"
    onClick={onClick} // 버튼 클릭 시 onClick 함수가 실행되도록 설정
    style={{
      position: "fixed", // 화면에서 고정 위치에 배치 (스크롤을 따라 움직이지 않음)
      bottom: "100px", // 화면 하단에서 200px 위쪽에 배치
      left: "20px", // 화면 우측에서 20px 떨어지게 배치
      width: "60px", // 버튼 너비를 60px로 설정
      height: "60px", // 버튼 높이를 60px로 설정
      borderRadius: "50%", // 버튼을 원형으로 만들기 위해 50%로 설정
      backgroundColor: "#FF6347  ", // 버튼 배경색을 주황색으로 설정
      color: "#fff", // 버튼의 텍스트 색을 흰색으로 설정
      fontSize: "30px", // 버튼의 텍스트 크기를 30px로 설정
      border: "none", // 버튼의 기본 테두리를 제거
      cursor: "pointer", // 버튼에 마우스를 올리면 포인터로 변경 (클릭 가능함을 표시)
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // 버튼에 그림자 효과 추가 (살짝 떠 있는 느낌)
      zIndex: 9999, // 다른 요소 위에 위치하도록 설정
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
  const [slideMode, setSlideMode] = useState("manual");
  const toggleSlide = () => setIsSlideOpen((prev) => !prev);

  return (
    <>
      {/* 플로팅 버튼 */}
      {/* FloatingActionButton 컴포넌트를 렌더링하고, 클릭 시 toggleSlide 함수를 실행 */}
      <FloatingActionButton onClick={toggleSlide} />

      {/* 슬라이드 컴포넌트 */}
      {/* SlideDrawer 컴포넌트를 렌더링하고, 슬라이드 열기/닫기 상태와 닫기 함수 전달 */}
      <SlideDrawer
        isOpen={isSlideOpen}
        onClose={toggleSlide}
        activeButton={slideMode}
        setActiveButton={setSlideMode}
      />
      {/* 펫넷 상점 로딩 SlideDrawer */}
    </>
  );
};

export default App;
