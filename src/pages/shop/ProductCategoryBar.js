import React from "react";
import { NavLink } from "react-router-dom"; // NavLink 사용
import "../../styles/Navigation.css";

function ProductCategoryBar() {
  return (
    <nav className="product-category-bar">
      <NavLink to="/" className={({ isActive }) => (isActive ? "nav-item active" : "product-category-item")}>
        홈
      </NavLink>
      <NavLink to="/community" className={({ isActive }) => (isActive ? "nav-item active" : "product-category-item")}>
        커뮤니티
      </NavLink>
      <NavLink to="/map-main" className={({ isActive }) => (isActive ? "nav-item active" : "product-category-item")}>
        지도
      </NavLink>
      <NavLink to="/shop" className={({ isActive }) => (isActive ? "nav-item active" : "product-category-item")}>
        상점
      </NavLink>

      <NavLink to="/my" className={({ isActive }) => (isActive ? "nav-item active" : "product-category-item")}>
        MY
      </NavLink>
      <NavLink to="/admin" className={({ isActive }) => (isActive ? "nav-item active" : "product-category-item")}>
        admin
      </NavLink>
       {/* userRole에 따라 다른 메뉴 표시 */}
      {/* {userRole === 2 ? (
        <NavLink to="/my" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          MY
        </NavLink>
        ) : (
        <NavLink to="/admin" className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}>
          관리자
        </NavLink>
      )} */}
    </nav>
  );
}

export default ProductCategoryBar;
