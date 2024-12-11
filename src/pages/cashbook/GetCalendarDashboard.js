import React, { useState } from "react";
import GetCalendarDashboardSlide from "./GetCalendarDashboardSlide";

// 테스트 함수
function testGetCalendarDashboard({ selectedDate, expenses, onClose }) {
  console.log("슬라이드 컴포넌트 렌더링"); // 슬라이드 렌더링 확인
  console.log("선택된 날짜:", selectedDate); // 선택된 날짜 확인
  console.log("지출 데이터:", expenses); // 지출 데이터 확인
}

function GetCalendarDashboard() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [expenses, setExpenses] = useState([]);

  const openDrawer = async (date) => {
    console.log("날짜 클릭:", date);
    setSelectedDate(date);
    setIsDrawerOpen(true);
    console.log("isDrawerOpen 상태:", isDrawerOpen);

    const fetchExpensesForDate = async (date) => {
      try {
        const response = await fetch(
          `/api/cashbook/expense/user05/${date}/getCalendarDashboard` // 여기서 date를 직접 사용
        );
        if (!response.ok) {
          throw new Error("데이터를 불러오는데 실패했습니다.");
        }
        const data = await response.json();
        console.log("가져온 데이터:", data); // 데이터 확인
        setExpenses(data);
        setIsDrawerOpen(true); // 슬라이드 열기
      } catch (error) {
        console.error("Fetch 에러:", error.message);
        setExpenses([]);
      }
    };
  };
  return (
    <div>
      {/* 달력 (클릭 이벤트 예제) */}
      <div className="calendar">
        <button onClick={() => openDrawer("2024-11-12")}>2024-11-12</button>
        <button onClick={() => openDrawer("2024-11-23")}>2024-11-23</button>
      </div>

      {/* 슬라이드 창 */}
      {isDrawerOpen && (
        <>
          {console.log("슬라이드 렌더링 조건 통과")}
          {testGetCalendarDashboard({
            selectedDate,
            expenses,
            onClose: () => setIsDrawerOpen(false),
          })}
          <GetCalendarDashboardSlide
            selectedDate={selectedDate}
            expenses={expenses}
            onClose={() => setIsDrawerOpen(false)}
          />
        </>
      )}
    </div>
  );
}

export default GetCalendarDashboard;
