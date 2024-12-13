import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { Button } from "react-bootstrap";
import "../../../styles/Navigation.css";
import "../../../styles/common/Button.css";
import CommonModal from "../modal/CommonModal";

//NavBarIcons
import HomeIcon from '@mui/icons-material/Home';  // home
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';  //commu
import MapIcon from '@mui/icons-material/Map';  //map
import StorefrontIcon from '@mui/icons-material/Storefront';  //store
import PersonIcon from '@mui/icons-material/Person'; //MY
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';  //admin




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
          <div style={{ textAlign: "center" }}>
              <HomeIcon style={{ fontSize: "24px" }} /> 
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                홈
              </div> 
          </div>
        </NavLink>
        <NavLink
          to="/community"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          <div style={{ textAlign: "center" }}>
              <LocalLibraryIcon style={{ fontSize: "24px" }} /> 
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                커뮤니티
              </div> 
            </div>
        </NavLink>
        <NavLink
          to="/map-main"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          <div style={{ textAlign: "center" }}>
              <MapIcon style={{ fontSize: "24px" }} /> 
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                지도
              </div>
            </div>
        </NavLink>
        <NavLink
          to="/shop/products"
          className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
        >
          <div style={{ textAlign: "center" }}>
              <StorefrontIcon style={{ fontSize: "24px" }} /> 
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                상점
              </div>
          </div>
        </NavLink>

        {userRole === "2" || userRole === null ? (
          <span
            className="nav-item"
            onClick={handleMyClick} // 클릭 이벤트로 경고 처리
            style={{ cursor: "pointer" }}
          >
            <div style={{ textAlign: "center" }}>
              <PersonIcon style={{ fontSize: "24px" }} /> 
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                MY
              </div> 
            </div>
          </span>
        ) : userRole === "0" || userRole === "1" ? (
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            <div style={{ textAlign: "center" }}>
              <AdminPanelSettingsIcon style={{ fontSize: "24px" }} /> 
              <div style={{ fontSize: "12px", marginTop: "4px" }}>
                관리자
              </div> 
            </div>
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
    </>
  );
}

export default Navigation;
