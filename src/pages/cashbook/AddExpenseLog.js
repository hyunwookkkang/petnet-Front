import React, { useState, useEffect } from "react";
import "../../styles/cashbook/SlideDrawer.css";
import { useUser } from "../../components/contexts/UserContext"; //UserContext에서 로그인한 사용자 정보를 가져오는 훅
import {
  showSuccessToast,
  showErrorToast,
} from "../../components/common/alert/CommonToast";
import AnimalCategoryDropdown from "../../components/cashbook/AnimalCategoryDropdown";
import ExpenseCategoryDropdown from "../../components/cashbook/ExpenseCategoryDropdown";
import PaymentCategoryDropdown from "../../components/cashbook/PaymentCategoryDropdown";

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

const AddExpenseLog = ({
  isOpen,
  onClose,
  onAddExpense = () => {},
  activeScreen,
  setActiveScreen,
  selectedData,
  onSelectPurchase, // 이미 전달받은 onSelectPurchase를 사용
}) => {
  // 상태 변수들: 지출 정보를 저장할 변수들
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [amount, setAmount] = useState("");
  const [animalCategory, setAnimalCategory] = useState("선택");
  const [expenseCategory, setExpenseCategory] = useState("선택");
  const [expenseContent, setExpenseContent] = useState("");
  const [paymentOption, setPaymentOption] = useState("선택");
  const [memo, setMemo] = useState("");
  const { userId } = useUser(); // 로그인된 사용자 정보를 가져오는 훅

  // selectedData가 변경될 때만 입력 필드를 업데이트
  useEffect(() => {
    if (selectedData) {
      console.log("useEffect: selectedData 업데이트 감지:", selectedData);
      const dateObj = new Date(selectedData.expenseDate || new Date()); // 유효한 expenseDate인지 확인

      setDate(dateObj.toISOString().split("T")[0]); // 날짜 설정
      setTime(dateObj.toTimeString().split(" ")[0]); // 시간 설정
      setAmount(selectedData.amount || ""); // 금액 설정
      setAnimalCategory(selectedData.animalCategory || "선택"); // 동물 카테고리 설정
      setExpenseCategory(selectedData.expenseCategory || "선택"); // 지출 카테고리 설정
      setExpenseContent(selectedData.expenseContent || ""); // 지출 내용 설정
      setPaymentOption(selectedData.paymentOption || "선택"); // 결제 수단 설정
    }
  }, [selectedData]);
  // ★ [핵심] 클릭된 카드 데이터를 입력 폼에 자동으로 채우는 함수

  const handleSelectPurchase = (purchaseData) => {
    console.log("handleSelectPurchase 호출됨: 선택된 데이터", purchaseData);

    const dateObj = new Date(purchaseData.expenseDate || new Date());
    setDate(dateObj.toISOString().split("T")[0]); // 날짜 설정
    setTime(dateObj.toTimeString().split(" ")[0]); // 시간 설정
    setAmount(purchaseData.amount || ""); // 금액 설정
    setAnimalCategory(purchaseData.animalCategory || "선택"); // 동물 카테고리 설정
    setExpenseCategory(purchaseData.expenseCategory || "선택"); // 지출 카테고리 설정
    setExpenseContent(purchaseData.expenseContent || ""); // 지출 내용 설정
    setPaymentOption(purchaseData.paymentOption || "선택"); // 결제 수단 설정
  };

  // 입력 필드를 초기화하는 함수
  const resetFields = () => {
    setAmount("");
    setAnimalCategory("선택");
    setExpenseCategory("선택");
    setExpenseContent("");
    setPaymentOption("선택");
    setMemo("");
  };

  // 슬라이드가 열릴 때마다 날짜와 시간을 현재 값으로 설정하고 필드 초기화
  useEffect(() => {
    if (!isOpen) {
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0]; // 'YYYY-MM-DD'
      const currentTime = now.toTimeString().split(" ")[0].slice(0, 8); // 'HH:MM:SS'
      setDate(currentDate);
      setTime(currentTime);
      resetFields(); // 나머지 필드 초기화
      console.log("슬라이드가 닫혔습니다. 데이터 초기화 완료");
    }
  }, [!isOpen]);

  const handleSaveExpense = async () => {
    const data = {
      userId,
      amount,
      animalCategory,
      expenseCategory,
      expenseContent,
      paymentOption,
      expenseDate: `${date}T${time}`, // 날짜와 시간을 결합하여 전송
      memo,
    };
    console.log("전송 데이터 확인:", data); // 전송 데이터 확인
    // 필수 항목들이 모두 입력되었는지 체크
    if (
      !amount ||
      !animalCategory ||
      !expenseCategory ||
      !expenseContent ||
      !paymentOption ||
      !date
    ) {
      showErrorToast("모든 필수 항목을 입력해주세요.");
      return;
    }

    // 데이터를 서버로 전송
    try {
      const response = await fetch(`/api/cashbook/expense/addExpenseLog`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const parsedData = await response.json();
        console.log("응답 데이터:", parsedData);
        onAddExpense(parsedData.expense); // 부모 컴포넌트로 새로 등록된 데이터 전달
        console.log("onAddExpense 호출 완료");
        showSuccessToast("지출등록되었습니다!");
      } else {
        console.error("지출 등록 실패, 응답 상태:", response.status);
        showErrorToast("지출등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
      showErrorToast("지출등록에 실패했습니다.");
    } finally {
      onClose(); // 슬라이드 닫기
    }
  };

  return (
    <div className="cashbook-drawer-content">
      {/* 닫기 버튼은 SlideDrawer에 있음 */}
      {/* 수동 등록 */}
      {activeScreen === "manual" && (
        <>
          {/* 날짜와 시간 */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              top: "20px",
              marginBottom: "10px",
              margin: "20px 0",
              width: "120px",
              gap: "90px",
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
                  width: "120%", // 너비를 50%로 설정하여 두 입력폼의 너비를 더 넓게 설정
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",

                  boxSizing: "border-box", // 패딩과 테두리를 너비에 포함
                  textAlign: "center", // 날짜 값을 가운데 정렬
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
                  width: "110%", // 너비를 50%로 설정하여 두 입력폼의 너비를 더 넓게 설정
                  padding: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",

                  boxSizing: "border-box", // 패딩과 테두리를 너비에 포함
                  textAlign: "center", // 날짜 값을 가운데 정렬
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
            <AnimalCategoryDropdown
              onSelect={(selectedValue) => setAnimalCategory(selectedValue)}
              selectedValue={animalCategory}
            />
          </div>

          {/* 지출 카테고리 */}
          <div style={{ marginBottom: "25px" }}>
            <ExpenseCategoryDropdown
              onSelect={(selectedValue) => setExpenseCategory(selectedValue)}
              selectedValue={expenseCategory}
            />
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
            <PaymentCategoryDropdown
              onSelect={(selectedValue) => setPaymentOption(selectedValue)}
              selectedValue={paymentOption}
            />
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

export default AddExpenseLog;
