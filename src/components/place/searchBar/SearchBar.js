import React from "react";
import "../../../styles/SearchBar.css"; // 검색 바 스타일 파일 (선택사항)

const SearchBar = ({ placeholder = "검색어를 입력하세요", onSearch, onInputClick }) => {

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        readOnly // 입력 필드를 읽기 전용으로 설정
        onClick={onInputClick} // 입력 필드 클릭 시 핸들러 호출
      />
      <button onClick={onSearch}>🔍</button>
    </div>
  );
};

export default SearchBar;
