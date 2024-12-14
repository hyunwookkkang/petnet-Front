import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/common/Button.css"; // .modal-button 클래스 포함
import { useUser } from "../../components/contexts/UserContext";
import CommonModal from "../../components/common/modal/CommonModal";
import { showSuccessToast, showErrorToast } from "../../components/common/alert/CommonToast";
import "../../styles/pointshop/GetPointProduct.css"; // 새로운 CSS 파일 import

const GetPointProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false); // 로그인 모달 상태

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/pointshop/pointProducts/${productId}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
      setError("상품 정보를 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!userId) {
      setShowAlert(true); // 로그인 모달 표시
      return;
    }

    try {
      await axios.post(
        `/api/pointshop/pointProducts/${productId}`,
        { userId },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      showSuccessToast("구매가 완료되었습니다!");
      navigate("/pointProducts");
    } catch (error) {
      console.error("Error purchasing product:", error);
      showErrorToast("구매에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  if (loading) {
    return <div>로딩 중입니다...</div>;
  }

  if (error) {
    return (
      <div className="text-center">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="get-point-product-container">
      <div className="product-card">
        {product.imageIds && (
          <img
            src={`/api/images/${product.imageIds}`}
            alt={product.productName}
            className="product-image"
          />
        )}
        <div className="product-content">
          <p className="product-brand">{product.brandCategory}</p>
          <h1 className="product-title">{product.productName}</h1>
          <p className="product-price">{product.price} 포인트</p>
          <p className="product-validity">유효 기간: {product.validityDate}일</p>
          <button
            className="purchase-button"
            onClick={handlePurchase}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff6347")}
          >
            구매하기
          </button>
          <div className="product-info-box">
            <p className="info-title">[포인트 상품 이용 안내]</p>
            <ul className="info-list">
              <li>포인트 상품 구매 시 교환, 환불 및 연장은 불가합니다.</li>
              <li>해당 브랜드 편의점에서 상품 교환이 가능합니다.</li>
              <li>일부 편의점에서는 취급하지 않는 상품일 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </div>
      <CommonModal
        show={showAlert}
        onHide={() => setShowAlert(false)}
        title="로그인 필요"
        body={
          <div>
            로그인이 필요한 서비스입니다.<br /> 로그인 화면으로 이동합니다.
          </div>
        }
        footer={
          <button
            className="modal-button"
            style={{ backgroundColor: "#feb98e", border: "none" }}
            onClick={() => {
              setShowAlert(false);
              navigate("/login");
            }}
          >
            확인
          </button>
        }
      />
    </div>
  );
};

export default GetPointProduct;
