import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal } from "react-bootstrap";
import "../../styles/common/Button.css";
import { useUser } from "../../components/contexts/UserContext";
import CommonModal from "../../components/common/modal/CommonModal";
import { showSuccessToast, showErrorToast } from "../../components/common/alert/CommonToast";
import "../../styles/pointshop/GetPointProduct.css";

const GetPointProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showAlert, setShowAlert] = useState(false); // 로그인 모달 상태
  const [showModal, setShowModal] = useState(false); // 이미지 확대 모달 상태
  const [modalImage, setModalImage] = useState(""); // 모달에 표시할 이미지 URL

  // fetchProductDetail을 useCallback으로 감싸기
  const fetchProductDetail = useCallback(async () => {
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
  }, [productId]); // productId가 변경될 때만 새로 생성됨

  // 의존성 배열에 fetchProductDetail 추가
  useEffect(() => {
    fetchProductDetail();
  }, [fetchProductDetail]);

  const handleImageClick = (imageUrl) => {
    setModalImage(imageUrl);
    setShowModal(true); // 모달 열기
  };

  const handlePurchase = async () => {
    if (!userId) {
      setShowAlert(true);
      return;
    }

    try {
      await axios.post(
        `/api/pointshop/pointProducts/${productId}`,
        { userId },
        { headers: { "Content-Type": "application/json" } }
      );
      showSuccessToast("구매가 완료되었습니다!");
      navigate("/pointProducts");
    } catch (error) {
      console.error("Error purchasing product:", error);
      showErrorToast("포인트가 부족합니다.");
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
        <h1 className="point-shop-title">포인트 상품 정보</h1>
        {product.imageIds && (
          <img
            src={`/api/images/${product.imageIds}`}
            alt={product.productName}
            className="product-image"
            style={{ cursor: "pointer" }}
            onClick={() => handleImageClick(`/api/images/${product.imageIds}`)}
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

      {/* 이미지 확대 모달 */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body>
          <img
            src={modalImage}
            alt="확대된 이미지"
            style={{ width: "100%", height: "auto" }}
          />
        </Modal.Body>
      </Modal>

      {/* 로그인 모달 */}
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
