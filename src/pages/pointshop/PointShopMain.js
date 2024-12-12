import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuizIcon from '@mui/icons-material/Quiz';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PaidIcon from '@mui/icons-material/Paid';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import "../../styles/pointshop/point.css";

function PointShopMain() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(`/${path}`);
  };

  return (
    <div className="point-shop">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* 포인트 상품 */}
        <div className="option-box" onClick={() => handleNavigation("pointProducts")}>
          <StorefrontIcon style={{ fontSize: "50px" }} />
          <div>포인트 상품</div>
        </div>

        {/* 기프티콘 목록 */}
        <div className="option-box" onClick={() => handleNavigation("gifticons")}>
          <CardGiftcardIcon style={{ fontSize: "50px" }} />
          <div>기프티콘 목록</div>
        </div>

        {/* 포인트 적립 내역 */}
        <div className="option-box" onClick={() => handleNavigation("pointLog")}>
          <PaidIcon style={{ fontSize: "50px" }} />
          <div>포인트 적립 내역</div>
        </div>

        {/* 퀴즈 참여 */}
        <div className="option-box" onClick={() => handleNavigation("pointQuiz")}>
          <QuizIcon style={{ fontSize: "50px" }} />
          <div>퀴즈 참여</div>
        </div>
      </div>

      
    </div>
  );
}

export default PointShopMain;
