import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../../styles/cashbook/GetAnnualExpenseStats.css";
import { useUser } from "../../components/contexts/UserContext";
import { useNavigate } from "react-router-dom";

const GetAnnualExpenseStats = ({ year, setYear }) => {
  const [stats, setStats] = useState([]); // 월별 지출 데이터 상태
  const [chartData, setChartData] = useState(null); // Chart.js 데이터 상태
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // 선택된 연도
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 선택된 월 (1부터 시작)
  const { userId } = useUser(""); // 사용자 ID 가져오기
  const navigate = useNavigate();

  // Chart.js 옵션 설정 <============
  const options = {
    responsive: true,
    maintainAspectRatio: false, // 그래프 비율 유지 비활성화 <============
    scales: {
      y: {
        beginAtZero: true, // Y축이 0부터 시작
      },
    },
  };

  // API 호출 함수
  const fetchAnnualExpenseStats = async () => {
    try {
      const response = await fetch(
        `/api/cashbook/expense/${userId}/${year}/getAnnualExpenseStats`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
      processChartData(data); // Chart.js 데이터 가공
    } catch (error) {
      console.error("Error fetching annual expense stats:", error);
    }
  };

  // Chart.js 데이터 가공
  const processChartData = (data) => {
    const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
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
  }, [year]); // year가 변경되면 데이터를 새로 가져옵니다.

  // 합계 계산
  const calculateTotalExpense = () => {
    return stats.reduce((sum, item) => sum + item.totalExpense, 0);
  };

  // 월별 지출 비율 계산
  const calculatePercentage = (amount) => {
    const total = calculateTotalExpense();
    return total > 0 ? (amount / total) * 100 : 0;
  };

  // 총합 색상
  const totalExpenseColor = "#0500FF";

  return (
    <div className="cashbook-annual-expense-stats">
      <h3 className="cashbook-annual-expense-statsh2">
        {year}년 월별 지출 통계
      </h3>

      {/* Chart.js 막대그래프 */}
      {chartData && (
        <div className="cashbook-chart-container">
          <Bar data={chartData} options={options} />{" "}
          {/* options 재사용 <============ */}
        </div>
      )}

      {/* HTML 테이블 및 월별 지출 비율 표시 */}
      <div className="cashbook-monthly-expense-list">
        {stats.length > 0 ? (
          stats.map((item) => {
            const percentage = calculatePercentage(item.totalExpense);
            const color =
              percentage >= 80 ? "red" : percentage >= 50 ? "yellow" : "green"; // 색상 설정
            return (
              <div key={item.month} className="cashbook-monthly-expense-item">
                <div
                  className={`cashbook-monthly-expense-bar ${color}`}
                  style={{ width: `${percentage}%` }}
                ></div>
                <div className="cashbook-monthly-expense-text">
                  <span>{item.month}월</span>
                  <span>{item.totalExpense.toLocaleString()} 원</span>
                </div>
              </div>
            );
          })
        ) : (
          <p>데이터가 없습니다.</p>
        )}

        {/* 총합 표시 */}
        <div
          className="cashbook-monthly-expense-item"
          style={{ color: totalExpenseColor }}
        >
          <div
            className="cashbook-monthly-expense-bar"
            style={{
              width: `${calculatePercentage(calculateTotalExpense())}%`,
              backgroundColor: totalExpenseColor,
            }}
          ></div>
          <div className="cashbook-monthly-expense-text">
            <span>총합</span>
            <span>{calculateTotalExpense().toLocaleString()} 원</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetAnnualExpenseStats;
