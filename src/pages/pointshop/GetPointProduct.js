import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/common/Button.css"; // .modal-button 클래스 포함
import { useUser } from "../../components/contexts/UserContext";

const GetPointProduct = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { userId } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

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
      alert("구매하려면 로그인이 필요합니다.");
      navigate("/login");
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
      alert("구매가 완료되었습니다!");
      navigate("/pointProducts");
    } catch (error) {
      console.error("Error purchasing product:", error);
      alert("구매에 실패했습니다. 다시 시도해 주세요.");
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
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f8f8f8, #ececec)",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "#fff",
          borderRadius: "15px",
          overflow: "hidden",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
        }}
      >
        {product.imageIds && (
          <img
            src={`/api/images/${product.imageIds}`}
            alt={product.productName}
            style={{
              width: "100%",
              height: "300px",
              objectFit: "cover",
              borderBottom: "1px solid #ddd",
            }}
          />
        )}
        <div style={{ padding: "20px" }}>
          <p style={{ fontSize: "1rem", color: "#999", marginBottom: "5px" }}>
            {product.brandCategory}
          </p>
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "10px",
            }}
          >
            {product.productName}
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "#FF6347 ",
              marginBottom: "20px",
            }}
          >
            {product.price} 포인트
          </p>
          <p style={{ fontSize: "0.9rem", color: "#777", marginBottom: "20px" }}>
            유효 기간: {product.validityDate}일
          </p>
          <button
            style={{
              width: "100%",
              backgroundColor: "#ff6347",
              color: "#fff",
              border: "none",
              padding: "15px",
              fontSize: "1.2rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            }}
            onClick={handlePurchase}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#ff6347")}
          >
            구매하기
          </button>
          <div
            style={{
              marginTop: "30px",
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              textAlign: "left",
              fontSize: "0.9rem",
              color: "#666",
              lineHeight: "1.5",
            }}
          >
            <p style={{ fontWeight: "bold", marginBottom: "10px" }}>
              [포인트 상품 이용 안내]
            </p>
            <ul style={{ paddingLeft: "20px", margin: "0" }}>
              <li>포인트 상품 구매 시 교환, 환불 및 연장은 불가합니다.</li>
              <li>해당 브랜드 편의점에서 상품 교환이 가능합니다.</li>
              <li>일부 편의점에서는 취급하지 않는 상품일 수 있습니다.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetPointProduct;
