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
  faFutbol,
  faWalking,
  faHeart,
  faBath,
  faPumpMedical,
  faScissors,
  faHospital,
} from "@fortawesome/free-solid-svg-icons";
import {
  showSuccessToast,
  showErrorToast,
} from "../../components/common/alert/CommonToast";
import CommonModal from "../../components/common/modal/CommonModal";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false); // <=============수정
  const { userId } = useUser();
  const navigate = useNavigate();

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/cashbook/budget/getActiveBudgets/${userId}`
      );
      console.log("Response data:", response.data);
      const budgetsData = response.data;

      setBudgets(budgetsData);
      const totalBudgetAmount = budgetsData.reduce(
        (sum, budget) => sum + (budget.budgetAmount || 0),
        0
      );
      const totalUsedAmount = budgetsData.reduce(
        (sum, budget) => sum + (budget.usedAmount || 0),
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
      console.error("Error fetching budgets:", error);
      console.error("데이터 가져오기 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await axios.post(`/api/cashbook/budget/resetUsedAmount/${userId}`);
      console.log("초기화 성공");
      showSuccessToast("초기화되었습니다.");
      setBudgets((prevBudgets) =>
        prevBudgets.map((budget) => ({
          ...budget,
          usedAmount: 0,
        }))
      );
      setTotalUsed(0);
      setOverBudget(0);
      setShowResetModal(false); // 초기화 후 모달 닫기
    } catch (error) {
      console.error("초기화 실패:", error);
      showErrorToast("초기화 실패");
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  if (loading) {
    return <p>로딩 중...</p>;
  }

  // 초기화 모달에 사용할 내용
  const resetModalFooter = (
    <>
      <button onClick={handleReset}>예</button>
      <button onClick={() => setShowResetModal(false)}>아니오</button>
    </>
  );

  return (
    <div className="cashbook-budgets-container">
      <div className="cashbook-budgets-header">
        <h2>예산금액</h2>
        <button
          className="cashbook-reset-button"
          onClick={() => setShowResetModal(true)}
        >
          {" "}
          {/* <=============수정 */}
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
          .filter((budget) => budget && budget.budgetAmount)
          .map((budget) => {
            const usedAmount = budget.usedAmount || 0;
            const budgetAmount = budget.budgetAmount || 0;
            const percentageUsed = Math.min(
              (usedAmount / budgetAmount) * 100,
              100
            );
            const progressClass =
              usedAmount > budgetAmount ? "bg-danger" : "bg-success";

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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <div>예산금액: {budgetAmount.toLocaleString()}원</div>
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
                <div className="progress-container">
                  <div className="progress" style={{ width: "100%" }}>
                    <div
                      className={`progress-bar ${progressClass}`}
                      role="progressbar"
                      style={{ width: `${percentageUsed}%` }}
                      aria-valuenow={percentageUsed}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    >
                      {percentageUsed.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* 초기화 모달 */}
      <CommonModal
        show={showResetModal}
        onHide={() => setShowResetModal(false)}
        title="초기화 확인"
        body="초기화하시겠습니까?"
        footer={resetModalFooter}
      />
    </div>
  );
};

export default GetBudgets;
