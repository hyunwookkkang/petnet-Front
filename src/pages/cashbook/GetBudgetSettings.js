import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/cashbook/GetBudgetSettings.css";

const GetBudgetSettings = () => {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  // 예산 데이터 가져오기
  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const userId = "user01"; // 로그인 사용자 ID
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
    <div className="budget-settings-container">
      <h2>예산 설정</h2>
      <div className="budget-list">
        {budgets.map((budget, index) => (
          <div className="budget-item" key={budget.expenseCategory}>
            <div className="budget-icon">{/* 카테고리 아이콘 */}</div>
            <div className="budget-category">{budget.expenseCategory}</div>
            <div className="budget-amount">
              <input
                type="number"
                value={budget.budgetAmount}
                onChange={(e) =>
                  handleBudgetChange(index, "budgetAmount", e.target.value)
                }
              />
              원
            </div>
            <div className="budget-edit">
              <button
                className="edit-icon"
                onClick={() => alert("수정 버튼 클릭")}
              >
                ✏️
              </button>
            </div>
            <div className="budget-toggle">
              <label className="switch">
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
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        ))}
      </div>
      <button className="save-button" onClick={handleSave}>
        저장
      </button>
    </div>
  );
};

export default GetBudgetSettings;
