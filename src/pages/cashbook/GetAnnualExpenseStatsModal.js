import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "../../styles/cashbook/GetAnnualExpenseStatsModal.css";
import { useUser } from "../../components/contexts/UserContext";
import { useNavigate } from "react-router-dom";

const GetAnnualExpenseStats = () => {
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [year] = useState(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userId } = useUser();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!userId) {
  //     alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
  //     navigate("/login");
  //     return;
  //   }
  // }, [userId, navigate]);

  const fetchAnnualExpenseStats = async () => {
    try {
      const response = await fetch(
        `/api/cashbook/expense/${userId}/${year}/getAnnualExpenseStats`
      );
      if (!response.ok) {
        throw new Error("HTTP error!");
      }
      const data = await response.json();
      setStats(data);
      processChartData(data);
    } catch (error) {
      console.error("Error fetching annual expense stats:", error);
    }
  };

  const processChartData = (data) => {
    const months = Array.from({ length: 12 }, (_, i) => `${i + 1}`);
    const expenses = Array(12).fill(0);

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

  useEffect(() => {
    fetchAnnualExpenseStats();
  }, []); // 컴포넌트 마운트 시 데이터 가져오기

  const calculateTotalExpense = () => {
    return stats.reduce((sum, item) => sum + item.totalExpense, 0);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="cashbook-modal-annual-expense-stats">
      <h2 className="cashbook-modal-annual-expense-title">
        {year}년 월별 지출 통계
      </h2>

      {/* Chart.js 막대그래프 */}
      {chartData && (
        <div className="cashbook-modal-chart-container">
          <Bar data={chartData} options={{ responsive: true }} />
        </div>
      )}

      {/* HTML 테이블 */}
      <div className="cashbook-modal-table-container">
        <table className="cashbook-modal-table">
          <thead>
            <tr>
              <th>월</th>
              {[...Array(12)].map((_, i) => (
                <th key={i}>{i + 1}</th>
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
