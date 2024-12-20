import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBowlFood,
  faBone,
  faBath,
  faPumpMedical,
  faScissors,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHospital } from "@fortawesome/free-regular-svg-icons";
import { faWalking } from "@fortawesome/free-solid-svg-icons"; // 산책용품 아이콘 추가
import { faFutbol } from "@fortawesome/free-regular-svg-icons"; // 장난감 아이콘 추가

const ExpenseCategoryDropdown = ({ onSelect, selectedValue }) => {
  const [isExpenseDropDownOpen, setIsExpenseDropDownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    {
      value: "사료",
      label: "사료",
      icon: <FontAwesomeIcon icon={faBowlFood} />,
    },
    { value: "간식", label: "간식", icon: <FontAwesomeIcon icon={faBone} /> },
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
    { value: "의류", label: "의류", icon: <FontAwesomeIcon icon={faHeart} /> },
    {
      value: "미용용품",
      label: "미용용품",
      icon: <FontAwesomeIcon icon={faBath} />,
    },
    {
      value: "위생용품",
      label: "위생용품",
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
    { value: "기타", label: "기타", icon: <FontAwesomeIcon icon={faHeart} /> },
  ];

  // 초기값에 맞는 옵션 찾기
  const findInitialOption = () =>
    options.find((option) => option.value === selectedValue) || {
      label: "카테고리를 선택하세요",
      icon: null,
    };

  const [selected, setSelected] = useState(findInitialOption());

  // 초기값 변경 시 상태 업데이트
  useEffect(() => {
    setSelected(findInitialOption());
  }, [selectedValue]);

  const handleSelect = (option) => {
    setSelected(option);
    setIsExpenseDropDownOpen(false);
    onSelect(option.value);
  };

  // 바깥 클릭 감지
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsExpenseDropDownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
      <label>지출 카테고리</label>
      <div
        onClick={() => setIsExpenseDropDownOpen((prev) => !prev)}
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

      {isExpenseDropDownOpen && (
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

export default ExpenseCategoryDropdown;
