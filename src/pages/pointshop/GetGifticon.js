import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUser } from "../../components/contexts/UserContext";

const GetGifticon = () => {
  const { gifticonId } = useParams();
  const [gifticon, setGifticon] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGifticon = async () => {
      if (!userId) {
        alert("로그인이 필요합니다.");
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(`/api/pointshop/gifticons/${gifticonId}`);
        const gifticonData = response.data;

        if (gifticonData.userId !== userId) {
          alert("해당 기프티콘에 접근할 권한이 없습니다.");
          navigate("/");
          return;
        }

        setGifticon(gifticonData);

        if (gifticonData?.productId) {
          const productResponse = await axios.get(`/api/pointshop/pointProducts/${gifticonData.productId}`);
          setProduct(productResponse.data);
        }
      } catch (error) {
        console.error("Error fetching gifticon or product details:", error);
        alert("기프티콘 정보를 불러오는데 실패했습니다.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchGifticon();
  }, [gifticonId, userId, navigate]);

  const handleUpdateGifticon = async () => {
    try {
      await axios.patch(`/api/pointshop/gifticons/${gifticonId}`);
      alert(`${product.productName} 기프티콘을 사용하셨습니다!`);
      navigate("/gifticons");
    } catch (error) {
      console.error("Error updating gifticon:", error);
      alert("기프티콘 사용이 취소되었습니다.");
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2rem' }}>기프티콘 상세 정보를 불러오는 중입니다...</div>;
  }

  if (!gifticon || !product) {
    return <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2rem', color: '#FF6347' }}>기프티콘 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8f8f8, #ececec)',
        padding: '20px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '500px',
          background: '#fff',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            color: '#FF6347',
            margin: '20px 0',
          }}
        >
          기프티콘 상세 정보
        </h1>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          {gifticon.imageIds.map((imageId) => (
            <img
              key={imageId}
              src={`http://192.168.0.40:8000/api/images/${imageId}`}
              alt={`기프티콘 이미지 ${imageId}`}
              style={{
                width: '300px',
                height: 'auto',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
              }}
            />
          ))}
        </div>

        <div style={{ padding: '20px', textAlign: 'left', fontSize: '1rem', lineHeight: '1.8', color: '#333' }}>
          <p><strong>상품명:</strong> {product.productName}</p>
          <p><strong>가격:</strong> {product.price} 포인트</p>
          <p><strong>유효 기한:</strong> {gifticon.validityDate}</p>
          <p><strong>구입 날짜:</strong> {gifticon.addDate}</p>
          <p><strong>사용 여부:</strong> {gifticon.isUsed ? '사용 완료' : '사용 가능'}</p>
          {gifticon.isUsed && <p><strong>사용 날짜:</strong> {gifticon.expirationDate || 'N/A'}</p>}
          <p><strong>바코드 번호:</strong> {gifticon.barcodeNumber}</p>
        </div>

        {!gifticon.isUsed && (
          <button
            onClick={handleUpdateGifticon}
            style={{
              width: '90%',
              backgroundColor: '#FF6347',
              color: '#fff',
              border: 'none',
              padding: '15px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              margin: '20px 0',
              borderRadius: '10px',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#EEA092')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#FF6347')}
          >
            기프티콘 사용하기
          </button>
        )}
      </div>
    </div>
  );
};

export default GetGifticon;
