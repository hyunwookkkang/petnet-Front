import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizIcon from '@mui/icons-material/Quiz';
import StorefrontIcon from '@mui/icons-material/Storefront';
import PaidIcon from '@mui/icons-material/Paid';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import '../../styles/pointshop/pointshopmain.css';

function PointShopMain() {
  const navigate = useNavigate();
  const [visibleButtons, setVisibleButtons] = useState(0);

  

  const handleNavigation = (path) => {
    navigate(`/${path}`);
  };

  const options = [
    {
      title: '포인트 상품',
      description: '다양한 상품을 포인트로 구매하세요.',
      icon: <StorefrontIcon className="option-icon " style={{ color: '#4CAF50' }} />,
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
      title: '퀴즈 참여하기',
      description: '퀴즈에 참여하고 포인트를 적립하세요.',
      icon: <QuizIcon className="option-icon" style={{ color: '#E91E63' }} />,
      path: 'pointQuiz',
    },
  ];

  useEffect(() => {
    if (visibleButtons < options.length) {
      const timer = setTimeout(() => {
        setVisibleButtons(visibleButtons + 1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visibleButtons, options.length]);

  return (
    <div className="point-shop">
      <h1 className="shop-title">포인트 상점</h1>
      <div className="options-container">
        {options.map((option, index) => (
          <div
            key={index}
            className={`option-card ${index < visibleButtons ? 'visible' : ''}`}
            style={{
              transition: 'transform 0.4s ease, opacity 0.4s ease',
              transform: index < visibleButtons ? 'scale(1)' : 'scale(0.9)',
              opacity: index < visibleButtons ? 1 : 0,
              boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
              borderRadius: '15px',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, #fff, #f9f9f9)',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector('.highlight').classList.add('highlight-hover');
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector('.highlight').classList.remove('highlight-hover');
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
            }}
            onClick={() => handleNavigation(option.path)}
          >
            <div
              className="highlight"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(255, 255, 255, 0.5)',
                zIndex: -1,
                transition: 'opacity 0.4s ease',
                opacity: 0,
              }}
            ></div>
            <div className="card-content" style={{ padding: '5px' }}>
              <div className="option-text-container" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                {option.icon}
                <div>
                  <h2 className="option-title" style={{ fontSize: 'clamp(1.2rem, 2vw, 2.3rem)', fontWeight: 'bold', margin: 0 }}>{option.title}</h2>
                  <p className="option-description" style={{
                    fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                    color: '#666',
                    whiteSpace: 'normal',
                    margin: 0, // 불필요한 여백 제거
                  }}>
                    {option.description}
                  </p>
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
