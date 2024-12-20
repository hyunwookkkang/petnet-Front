import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/cashbook/GetBudgets.css";
import { Link } from "react-router-dom";
import { useUser } from "../../components/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBowlFood,
  faBone,
  faBath,
  faPumpMedical,
  faScissors,
  faHeart,
  faWalking,
  faFutbol,
} from "@fortawesome/free-solid-svg-icons";
import { faHospital } from "@fortawesome/free-regular-svg-icons";

const GetBudgets = () => {
  const categoryIcons = {
    사료: <FontAwesomeIcon icon={faBowlFood} />,
    간식: <FontAwesomeIcon icon={faBone} />,
    장난감: <FontAwesomeIcon icon={faFutbol} />,
    산책용품: <FontAwesomeIcon icon={faWalking} />,
    의류: <FontAwesomeIcon icon={faHeart} />,
    미용용품: <FontAwesomeIcon icon={faBath} />,
    위생용품: <FontAwesomeIcon icon={faPumpMedical} />,
    병원비: <FontAwesomeIcon icon={faHospital} />,
    미용비: <FontAwesomeIcon icon={faScissors} />,
    기타: <FontAwesomeIcon icon={faHeart} />,
  };

  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalUsed, setTotalUsed] = useState(0);
  const [overBudget, setOverBudget] = useState(0);
  const { userId } = useUser();
  const navigate = useNavigate();

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/cashbook/budget/getActiveBudgets/${userId}`
      );
      const budgetsData = response.data;

      setBudgets(budgetsData);
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

      setTotalBudget(totalBudgetAmount);
      setTotalUsed(totalUsedAmount);
      setOverBudget(totalOverBudget);
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    try {
      const resetBudgets = budgets.map((budget) => ({
        ...budget,
        usedAmount: 0,
      }));

      setBudgets(resetBudgets);
      setTotalUsed(0);
      setOverBudget(0);

      alert("예산과 사용 금액이 초기화되었습니다.");
    } catch (error) {
      console.error("초기화 실패:", error);
      alert("초기화에 실패했습니다.");
    }
  };

  useEffect(() => {
    fetchBudgets();
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
        <div style={{ color: "blue" }}>
          사용금액: {totalUsed.toLocaleString()}원
        </div>
        {overBudget > 0 ? (
          <div style={{ color: "#f44336" }}>
            초과금액: {overBudget.toLocaleString()}원
          </div>
        ) : (
          <div style={{ color: "#4caf50" }}>
            남은금액: {(totalBudget - totalUsed).toLocaleString()}원
          </div>
        )}
      </div>
      <div className="cashbook-budgets-list">
        {budgets
          .filter((budget) => budget && budget.budgetAmount)
          .map((budget) => {
            const usedAmount = budget.usedAmount || 0;
            const budgetAmount = budget.budgetAmount || 0;

            return (
              <div
                className="cashbook-budget-item"
                key={budget.expenseCategory}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontWeight: "bold",
                  }}
                >
                  {categoryIcons[budget.expenseCategory]}
                  <span style={{ marginLeft: "8px" }}>
                    {budget.expenseCategory}
                  </span>
                </div>
                <div>
                  <span>예산:</span>{" "}
                  <span>
                    {budgetAmount.toLocaleString()}
                    <span style={{ marginLeft: "4px" }}>원</span>
                  </span>
                </div>
                <div>
                  <span>사용금액:</span>{" "}
                  <span>
                    {usedAmount.toLocaleString()}
                    <span style={{ marginLeft: "4px" }}>원</span>
                  </span>
                </div>
                <div
                  className="cashbook-progress-bar-container"
                  style={{ marginTop: "10px" }}
                >
                  <div
                    className={`cashbook-progress-bar ${
                      usedAmount > budgetAmount
                        ? "over-budget"
                        : "within-budget"
                    }`}
                    style={{
                      width: `${Math.min(
                        (usedAmount / budgetAmount) * 100,
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
                <div
                  style={{
                    color: usedAmount > budgetAmount ? "red" : "green",
                  }}
                >
                  {usedAmount > budgetAmount ? (
                    <>
                      초과금액:{" "}
                      <span>
                        {(usedAmount - budgetAmount).toLocaleString()}
                        <span style={{ marginLeft: "4px" }}>원</span>
                      </span>
                    </>
                  ) : (
                    <>
                      남은금액:{" "}
                      <span>
                        {(budgetAmount - usedAmount).toLocaleString()}
                        <span style={{ marginLeft: "4px" }}>원</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default GetBudgets;
