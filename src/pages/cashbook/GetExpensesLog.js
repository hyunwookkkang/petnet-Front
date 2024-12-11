import React, { useState, useEffect } from "react";
import "./GetExpensesLog.css";
import SlideDrawers from "../../components/cashbook/SlideDrawers"; // SlideDrawers 컴포넌트

const GetExpensesLog = ({ year, month }) => {
  const [expenses, setExpenses] = useState([]); // 지출 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [monthlyTotal, setMonthlyTotal] = useState(0); // 월간 총액
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // 슬라이드 열림/닫힘 상태
  const [selectedExpense, setSelectedExpense] = useState(null); // 선택된 지출 상세 데이터
  const [selectedExpenseId, setSelectedExpenseId] = useState(null); // 선택된 지출 상세 데이터

  // 지출 목록 및 총액 데이터 가져오기
  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/cashbook/expense/getExpensesLog?userId=user05&year=${year}&month=${month}&page=0&pageSize=10`
      );
      const data = await response.json();
      setExpenses(data.expenses || []);

      const totalResponse = await fetch(
        `/api/cashbook/expense/user05/${year}/${month}/getMonthlyTotalExpense`
      );
      const totalData = await totalResponse.json();
      setMonthlyTotal(totalData);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(); // 데이터 가져오기
  }, [year, month]);

  // 지출 항목 클릭 시 상세 데이터 가져오기 및 슬라이드 열기
  const handleExpenseClick = async (expenseId) => {
    console.log("Clicked expenseId:", expenseId); // 클릭된 ID 확인
    try {
      const response = await fetch(
        `/api/cashbook/expense/getExpenseLog/${expenseId}`
      );
      const data = await response.json();
      console.log("Fetched expense data:", data); // 가져온 데이터 확인
      setSelectedExpense(data); // 상세 데이터 저장
      setSelectedExpenseId(expenseId); // 선택된 ID 저장
      setIsDrawerOpen(true); // 슬라이드 열기
    } catch (error) {
      console.error("상세 데이터 로드 실패:", error);
    }
  };
  const handleSlideClose = () => {
    setIsDrawerOpen(false); // 슬라이드 닫기
    setSelectedExpense(null); // 선택된 데이터 초기화
  };

  const formatAmount = (amount) => `${amount.toLocaleString()} 원`;

  return (
    <div>
      <div className="monthly-total">
        <h2>
          월간 지출 총액:{" "}
          <span style={{ color: "purple" }}>{formatAmount(monthlyTotal)}</span>
        </h2>
      </div>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <div className="expense-list">
          {expenses.length === 0 ? (
            <p className="empty-message">데이터가 없습니다.</p>
          ) : (
            expenses.map((expense) => (
              <div
                className="expense-card"
                key={expense.expenseId}
                onClick={() => handleExpenseClick(expense.expenseId)}
              >
                <div className="expense-date">
                  <strong>
                    {new Date(expense.expenseDate).toLocaleDateString()}
                  </strong>
                  <span>
                    {new Date(expense.expenseDate).toLocaleTimeString()}
                  </span>
                </div>
                <div className="expense-details">
                  <span className="expense-category">
                    {expense.expenseCategory}
                  </span>
                  <span className="expense-payment">
                    {expense.paymentOption}
                  </span>
                </div>
                <div
                  className="expense-amount"
                  style={{ color: expense.amount >= 0 ? "red" : "blue" }}
                >
                  {formatAmount(expense.amount)}
                </div>
                <div className="expense-content">{expense.expenseContent}</div>
              </div>
            ))
          )}
        </div>
      )}
      {/* SlideDrawer: 상세 조회 */}
      {isDrawerOpen && (
        <SlideDrawers
          isOpen={isDrawerOpen} // 슬라이드 열림 상태 전달
          onClose={() => setIsDrawerOpen(false)} // 닫기 함수 전달
          expenseId={selectedExpenseId} // 선택된 ID 전달
          expense={selectedExpense} // 선택된 상세 데이터 전달
          onUpdate={fetchExpenses} // 데이터 갱신 함수 전달
        />
      )}
    </div>
  );
};

export default GetExpensesLog;
