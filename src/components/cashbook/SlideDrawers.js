import React, { useState, useEffect } from "react";
import "../../styles/cashbook/SlideDrawers.css";

const SlideDrawers = ({ isOpen, onClose, expenseId, onUpdate = () => {} }) => {
  const [expense, setExpense] = useState(null); // 지출 상세 데이터
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false); // 삭제 모달 상태

  useEffect(() => {
    console.log("SlideDrawers isOpen:", isOpen);
    console.log("SlideDrawers expenseId:", expenseId);

    if (isOpen && expenseId) {
      console.log("Fetching data for expenseId:", expenseId);
      setLoading(true);
      fetch(`/api/cashbook/expense/getExpenseLog/${expenseId}`)
        .then((res) => {
          console.log("Response status:", res.status);
          return res.json();
        })
        .then((data) => {
          console.log("Fetched expense data:", data);
          setExpense(data);
        })
        .catch((error) => console.error("지출 상세 데이터 로드 실패:", error))
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log("Slide is closed or expenseId is invalid");
    }
  }, [isOpen, expenseId]);

  const handleInputChange = (field, value) => {
    console.log(`Field changed: ${field}, New value: ${value}`);
    setExpense((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = () => {
    if (!expense) {
      console.error("No expense data to update");
      return;
    }
    console.log("Updating expense data:", expense);
    fetch(`/api/cashbook/expense/updateExpenseLog`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(expense),
    })
      .then((res) => {
        console.log("Update response status:", res.status);
        if (res.ok) {
          alert("지출 내역이 성공적으로 수정되었습니다.");
          onUpdate(); // 데이터 갱신
          onClose(); // 슬라이드 닫기
        } else {
          alert("수정에 실패했습니다.");
        }
      })
      .catch((error) => console.error("지출 내역 수정 실패:", error));
  };

  const handleDelete = () => {
    if (!expenseId) {
      console.error("No expenseId provided for deletion");
      return;
    }
    console.log("Deleting expenseId:", expenseId);
    fetch(`/api/cashbook/expense/deleteExpenseLog/${expenseId}`, {
      method: "DELETE",
    })
      .then((res) => {
        console.log("Delete response status:", res.status);
        if (res.ok) {
          alert("지출 내역이 삭제되었습니다.");
          onUpdate(); // 데이터 갱신
          onClose(); // 슬라이드 닫기
        } else {
          alert("삭제에 실패했습니다.");
        }
      })
      .catch((error) => console.error("지출 내역 삭제 실패:", error));
  };

  if (!isOpen) return null;

  return (
    <div className={`slide-drawer ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={onClose}>
        닫기
      </button>
      <h2>지출 상세 정보</h2>
      {loading ? (
        <p>로딩 중...</p>
      ) : expense ? (
        <>
          <div className="field">
            <label>날짜</label>
            <input
              type="datetime-local"
              value={new Date(expense.expenseDate).toISOString().slice(0, 16)}
              onChange={(e) => handleInputChange("expenseDate", e.target.value)}
            />
          </div>
          <div className="field">
            <label>금액</label>
            <input
              type="number"
              value={expense.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
            />
          </div>
          <div className="field">
            <label>분류</label>
            <input
              type="text"
              value={expense.expenseCategory}
              onChange={(e) =>
                handleInputChange("expenseCategory", e.target.value)
              }
            />
          </div>
          <div className="field">
            <label>내용</label>
            <input
              type="text"
              value={expense.expenseContent}
              onChange={(e) =>
                handleInputChange("expenseContent", e.target.value)
              }
            />
          </div>
          <div className="field">
            <label>결제수단</label>
            <input
              type="text"
              value={expense.paymentOption}
              onChange={(e) =>
                handleInputChange("paymentOption", e.target.value)
              }
            />
          </div>
          <div className="field">
            <label>메모</label>
            <input
              type="text"
              value={expense.memo || ""}
              onChange={(e) => handleInputChange("memo", e.target.value)}
            />
          </div>
          <div className="actions">
            <button className="update-btn" onClick={handleUpdate}>
              수정
            </button>
            <button
              className="delete-btn"
              onClick={() => setShowDeleteModal(true)}
            >
              삭제
            </button>
          </div>
          {showDeleteModal && (
            <div className="delete-modal">
              <p>해당 항목을 삭제하시겠습니까?</p>
              <button onClick={handleDelete}>예</button>
              <button onClick={() => setShowDeleteModal(false)}>아니오</button>
            </div>
          )}
        </>
      ) : (
        <p>데이터를 불러올 수 없습니다.</p>
      )}
    </div>
  );
};

export default SlideDrawers;
