import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // API 호출을 위해 axios 사용
import DatePicker from "react-datepicker"; // 날짜 선택을 위한 라이브러리
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/cashbookExpenseLog.css";

const ExpenseLog = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchParams, setSearchParams] = useState({
    userId: "user05", // 예시로 "user01" 사용
    startDate: new Date("2024-11-01"),
    endDate: new Date("2024-11-30"),
    expenseCategory: "",
    animalCategory: "",
    paymentOption: "",
    searchKeyword: "",
  });
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    fetchExpenses();
  }, [searchParams, currentPage]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        "/api/cashbook/expense/searchExpensesLog",
        {
          params: { ...searchParams, page: currentPage, size: 10 },
        }
      );
      setExpenses(response.data.expenses);
      setTotalAmount(response.data.totalAmount);
    } catch (error) {
      console.error("Error fetching expenses", error);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleDateChange = (date, type) => {
    setSearchParams({ ...searchParams, [type]: date });
  };

  return (
    <div>
      {/* 상단 네비게이션 바 */}
      <div className="cashbook-header-nav">
        <div className="cashbook-header-nav-left">
          <button>◀</button>
          <span>
            {searchParams.startDate.getFullYear()}년{" "}
            {searchParams.startDate.getMonth() + 1}월
          </span>
          <button>▶</button>
        </div>
        <div className="cashbook-search-box">
          <input
            type="text"
            placeholder="검색어"
            name="searchKeyword"
            value={searchParams.searchKeyword}
            onChange={handleSearchChange}
          />
          <button>검색</button>
        </div>
        <div className="cashbook-expense-log-container">
          {/* 여기에 컴포넌트 내용 작성 */}
        </div>
      </div>

      {/* 검색 조건 */}
      <div className="cashbook-filter-box">
        <DatePicker
          selected={searchParams.startDate}
          onChange={(date) => handleDateChange(date, "startDate")}
          dateFormat="yyyy/MM/dd"
        />
        <span>~</span>
        <DatePicker
          selected={searchParams.endDate}
          onChange={(date) => handleDateChange(date, "endDate")}
          dateFormat="yyyy/MM/dd"
        />
        <select
          name="expenseCategory"
          value={searchParams.expenseCategory}
          onChange={handleSearchChange}
        >
          <option value="">지출 카테고리</option>
          <option value="식비">식비</option>
          <option value="교통/차량">교통/차량</option>
          {/* 다른 카테고리 추가 */}
        </select>
        <select
          name="paymentOption"
          value={searchParams.paymentOption}
          onChange={handleSearchChange}
        >
          <option value="">결제 수단</option>
          <option value="현금">현금</option>
          <option value="카드결제">카드결제</option>
          <option value="간편결제">간편결제</option>
        </select>
        <select
          name="animalCategory"
          value={searchParams.animalCategory}
          onChange={handleSearchChange}
        >
          <option value="">동물 카테고리</option>
          <option value="개">개</option>
          <option value="고양이">고양이</option>
        </select>
      </div>

      {/* 지출 내역 테이블 */}
      <div className="cashbook-expense-table">
        <table>
          <thead>
            <tr>
              <th>날짜</th>
              <th>자산</th>
              <th>분류</th>
              <th>금액</th>
              <th>내용</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.expenseId}>
                <td>{expense.expenseDate}</td>
                <td>{expense.paymentOption}</td>
                <td>{expense.expenseCategory}</td>
                <td>{expense.amount}</td>
                <td>{expense.expenseContent}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="cashbook-pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 0}
        >
          이전
        </button>
        <button onClick={() => setCurrentPage(currentPage + 1)}>다음</button>
      </div>
    </div>
  );
};

export default ExpenseLog;
