import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/pointshop/PointProducts.css"; 

const PointProducts = () => {
  const [pointProducts, setPointProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState([]);
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
    return (
      <div className="loading-container">
        로딩 중입니다...
      </div>
    );
  }

  return (
    <div className="point-products-container">
      <h1 className="point-shop-title">포인트 상점</h1>

      {/* 브랜드 필터 버튼들 */}
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

      {/* 상품 리스트: 3열 레이아웃 */}
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
              {/* 상품 이미지 */}
              <div className="product-image-container">
                <img
                  src={`/api/images/${product.imageIds}`}
                  alt={product.productName}
                  className="product-image"
                />
              </div>

              {/* 상품 정보 */}
              <div className="product-info">
                <p className="product-brand">{product.brandCategory}</p>
                <h3 className="product-name">{product.productName}</h3>
                <p className="product-price">{product.price} 포인트</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PointProducts;
