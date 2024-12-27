import React, { useState, useEffect } from "react";
import "../../styles/cashbook/GetExpensesLog.css";
import AddExpenseLog from "../../pages/cashbook/AddExpenseLog";
import GetExpenseLog from "./GetExpenseLog";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../components/common/modal/LoginModal";
import GetLoadExpenseLog from "../../pages/cashbook/GetLoadExpenseLog";
import { useUser } from "../../components/contexts/UserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import { showErrorToast } from "../../components/common/alert/CommonToast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // 아이콘 추가
import {
  faBowlFood,
  faBone,
  faPaw,
  faBath,
  faScissors,
  faHospital,
  faHeart,
  faDog,
} from "@fortawesome/free-solid-svg-icons"; // 아이콘 임포트
import CashbookControl from "./CashbookControl";

const GetExpensesLog = ({ year, month, onAddExpense }) => {
  const navigate = useNavigate();
  const { userId } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [expenses, setExpenses] = useState([]); // 지출 목록
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [monthlyTotal, setMonthlyTotal] = useState(0); // 월간 총액
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [newExpense, setNewExpense] = useState(null); // 새로 추가된 지출 데이터
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 번호
  const [error, setError] = useState(null); // 에러 상태
  // 상세보기용 드로어 열림/닫힘 상태
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState("manual");

  useEffect(() => {
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    if (!userId) {
      setError("로그인이 필요합니다."); // 로그인이 필요한 경우 처리
      showErrorToast("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
      return;
    }
  }, [userId, navigate]);

  // categoryIcons 객체를 정의한 코드
  const categoryIcons = {
    사료: <FontAwesomeIcon icon={faBowlFood} />,
    간식: <FontAwesomeIcon icon={faBone} />,
    장난감: <FontAwesomeIcon icon={faPaw} />,
    산책용품: <FontAwesomeIcon icon={faDog} />,
    의료: <FontAwesomeIcon icon={faPaw} />,
    미용용품: <FontAwesomeIcon icon={faBath} />,
    병원비: <FontAwesomeIcon icon={faHospital} />,
    미용비: <FontAwesomeIcon icon={faScissors} />,
    기타: <FontAwesomeIcon icon={faHeart} />,
  };

  // 지출 목록 및 월간 총액을 가져오는 함수 fetchExpenses: 지출데이터를 가져온다
  const fetchExpenses = async (page) => {
    // async: 비동기함수를 의미, (page): 함수 호출 시 전달되는 매개변수, fetchExpenses(1) → 첫 번째 페이지 데이터를 가져옵니다.
    console.log("Fetching expenses..."); // 이 함수가 호출될 때마다 **"Fetching expenses..."**라는 메시지를 콘솔에 출력
    if (!userId || loading || !hasMore) return; // 사용자 정보가 없거나 이미 로딩 중이면 함수 실행 중단
    setLoading(true); // 로딩 시작

    try {
      const response = await fetch(
        `/api/cashbook/expense/getExpensesLog/${userId}/${year}/${month}/${page}/10`
      ); // fetch: http요청을 보내고 응답을 받는다. 여기서는 지출목록데이터를 받아옴
      console.log("fetchExpenses 응답:", response);
      console.log("fetchExpenses 호출 시 userId:", userId);
      console.log("fetchExpenses 호출 시 year:", year);
      console.log("fetchExpenses 호출 시 month:", month);
      console.log("fetchExpenses 호출 시 page:", page);
      // await : fetch가 완료될 때까지 기다립니다.
      if (!response.ok) {
        // response : 응답객체, response.ok: 요청 성공 여부(true, false)
        throw new Error(`지출 목록 로드 실패: ${response.status}`); // response.status: HTTP 상태 코드
      }
      const data = await response.json(); // response.json(): 응답 본문을 JSON 형식으로 변환
      console.log("지출 목록 데이터:", data);

      // Array.isArray(data.expenses) : 데이터가 배열인지 확인, 아닌경우를 방지, data.expenses.length > 0: 배열에 데이터가 있는지 확인
      if (Array.isArray(data.expenses) && data.expenses.length > 0) {
        // 새 데이터를 기존 데이터와 병합
        setExpenses((prev) => {
          const newExpenses = data.expenses.filter(
            (expense) =>
              !prev.some(
                (prevExpense) => prevExpense.expenseId === expense.expenseId
              )
          );
          return [...prev, ...newExpenses];
        });

        // 추가 데이터가 있는지 확인
        if (data.expenses.length < 10) {
          // 한 페이지당 10개의 데이터를 가져오므로
          console.log("더 이상 데이터가 없습니다.");
          setHasMore(false); // 추가 데이터가 없을 경우
        } else {
          setCurrentPage((prevPage) => prevPage + 1); // 다음 페이지로 이동
        }
      } else {
        setHasMore(false); // 데이터가 없으면 종료
      }

      const totalResponse = await fetch(
        `/api/cashbook/expense/${userId}/${year}/${month}/getMonthlyTotalExpense`
      );
      if (!totalResponse.ok) {
        throw new Error(`월간 총액 로드 실패: ${totalResponse.status}`);
      }
      const totalData = await totalResponse.json();
      setMonthlyTotal(totalData);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("year or month changed:", year, month); // 변경된 연도와 월 로그
    if (userId) {
      setExpenses([]); // 초기화
      setCurrentPage(0); //
      setHasMore(true); //
      fetchExpenses(0); // 첫 페이지 로드
    }
  }, [year, month, userId]); //

  useEffect(() => {
    if (!loading && hasMore) {
      fetchExpenses(currentPage); //
    }
  }, [currentPage, hasMore]);

  // 새로운 지출 데이터 추가 시 상태 업데이트
  useEffect(() => {
    if (newExpense) {
      setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
      setMonthlyTotal((prevTotal) => prevTotal + Number(newExpense.amount));
    }
  }, [newExpense]);

  // 새 지출 데이터를 추가하는 함수
  const handleNewExpense = (expenses) => {
    console.log("handleNewExpense 호출됨, newExpense:", expenses);

    setExpenses((prevExpenses) => {
      const isDuplicate = prevExpenses.some(
        (expense) => expense.expenseId === expenses.expenseId
      );
      if (!isDuplicate) {
        return [expenses, ...prevExpenses];
      }
      return prevExpenses;
    });
    setMonthlyTotal((prevTotal) => prevTotal + Number(expenses.amount)); // 월간 총액 갱신
  };

  // 특정 지출 항목 클릭 시 상세 데이터 로드
  const handleExpenseClick = async (expenseId) => {
    try {
      const response = await fetch(
        `/api/cashbook/expense/getExpenseLog/${expenseId}`
      );
      const data = await response.json();
      setSelectedExpense(data);
      setSelectedExpenseId(expenseId);
      setIsDrawerOpen(true); // 상세보기용 드로어 열기
    } catch (error) {
      console.error("상세 데이터 로드 실패:", error);
    }
  };

  // 상세보기 드로어 닫기 함수
  const handleSlideClose = () => {
    setIsDrawerOpen(false); // 드로어(슬라이드)를 닫는 동작
    setSelectedExpense(null); // 드로어를 닫으면서 선택된 지출 데이터(selectedExpense)를 비워, 다음 번 드로어가 열릴 때 이전 데이터를 유지하지 않도록 방지
  };

  const handleUpdate = () => {
    // 지출 수정 후 목록 재갱신
    setExpenses([]);
    setCurrentPage(0);
    setHasMore(true);
    fetchExpenses(0);
  };

  // 금액 포맷 함수
  const formatAmount = (amount) => `${amount.toLocaleString()} 원`; // toLocaleString(): 천단위 구분자 삽입

  return (
    <div>
      <LoginModal
        showModal={showLoginModal}
        setShowModal={setShowLoginModal}
        required={true}
      />
      <div className="cashbook-monthly-total">
        <h2>
          월간 지출 총액:{" "}
          <strong style={{ color: "#FF6347  " }}>
            {formatAmount(monthlyTotal)}
          </strong>
        </h2>
      </div>

      {loading && expenses.length === 0 ? ( // 초기 로딩 상태 확인
        <p>로딩 중...</p>
      ) : (
        <InfiniteScroll
          dataLength={expenses.length}
          next={() => setCurrentPage((prev) => prev + 1)}
          hasMore={hasMore}
          loader={<p>로딩 중...</p>}
          endMessage={<p>모든 데이터를 불러왔습니다.</p>}
        >
          <div className="cashbook-expense-list">
            {expenses.map((expense, index, array) => {
              const currentDate = new Date(
                expense.expenseDate
              ).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                weekday: "short",
              });

              const previousDate =
                index > 0
                  ? new Date(array[index - 1].expenseDate).toLocaleDateString(
                      "ko-KR",
                      {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        weekday: "short",
                      }
                    )
                  : null;

              const shouldShowDateHeader = currentDate !== previousDate; // <=============수정: 날짜 헤더 표시 조건 추가

              return (
                <div key={expense.expenseId}>
                  {shouldShowDateHeader && (
                    <div className="mb-3">
                      <hr className="custom-hr" />
                      <h3 className="cashbook-date-header">{currentDate}</h3>
                    </div>
                  )}{" "}
                  {/* <=============수정: 날짜 헤더 조건부 렌더링 */}
                  <div
                    className="cashbook-expense-card"
                    onClick={() => handleExpenseClick(expense.expenseId)}
                  >
                    <div className="cashbook-expense-left">
                      <div className="cashbook-expense-date">
                        <strong>
                          {new Date(expense.expenseDate).toLocaleDateString(
                            "ko-KR",
                            {
                              month: "2-digit",
                              day: "2-digit",
                              weekday: "short",
                            }
                          )}
                        </strong>
                        <span>
                          {new Date(expense.expenseDate).toLocaleTimeString(
                            "ko-KR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            }
                          )}
                        </span>
                      </div>
                      <div className="cashbook-expense-category">
                        {categoryIcons[expense.expenseCategory]}{" "}
                        {expense.expenseCategory}
                      </div>
                    </div>

                    <div className="cashbook-expense-center">
                      {expense.expenseContent}
                    </div>

                    <div className="cashbook-expense-right">
                      <span className="cashbook-expense-amount">
                        {formatAmount(expense.amount)}
                      </span>
                      <div className="cashbook-expense-payment">
                        {expense.paymentOption}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </InfiniteScroll>
      )}

      <AddExpenseLog
        isOpen={isDrawerOpen} // CashbookMain.js에서 관리: 드로어가 열렸는지 여부를 제어하는 상태
        onClose={() => setIsDrawerOpen(false)} // CashbookMain.js에서 관리: 드로어를 닫는 함수. 드로어 닫기 동작을 호출하는 역할
        onAddExpense={handleNewExpense}
        selectedData={selectedExpense} // 선택된 지출 항목의 데이터를 전달. 수정 시 해당 데이터를 폼에 미리 채우는 데 사용
        handleSaveExpense={() => {
          setExpenses([]); // 지출 목록 초기화
          setCurrentPage(0); // 페이지 번호 초기화 (첫 페이지부터 다시 로드)
          setHasMore(true); // 더 가져올 데이터가 있음을 초기화
          fetchExpenses(0); // 첫 페이지 데이터를 새로 가져옴
        }}
      />
      {/* 상세 보기용 GetExpenseLog */}
      <GetExpenseLog
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)} // 닫기 함수 전달
        expenseId={selectedExpenseId}
        expense={selectedExpense}
        onUpdate={handleUpdate}
      />
    </div>
  );
};

export default GetExpensesLog;
