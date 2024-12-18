import React, { useState } from "react";
import GetAnnualExpenseStats from "./GetAnnualExpenseStats";
import GetCategoryExpenseStats from "./GetCategoryExpenseStats";
import "../../styles/cashbook/GetstatisticsDashboards.css";
import HeaderCashbook from "../../components/cashbook/HeaderCashbook";

const GetstatisticsDashboards = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  return (
    <div>
      <HeaderCashbook
        currentYear={year}
        currentMonth={month}
        setYear={setYear}
        setMonth={setMonth}
      />
      <div className="cashbook-statistics-dashboard">
        {/* 연간 통계 섹션 */}
        <section>
          <div className="cashbook-dashboard-bit">연간 월별 지출 통계</div>
          <GetAnnualExpenseStats />
        </section>

        <hr />
        {/* 카테고리 통계 섹션 */}
        <section>
          <div className="cashbook-dashboard-bit">
            연간 지출 카테고리별 통계
          </div>
          <GetCategoryExpenseStats />
        </section>
      </div>
    </div>
  );
};

export default GetstatisticsDashboards;
