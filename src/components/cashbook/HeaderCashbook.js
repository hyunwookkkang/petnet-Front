import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MonthCalendar } from "@mui/x-date-pickers/MonthCalendar";
import dayjs from "dayjs";
import "./HeaderCashbook.css";
import { PlayArrow } from "@mui/icons-material";
import KeyboardDoubleArrowDownSharpIcon from "@mui/icons-material/KeyboardDoubleArrowDownSharp";
import { Link } from "react-router-dom";
import "dayjs/locale/ko";
import SearchIcon from "@mui/icons-material/Search";

const HeaderCashbook = ({ currentYear, currentMonth, setYear, setMonth }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
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
      <div className="header-row">
        <button className="nav-btn" onClick={handlePrevMonth}>
          <PlayArrow style={{ transform: "scaleX(-1)" }} />
        </button>
        <div className="title-section">
          <span>
            {currentYear}년 {currentMonth}월
          </span>
          <button className="dropdown-btn" onClick={toggleDatePicker}>
            <KeyboardDoubleArrowDownSharpIcon />
          </button>
        </div>
        <button className="nav-btn" onClick={handleNextMonth}>
          <PlayArrow />
        </button>
        <button className="search-search">
          <Link to="/SearchExpenses">
            <SearchIcon />
          </Link>
        </button>
      </div>

      <div className="navigation-menu">
        <button className="nav-btn">
          <Link to="/cashbook">일일</Link>
        </button>

        <button className="nav-btn">
          <Link to="/GetCalendarsDashboard">달력</Link>
        </button>

        <button className="nav-btn">
          <Link to="/GetstatisticsDashboards">통계</Link>
        </button>

        <button>예산</button>
      </div>

      {showDatePicker && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleDatePicker}>
              &times;
            </span>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
              <MonthCalendar
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
