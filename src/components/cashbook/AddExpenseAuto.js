import React, { useEffect, useState } from "react";

const AddExpenseLog = ({ selectedPurchase }) => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [amount, setAmount] = useState("");
  const [animalCategory, setAnimalCategory] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [expenseContent, setExpenseContent] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [memo, setMemo] = useState("");

  // 전달받은 데이터로 필드를 자동 채움
  useEffect(() => {
    if (selectedPurchase) {
      const [purchaseDate, purchaseTime] =
        selectedPurchase.expenseDate.split("T");
      setDate(purchaseDate);
      setTime(purchaseTime.slice(0, 5)); // HH:MM 형식
      setAmount(selectedPurchase.amount);
      setAnimalCategory(selectedPurchase.animalCategory);
      setExpenseCategory(selectedPurchase.expenseCategory);
      setExpenseContent(selectedPurchase.expenseContent);
      setPaymentOption(selectedPurchase.paymentOption);
    }
  }, [selectedPurchase]);

  return (
    <div style={{ padding: "20px" }}>
      <h3>지출 등록</h3>
      <div>
        <label>날짜</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div>
        <label>시간</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </div>
      <div>
        <label>금액</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <div>
        <label>동물 카테고리</label>
        <input
          type="text"
          value={animalCategory}
          onChange={(e) => setAnimalCategory(e.target.value)}
        />
      </div>
      <div>
        <label>지출 카테고리</label>
        <input
          type="text"
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
        />
      </div>
      <div>
        <label>지출 내용</label>
        <input
          type="text"
          value={expenseContent}
          onChange={(e) => setExpenseContent(e.target.value)}
        />
      </div>
      <div>
        <label>결제 수단</label>
        <input
          type="text"
          value={paymentOption}
          onChange={(e) => setPaymentOption(e.target.value)}
        />
      </div>
      <div>
        <label>메모</label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />
      </div>
    </div>
  );
};

export default AddExpenseLog;
