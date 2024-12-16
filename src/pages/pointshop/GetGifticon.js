import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../components/contexts/UserContext";
import CommonModal from "../../components/common/modal/CommonModal";
import { showSuccessToast, showErrorToast } from "../../components/common/alert/CommonToast";
import "../../styles/pointshop/GetGifticon.css"; // CSS 파일 import

const GetGifticon = () => {
  const { gifticonId } = useParams();
  const [gifticon, setGifticon] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false); // 모달 상태
  const [alertMessage, setAlertMessage] = useState(""); // 모달 메시지

  useEffect(() => {
    const fetchGifticon = async () => {
      if (!userId) {
        setAlertMessage("로그인이 필요합니다.");
        setShowAlert(true);
        return;
      }

      try {
        const response = await axios.get(`/api/pointshop/gifticons/${gifticonId}`);
        const gifticonData = response.data;

        if (gifticonData.userId !== userId) {
          setAlertMessage("해당 기프티콘에 접근할 권한이 없습니다.");
          setShowAlert(true);
          return;
        }

        setGifticon(gifticonData);

        if (gifticonData?.productId) {
          const productResponse = await axios.get(`/api/pointshop/pointProducts/${gifticonData.productId}`);
          setProduct(productResponse.data);
        }
      } catch (error) {
        console.error("Error fetching gifticon or product details:", error);
        setAlertMessage("기프티콘 정보를 불러오는데 실패했습니다.");
        setShowAlert(true);
      } finally {
        setLoading(false);
      }
    };

    fetchGifticon();
  }, [gifticonId, userId]);

  const handleUpdateGifticon = async () => {
    try {
      await axios.patch(`/api/pointshop/gifticons/${gifticonId}`);
      showSuccessToast(`${product.productName} 기프티콘을 사용하셨습니다!`);
      navigate("/gifticons");
    } catch (error) {
      console.error("Error updating gifticon:", error);
      showErrorToast("기프티콘 사용이 취소되었습니다.");
    }
  };

  if (loading) {
    return <div className="gifticon-loading">기프티콘 상세 정보를 불러오는 중입니다...</div>;
  }

  if (!gifticon || !product) {
    return <div className="gifticon-not-found">기프티콘 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="get-gifticon-container">
      <div className="gifticon-card">
        <h1 className="gifticon-title">기프티콘 상세 정보</h1>

        <div className="gifticon-images">
          {gifticon.imageIds.map((imageId) => (
            <img
              key={imageId}
              src={`/api/images/${imageId}`}
              alt={`기프티콘 이미지 ${imageId}`}
              className="gifticon-image"
            />
          ))}
        </div>

        <div className="gifticon-info">
          <p><strong>상품명:</strong> {product.productName}</p>
          <p><strong>가격:</strong> {product.price} 포인트</p>
          <p><strong>유효 기한:</strong> {gifticon.validityDate}</p>
          <p><strong>구입 날짜:</strong> {gifticon.addDate}</p>
          <p><strong>사용 여부:</strong> {gifticon.isUsed ? "사용 완료" : "사용 가능"}</p>
          {gifticon.isUsed && <p><strong>사용 날짜:</strong> {gifticon.expirationDate || "N/A"}</p>}
          <p><strong>바코드 번호:</strong> {gifticon.barcodeNumber}</p>
        </div>

        {!gifticon.isUsed && (
          <button
            onClick={handleUpdateGifticon}
            className="use-gifticon-button"
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#EEA092")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#FF6347")}
          >
            기프티콘 사용하기
          </button>
        )}
      </div>

      <CommonModal
        show={showAlert}
        onHide={() => {
          setShowAlert(false);
          navigate("/");
        }}
        title="알림"
        body={<div>{alertMessage}</div>}
        footer={
          <button
            className="alert-confirm-button"
            onClick={() => {
              setShowAlert(false);
              navigate("/");
            }}
          >
            확인
          </button>
        }
      />
    </div>
  );
};

export default GetGifticon;
