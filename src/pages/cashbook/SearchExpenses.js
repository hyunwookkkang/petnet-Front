import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./SearchExpenses.css";
import SearchBar from "../../components/common/searchBar/SearchBar";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const SearchExpenses = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [animalCategory, setAnimalCategory] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [results, setResults] = useState([]); // 검색 결과 상태
  const [totalExpense, setTotalExpense] = useState(0); // 총 지출 금액 상태

  const handleSearch = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/api/cashbook/expense/searchExpensesLog",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            startDate,
            endDate,
            animalCategory,
            expenseCategory,
            paymentOption,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("서버 응답이 올바르지 않습니다.");
      }

      const data = await response.json();
      setResults(data.expenses); // 검색 결과 업데이트
      setTotalExpense(data.totalCount); // 총 지출 금액 업데이트
    } catch (error) {
      console.error("검색 중 오류가 발생했습니다:", error);
    }
  };

  return (
    <div className="search-expenses">
      {/* 날짜 선택 */}
      <div className="date-picker-container">
        <label>
          <CalendarMonthIcon />
        </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="시작 날짜 선택"
        ></DatePicker>
      </div>
      <div>
        <label>
          <CalendarMonthIcon />
        </label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="종료 날짜 선택"
        />
      </div>

      <SearchBar />

      {/* 드롭다운 필터 */}
      <div className="dropdown-container">
        <label>동물 카테고리:</label>
        <select
          value={animalCategory}
          onChange={(e) => setAnimalCategory(e.target.value)}
        >
          <option value="">선택하세요</option>
          <option value="개">개</option>
          <option value="고양이">고양이</option>
        </select>

        <label>지출 카테고리:</label>
        <select
          value={expenseCategory}
          onChange={(e) => setExpenseCategory(e.target.value)}
        >
          <option value="">선택하세요</option>
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

        <label>결제 수단:</label>
        <select
          value={paymentOption}
          onChange={(e) => setPaymentOption(e.target.value)}
        >
          <option value="">선택하세요</option>
          <option value="카드결제">카드결제</option>
          <option value="간편결제">간편결제</option>
          <option value="현금">현금</option>
        </select>
      </div>

      {/* 검색 버튼 */}
      <button className="search-button" onClick={handleSearch}>
        검색
      </button>

      {/* 결과 표시 */}
      <div className="search-results">
        <h3>총 지출 금액: {totalExpense}</h3>
        <ul>
          {results.length > 0 ? (
            results.map((expense) => (
              <li key={expense.expenseId}>
                {expense.expenseDate} - {expense.expenseContent} - ₩
                {expense.amount}
              </li>
            ))
          ) : (
            <li>검색된 결과가 없습니다.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SearchExpenses;
