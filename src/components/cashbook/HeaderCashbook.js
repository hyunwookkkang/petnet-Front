import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MonthCalendar } from "@mui/x-date-pickers/MonthCalendar";
import dayjs from "dayjs";
import "../../styles/cashbook/HeaderCashbook.css";
import { PlayArrow } from "@mui/icons-material";
import KeyboardDoubleArrowDownSharpIcon from "@mui/icons-material/KeyboardDoubleArrowDownSharp";
import { Link } from "react-router-dom";
import "dayjs/locale/ko";
import SearchIcon from "@mui/icons-material/Search";

const HeaderCashbook = ({ currentYear, currentMonth, setYear, setMonth }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    dayjs(`${currentYear}-${currentMonth}-01`)
  ); // 초기 날짜 설정

  useEffect(() => {
    setSelectedDate(dayjs(`${currentYear}-${currentMonth}-01`)); // year, month 변경 시 업데이트
  }, [currentYear, currentMonth]);

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  // 이전 연도로 이동
  const handlePrevYear = () => {
    setYear((prevYear) => prevYear - 1);
  };

  // 다음 연도로 이동
  const handleNextYear = () => {
    setYear((prevYear) => prevYear + 1);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setYear((prevYear) => prevYear - 1);
      setMonth(12);
    } else {
      setMonth((prevMonth) => prevMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setYear((prevYear) => prevYear + 1);
      setMonth(1);
    } else {
      setMonth((prevMonth) => prevMonth + 1);
    }
  };

  return (
    <div className="header-cashbook">
      <div className="cashbook-header-row">
        <button className="cashbook-nav-btn" onClick={handlePrevMonth}>
          <PlayArrow style={{ transform: "scaleX(-1)" }} />
        </button>
        <div className="cashbook-title-section">
          <span>
            {currentYear}년 {currentMonth}월
          </span>
          <button className="cashbook-dropdown-btn" onClick={toggleDatePicker}>
            <KeyboardDoubleArrowDownSharpIcon />
          </button>
        </div>
        <button className="cashbook-nav-btn" onClick={handleNextMonth}>
          <PlayArrow />
        </button>
        <button className="cashbook-search-search">
          <Link to="/SearchExpenses">
            <SearchIcon />
          </Link>
        </button>
      </div>

      <div className="cashbook-navigation-menu">
        <button className="cashbook-nav-btn">
          <Link to="/cashbook">일일</Link>
        </button>

        <button className="cashbook-nav-btn">
          <Link to="/GetCalendarsDashboard">달력</Link>
        </button>

        <button className="cashbook-nav-btn">
          <Link to="/GetstatisticsDashboards">통계</Link>
        </button>

        <button className="cashbook-nav-btn">
          <Link to="/GetBudgets">예산</Link>
        </button>
      </div>

      {showDatePicker && (
        <div className="cashbook-modal">
          <div className="cashbook-modal-content">
            <span className="cashbook-header-close" onClick={toggleDatePicker}>
              &times;
            </span>
            {/* 연도 네비게이션 */}
            <div className="cashbook-year-nav">
              <button onClick={handlePrevYear}>◀</button>
              <span>{currentYear}</span>
              <button onClick={handleNextYear}>▶</button>
            </div>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <MonthCalendar
                value={selectedDate}
                onChange={(newDate) => {
                  setSelectedDate(newDate);
                  setYear(newDate.year());
                  setMonth(newDate.month() + 1); // MonthCalendar는 0부터 시작
                  toggleDatePicker();
                }}
              />
            </LocalizationProvider>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderCashbook;
