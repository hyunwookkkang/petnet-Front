import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateTimeInput.css";

Modal.setAppElement("#root");

const DateTimeInput = () => {
  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return {
      hour: String(hours).padStart(2, "0"),
      minute: minutes,
      ampm: ampm,
    };
  };

  const currentTime = getCurrentTime();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(
    `${currentTime.hour}:${currentTime.minute} ${currentTime.ampm}`
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempTime, setTempTime] = useState(currentTime);

  const handleTimeUpdate = () => {
    const { hour, minute, ampm } = tempTime;
    setSelectedTime(`${hour}:${minute} ${ampm}`);
    setIsModalOpen(false);
  };

  return (
    <div className="datetime-container">
      <div className="datetime-input">
        <label className="datetime-label">날짜</label>
        <div className="datetime-field">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yy-MM-dd"
            className="datetime-picker"
          />
        </div>
      </div>

      <div className="datetime-input">
        <label className="datetime-label">시간</label>
        <div className="datetime-field" onClick={() => setIsModalOpen(true)}>
          <span>{selectedTime}</span>
        </div>
      </div>

      {isModalOpen && (
        <div className="time-modal">
          <div className="time-modal-header">
            <h2>Set Time</h2>
            <button
              className="close-button"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
          </div>
          <div className="time-modal-body">
            {/* 시간, 분, AM/PM 필드 */}
            <div className="time-fields">
              <select
                className="time-select"
                value={tempTime.hour}
                onChange={(e) =>
                  setTempTime({ ...tempTime, hour: e.target.value })
                }
              >
                {Array.from({ length: 12 }, (_, i) => {
                  const hour = String(i + 1).padStart(2, "0");
                  return <option key={hour}>{hour}</option>;
                })}
              </select>
              <span>:</span>
              <select
                className="time-select"
                value={tempTime.minute}
                onChange={(e) =>
                  setTempTime({ ...tempTime, minute: e.target.value })
                }
              >
                {Array.from({ length: 60 }, (_, i) => {
                  const minute = String(i).padStart(2, "0");
                  return <option key={minute}>{minute}</option>;
                })}
              </select>
              <select
                className="time-select"
                value={tempTime.ampm}
                onChange={(e) =>
                  setTempTime({ ...tempTime, ampm: e.target.value })
                }
              >
                <option>AM</option>
                <option>PM</option>
              </select>
            </div>

            {/* Done 버튼 */}
            <div className="done-container">
              <button onClick={handleTimeUpdate} className="done-button">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimeInput;
