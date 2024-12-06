import React from "react";
import "../../../styles/SearchBar.css"; // 검색 바 스타일 파일 (선택사항)

const SearchBar = ({ placeholder = "검색어를 입력하세요", onSearch }) => {
  const handleSearchClick = () => {
    if (onSearch) {
      onSearch(); // 검색 버튼 클릭 시 부모 컴포넌트에 콜백 전달
    }
  };

  return (
    <div className="search-bar">
      <input type="text" placeholder={placeholder} />
      <button onClick={handleSearchClick}>🔍</button>
    </div>
  );
};

export default SearchBar;
