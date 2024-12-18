import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import "../../styles/cashbook/GetCategoryExpenseStats.css";
import { useUser } from "../../components/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { ProgressBar, Container, Row, Col } from "react-bootstrap";

const GetCategoryExpenseStats = () => {
  const [stats, setStats] = useState([]); // 원본 데이터
  const [pieData, setPieData] = useState(null); // 원형 차트 데이터
  const [totalExpense, setTotalExpense] = useState(0); // 총합
  const [year] = useState(new Date().getFullYear()); // 현재 연도
  const { userId } = useUser(""); // 사용자 ID
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
      return;
    }
    fetchCategoryExpenseStats();
  }, [userId, navigate]);

  // API 데이터 가져오기
  const fetchCategoryExpenseStats = async () => {
    try {
      const response = await fetch(
        `/api/cashbook/expense/${userId}/${year}/getCategoryExpenseStats`
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      processStats(data);
    } catch (error) {
      console.error("Error fetching category expense stats:", error);
    }
  };

  // 데이터 가공 및 카테고리 색상 설정
  const processStats = (data) => {
    const categoryTotals = data.reduce(
      (acc, { expenseCategory, totalExpense }) => {
        acc[expenseCategory] = (acc[expenseCategory] || 0) + totalExpense;
        return acc;
      },
      {}
    );

    const processedStats = Object.entries(categoryTotals).map(
      ([category, total]) => ({
        category,
        totalExpense: total,
      })
    );

    setStats(processedStats);

    // 원형 차트에 적용할 데이터
    const pieLabels = processedStats.map((item) => item.category);
    const pieValues = processedStats.map((item) => item.totalExpense);
    const backgroundColors = [
      "#F4E9E9", // 사료
      "#ff6384", // 간식
      "#4BC0C0", // 장난감
      "#3BB408", //산책용품
      "#9966FF", // 의류
      "#4D08B4", //미용용품
      "#9208B4", //위생용품
      "#36A2EB", // 병원비
      "#ffce56", // 미용비
      "#FF9F40", // 기타
    ];

    setPieData({
      labels: pieLabels,
      datasets: [
        {
          data: pieValues,
          backgroundColor: backgroundColors.slice(0, pieLabels.length),
        },
      ],
    });

    setTotalExpense(pieValues.reduce((sum, value) => sum + value, 0));
  };

  // 비율 계산
  const calculatePercentage = (amount) => {
    return totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(2) : 0;
  };

  return (
    <Container className="mt-5 category-expense-stats">
      {/* 원형 그래프 */}
      <Row>
        <Col md={6} className="mx-auto text-center">
          <h3>{year}년 지출 카테고리별 통계</h3>
          {pieData && <Pie data={pieData} />}
          <h4 className="mt-3">
            총 지출 금액: {totalExpense.toLocaleString()} 원
          </h4>
        </Col>
      </Row>

      {/* 카테고리별 프로그래스바 */}
      <Row className="mt-4">
        <Col>
          {stats.map((item, index) => {
            const percentage = calculatePercentage(item.totalExpense);
            return (
              <div key={index} className="mb-3 progress-row">
                <Row className="align-items-center">
                  <Col xs={2} className="text-start fw-bold">
                    {item.category}
                  </Col>
                  <Col xs={8}>
                    <ProgressBar
                      now={percentage}
                      label={`${percentage}%`}
                      className={`progress-bar-${index % 6}`}
                    />
                  </Col>
                  <Col xs={2} className="text-end">
                    {item.totalExpense.toLocaleString()}
                  </Col>
                </Row>
              </div>
            );
          })}
        </Col>
      </Row>
    </Container>
  );
};

export default GetCategoryExpenseStats;
