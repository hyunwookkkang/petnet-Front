import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/cashbook/GetBudgets.css";
import { Link } from "react-router-dom";
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

  const userId = "user01"; // 로그인 사용자 ID (예시)

  // 예산 데이터 가져오기
  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/cashbook/budget/getActiveBudgets/${userId}`
      );
      const budgetsData = response.data;

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
    <div className="budgets-container">
      <div className="budgets-header">
        <h2>예산</h2>
        <button className="reset-button" onClick={handleReset}>
          초기화
        </button>

        <button className="settings-button">
          <Link to="/GetBudgetSettings">예산설정</Link>
        </button>
      </div>
      <div className="budgets-summary">
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
      <div className="budgets-list">
        {budgets.map((budget) => {
          const usedAmount = budget.usedAmount || 0;
          const budgetAmount = budget.budgetAmount || 0;
          const progressPercentage = (usedAmount / budgetAmount) * 100;

          // progress bar 색상
          const progressColor = progressPercentage > 100 ? "danger" : "success";

          return (
            <div className="budget-item" key={budget.expenseCategory}>
              <div className="budget-info">
                <div>{categoryIcons[budget.expenseCategory]}</div>
                <div>예산: {budgetAmount.toLocaleString()}원</div>
                <div>사용금액: {usedAmount.toLocaleString()}원</div>
                <div>남은금액: {budgetAmount - usedAmount}</div>
              </div>

              <div className="progress-container">
                <progress
                  className={`progress-bar bg-${progressColor}`}
                  value={progressPercentage}
                  max={100}
                  style={{
                    width: "100%",
                    height: "30px",
                    borderRadius: "10px",
                  }}
                ></progress>
                <span
                  style={{
                    textAlign: "center",
                    width: "100%",
                    color: progressColor === "danger" ? "red" : "green",
                  }}
                >
                  {progressPercentage.toFixed(2)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GetBudgets;
