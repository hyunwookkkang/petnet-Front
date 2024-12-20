import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, CardContent, CardMedia, Typography } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/pointshop/PointProducts.css";

const PointProducts = () => {
  const [pointProducts, setPointProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [isGridView, setIsGridView] = useState(true); // 뷰 토글 상태
  const navigate = useNavigate();

  const brandOptions = [
    { name: "CU", value: "CU" },
    { name: "GS25", value: "GS25" },
    { name: "이마트24", value: "이마트24" },
  ];

  const fetchPointProducts = async (brands = []) => {
    setLoading(true);
    try {
      const brandQuery = brands.length ? `?brand=${brands.join(",")}` : "";
      const response = await axios.get(`/api/pointshop/pointProducts${brandQuery}`);
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

  const handleBrandChange = (brand) => {
    let newSelectedBrands;
    if (selectedBrands.includes(brand)) {
      newSelectedBrands = selectedBrands.filter((b) => b !== brand);
    } else {
      newSelectedBrands = [...selectedBrands, brand];
    }
    setSelectedBrands(newSelectedBrands);
    fetchPointProducts(newSelectedBrands);
  };

  if (loading) {
    return <div className="loading-container">로딩 중입니다...</div>;
  }

  return (
    <div className="point-products-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="point-shop-title text-center" style={{ flex: 1, textAlign: "center" }}>포인트 상점</h1>
        <button
          onClick={() => setIsGridView(!isGridView)}
          className="view-toggle-button"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "40px",
            height: "40px",
            background: "#f0f0f0",
            border: "1px solid #ccc",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isGridView ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ width: "20px", height: "3px", backgroundColor: "#333" }} />
              <div style={{ width: "20px", height: "3px", backgroundColor: "#333" }} />
              <div style={{ width: "20px", height: "3px", backgroundColor: "#333" }} />
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 10px)", gap: "4px" }}>
              <div style={{ width: "10px", height: "10px", backgroundColor: "#333" }} />
              <div style={{ width: "10px", height: "10px", backgroundColor: "#333" }} />
              <div style={{ width: "10px", height: "10px", backgroundColor: "#333" }} />
              <div style={{ width: "10px", height: "10px", backgroundColor: "#333" }} />
            </div>
          )}
        </button>
      </div>

      {/* 브랜드 필터 버튼 */}
      <div className="brand-filter-container">
        {brandOptions.map((brand) => {
          const isSelected = selectedBrands.includes(brand.value);
          return (
            <button
              key={brand.value}
              onClick={() => handleBrandChange(brand.value)}
              className={`brand-button ${isSelected ? "selected" : "unselected"}`}
            >
              {brand.name}
            </button>
          );
        })}
      </div>

      {/* 상품 리스트 */}
      {isGridView ? (
        <div className="product-grid">
          {pointProducts.length === 0 ? (
            <p className="no-products">상품이 없습니다.</p>
          ) : (
            pointProducts.map((product) => (
              <div
                key={product.productId}
                className="product-card"
                onClick={() => navigate(`/pointProducts/${product.productId}`)}
              >
                <div className="product-image-container">
                  <img
                    src={`/api/images/${product.imageIds}`}
                    alt={product.productName}
                    className="product-image"
                  />
                </div>
                <div className="product-info">
                  <p className="product-brand">{product.brandCategory}</p>
                  <h3 className="product-name">{product.productName}</h3>
                  <p className="product-price">{product.price} 포인트</p>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <Container>
          {pointProducts.length === 0 ? (
            <p className="no-products">상품이 없습니다.</p>
          ) : (
            pointProducts.map((product) => (
              <Card
                key={product.productId}
                className="common-card"
                onClick={() => navigate(`/pointProducts/${product.productId}`)}
                style={{
                  cursor: "pointer",
                  height: "150px",
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "10px",
                  marginLeft: "10px",
                  marginRight: "10px",
                }}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 150, height: 150 }}
                  image={`/api/images/${product.imageIds}`}
                  alt={product.productName}
                />
                <CardContent style={{ flexGrow: 1, overflow: "hidden" }}>
                  <Typography
                    variant="h5"
                    style={{
                      fontFamily: "'Ownglyph_ParkDaHyun', sans-serif",
                      fontWeight: "normal",
                      fontSize: "clamp(16px, 2.5vw, 22px)",
                      overflowWrap: "break-word",
                    }}
                  >
                    {product.productName || "상품명 없음"}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="#777"
                    style={{
                      fontFamily: "'Ownglyph_ParkDaHyun', sans-serif",
                      fontWeight: "normal",
                      fontSize: "clamp(14px, 2.2vw, 18px)",
                    }}
                  >
                    브랜드: {product.brandCategory || "브랜드 없음"}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="#FF6347"
                    style={{
                      fontFamily: "'Ownglyph_ParkDaHyun', sans-serif",
                      fontWeight: "normal",
                      fontSize: "clamp(14px, 2.2vw, 18px)",
                    }}
                  >
                    {product.price} 포인트
                  </Typography>
                </CardContent>
              </Card>
            ))
          )}
        </Container>
      )}
    </div>
  );
};

export default PointProducts;
