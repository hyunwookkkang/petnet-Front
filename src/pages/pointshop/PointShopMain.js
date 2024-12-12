import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizIcon from '@mui/icons-material/Quiz';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PaidIcon from '@mui/icons-material/Paid';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import '../../styles/pointshop/pointshopmain.css';

function PointShopMain() {
  const navigate = useNavigate();
  const [visibleButtons, setVisibleButtons] = useState(0); // 보여질 버튼 개수

  const handleNavigation = (path) => {
    navigate(`/${path}`);
  };

  const options = [
    {
      title: '포인트 상품',
      description: '다양한 상품을 포인트로 구매하세요.',
      icon: <StorefrontIcon className="option-icon" style={{ color: '#4CAF50' }} />,
      path: 'pointProducts',
    },
    {
      title: '기프티콘 목록',
      description: '보유 중인 기프티콘을 확인하세요.',
      icon: <CardGiftcardIcon className="option-icon" style={{ color: '#FF9800' }} />,
      path: 'gifticons',
    },
    {
      title: '포인트 적립 내역',
      description: '포인트 사용 및 적립 기록을 확인하세요.',
      icon: <PaidIcon className="option-icon" style={{ color: '#03A9F4' }} />,
      path: 'pointLog',
    },
    {
      title: '퀴즈 참여',
      description: '퀴즈에 참여하고 포인트를 적립하세요.',
      icon: <QuizIcon className="option-icon" style={{ color: '#E91E63' }} />,
      path: 'pointQuiz',
    },
  ];

  useEffect(() => {
    // 버튼을 하나씩 표시하는 타이머 설정
    if (visibleButtons < options.length) {
      const timer = setTimeout(() => {
        setVisibleButtons(visibleButtons + 1);
      }, 500); // 0.5초 간격으로 버튼을 보여줍니다.
      return () => clearTimeout(timer); // 타이머 정리
    }
  }, [visibleButtons, options.length]);

  return (
    <div className="point-shop">
      <h1 className="shop-title">포인트 상점</h1>
      <div className="options-container">
        {options.map((option, index) => (
          <div
            key={index}
            className={`option-card ${index < visibleButtons ? 'visible' : ''}`} // visible 클래스 추가
            onMouseEnter={(e) => {
              e.currentTarget.querySelector('.highlight').classList.add('highlight-hover');
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector('.highlight').classList.remove('highlight-hover');
            }}
            onClick={() => handleNavigation(option.path)}
          >
            <div className="highlight"></div>
            <div className="card-content">
              <div className="option-text-container">
                {option.icon}
                <div>
                  <h2 className="option-title">{option.title}</h2>
                  <p className="option-description">{option.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PointShopMain;
