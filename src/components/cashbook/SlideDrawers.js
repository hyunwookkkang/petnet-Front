import React, { useState, useEffect } from "react";
import "../../styles/cashbook/SlideDrawers.css";
import {
  showSuccessToast,
  showErrorToast,
} from "../../components/common/alert/CommonToast";
import CommonModal from "../../components/common/modal/CommonModal";

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
    if (field === "expenseDate") {
      setExpense((prev) => ({
        ...prev,
        expenseDate: `${value}T${prev.expenseDate.slice(11, 16)}:00`, // 초 단위 추가
      }));
    } else if (field === "expenseTime") {
      setExpense((prev) => ({
        ...prev,
        expenseDate: `${prev.expenseDate.slice(0, 10)}T${value}:00`, // 초 단위 추가
      }));
    } else {
      setExpense((prev) => ({ ...prev, [field]: value }));
    }
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
          showSuccessToast("수정되었습니다!");
          onUpdate(); // 데이터 갱신
          onClose(); // 슬라이드 닫기
        } else {
          showErrorToast("수정에 실패했습니다.");
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
          showSuccessToast("지출내역이 삭제되었습니다!");
          onUpdate(); // 데이터 갱신
          onClose(); // 슬라이드 닫기
        } else {
          showErrorToast("삭제가 실패했습니다.");
        }
      })
      .catch((error) => console.error("지출 내역 삭제 실패:", error));
  };

  if (!isOpen) return null;

  // 삭제 모달에 사용할 내용
  const modalFooter = (
    <>
      <button onClick={handleDelete}>예</button>
      <button onClick={() => setShowDeleteModal(false)}>아니오</button>
    </>
  );

  return (
    <div className={`cashbook-slide-drawer open ${isOpen ? "open" : ""}`}>
      {/* 닫기 버튼 */}
      <button className="cashbook-close-btn" onClick={onClose}>
        ×
      </button>
      <h2 className="Cashbook-GetExpense-title-box">지출 상세 정보</h2>

      {loading ? (
        <p>로딩 중...</p>
      ) : expense ? (
        <>
          {/* 날짜와 시간 */}
          <div className="cashbook-date-time-row">
            {/* 날짜 */}
            <div className="cashbook-field">
              <label>날짜</label>
              <input
                type="date"
                value={
                  expense.expenseDate ? expense.expenseDate.split("T")[0] : ""
                }
                onChange={(e) =>
                  handleInputChange("expenseDate", e.target.value)
                }
              />
            </div>

            {/* 시간 */}
            <div className="cashbook-field">
              <label>시간</label>
              <input
                type="time"
                value={
                  expense.expenseDate
                    ? expense.expenseDate.split("T")[1].slice(0, 5) // HH:mm 형식만 추출
                    : ""
                }
                onChange={(e) =>
                  handleInputChange("expenseTime", e.target.value)
                }
              />
            </div>
          </div>

          {/* 금액 */}
          <div className="cashbook-field">
            <label>금액</label>
            <input
              type="number"
              placeholder="금액 입력"
              value={expense.amount}
              onChange={(e) => handleInputChange("amount", e.target.value)}
            />
          </div>

          {/* 동물 카테고리 */}
          <div className="cashbook-field">
            <label>동물 카테고리</label>
            <select
              value={expense.animalCategory || ""} // 초기값 설정
              onChange={
                (e) => handleInputChange("animalCategory", e.target.value) // 값 변경 핸들러
              }
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <option value="">카테고리를 선택하세요</option>
              <option value="강아지">강아지</option>
              <option value="고양이">고양이</option>
            </select>
          </div>

          {/* 지출 카테고리 */}
          <div className="cashbook-field">
            <label>지출 카테고리</label>
            <select
              value={expense.expenseCategory || ""}
              onChange={(e) =>
                handleInputChange("expenseCategory", e.target.value)
              }
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <option value="">카테고리를 선택하세요</option>
              <option value="사료">사료</option>
              <option value="간식">간식</option>
              <option value="장난감">장난감</option>
              <option value="산책용품">산책용품</option>
              <option value="의류">의류</option>
              <option value="미용용품">미용용품</option>
              <option value="위생용품">위생용품</option>
              <option value="병원비">병원비</option>
              <option value="미용비">미용비</option>
              <option value="기타">기타</option>
            </select>
          </div>
          {/* 지출 내용 */}
          <div className="cashbook-field">
            <label>지출 내용</label>
            <input
              type="text"
              placeholder="지출 내용을 입력하세요"
              value={expense.expenseContent || ""}
              onChange={(e) =>
                handleInputChange("expenseContent", e.target.value)
              }
            />
          </div>

          {/* 결제 수단 */}
          <div className="cashbook-field">
            <label>결제 수단</label>
            <select
              value={expense.paymentOption || ""} // 초기값 설정
              onChange={
                (e) => handleInputChange("paymentOption", e.target.value) // 값 변경 핸들러
              }
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <option value="">결제 수단을 선택하세요</option>
              <option value="카드결제">카드결제</option>
              <option value="간편결제">간편결제</option>
              <option value="현금">현금</option>
            </select>
          </div>

          {/* 메모 */}
          <div className="cashbook-field">
            <label>메모</label>
            <input
              type="text"
              placeholder="메모를 입력하세요"
              value={expense.memo || ""}
              onChange={(e) => handleInputChange("memo", e.target.value)}
            />
          </div>

          {/* 수정 및 삭제 버튼 */}
          <div className="cashbook-actions">
            <button className="cashbook-update-btn" onClick={handleUpdate}>
              수정
            </button>
            <button
              className="cashbook-delete-btn"
              onClick={() => setShowDeleteModal(true)}
            >
              삭제
            </button>
          </div>

          {/* 삭제 모달 */}
          <CommonModal
            show={showDeleteModal}
            onHide={() => setShowDeleteModal(false)}
            title="삭제 확인"
            body="해당 항목을 삭제하시겠습니까?"
            footer={modalFooter}
          />
        </>
      ) : (
        <p>데이터를 불러올 수 없습니다.</p>
      )}
    </div>
  );
};

export default SlideDrawers;
