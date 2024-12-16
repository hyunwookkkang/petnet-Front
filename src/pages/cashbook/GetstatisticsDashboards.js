import React from "react";
import GetAnnualExpenseStats from "./GetAnnualExpenseStats";
import GetCategoryExpenseStats from "./GetCategoryExpenseStats";
import "../../styles/cashbook/GetstatisticsDashboards.css";

const GetstatisticsDashboards = () => {
  return (
    <div className="statistics-dashboard">
      <h1>통계 대시보드</h1>
      {/* 연간 통계 섹션 */}
      <section className="dashboard-section">
        <h2>연간 월별 지출 통계</h2>
        <GetAnnualExpenseStats />
      </section>

      <hr />
      {/* 카테고리 통계 섹션 */}
      <section className="dashboard-section">
        <h2>카테고리별 지출 통계</h2>
        <GetCategoryExpenseStats />
      </section>
    </div>
  );
};

export default GetstatisticsDashboards;
