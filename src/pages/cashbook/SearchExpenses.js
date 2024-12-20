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

  // useEffect(() => {
  //   if (!userId) {
  //     alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
  //     navigate("/login");
  //   }
  // }, [userId, navigate]);

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
      // 검색 결과 요청
      const searchResponse = await fetch(
        "/api/cashbook/expense/searchExpensesLog",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            startDate: startDate ? formatDateToStartOfDay(startDate) : null,
            endDate: endDate ? formatDateToEndOfDay(endDate) : null,
            animalCategory,
            expenseCategory,
            paymentOption,
          }),
        }
      );

      if (!searchResponse.ok)
        throw new Error("검색 결과를 불러오지 못했습니다.");

      const searchData = await searchResponse.json();
      setResults(searchData.expenses || []); // 검색 결과 업데이트

      // *** 검색 결과가 없을 때 총 지출 금액 초기화 ***
      if (searchData.expenses && searchData.expenses.length === 0) {
        setTotalExpense(0);
        return; // 결과가 없으므로 이후 총 금액 요청을 생략
      }

      // *** 총 지출 금액 요청 추가 ***
      const totalAmountResponse = await fetch(
        "/api/cashbook/expense/getTotalAmount",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            startDate: startDate ? formatDateToStartOfDay(startDate) : null,
            endDate: endDate ? formatDateToEndOfDay(endDate) : null,
            animalCategory,
            expenseCategory,
            paymentOption,
          }),
        }
      );

      if (!totalAmountResponse.ok)
        throw new Error("총 지출 금액을 불러오지 못했습니다.");

      const totalAmount = await totalAmountResponse.json();
      setTotalExpense(totalAmount); // 총 지출 금액 업데이트
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
      <button className="cashbook-searches-button" onClick={handleSearch}>
        검색
      </button>

      {/* 검색 진행 상태 */}
      {searching ? (
        <div className="cashbook-search-status">검색 중...</div>
      ) : (
        <>
          {/* 총 지출 금액 표시 */}
          <div className="cashbook-search-total-expense">
            총 지출 금액: {totalExpense.toLocaleString()} 원
          </div>

          {/* 결과 표시 */}
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
                            weekday: "short",
                          }
                        )}
                      </strong>
                      <span>
                        {new Date(expense.expenseDate).toLocaleTimeString(
                          "ko-KR",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: false,
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
