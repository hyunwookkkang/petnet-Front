import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../../styles/pointshop/gifticon.css";

const GetGifticon = () => {
  const { gifticonId } = useParams();
  const [gifticon, setGifticon] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGifticon = async () => {
      try {
        console.log(`Fetching gifticon details for ID: ${gifticonId}`);
        const response = await axios.get(`http://192.168.0.40:8000/api/pointshop/gifticons/${gifticonId}`);
        const gifticonData = response.data;
        setGifticon(gifticonData);

        // Fetch the product details using productId from the gifticon
        if (gifticonData?.productId) {
          const productResponse = await axios.get(`http://192.168.0.40:8000/api/pointshop/pointProducts/${gifticonData.productId}`);
          setProduct(productResponse.data);
        }
      } catch (error) {
        console.error("Error fetching gifticon or product details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGifticon();
  }, [gifticonId]);

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
      </div>
    </div>
  );
};

export default GetGifticon;
