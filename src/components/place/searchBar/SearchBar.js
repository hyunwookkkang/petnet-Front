import React, { useState } from "react";
import "../../../styles/SearchBar.css"; // 검색 바 스타일 파일 (선택사항)

const SearchBar = ({ placeholder = "검색어를 입력하세요", onSearch }) => {
  const [searchValue, setSearchValue] = useState(""); // 검색어 상태

  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(searchValue); // 입력된 검색어를 부모 컴포넌트에 전달
    }
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value); // 입력값 업데이트
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={handleInputChange} // 입력값 변경 시 상태 업데이트
      />
      <button onClick={handleSearchClick}>🔍</button>
    </div>
  );
};

export default SearchBar;
