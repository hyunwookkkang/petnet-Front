import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./GetAnnualExpenseStats.css";

const GetAnnualExpenseStats = () => {
  const [stats, setStats] = useState([]); // 월별 지출 데이터 상태
  const [chartData, setChartData] = useState(null); // Chart.js 데이터 상태
  const [year] = useState(new Date().getFullYear()); // 현재 연도
  const userId = "user05"; // 테스트용 사용자 ID

  // API 호출 함수
  const fetchAnnualExpenseStats = async () => {
    try {
      const response = await fetch(
        `/api/cashbook/expense/user05/${year}/getAnnualExpenseStats`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // 상태 업데이트
      setStats(data);
      processChartData(data); // Chart.js 데이터 가공
    } catch (error) {
      console.error("Error fetching annual expense stats:", error);
    }
  };

  // Chart.js 데이터 가공
  const processChartData = (data) => {
    const months = Array.from({ length: 12 }, (_, i) => `${i + 1}월`); // 1월~12월
    const expenses = Array(12).fill(0); // 각 월별 기본값 0

    // 월별 데이터 매핑
    data.forEach((item) => {
      expenses[item.month - 1] = item.totalExpense;
    });

    setChartData({
      labels: months,
      datasets: [
        {
          label: "월별 지출 금액",
          data: expenses,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    });
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchAnnualExpenseStats();
  }, []);

  // 합계 계산
  const calculateTotalExpense = () => {
    return stats.reduce((sum, item) => sum + item.totalExpense, 0);
  };

  return (
    <div className="annual-expense-stats">
      <h2>{year}년 월별 지출 통계</h2>

      {/* Chart.js 막대그래프 */}
      {chartData && (
        <div className="chart-container">
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
      )}

      {/* HTML 테이블 */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>월</th>
              {[...Array(12)].map((_, i) => (
                <th key={i}>{i + 1}월</th>
              ))}
              <th>합계</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>지출</td>
              {[...Array(12)].map((_, i) => {
                const monthData = stats.find((item) => item.month === i + 1);
                return (
                  <td key={i}>
                    {monthData ? monthData.totalExpense.toLocaleString() : "0"}{" "}
                    원
                  </td>
                );
              })}
              <td>{calculateTotalExpense().toLocaleString()} 원</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetAnnualExpenseStats;
