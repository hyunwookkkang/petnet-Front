import React, { useState, useEffect } from "react"; // useCallback 제거
import "../../styles/cashbook/GetExpensesLog.css";
import SlideDrawers from "../../components/cashbook/SlideDrawers";
import SlideDrawer from "../../components/cashbook/SlideDrawer";
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

const GetExpensesLog = ({ year, month }) => {
  const navigate = useNavigate();
  const { userId } = useUser();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [expenses, setExpenses] = useState([]); // 지출 목록
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [monthlyTotal, setMonthlyTotal] = useState(0); // 월간 총액

  // 상세보기용 드로어 열림/닫힘 상태
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // 등록용 드로어 열림/닫힘 상태
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  // 펫넷 상점 로딩용 드로어 열림/닫힘 상태
  const [isShopDrawerOpen, setIsShopDrawerOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [newExpense, setNewExpense] = useState(null); // 새로 추가된 지출 데이터
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지 번호
  const [error, setError] = useState(null); // 에러 상태

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

  const categoryIcons = {
    사료: <FontAwesomeIcon icon={faBowlFood} />,
    간식: <FontAwesomeIcon icon={faBone} />,
    장난감: <FontAwesomeIcon icon={faPaw} />,
    산책용품: <FontAwesomeIcon icon={faDog} />,
    의류: <FontAwesomeIcon icon={faPaw} />,
    미용용품: <FontAwesomeIcon icon={faBath} />,
    병원비: <FontAwesomeIcon icon={faHospital} />,
    미용비: <FontAwesomeIcon icon={faScissors} />,
    기타: <FontAwesomeIcon icon={faHeart} />,
  };

  // 현재 지출 데이터 로그
  useEffect(() => {
    console.log("현재 지출 데이터:", expenses);
  }, [expenses]);

  // hasMore 상태 로그
  useEffect(() => {
    console.log("hasMore 상태:", hasMore);
  }, [hasMore]);

  // 지출 목록 및 월간 총액을 가져오는 함수
  const fetchExpenses = async (page) => {
    console.log("Fetching expenses...");
    if (!userId || loading || !hasMore) return; // 이미 로딩 중이거나 더 이상 데이터가 없으면 중단
    setLoading(true); // 로딩 시작

    try {
      const response = await fetch(
        `/api/cashbook/expense/getExpensesLog/${userId}/${year}/${month}/${page}/10`
      );
      console.log("fetchExpenses 응답:", response);

      if (!response.ok) {
        throw new Error(`지출 목록 로드 실패: ${response.status}`);
      }

      const data = await response.json();
      console.log("지출 목록 데이터:", data);

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
          setHasMore(false); // 추가 데이터가 없을 경우
        } else {
          setCurrentPage(page + 1); // 다음 페이지 번호 설정
        }
      } else {
        console.log("더 이상 데이터가 없습니다.");
        setHasMore(false); // 더 이상 데이터가 없을 경우
      }

      const totalResponse = await fetch(
        `/api/cashbook/expense/${userId}/${year}/${month}/getMonthlyTotalExpense`
      );
      console.log("getMonthlyTotalExpense 응답:", totalResponse);
      if (!totalResponse.ok) {
        throw new Error(`월간 총액 로드 실패: ${totalResponse.status}`);
      }
      const totalData = await totalResponse.json();
      console.log("월간 총액 데이터:", totalData);
      setMonthlyTotal(totalData);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // 초기 데이터 로드 및 연도/월 변경 시 데이터 리셋
  useEffect(() => {
    console.log("year or month changed:", year, month); // 변경된 연도와 월 로그
    if (userId) {
      setExpenses([]); // 기존 데이터 초기화
      setCurrentPage(0); // 페이지 번호 초기화
      setHasMore(true); // 추가 데이터 로드 가능 상태 초기화
      fetchExpenses(0); // 첫 페이지 데이터 로드
    }
  }, [userId, year, month]); // year와 month가 변경될 때마다 실행

  // 새로운 지출 데이터 추가 시 상태 업데이트
  useEffect(() => {
    if (newExpense) {
      setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
      setMonthlyTotal((prevTotal) => prevTotal + Number(newExpense.amount));
    }
  }, [newExpense]);

  // 새 지출 데이터를 추가하는 함수
  const handleNewExpense = (expense) => {
    console.log("handleNewExpense 호출됨, newExpense:", expense);
    setNewExpense(expense); // 새로운 지출 데이터를 상태에 설정
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

  // 드로어 닫기 함수
  const handleSlideClose = () => {
    setIsDrawerOpen(false);
    setSelectedExpense(null);
  };

  // 금액 포맷 함수
  const formatAmount = (amount) => `${amount.toLocaleString()} 원`; // toLocaleString(): 천단위 구분자 삽입

  return (
    <div>
      <div className="cashbook-monthly-total">
        <h2>
          월간 지출 총액:{" "}
          <span style={{ color: "#FF6347  " }}>
            {formatAmount(monthlyTotal)}
          </span>
        </h2>
      </div>

      {loading && expenses.length === 0 ? ( // 초기 로딩 상태 확인
        <p>로딩 중...</p>
      ) : (
        <InfiniteScroll
          dataLength={expenses.length} // 현재까지 로드된 데이터 개수
          next={() => fetchExpenses(currentPage)} // 다음 페이지 데이터를 로드
          hasMore={hasMore} // 추가 데이터가 더 있는지 여부 (true로 초기 설정)
          loader={<h4>Loading....</h4>} // 로딩 중 표시
          endMessage={
            <p style={{ textAlign: "center" }}>모든 데이터를 불러왔습니다.</p>
          } // 데이터가 모두 로드된 경우
        >
          <div className="cashbook-expense-list">
            {expenses.map((expense, index) => {
              // 현재 항목의 날짜
              const currentDate = new Date(
                expense.expenseDate
              ).toLocaleDateString();
              // 이전 항목의 날짜
              const previousDate =
                index > 0
                  ? new Date(
                      expenses[index - 1].expenseDate
                    ).toLocaleDateString()
                  : null;

              return (
                <div key={`${expense.expenseId}-${index}`}>
                  {/* 날짜가 변경될 때마다 날짜 헤더와 <hr /> 삽입 */}
                  {currentDate !== previousDate && (
                    <div>
                      <hr />
                      <h3 className="cashbook-date-header">
                        {new Date(expense.expenseDate).toLocaleDateString(
                          "ko-KR",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            weekday: "short", // 요일 추가 (예: 일, 월, 화)
                          }
                        )}
                      </h3>
                    </div>
                  )}

                  <div
                    className="cashbook-expense-card"
                    onClick={() => handleExpenseClick(expense.expenseId)} // 클릭 시 상세보기
                  >
                    {/* 왼쪽 영역 */}
                    <div className="cashbook-expense-left">
                      <div className="cashbook-expense-date">
                        <strong>
                          {new Date(expense.expenseDate).toLocaleDateString(
                            "ko-KR",
                            {
                              month: "2-digit",
                              day: "2-digit",
                              weekday: "short", // 요일 추가
                            }
                          )}
                        </strong>
                        {/* 시간 표시 부분 */}
                        <span>
                          {new Date(expense.expenseDate).toLocaleTimeString(
                            "ko-KR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false, // 24시간 형식
                            }
                          )}
                        </span>
                      </div>
                      <div className="cashbook-expense-category">
                        {categoryIcons[expense.expenseCategory]}{" "}
                        {expense.expenseCategory}
                      </div>
                    </div>

                    {/* 가운데 영역 */}
                    <div className="cashbook-expense-center">
                      {expense.expenseContent}
                    </div>

                    {/* 오른쪽 영역 */}
                    <div className="cashbook-expense-right">
                      <span className="cashbook-expense-amount">
                        {formatAmount(expense.amount)}
                      </span>
                      <div className="cashbook-expense-payment">
                        {expense.paymentOption}
                      </div>{" "}
                      {/* 결제수단을 금액 밑으로 이동 */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </InfiniteScroll>
      )}

      {/* 상세 보기용 SlideDrawers */}
      <SlideDrawers
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)} // 닫기 함수 전달
        expenseId={selectedExpenseId}
        expense={selectedExpense}
        onUpdate={() => {
          // 상세 수정 후 목록 재갱신
          setExpenses([]);
          setCurrentPage(0);
          setHasMore(true);
          fetchExpenses(0);
        }}
      />

      {/* 등록용 SlideDrawer */}
      <SlideDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        onAddExpense={handleNewExpense} // 등록 완료 시 바로 로컬 상태에 반영
        handleSaveExpense={() => {
          setExpenses([]);
          setCurrentPage(0);
          setHasMore(true);
          fetchExpenses(0);
        }}
      />
      <SlideDrawer
        isOpen={isShopDrawerOpen}
        onClose={() => setIsShopDrawerOpen(false)}
        onSelectPurchase={(purchase) => {
          // purchase 선택 처리 로직 필요시 작성
          // 필요하다면 이곳에서 handleUpdate 또는 fetchExpenses를 호출
          setIsShopDrawerOpen(false);
        }}
      />
    </div>
  );
};

export default GetExpensesLog;
