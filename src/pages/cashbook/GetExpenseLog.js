import React, { useState, useEffect } from "react";
import FloatingButtonWithSlide from "../../components/cashbook/FloatingButtonWithSlide"; // FloatingButtonWithSlide 컴포넌트 가져오기
import { useNavigate } from "react-router-dom"; // 네비게이션을 위한 useNavigate

const GetExpenseLog = ({ expenseId }) => {
  const [getExpenseLog, setGetExpenseLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExpense, setSelectedExpense] = useState(null); // 선택된 지출 내역
  const navigate = useNavigate(); // 사용자가 다른 페이지로 이동할 때 사용

  const handleExpenseClick = (expense) => {
    console.log("클릭된 지출 내역:", expense);
    navigate(`/expense/${expense.expenseId}`); // 지출 상세 페이지로 이동
  };

  // 지출 내역을 가져오는 함수
  useEffect(() => {
    if (expenseId) {
      setLoading(true); // 로딩 상태 시작
      fetch(`/api/cashbook/expense/getExpenseLog/${expenseId}`)
        .then((response) => response.json())
        .then((data) => {
          console.log("받아온 데이터:", data); // 데이터 확인
          setGetExpenseLog(data); // 데이터를 state에 저장
          setLoading(false); // 로딩 상태 종료
        })
        .catch((error) => {
          setError("지출 내역을 불러오는 데 실패했습니다.");
          setLoading(false);
        });
    }
  }, [expenseId]);

  // 수정 버튼 클릭 시
  const handleEdit = () => {
    console.log("수정 버튼 클릭");
    // 수정 폼을 여는 로직은 여기에 추가하면 됩니다.
  };

  // 삭제 버튼 클릭 시
  const handleDelete = () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      fetch(`/api/cashbook/expense/delete/${expenseId}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            alert("삭제되었습니다.");
            navigate("/expenses"); // 삭제 후 목록으로 리디렉션
          } else {
            alert("삭제 실패. 다시 시도해주세요.");
          }
        })
        .catch((error) => {
          console.error("삭제 오류:", error);
          alert("삭제 중 오류가 발생했습니다.");
        });
    }

    // 로딩 중 상태나 에러 처리
    if (loading) {
      return <p>로딩 중...</p>;
    }

    if (error) {
      return <p>{error}</p>;
    }

    return (
      <div>
        {/* 테이블 구성 */}
        <table>
          {/* 테이블 헤더 */}
          <thead>
            <tr>
              <th>Expense ID</th>
              <th>Amount</th>
              <th>Category</th>
              <th>Content</th>
              <th>Memo</th>
            </tr>
          </thead>

          {/* 테이블 본문 (tbody) */}
          <tbody>
            {getExpenseLog && getExpenseLog.length > 0 ? (
              getExpenseLog.map((expense) => (
                <tr
                  key={expense.expenseId}
                  onClick={() => {
                    console.log("클릭된 지출 내역:", expense); // 클릭된 데이터 확인
                    handleExpenseClick(expense); // 클릭 시 해당 항목의 상세 내역 보여줌
                  }}
                  className={
                    selectedExpense?.expenseId === expense.expenseId
                      ? "selected"
                      : ""
                  }
                >
                  <td>{expense.expenseId}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.expenseCategory}</td>
                  <td>{expense.expenseContent}</td>
                  <td>{expense.memo}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="cashbook-empty-message">
                  지출 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 선택된 지출 내역 슬라이드 */}
        {selectedExpense && (
          <FloatingButtonWithSlide
            expenseId={selectedExpense.expenseId}
            slideContent={
              <div>
                <h3>지출 내역 상세</h3>
                <p>
                  <strong>Expense ID:</strong> {selectedExpense.expenseId}
                </p>
                <p>
                  <strong>Amount:</strong> {selectedExpense.amount}
                </p>
                <p>
                  <strong>Category:</strong> {selectedExpense.expenseCategory}
                </p>
                <p>
                  <strong>Content:</strong> {selectedExpense.expenseContent}
                </p>
                <p>
                  <strong>Memo:</strong> {selectedExpense.memo}
                </p>
                <button onClick={handleEdit}>수정하기</button>
                <button onClick={handleDelete}>삭제하기</button>
              </div>
            }
          />
        )}
      </div>
    );
  };
};
export default GetExpenseLog;
