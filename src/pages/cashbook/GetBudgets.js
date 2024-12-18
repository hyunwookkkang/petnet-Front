import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/cashbook/GetBudgets.css";
import { Link } from "react-router-dom";
import { useUser } from "../../components/contexts/UserContext";
import { useNavigate } from "react-router-dom";

const GetBudgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalUsed, setTotalUsed] = useState(0);
  const [overBudget, setOverBudget] = useState(0);
  const { userId } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    }
  }, [userId, navigate]);

  // 예산 데이터 가져오기
  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/cashbook/budget/getActiveBudgets/${userId}`
      );
      const budgetsData = response.data;
      // 여기가 정상적으로 데이터가 넘어오는지 확인

      console.log("API 응답 데이터:", budgetsData); // 콘솔에 데이터 출력

      setBudgets(budgetsData);
      // 총액 계산
      const totalBudgetAmount = budgetsData.reduce(
        (sum, budget) => sum + budget.budgetAmount,
        0
      );
      const totalUsedAmount = budgetsData.reduce(
        (sum, budget) => sum + budget.usedAmount,
        0
      );
      const totalOverBudget =
        totalUsedAmount > totalBudgetAmount
          ? totalUsedAmount - totalBudgetAmount
          : 0;

      setBudgets(budgetsData);
      setTotalBudget(totalBudgetAmount);
      setTotalUsed(totalUsedAmount);
      setOverBudget(totalOverBudget);
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 초기화 버튼 클릭 처리
  const handleReset = async () => {
    try {
      // 초기화 요청 API 호출
      await axios.post(`/api/cashbook/budget/resetBudgets/${userId}`);
      alert("예산과 사용 금액이 초기화되었습니다.");
      fetchBudgets(); // 데이터를 다시 가져오기
    } catch (error) {
      console.error("초기화 실패:", error);
      alert("초기화에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchBudgets(); // 컴포넌트 로드 시 데이터 가져오기
  }, []);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="cashbook-budgets-container">
      <div className="cashbook-budgets-header">
        <h2>예산금액</h2>
        <button className="cashbook-reset-button" onClick={handleReset}>
          초기화
        </button>

        <button className="cashbook-settings-button">
          <Link to="/GetBudgetSettings">예산설정</Link>
        </button>
      </div>
      <div className="cashbook-budgets-summary">
        <div>전체예산: {totalBudget.toLocaleString()}원</div>
        <div>사용금액: {totalUsed.toLocaleString()}원</div>

        {overBudget > 0 ? (
          <div style={{ color: "red" }}>
            초과금액: {overBudget.toLocaleString()}원
          </div>
        ) : (
          <div>남은금액: {(totalBudget - totalUsed).toLocaleString()}원</div>
        )}
      </div>

      <div className="cashbook-budgets-list">
        {budgets
          .filter((budget) => budget && budget.budgetAmount) // null 체크 및 조건 추가
          .map((budget) => {
            const usedAmount = budget.usedAmount || 0; // null 또는 undefined 방지
            const budgetAmount = budget.budgetAmount || 0;

            return (
              <div
                className="cashbook-budget-item"
                key={budget.expenseCategory}
              >
                <div className="cashbook-budget-category">
                  {budget.expenseCategory}
                </div>
                <div className="cashbook-budget-details">
                  <div>예산: {budgetAmount.toLocaleString()}원</div>
                  <div>사용금액: {usedAmount.toLocaleString()}원</div>
                  <div
                    style={{
                      color: usedAmount > budgetAmount ? "red" : "green",
                    }}
                  >
                    {usedAmount > budgetAmount
                      ? `초과금액: ${(
                          usedAmount - budgetAmount
                        ).toLocaleString()}원`
                      : `남은금액: ${(
                          budgetAmount - usedAmount
                        ).toLocaleString()}원`}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default GetBudgets;
