import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";

const PointProducts = () => {
  const [pointProducts, setPointProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [sendAsArray, setSendAsArray] = useState(false); // 배열로 보낼지 여부
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);

  const brandOptions = [
    { name: "CU", value: "CU" },
    { name: "GS25", value: "GS25" },
    { name: "이마트24", value: "이마트24" },
  ];

  const fetchPointProducts = async (brands = []) => {
    setLoading(true);
    try {
      let queryParam = "";

      if (brands.length) {
        if (sendAsArray) {
          // 배열 형식으로 전송
          queryParam = `?brand=${JSON.stringify(brands)}`;
        } else {
          // 문자열 형식으로 전송
          queryParam = `?brand=${brands.join(",")}`;
        }
      }

      const response = await axios.get(
        `http://192.168.0.40:8000/api/pointshop/pointProducts${queryParam}`
      );

      setPointProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching point products:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPointProducts();
  }, [sendAsArray]); // sendAsArray 변경 시 필터링 다시 수행

  const handleBrandChange = (brands) => {
    setSelectedBrands(brands);
    fetchPointProducts(brands);
  };

  return (
    <div className="pointProducts" style={{ padding: "20px" }}>
      <h1
        className="points-display"
        style={{
          display: "flex",
          fontSize: "60px",
          justifyContent: "center",
        }}
      >
        포인트 상점
      </h1>
      <div className="brand-filter" style={{ marginBottom: "20px" }}>
        <Row>
          {brandOptions.map((brand) => (
            <Col xs={4} key={brand.value}>
              <ToggleButtonGroup
                type="checkbox"
                value={selectedBrands}
                onChange={handleBrandChange}
                style={{ width: "100%" }}
              >
                <ToggleButton
                  id={`brand-${brand.value}`}
                  value={brand.value}
                  style={{
                    backgroundColor: selectedBrands.includes(brand.value)
                      ? "#FFBD94"
                      : "transparent",
                    color: selectedBrands.includes(brand.value)
                      ? "#FFFFFF"
                      : "#FFBD94",
                    border: `2px solid #FFBD94`,
                    fontWeight: selectedBrands.includes(brand.value)
                      ? "bold"
                      : "normal",
                    width: "100%", // 버튼 너비를 Col의 크기만큼 설정
                  }}
                >
                  {brand.name}
                </ToggleButton>
              </ToggleButtonGroup>
            </Col>
          ))}
        </Row>
        <Button
          variant="outline-primary"
          onClick={() => setSendAsArray(!sendAsArray)}
          style={{ marginTop: "10px" }}
        >
          {sendAsArray
            ? "쿼리 파라미터를 문자열로 전송"
            : "쿼리 파라미터를 배열로 전송"}
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {loading ? (
          <p>Loading...</p>
        ) : pointProducts.length === 0 ? (
          <p>상품이 없습니다.</p>
        ) : (
          pointProducts.map((product) => (
            <Card
              style={{ backgroundColor: "#FFE2D0", width: "18rem" }}
              key={product.productId}
            >
              <Card.Img
                variant="top"
                src={`http://192.168.0.40:8000/api/images/${product.imageIds}`}
                alt={product.productName || "상품 이미지"}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{product.productName}</Card.Title>
                <Card.Text>
                  <strong>가격:</strong> {product.price} 포인트
                  <br />
                  <strong>브랜드:</strong> {product.brandCategory}
                </Card.Text>
                <Button
                  style={{
                    backgroundColor:
                      hoveredId === product.productId ? "#FD9251" : "#feb98e",
                    borderColor:
                      hoveredId === product.productId ? "#ffa07a" : "#feb98e",
                  }}
                  onMouseEnter={() => setHoveredId(product.productId)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => navigate(`/pointProducts/${product.productId}`)}
                >
                  구매하러 가기
                </Button>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PointProducts;
