import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../../styles/pointshop/gifticon.css";

const GetGifticon = () => {
  const { gifticonId } = useParams();
  const [gifticon, setGifticon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGifticon = async () => {
      try {
        console.log(`Fetching gifticon details for ID: ${gifticonId}`);
        const response = await axios.get(`http://192.168.0.40:8000/api/pointshop/gifticons/${gifticonId}`);
        console.log("Gifticon Data:", response.data);
        setGifticon(response.data);
      } catch (error) {
        console.error("Error fetching gifticon details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGifticon();
  }, [gifticonId]);

  if (loading) {
    return <p>기프티콘 상세 정보를 불러오는 중입니다...</p>;
  }

  if (!gifticon) {
    return <p>기프티콘 정보를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="gifticon-container">
      <h1 className="gifticon-title">기프티콘 상세 정보</h1>
      <div className="gifticon-details">
        <p><strong>바우처 ID:</strong> {gifticon.voucherId}</p>
        <p><strong>사용자 ID:</strong> {gifticon.userId}</p>
        <p><strong>상품 ID:</strong> {gifticon.productId}</p>
        <p><strong>바코드 번호:</strong> {gifticon.barcodeNumber}</p>
        <p><strong>유효 시작일:</strong> {gifticon.validityDate}</p>
        <p><strong>유효 종료일:</strong> {gifticon.expirationDate || 'N/A'}</p>
        <p><strong>추가된 날짜:</strong> {gifticon.addDate}</p>
        <p><strong>사용 여부:</strong> {gifticon.isUsed ? '사용됨' : '사용 안됨'}</p>
        <p><strong>이미지:</strong></p>
        <div>
          {gifticon.imageIds.map((imageId) => (
            <img
              key={imageId}
              src={`http://192.168.0.40:8000/api/images/${imageId}`}
              alt={`기프티콘 이미지 ${imageId}`}
              className="gifticon-image"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GetGifticon;
