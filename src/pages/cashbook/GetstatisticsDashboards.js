import React, { useState } from "react";
import GetAnnualExpenseStats from "./GetAnnualExpenseStats";
import GetCategoryExpenseStats from "./GetCategoryExpenseStats";
import "../../styles/cashbook/GetstatisticsDashboards.css";
import CashbookYearNav from "./CashbookYearNav";

const GetstatisticsDashboards = () => {
  const [year, setYear] = useState(new Date().getFullYear());

  return (
    <div>
      <CashbookYearNav year={year} setYear={setYear} />

      <div className="cashbook-statistics-dashboard">
        {/* 연간 통계 섹션 */}
        <section>
          <div className="cashbook-dashboard-bit">연간 월별 지출 통계</div>
          <GetAnnualExpenseStats year={year} setYear={setYear} />
        </section>

        <hr />

        {/* 카테고리 통계 섹션 */}
        <section>
          <div className="cashbook-dashboard-bit">
            연간 지출 카테고리별 통계
          </div>
          <GetCategoryExpenseStats year={year} setYear={setYear} />
        </section>
      </div>
    </div>
  );
};

export default GetstatisticsDashboards;
