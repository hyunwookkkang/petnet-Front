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
import GetCarts from "./pages/shop/product/GetCarts";
import ManageProducts from "./pages/shop/product/ManageProducts";
import GetProductImage from "./pages/shop/product/GetProductImage";
import GetProduct from "./pages/shop/product/GetProduct";
import GetProducts from "./pages/shop/product/GetProducts";
import GetWishes from "./pages/shop/product/GetWishes";
import GetMyProductPosts from "./pages/shop/productPost/GetMyProductPosts";
import GetProductPosts from "./pages/shop/productPost/GetProductPosts";
import AddOrEditDeliveryInfo from "./pages/shop/purchase/AddOrEditDeliveryInfo";
import AddPurchase from "./pages/shop/purchase/AddPurchase";
import GetDeliveryInfos from "./pages/shop/purchase/GetDeliveryInfos";
import ManagePurchases from "./pages/shop/purchase/ManagePurchases";
import GetPurchase from "./pages/shop/purchase/GetPurchase";
import GetPurchases from "./pages/shop/purchase/GetPurchases";
import RefundPurchases from "./pages/shop/purchase/RefundPurchases";

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
import GetMyComments from "./pages/community/GetMyComments";
import GetMyTopics from "./pages/community/GetMyTopics";
import GetScrapTopics from "./pages/community/GetScrapTopics";
import GetTopicInfo from "./pages/community/GetTopicInfo";
import SearchTopics from "./pages/community/SearchTopics";

// 가계부 관련 페이지
import CashbookMain from "./pages/cashbook/CashbookMain";
import GetExpensesLog from "./pages/cashbook/GetExpensesLog";
import GetCalendarsDashboard from "./pages/cashbook/GetCalendarsDashboard";
import SlideDrawer from "./components/cashbook/SlideDrawer";

import GetCalendarDashboard from "./pages/cashbook/GetCalendarDashboard";
import GetstatisticsDashboards from "./pages/cashbook/GetstatisticsDashboards";
import SearchExpenses from "./pages/cashbook/SearchExpenses";
import GetBudgets from "./pages/cashbook/GetBudgets";
import GetBudgetSettings from "./pages/cashbook/GetBudgetSettings";


// Admin 관련 페이지 (잘못된 경로 수정)
import AdminMainPage from "./pages/common/AdminMainPage";
import PopularPlacesInfo from "./pages/map/place/PopularPlacesInfo";











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
            <Route path="/placeInfo/:placeId" element={<PlaceInfo />} />
            <Route path="/placeFavorite" element={<Favorites />} />
            <Route path="/placeFavorite/:favoriteId" element={<FavoriteInfo />} />
            <Route path="/placeSearch" element={<PlaceSearch />} />
            <Route path="/addPlace" element={<AddPlace />} />
            <Route path="/my/placeposts" element={<GetMyPlacePosts />} />
            <Route path="/popularPlacesInfo" element={<PopularPlacesInfo />} />
            {/* END : map-page */}

            {/* START : shop-page */}
            <Route path="/shop/products" element={<GetProducts />} />
            <Route path="shop/products/manage" element={<ManageProducts />} />
            <Route path="/shop/products/form/:productId?" element={<AddOrEditProduct />} />
            <Route path="/shop/products/:productId" element={<GetProduct/>} />
            <Route path="/shop/products/:productId/image" element={<GetProductImage />} />
            <Route path="/shop/products/cart/:userId" element={<GetCarts/>} />
            <Route path="/shop/products/wish/:userId" element={<GetWishes />} />
            <Route path=".shop/productPost/:productId" element={<GetProductPosts />} />
            <Route path="/shop/productPost/my" element={<GetMyProductPosts />} />
            <Route path="/shop/purchase" element={<AddPurchase />} />
            <Route path="/shop/purchase/my" element={<GetPurchases />} />
            <Route path="/shop/purchase/all" element={<ManagePurchases />} />
            <Route path="/shop/purchase/:purchaseId" element={<GetPurchase />} />
            <Route path="/deliveryInfo" element={<GetDeliveryInfos />} />
            <Route path="/deliveryInfo/form/:deliveryInfoId?" element={<AddOrEditDeliveryInfo />} />
            <Route path="/shop/purchase/refund" element={<RefundPurchases />} />
            {/* END : shop-page */}

            {/* START : community-page */}
            <Route path="/editTopic" element={<EditTopicInfo />} />
            <Route path="/editTopic/:topicId" element={<EditTopicInfo />} />
            <Route path="/getTopic/:topicId" element={<GetTopicInfo />} />
            <Route path="/getMyTopics" element={<GetMyTopics />} />
            <Route path="/getScraps" element={<GetScrapTopics />} />
            <Route path="/searchTopics" element={<SearchTopics />} />
            <Route path="/getMyComments" element={<GetMyComments />} />
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

             {/* START : cashbook-page */}
             <Route path="/cashbook" element={<CashbookMain />} />
              <Route path="/GetExpensesLog" element={<GetExpensesLog />} />
              <Route
                path="/GetCalendarsDashboard"
                element={<GetCalendarsDashboard />}
              />
              <Route path="/SlideDrawer" element={<SlideDrawer />} />

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