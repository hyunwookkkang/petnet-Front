import React, { useState, useEffect } from "react";
import { useUser } from "../../components/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import "../../styles/cashbook/SearchExpenses.css";

const SearchExpenses = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [animalCategory, setAnimalCategory] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [results, setResults] = useState([]); // 검색 결과
  const [totalExpense, setTotalExpense] = useState(0); // 총 지출 금액
  const [searching, setSearching] = useState(false); // 검색 진행 상태

  const { userId } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    }
  }, [userId, navigate]);

  const formatDateToStartOfDay = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.toISOString();
  };

  const formatDateToEndOfDay = (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d.toISOString();
  };

  const handleSearch = async () => {
    setSearching(true); // 검색 시작
    try {
      const response = await fetch("/api/cashbook/expense/searchExpensesLog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          startDate: startDate ? formatDateToStartOfDay(startDate) : null,
          endDate: endDate ? formatDateToEndOfDay(endDate) : null,
          animalCategory,
          expenseCategory,
          paymentOption,
        }),
      });

      if (!response.ok) throw new Error("서버 응답이 올바르지 않습니다.");

      const data = await response.json();
      setResults(data.expenses || []);
      setTotalExpense(data.totalExpense || 0);
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
    } finally {
      setSearching(false); // 검색 종료
    }
  };

  return (
    <div className="cashbook-search-expenses-container">
      {/* 날짜 선택 */}
      <div className="cashbook-date-picker-sections">
        <div className="cashbook-date-picker">
          <label>시작 날짜</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="cashbook-date-picker">
          <label>종료 날짜</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* 드롭다운 필터 */}
      <div className="cashbook-filter-section">
        <select
          value={animalCategory}
          onChange={(e) => setAnimalCategory(e.target.value)}
        >
          <option value="">동물 카테고리</option>
          <option value="강아지">강아지</option>
          <option value="고양이">고양이</option>
        </select>

        <select
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
        >
          <option value="">지출 카테고리</option>
          <option value="사료">사료</option>
          <option value="간식">간식</option>
          <option value="병원비">병원비</option>
          <option value="기타">기타</option>
        </select>

        <select
          value={paymentOption}
          onChange={(e) => setPaymentOption(e.target.value)}
        >
          <option value="">결제 수단</option>
          <option value="카드결제">카드결제</option>
          <option value="간편결제">간편결제</option>
          <option value="현금">현금</option>
        </select>
      </div>

      {/* 검색 버튼 */}
      <button
        className="cashbook-searches-button"
        onClick={handleSearch}
        style={{
          padding: "15px 30px",
          backgroundColor: "#ff6b6b",
          color: "white",
          border: "none",
          borderRadius: "20px",
          fontSize: "17px",
          cursor: "pointer",
          boxSizing: "border-box",
          marginTop: "20px",
          marginLeft: "auto", // 버튼을 왼쪽에서부터 자동으로 배치
          marginRight: "auto", // 버튼을 오른쪽에서부터 자동으로 배치
          display: "block", // 버튼을 블록 레벨로 설정
          width: "300px !important", // 버튼의 너비를 300px로 고정
          height: "60px", // 버튼의 높이를 60px로 고정
        }}
      >
        검색
      </button>

      {/* 검색 진행 상태 */}
      {searching ? (
        <div className="cashbook-search-status">검색 중...</div>
      ) : (
        <>
          {/* 결과 표시 */}
          {results.length > 0 && (
            <div className="cashbook-search-total-expense">
              총 지출 금액: {totalExpense.toLocaleString()} 원
            </div>
          )}

          <div className="cashbook-results-section">
            {results.length > 0 ? (
              results.map((expense) => (
                <div key={expense.expenseId} className="cashbook-expense-card">
                  <div className="cashbook-expense-left">
                    <div className="cashbook-expense-date">
                      <strong>
                        {new Date(expense.expenseDate).toLocaleDateString(
                          "ko-KR",
                          {
                            month: "2-digit",
                            day: "2-digit",
                            weekday: "short", // 요일 추가
                          }
                        )}
                      </strong>
                      <span>
                        {new Date(expense.expenseDate).toLocaleTimeString(
                          "ko-KR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false, // 24시간 형식
                          }
                        )}
                      </span>
                    </div>
                    <div className="cashbook-expense-category">
                      {expense.expenseCategory}
                    </div>
                  </div>

                  <div className="cashbook-expense-center">
                    {expense.expenseContent}
                  </div>

                  <div className="cashbook-expense-right">
                    <span className="cashbook-expense-amount">
                      ₩ {expense.amount.toLocaleString()}
                    </span>
                    <div className="cashbook-expense-payment">
                      {expense.paymentOption}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>검색된 결과가 없습니다.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchExpenses;
