import React from "react";

const CashbookSortOptions = ({ sortOption, onChange }) => {
  return (
    <div style={{ marginBottom: "10px", textAlign: "right" }}>
      <label htmlFor="sortOption">정렬 기준: </label>
      <select
        id="sortOption"
        value={sortOption}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="date-desc">날짜 내림차순</option>
        <option value="date-asc">날짜 오름차순</option>
        <option value="category-asc">지출 카테고리 오름차순</option>
        <option value="category-desc">지출 카테고리 내림차순</option>
        <option value="amount-desc">금액 내림차순</option>
        <option value="amount-asc">금액 오름차순</option>
        <option value="payment-asc">결제수단 오름차순</option>
        <option value="payment-desc">결제수단 내림차순</option>
      </select>
    </div>
  );
};

export default CashbookSortOptions;
