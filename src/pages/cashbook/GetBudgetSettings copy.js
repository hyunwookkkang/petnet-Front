import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/cashbook/GetBudgetSettings.css";
import { useUser } from "../../components/contexts/UserContext";
import { useNavigate } from "react-router-dom";

const GetBudgetSettings = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const { userId } = useUser();
  const navigate = useNavigate();

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
  }, []);

  // 입력 필드 변경 처리
  const handleBudgetChange = (index, field, value) => {
    const updatedBudgets = [...budgets];
    updatedBudgets[index][field] = value;
    setBudgets(updatedBudgets);
  };

  // 예산 저장
  const handleSave = async () => {
    try {
      for (const budget of budgets) {
        await axios.post(`/api/cashbook/budget/saveBudget`, budget);
      }
      alert("예산이 성공적으로 저장되었습니다!");
    } catch (error) {
      console.error("예산 저장 중 오류 발생:", error);
      alert("예산 저장에 실패했습니다.");
    }
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
            <div className="cashbook-budget-icon">{/* 카테고리 아이콘 */}</div>
            <div className="cashbook-budget-category">
              {budget.expenseCategory}
            </div>
            <div className="cashbook-budget-amount">
              <input
                type="number"
                value={budget.budgetAmount}
                onChange={(e) =>
                  handleBudgetChange(index, "budgetAmount", e.target.value)
                }
              />
              원
            </div>
            <div className="cashbook-budget-edit">
              <button
                className="cashbook-edit-icon"
                onClick={() => alert("수정 버튼 클릭")}
              >
                ✏️
              </button>
            </div>
            <div className="cashbook-budget-toggle">
              <label className="cashbook-switch">
                <input
                  type="checkbox"
                  checked={budget.isNotification}
                  onChange={(e) =>
                    handleBudgetChange(
                      index,
                      "isNotification",
                      e.target.checked
                    )
                  }
                />
                <span className="cashbook-slider round"></span>
              </label>
            </div>
          </div>
        ))}
      </div>
      <button className="cashbook-save-button" onClick={handleSave}>
        저장
      </button>
    </div>
  );
};

export default GetBudgetSettings;
