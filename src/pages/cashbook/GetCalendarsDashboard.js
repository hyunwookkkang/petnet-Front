import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import HeaderCashbook from "../../components/cashbook/HeaderCashbook";
import GetCalendarDashboardSlide from "./GetCalendarDashboardSlide"; // 슬라이드 컴포넌트 가져오기
import "../../styles/cashbook/GetCalendarsDashboard.css";
import koLocale from "@fullcalendar/core/locales/ko"; // 한국어 가져오기

import { useUser } from "../../components/contexts/UserContext";
import { useNavigate } from "react-router-dom";

const Calendar = () => {
  const [year, setYear] = useState(new Date().getFullYear()); // 현재 연도로 초기화
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 현재 월로 초기화
  //const [userId] = useState("user05"); // 현재 로그인된 사용자 ID (테스트용)
  const [events, setEvents] = useState([]); // FullCalendar에 표시할 이벤트
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // 슬라이드 상태 관리
  const [selectedDate, setSelectedDate] = useState(""); // 선택된 날짜 저장
  const [expenses, setExpenses] = useState([]); // 선택된 날짜의 지출 데이터 저장

  const { userId } = useUser(""); // 사용자 ID 가져오기

  const navigate = useNavigate();

  useEffect(() => {
    console.log(userId);
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login"); // 로그인 페이지로 리다이렉트
      return;
    }
  }, [userId, navigate]);

  const fetchData = async () => {
    try {
      // 동적으로 API 요청 경로 구성
      const response = await fetch(
        `/api/cashbook/expense/${userId}/${year}/${month}/getCalendarsDashboard`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      // FullCalendar 이벤트 형식으로 데이터 변환
      const formattedEvents = data.map((expense) => ({
        title: `${expense.dailyTotalExpense}원`, // 금액 표시
        start: expense.expenseDate, // 쿼리의 expenseDate와 매핑
      }));
      setEvents(formattedEvents); // 이벤트 상태 업데이트
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchExpensesForDate = async (date) => {
    try {
      const response = await fetch(
        `/api/cashbook/expense/${userId}/${date}/getCalendarDashboard`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setExpenses(data); // 선택된 날짜의 지출 데이터 업데이트
      setIsDrawerOpen(true); // 슬라이드 열기
    } catch (error) {
      console.error("Error fetching expenses for date:", error);
    }
  };

  useEffect(() => {
    // 상태가 변경될 때마다 fetchData 호출
    fetchData();
  }, [year, month]);

  return (
    <div className="cashbook-calendar-container">
      <HeaderCashbook
        currentYear={year}
        currentMonth={month}
        setYear={setYear}
        setMonth={setMonth}
      />

      <FullCalendar
        className="cashbook-full-calendar"
        key={`${year}-${month}`} // 상태 변경 시 강제 리렌더링
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={false} // Fullcalendar 네비게이션 비활성화
        events={events} // FullCalendar에 표시할 이벤트
        locale={koLocale} // 한국어 설정
        initialDate={`${year}-${String(month).padStart(2, "0")}-01`} // 상태에 따라 동적으로 날짜 설정
        contentHeight="auto" /* 캘린더 내용 높이를 자동으로 조정 */
        aspectRatio={1.5} /* 캘린더 비율을 조정하여 너비 조절 */
        dateClick={(info) => {
          console.log("날짜 클릭됨:", info.dateStr); // 클릭된 날짜 확인
          setSelectedDate(info.dateStr); // 클릭된 날짜 저장
          fetchExpensesForDate(info.dateStr); // 선택된 날짜의 데이터 가져오기
        }}
      />

      {/* 슬라이드 컴포넌트 */}
      {isDrawerOpen && (
        <GetCalendarDashboardSlide
          selectedDate={selectedDate}
          expenses={expenses}
          onClose={() => setIsDrawerOpen(false)} // 닫기 핸들러
        />
      )}
    </div>
  );
};

export default Calendar;
