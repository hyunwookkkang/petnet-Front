import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import "../../styles/cashbook/GetCategoryExpenseStats.css";
import { useUser } from "../../components/contexts/UserContext";
import { useNavigate } from "react-router-dom";

const GetCategoryExpenseStats = () => {
  const [stats, setStats] = useState([]); // API에서 가져온 원본 데이터
  const [pieData, setPieData] = useState(null); // 원형 차트 데이터
  const [tableData, setTableData] = useState([]); // 테이블 데이터
  const [totalExpense, setTotalExpense] = useState(0); // 전체 지출 합계
  const [year] = useState(new Date().getFullYear()); // 현재 연도
  const { userId } = useUser(""); // 사용자 ID 가져오기
  const navigate = useNavigate();

  useEffect(() => {
    console.log(userId);
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login"); // 로그인 페이지로 리다이렉트
      return;
    }
  }, [userId, navigate]);

  // 데이터 가져오기
  const fetchCategoryExpenseStats = async () => {
    try {
      const response = await fetch(
        `/api/cashbook/expense/${userId}/${year}/getCategoryExpenseStats`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStats(data);
      processData(data); // 데이터 가공
    } catch (error) {
      console.error("Error fetching category expense stats:", error);
    }
  };

  // 데이터 가공
  const processData = (data) => {
    // 1. 원형 차트 데이터 준비
    const categoryTotals = {};
    let total = 0;

    data.forEach(({ expenseCategory, totalExpense }) => {
      categoryTotals[expenseCategory] =
        (categoryTotals[expenseCategory] || 0) + totalExpense;
      total += totalExpense;
    });

    const pieLabels = Object.keys(categoryTotals);
    const pieValues = Object.values(categoryTotals);

    setPieData({
      labels: pieLabels,
      datasets: [
        {
          data: pieValues,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#9966FF",
            "#FF9F40",
          ],
        },
      ],
    });

    setTotalExpense(total); // 전체 지출 합계 저장

    // 2. 테이블 데이터 준비
    const categories = Array.from(
      new Set(data.map((item) => item.expenseCategory))
    );
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    const table = categories.map((category) => {
      const row = months.map((month) => {
        const match = data.find(
          (item) => item.expenseCategory === category && item.month === month
        );
        return match ? match.totalExpense : 0;
      });
      const annualTotal = row.reduce((sum, value) => sum + value, 0);
      return { category, row, annualTotal };
    });

    setTableData(table);
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchCategoryExpenseStats();
  }, []);

  return (
    <div className="category-expense-stats">
      <h2>{year}년 지출 카테고리별 통계</h2>

      {/* 원형 차트 */}
      {pieData && (
        <div className="pie-chart-container">
          <Pie data={pieData} />
          <h3>
            연간 지출 총액: <span>{totalExpense.toLocaleString()} 원</span>
          </h3>
        </div>
      )}

      {/* 도표 */}
      <div className="cashbook-table-container">
        <table>
          <thead>
            <tr>
              <th>카테고리</th>
              {[...Array(12)].map((_, i) => (
                <th key={i}>{i + 1}월</th>
              ))}
              <th>합계</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map(({ category, row, annualTotal }, index) => (
              <tr key={index}>
                <td>{category}</td>
                {row.map((value, i) => (
                  <td key={i}>{value.toLocaleString()} 원</td>
                ))}
                <td>{annualTotal.toLocaleString()} 원</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetCategoryExpenseStats;
