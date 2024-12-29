import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../../components/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import "../../styles/cashbook/SearchExpenses.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDog,
  faCat,
  faBowlFood,
  faBone,
  faBath,
  faPumpMedical,
  faScissors,
  faHeart,
  faHospital,
  faWalking,
  faFutbol,
  faCreditCard,
  faMobile,
  faMoneyBill1,
} from "@fortawesome/free-solid-svg-icons";

const SearchExpenses = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [animalCategory, setAnimalCategory] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [paymentOption, setPaymentOption] = useState("");
  const [results, setResults] = useState([]); // 검색 결과
  const [totalExpense, setTotalExpense] = useState(0); // 총 지출 금액
  const [searching, setSearching] = useState(false); // 검색 진행 상태

  const { userId } = useUser();
  const navigate = useNavigate();

  const handleSearch = async () => {
    setSearching(true);
    try {
      const searchResponse = await fetch(
        "/api/cashbook/expense/searchExpensesLog",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            startDate,
            endDate,
            animalCategory,
            expenseCategory,
            paymentOption,
          }),
        }
      );

      if (!searchResponse.ok)
        throw new Error("검색 결과를 불러오지 못했습니다.");

      const searchData = await searchResponse.json();
      setResults(searchData.expenses || []);
      if (searchData.expenses?.length === 0) {
        setTotalExpense(0);
        return;
      }

      const totalAmountResponse = await fetch(
        "/api/cashbook/expense/getTotalAmount",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            startDate,
            endDate,
            animalCategory,
            expenseCategory,
            paymentOption,
          }),
        }
      );

      if (!totalAmountResponse.ok)
        throw new Error("총 지출 금액을 불러오지 못했습니다.");

      const totalAmount = await totalAmountResponse.json();
      setTotalExpense(totalAmount);
    } catch (error) {
      console.error("검색 중 오류 발생:", error);
    } finally {
      setSearching(false);
    }
  };

  const Dropdown = ({ label, options, selectedValue, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const findInitialOption = () =>
      options.find((option) => option.value === selectedValue) || {
        label: "카테고리를 선택하세요",
        icon: null,
      };

    const [selected, setSelected] = useState(findInitialOption());

    useEffect(() => {
      setSelected(findInitialOption());
    }, [selectedValue]);

    const handleSelect = (option) => {
      setSelected(option);
      setIsOpen(false);
      onSelect(option.value);
    };

    useEffect(() => {
      const handleOutsideClick = (event) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleOutsideClick);
      return () => {
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }, []);

    return (
      <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
        <label>{label}</label>
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          style={{
            border: "1px solid #ccc",
            padding: "8px",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {selected.icon && (
              <span style={{ marginRight: "8px" }}>{selected.icon}</span>
            )}
            {selected.label}
          </div>
          <span>▼</span>
        </div>

        {isOpen && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              border: "1px solid #ccc",
              backgroundColor: "#fff",
              zIndex: 10,
            }}
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option)}
                style={{
                  padding: "8px",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <span style={{ marginRight: "8px" }}>{option.icon}</span>
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="cashbook-search-expenses-container">
      <div className="cashbook-search-date-picker-sections">
        <div className="cashbook-search-date-picker">
          <label>시작 날짜</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="연도-월-일"
            className="cashbook-datepicker-input"
            popperPlacement="bottom-start"
          />
        </div>

        <div className="cashbook-search-date-picker">
          <label>종료 날짜</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy-MM-dd"
            placeholderText="연도-월-일"
            className="cashbook-datepicker-input"
            popperPlacement="bottom-start"
          />
        </div>
      </div>

      <div className="cashbook-search-animalDropdown">
        <Dropdown
          label="동물 카테고리"
          options={[
            {
              value: "강아지",
              label: "강아지",
              icon: <FontAwesomeIcon icon={faDog} />,
            },
            {
              value: "고양이",
              label: "고양이",
              icon: <FontAwesomeIcon icon={faCat} />,
            },
          ]}
          selectedValue={animalCategory}
          onSelect={setAnimalCategory}
        />
      </div>

      <div className="cashbook-search-animalDropdown">
        <Dropdown
          label="지출 카테고리"
          options={[
            {
              value: "사료",
              label: "사료",
              icon: <FontAwesomeIcon icon={faBowlFood} />,
            },
            {
              value: "간식",
              label: "간식",
              icon: <FontAwesomeIcon icon={faBone} />,
            },
            {
              value: "장난감",
              label: "장난감",
              icon: <FontAwesomeIcon icon={faFutbol} />,
            },
            {
              value: "산책용품",
              label: "산책용품",
              icon: <FontAwesomeIcon icon={faWalking} />,
            },
            {
              value: "의류",
              label: "의류",
              icon: <FontAwesomeIcon icon={faHeart} />,
            },
            {
              value: "미용용퓸",
              label: "미용용퓸",
              icon: <FontAwesomeIcon icon={faBath} />,
            },
            {
              value: "위생용퓸",
              label: "위생용퓸",
              icon: <FontAwesomeIcon icon={faPumpMedical} />,
            },
            {
              value: "병원비",
              label: "병원비",
              icon: <FontAwesomeIcon icon={faHospital} />,
            },
            {
              value: "미용비",
              label: "미용비",
              icon: <FontAwesomeIcon icon={faScissors} />,
            },
            {
              value: "기타",
              label: "기타",
              icon: <FontAwesomeIcon icon={faHeart} />,
            },
          ]}
          selectedValue={expenseCategory}
          onSelect={setExpenseCategory}
        />
      </div>
      <div className="cashbook-search-animalDropdown">
        <Dropdown
          label="결제 수단"
          options={[
            {
              value: "카드결제",
              label: "카드결제",
              icon: <FontAwesomeIcon icon={faCreditCard} />,
            },
            {
              value: "간편결제",
              label: "간편결제",
              icon: <FontAwesomeIcon icon={faMobile} />,
            },
            {
              value: "현금",
              label: "현금",
              icon: <FontAwesomeIcon icon={faMoneyBill1} />,
            },
          ]}
          selectedValue={paymentOption}
          onSelect={setPaymentOption}
        />
      </div>
      <button className="cashbook-searches-button" onClick={handleSearch}>
        검 색
      </button>

      {searching ? (
        <div className="cashbook-search-status">검색 중...</div>
      ) : (
        <>
          <div className="cashbook-search-total-expense">
            총 지출 금액: {totalExpense.toLocaleString()} 원
          </div>

          <div className="cashbook-results-section">
            {results.length > 0 ? (
              results.map((expense) => (
                <div key={expense.expenseId} className="cashbook-expense-card">
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
                      {expense.expenseCategory}
                    </div>
                  </div>
                  <div className="cashbook-expense-center">
                    {expense.expenseContent}
                  </div>
                  <div className="cashbook-expense-right">
                    <span className="cashbook-expense-amount">
                      ₩ {expense.amount.toLocaleString()}
                    </span>
                    <div className="cashbook-expense-payment">
                      {expense.paymentOption}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div>검색된 결과가 없습니다.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchExpenses;
