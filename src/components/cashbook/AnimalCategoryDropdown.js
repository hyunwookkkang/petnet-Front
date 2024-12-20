import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDog, faCat } from "@fortawesome/free-solid-svg-icons";

const AnimalCategoryDropdown = ({ onSelect, selectedValue }) => {
  const [isAnimalDropDownOpen, setIsAnimalDropDownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = [
    { value: "강아지", label: "강아지", icon: faDog },
    { value: "고양이", label: "고양이", icon: faCat },
  ];

  // 초기값 설정
  const findInitialOption = () =>
    options.find((option) => option.value === selectedValue) || {
      label: "카테고리를 선택하세요",
      icon: null,
    };

  const [selected, setSelected] = useState(findInitialOption());

  useEffect(() => {
    // selectedValue 변경 시 상태 업데이트
    setSelected(findInitialOption());
  }, [selectedValue]);

  const handleSelect = (option) => {
    setSelected(option);
    setIsAnimalDropDownOpen(false);
    onSelect(option.value);
  };

  // 바깥 클릭 감지
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsAnimalDropDownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative", width: "100%" }}>
      <label>동물 카테고리</label>
      <div
        onClick={() => setIsAnimalDropDownOpen((prev) => !prev)}
        style={{
          border: "1px solid #ccc",
          padding: "8px",
          borderRadius: "4px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {selected.icon && (
            <FontAwesomeIcon
              icon={selected.icon}
              style={{ marginRight: "8px" }}
            />
          )}
          {selected.label}
        </div>
        <span style={{ fontSize: "12px" }}>▼</span>
      </div>

      {isAnimalDropDownOpen && (
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
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon
                icon={option.icon}
                style={{ marginRight: "8px" }}
              />
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimalCategoryDropdown;
