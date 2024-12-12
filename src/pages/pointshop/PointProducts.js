import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const PointProducts = () => {
  const [pointProducts, setPointProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPointProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/pointshop/pointProducts");
      setPointProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching point products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPointProducts();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "50px",
          fontSize: "1.5rem",
          color: "#888",
        }}
      >
        로딩 중입니다...
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "0px",
        background: "linear-gradient(to bottom, #fdf2e9, #fbe0cc)",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "2rem",
          marginBottom: "20px",
          color: "#FF7F50",
        }}
      >
        포인트 상점
      </h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0px", // 카드 간의 간격
          justifyContent: "space-between", // 카드 사이의 공간 균등 배치
        }}
      >
        {pointProducts.map((product) => (
          <div
            key={product.productId}
            style={{
              width: "calc(33% - 0px)", // 한 줄에 3개씩 배치
              cursor: "pointer",
              border: "1px solid #ddd",
              borderRadius: "10px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              backgroundColor: "#fff",
              transition: "transform 0.2s ease-in-out",
            }}
            onClick={() => navigate(`/pointProducts/${product.productId}`)}
          >
            {/* 상품 이미지 */}
            <div
              style={{
                height: "200px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={`/api/images/${product.imageIds}`}
                alt={product.productName}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            {/* 상품 정보 */}
            <div style={{ padding: "10px" }}>
              {/* 브랜드명 */}
              <p
                style={{
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  color: "#888",
                  margin: "0 0 5px 0",
                }}
              >
                {product.brandCategory}
              </p>

              {/* 상품명 */}
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  margin: "0 0 10px 0",
                  color: "#333",
                  lineHeight: "1.2",
                }}
              >
                {product.productName}
              </h3>

              {/* 포인트 가격 */}
              <p
                style={{
                  fontSize: "1rem",
                  fontWeight: "bold",
                  color: "#FF7F50",
                  margin: "0",
                }}
              >
                {product.price} 포인트
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PointProducts;
