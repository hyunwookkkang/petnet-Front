import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { Button } from "react-bootstrap";
import "../../../styles/Navigation.css";
import "../../../styles/common/Button.css";
import CommonModal from "../modal/CommonModal";

function Navigation() {
  const { userId, userRole } = useUser(); // userId와 userRole 가져오기
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = React.useState(false);

  const handleMyClick = () => {
    if (!userId || userRole !== "2") {
      setShowAlert(true); // 경고창 띄우기
    } else {
      navigate("/my"); // MY 페이지로 이동
    }
  };

  return (
    <>
      <nav className="navigation">
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          홈
        </NavLink>
        <NavLink
          to="/community"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          커뮤니티
        </NavLink>
        <NavLink
          to="/map-main"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          지도
        </NavLink>
        <NavLink
          to="/shop/products"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          상점
        </NavLink>

        {userRole === "2" || userRole === null ? (
          <span
            className="nav-item"
            onClick={handleMyClick} // 클릭 이벤트로 경고 처리
            style={{ cursor: "pointer" }}
          >
            MY
          </span>
        ) : userRole === "0" || userRole === "1" ? (
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            관리자
          </NavLink>
        ) : null}
      </nav>

      <CommonModal
        show = {showAlert} 
        onHide = {() => setShowAlert(false)}
        title = "로그인 필요"
        body = {<div>
                로그인이 필요한 서비스입니다.<br/> 로그인 화면으로 이동합니다.
              </div>}
        footer = {
          <Button
            className="modal-button"
            style={{backgroundColor: "#feb98e", border: "none"}}
            onClick={() => {
              setShowAlert(false);
              navigate("/login");
            }}
          >
            확인
          </Button>
        }
      />

      {/* 경고창 모달 */}
      {/* <Modal show={showAlert} onHide={() => setShowAlert(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>로그인 필요</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다.
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{
              backgroundColor: "#feb98e",
              border: "none",
              color: "white",
              fontWeight: "bold",
              padding: "10px 20px",
              borderRadius: "5px",
            }}
            onClick={() => {
              setShowAlert(false);
              navigate("/login"); // 로그인 화면으로 이동
            }}
          >
            확인
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
}

export default Navigation;
