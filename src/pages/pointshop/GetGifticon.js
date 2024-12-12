import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../styles/pointshop/gifticon.css";
import { useUser } from "../../components/contexts/UserContext";

const GetGifticon = () => {
  const { gifticonId } = useParams();
  const [gifticon, setGifticon] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser(); // UserContext에서 userId 가져오기
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGifticon = async () => {
      if (!userId) {
        alert("로그인이 필요합니다.");
        navigate("/"); // 메인 페이지로 이동
        return;
      }

      try {
        console.log(`Fetching gifticon details for ID: ${gifticonId}`);
        const response = await axios.get(`/api/pointshop/gifticons/${gifticonId}`);
        const gifticonData = response.data;

        // userId가 일치하지 않을 경우 메인 페이지로 이동
        if (gifticonData.userId !== userId) {
          alert("해당 기프티콘에 접근할 권한이 없습니다.");
          navigate("/");
          return;
        }

        setGifticon(gifticonData);

        // Fetch the product details using productId from the gifticon
        if (gifticonData?.productId) {
          const productResponse = await axios.get(`/api/pointshop/pointProducts/${gifticonData.productId}`);
          setProduct(productResponse.data);
        }
      } catch (error) {
        console.error("Error fetching gifticon or product details:", error);
        alert("기프티콘 정보를 불러오는데 실패했습니다.");
        navigate("/"); // 오류 발생 시 메인 페이지로 이동
      } finally {
        setLoading(false);
      }
    };

    fetchGifticon();
  }, [gifticonId, userId, navigate]);

  const handleUpdateGifticon = async () => {
    try {
      await axios.patch(`/api/pointshop/gifticons/${gifticonId}`);
      alert("${product.productName} 기프티콘을 사용하셨습니다!");
      navigate("/gifticons"); // 업데이트 후 기프티콘 목록으로 이동
    } catch (error) {
      console.error("Error updating gifticon:", error);
      alert("기프티콘 사용이 취소되었습니다.");
    }
  };

  if (loading) {
    return <p>기프티콘 상세 정보를 불러오는 중입니다...</p>;
  }

  if (!gifticon || !product) {
    return <p>기프티콘 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="gifticon-container">
      <h1 className="gifticon-title">기프티콘 상세 정보</h1>
      
      {/* 이미지 표시 */}
      <div className="gifticon-images">
        {gifticon.imageIds.map((imageId) => (
          <img
            key={imageId}
            src={`http://192.168.0.40:8000/api/images/${imageId}`}
            alt={`기프티콘 이미지 ${imageId}`}
            className="gifticon-image"
          />
        ))}
      </div>

      {/* 상세 정보 */}
      <div className="gifticon-details">
        <p><strong>상품명:</strong> {product.productName}</p>
        <p><strong>가격:</strong> {product.price} 포인트</p>
        <p><strong>유효 기한:</strong> {gifticon.validityDate}</p>
        <p><strong>구입 날짜:</strong> {gifticon.addDate}</p>
        <p><strong>사용 여부:</strong> {gifticon.isUsed ? '사용 완료' : '사용 가능'}</p>
        {gifticon.isUsed && (
          <p><strong>사용날짜:</strong> {gifticon.expirationDate || 'N/A'}</p>
        )}
        <p><strong>바코드 번호:</strong> {gifticon.barcodeNumber}</p>

        {/* 사용 가능 상태일 때만 버튼 표시 */}
        {!gifticon.isUsed && (
          <button
            className="gifticon-update-button"
            onClick={handleUpdateGifticon}
            style={{
              backgroundColor: '#FF7826',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginTop: '20px',
            }}
          >
            기프티콘 사용하기
          </button>
        )}
      </div>
    </div>
  );
};

export default GetGifticon;
