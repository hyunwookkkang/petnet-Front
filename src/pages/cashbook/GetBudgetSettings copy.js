import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/cashbook/GetBudgetSettings.css";
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
} from "@fortawesome/free-solid-svg-icons";
import { faHospital } from "@fortawesome/free-regular-svg-icons";
import { faWalking } from "@fortawesome/free-solid-svg-icons"; // 산책용품 아이콘 추가
import { faFutbol } from "@fortawesome/free-regular-svg-icons"; // 장난감 아이콘 추가
import {
  showSuccessToast,
  showErrorToast,
} from "../../components/common/alert/CommonToast";

const GetBudgetSettings = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userId } = useUser();
  const navigate = useNavigate();

  // 로그인 확인
  // useEffect(() => {
  //   if (!userId) {
  //     alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
  //     navigate("/login");
  //   }
  // }, [userId, navigate]);

  // 예산 데이터 가져오기
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const response = await axios.get(
          `/api/cashbook/budget/getAllBudgets/${userId}`
        );
        setBudgets(response.data);
      } catch (error) {
        console.error("예산 데이터를 가져오는데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBudgets();
  }, [userId]);

  // 예산 금액 변경 시 서버로 전송
  const handleBudgetChange = async (index, value) => {
    const updatedBudgets = [...budgets];
    updatedBudgets[index].budgetAmount = value;
    setBudgets(updatedBudgets);

    try {
      const budget = updatedBudgets[index];
      await axios.put(`/api/cashbook/budget/update/${budget.budgetId}`, {
        budgetAmount: value,
      });
      showSuccessToast("예산이 등록되었습니다!");
    } catch (error) {
      console.error("예산 금액 업데이트 실패:", error);
      showErrorToast("예산등록에 실패했습니다.");
    }
  };

  // 토글 상태 변경 시 서버로 전송
  const handleToggle = async (index) => {
    const updatedBudgets = [...budgets];
    updatedBudgets[index].isNotification =
      !updatedBudgets[index].isNotification;
    setBudgets(updatedBudgets);

    try {
      const budget = updatedBudgets[index];
      await axios.put(`/api/cashbook/budget/toggle/${budget.budgetId}`, {
        isNotification: budget.isNotification,
      });
    } catch (error) {
      console.error("토글 상태 업데이트 실패:", error);
    }
  };

  // 아이콘을 expenseCategory에 맞게 매핑
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

  if (loading) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="cashbook-budget-settings-container">
      <h2 className="cashbook-budget-h2">예산 설정</h2>
      <div className="cashbook-budget-list">
        {budgets.map((budget, index) => (
          <div
            className="cashbook-budgetsetting-item"
            key={budget.expenseCategory}
          >
            <div className="cashbook-budget-category">
              {categoryIcons[budget.expenseCategory] || null}{" "}
              {/* 아이콘 표시 */}
              {budget.expenseCategory}
            </div>
            <div className="cashbook-budget-amount">
              <input
                type="number"
                value={budget.budgetAmount}
                onChange={(e) =>
                  handleBudgetChange(index, parseInt(e.target.value, 10))
                }
              />
              원
            </div>
            <div className="cashbook-budget-toggle">
              <label className="cashbook-switch">
                <input
                  type="checkbox"
                  checked={budget.isNotification || false}
                  onChange={() => handleToggle(index)}
                />
                <span className="cashbook-slider round"></span>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetBudgetSettings;
