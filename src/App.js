import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/common/Main";
import MyMainPage from "./pages/common/MyMainPage";
import AdminMainPage from "./pages/common/AdminMainPage";

import Navigation from "./components/common/navigationBar/Navigation";
import TopNavigation from "./components/common/navigationBar/TopNavigation";
import BasicSpeedDial from "./components/common/dial/BasicSpeedDial";
import UsingComponent from "./components/common/UsingComponent";

/*
  본인 메인페이지 주석 풀어서 사용하세요.
  예시 ---> import JS이름 from "./pages -> 폴더1/shop -> 폴더2/ShopMain -> js파일";
*/

// import CommunityMain from "./pages/community/CommunityMain";   //Community
// import ShopMain from "./pages/shop/ShopMain";                  //Shop
// import PointShopMain from "./pages/pointshop/PointShopMain";        //Shop
// import ShopPage from "./pages/ShopMain";                       //Shop

import Login from "./pages/user/Login";
import Singup from "./pages/user/Signup";
import UpdateUser from "./pages/user/UpdateUser";
import MapMain from "./pages/map/MapMain";
import PlaceMap from "./pages/map/place/PlaceMap";
import PlaceInfo from "./pages/map/place/PlaceInfo";



function App() {
  //const userRole = 1; // 관리자: 0 또는 1, 일반 사용자: 2

  return (
    
    <Router>
      {/* 상단 nav 고정 */}
      <TopNavigation />
      
          {/* 페이지 콘텐츠 영역에 여백을 추가해 상단/하단 네비게이션이 겹치지 않도록 처리 */}
      <div className="main-content"> {/* 여기에 여백을 추가하는 wrapper div 추가 */}
        <Routes>
          {/* 메인 페이지 */}
          <Route path="/" element={<Main />} />

          {/* START : 각자 서브기능 메인페이지 */}
          {/* <Route path="/url" element={<js파일이름 />} /> */}
          <Route path="/map-main" element={<MapMain />} />
          <Route path="/component-main" element={<UsingComponent />} />
          {/* <Route path="/community-main" element={<CommunityMain />} /> */}
          {/* <Route path="/shop-main" element={<ShopMain />} /> */}
          {/* <Route path="/pointshop-page" element={<PointShopMain />} /> */}
          {/* <Route path="/cashbook-page" element={<CashbookMain />} /> */}
          {/* END : 각자 서브기능 메인페이지 끝 */}

          {/* START : user, admin 페이지 */}
          <Route path="/my" element={<MyMainPage />} />
          <Route path="/admin" element={<AdminMainPage />} />
          {/* END : user, admin 페이지*/}

          {/* START : 사용자 로그인 페이지 */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Singup />} />
          <Route path="/updateUser" element={<UpdateUser />} />
          {/* END : 사용자 로그인 페이지 */}

          {/* START : map-page */}
          <Route path="/placeMap" element={<PlaceMap />} />
          <Route path="/place/:placeId" element={<PlaceInfo />} />
          {/* <Route path="/places" element={<PlaceMap />} /> */}
          {/* <Route path="/placeInfo" element={<PlaceInfo />} /> */}
          {/* END : map-page */}

          {/* START : shop-page */}
          {/* END : shop-page */}

          {/* START : community-page */}
          {/* END : community-page */}

          {/* START : pointshop-page */}
          {/* END : pointshop-page */}

          {/* START : cashbook-page */}
          {/* END : cashbook-page */}

        </Routes>
      </div>
        {/*하단 Nav 고정*/}
      <Navigation />
      {/* SpeedDial */}``
      <BasicSpeedDial />
    </Router>
  );
}

export default App;
