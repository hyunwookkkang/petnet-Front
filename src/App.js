import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import './App.css';
import Main from "./pages/common/Main";
import MyMainPage from "./pages/common/MyMainPage";
//import AdminMainPage from "./pages/common/AdminMainPage";

//userId상태값 유지
import { UserProvider } from "./components/contexts/UserContext";

import Navigation from "./components/common/navigationBar/Navigation";
import TopNavigation from "./components/common/navigationBar/TopNavigation";
//import BasicSpeedDial from "./components/common/dial/BasicSpeedDial";
import UsingComponent from "./components/common/UsingComponent";

// Shop 관련 페이지
import AddOrEditProduct from "./pages/shop/product/AddOrEditProduct";
import Carts from "./pages/shop/product/Carts";
import ManageProducts from "./pages/shop/product/ManageProducts";
import ProductImage from "./pages/shop/product/ProductImage";
import ProductInfo from "./pages/shop/product/ProductInfo";
import Products from "./pages/shop/product/Products";
import Wishes from "./pages/shop/product/Wishes";
import ProductPost from "./pages/shop/productPost/ProductPosts";
import AddPurchase from "./pages/shop/purchase/AddPurchase";

// 사용자 페이지
import Login from "./pages/user/Login";
import Singup from "./pages/user/Signup";
import UpdateUser from "./pages/user/UpdateUser";

// Map 관련 페이지
import AddPlace from "./pages/map/admin/AddPlace";
import FavoriteInfo from "./pages/map/favorite/FavoriteInfo";
import Favorites from "./pages/map/favorite/Favorites";
import MapMain from "./pages/map/MapMain";
import PlaceInfo from "./pages/map/place/PlaceInfo";
import PlaceMap from "./pages/map/place/PlaceMap";
import PlaceSearch from "./pages/map/placeSearch/PlaceSearch";
import GetMyPlacePosts from "./pages/map/user/GetMyPlacePosts";

// pointshop 관련 페이지
import AdminAddPointProduct from "./pages/pointshop/AdminAddPointProduct";
import AdminPointProducts from "./pages/pointshop/AdminPointProducts";
import AdminUpdatePointProduct from "./pages/pointshop/AdminUpdatePointProduct";
import GetGifticon from "./pages/pointshop/GetGifticon";
import GetPointLog from "./pages/pointshop/GetPointLog";
import GetPointProduct from "./pages/pointshop/GetPointProduct";
import GetPointQuiz from "./pages/pointshop/GetPointQuiz";
import GetQuizs from "./pages/pointshop/GetQuizs";
import GifticonManigement from "./pages/pointshop/GifticonManigement";
import PointProducts from "./pages/pointshop/PointProducts";
import PointShopMain from "./pages/pointshop/PointShopMain";

// Community 관련 페이지
import CommunityMain from "./pages/community/CommunityMain";
import EditTopicInfo from "./pages/community/EditTopicInfo";
import GetMyTopics from "./pages/community/GetMyTopics";
import GetScrapTopics from "./pages/community/GetScrapTopics";
import GetTopicInfo from "./pages/community/GetTopicInfo";
import SearchTopics from "./pages/community/SearchTopics";

// 가계부 관련 페이지


// Admin 관련 페이지 (잘못된 경로 수정)
import AdminMainPage from "./pages/common/AdminMainPage";






function App() {
  //const userRole = 1; // 관리자: 0 또는 1, 일반 사용자: 2

  return (
  <div className="container">
    <UserProvider>
      {/* 최상단 userId 상태값 공유 */}
      <Router>
        {/* 상단 nav 고정 */}
        <TopNavigation />

        <div className="main-content">
        
        {/* 페이지 콘텐츠 영역에 여백을 추가해 상단/하단 네비게이션이 겹치지 않도록 처리 */}
          <Routes>
            {/* 메인 페이지 */}
            <Route path="/" element={<Main />} />

            {/* START : 각자 서브기능 메인페이지 */}
            <Route path="/map-main" element={<MapMain />} />
            <Route path="/component-main" element={<UsingComponent />} />
            <Route path="/community" element={<CommunityMain />} />
            <Route path="/pointshop-page" element={<PointShopMain />} /> 
            {/* <Route path="/cashbook-page" element={<CashbookMain />} /> */}
            {/* END : 각자 서브기능 메인페이지 끝 */}

            {/* START : user, admin 페이지 */}
            <Route path="/my" element={<MyMainPage />} />
            <Route path="/admin" element={<AdminMainPage />} />
            {/* END : user, admin 페이지 */}

            {/* START : 사용자 로그인 페이지 */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Singup />} />
            <Route path="/updateUser" element={<UpdateUser />} />
            {/* END : 사용자 로그인 페이지 */}

            {/* START : map-page */}
            <Route path="/placeMap" element={<PlaceMap />} />
            <Route path="/place/:placeId" element={<PlaceInfo />} />
            <Route path="/placeFavorite" element={<Favorites />} />
            <Route path="/placeFavorite/:favoriteId" element={<FavoriteInfo />} />
            <Route path="/placeSearch" element={<PlaceSearch />} />
            <Route path="/addPlace" element={<AddPlace />} />
            <Route path="/my/placeposts" element={<GetMyPlacePosts />} />
            {/* END : map-page */}

            {/* START : shop-page */}
            <Route path="/shop/products" element={<Products />} />
            <Route path="shop/products/manage" element={<ManageProducts />} />
            <Route path="/shop/products/form/:productId?" element={<AddOrEditProduct />} />
            <Route path="/shop/products/:productId" element={<ProductInfo/>} />
            <Route path="/shop/products/:productId/image" element={<ProductImage />} />
            <Route path="/shop/products/cart/:userId" element={<Carts/>} />
            <Route path="/shop/products/wish/:userId" element={<Wishes />} />
            <Route path=".shop/productPost/:productId" element={<ProductPost />} />
            <Route path="/shop/purchase" element={<AddPurchase />} />
            {/* END : shop-page */}

            {/* START : community-page */}
            <Route path="/editTopic" element={<EditTopicInfo />} />
            <Route path="/editTopic/:topicId" element={<EditTopicInfo />} />
            <Route path="/getTopic/:topicId" element={<GetTopicInfo />} />
            <Route path="/getMyTopics" element={<GetMyTopics />} />
            <Route path="/getScraps" element={<GetScrapTopics />} />
            <Route path="/searchTopics" element={<SearchTopics />} />
            {/* END : community-page */}

            {/* START : pointshop-page */}
            <Route path="/pointProducts" element={<PointProducts/>}/>
            <Route path="/pointProducts/:productId" element={<GetPointProduct/>}/>
            <Route path="/point-product-management" element={<AdminPointProducts/>}/>
            <Route path="/get-point-product/:productId" element={<GetPointProduct/>}/>
            <Route path="/put-point-product/:productId" element={<AdminUpdatePointProduct/>}/>
            <Route path="/point-product-management/AdminAddPointProduct" element={<AdminAddPointProduct/>}/>
            <Route path="/gifticons" element={<GifticonManigement/>}/>
            <Route path="/pointLog" element={<GetPointLog/>}/>
            <Route path="/gifticons/:gifticonId" element={<GetGifticon/>}/>
            <Route path="/quiz-management" element={<GetQuizs/>}/>
            <Route path="/pointQuiz" element={<GetPointQuiz/>}/>
            {/* END : pointshop-page */}

            {/* START : cashbook-page
            <Route path="/cashbook" element={<CashbookMain />} />
              <Route path="/GetExpensesLog" element={<GetExpensesLog />} />
              <Route
                path="/GetCalendarsDashboard"
                element={<GetCalendarsDashboard />}
              />
              <Route path="/SlideDrawer" element={<SlideDrawer />} />
              <Route path="/AddExpenseAuto" element={<AddExpenseAuto />} />
              <Route path="/AddExpenseLog" element={<AddExpenseLog />} />
              <Route
                path="/GetExpenseLog/:expenseId"
                element={<GetExpenseLog />}
              />
              <Route
                path="/GetstatisticsDashboards"
                element={<GetstatisticsDashboards />}
              />
              <Route
                path="/GetCalendarDashboard"
                element={<GetCalendarDashboard />}
              />
              <Route path="/GetBudgets" element={<GetBudgets />} />
              <Route
                path="/GetBudgetSettings"
                element={<GetBudgetSettings />}
              />
              <Route path="/SearchExpenses" element={<SearchExpenses />} />

              {/* END : cashbook-page */}

          </Routes>
          </div>
        {/*하단 Nav 고정*/}
        <Navigation />
        {/* SpeedDial */}
        {/* <BasicSpeedDial /> */}
      </Router>
    </UserProvider>
    </div>

  );
}

export default App;