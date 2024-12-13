import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { Heart, Share } from "react-bootstrap-icons";

const Products = () => {
  const [products, setProducts] = useState([]); // 상품 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 무한 스크롤 여부
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const navigate = useNavigate();

  const fetchProducts = async (page) => {
    if (!hasMore) return; // 더 이상 데이터가 없으면 실행 안 함
    setLoading(true);

    try {
      const response = await axios.get(
        `/api/shop/products?currentPage=${page}&pageSize=6`
      );

      if (response.data.length === 0) {
        setHasMore(false); // 더 이상 데이터가 없을 때
      } else {
        setProducts((prevProducts) => [
          ...prevProducts,
          ...response.data.filter(
            (newProduct) =>
              !prevProducts.some((product) => product.productId === newProduct.productId)
          ),
        ]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setProducts([]); // 상품 리스트 초기화
    setCurrentPage(0); // 페이지 번호 초기화
    setHasMore(true); // 더 불러올 데이터가 있다고 설정
    fetchProducts(0); // 초기 데이터 로드 (0 페이지부터)
  }, []);

  if (loading && currentPage === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="secondary" />
        <p className="mt-3" style={{ fontSize: "1.5rem", color: "#888" }}>
          로딩 중입니다...
        </p>
      </div>
    );
  }

  return (
    <Container className="py-4" style={{ background: "linear-gradient(135deg, #FFFFFF, #EDEDED)" }}>
      <h1 className="text-center text-warning mb-4" style={{ fontSize: "2rem" }}>
        상품 목록
      </h1>
      <Row
        className="g-0"  // 카드 간격을 없애기 위해 'g-0' 사용
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)", // 무조건 3열로 고정
        }}
      >
        {products.map((product) => (
          <Col key={product.productId}>
            <Card
              className="h-100 shadow-sm"
              style={{ cursor: "pointer", border: "none" }}  // 카드 사이에 간격 없도록 설정
              onClick={() => navigate(`/shop/products/${product.productId}`)}
            >
              <div className="overflow-hidden" style={{ height: "200px" }}>
                <Card.Img
                  variant="top"
                  src={product.image || "https://via.placeholder.com/150"}
                  alt={product.productName}
                  style={{ objectFit: "cover", height: "100%" }}
                />
              </div>

              <Card.Body style={{ padding: "20px" }}>
                <Card.Text className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>
                  {product.animalCategory} / {product.productCategory}
                </Card.Text>
                <Card.Title className="h6 mb-3 text-dark" style={{ fontSize: "1.1rem" }}>
                  {product.productName}
                </Card.Title>

                {product.discount > 0 ? (
                  <>
                    <Card.Text className="text-muted text-decoration-line-through mb-1" style={{ fontSize: "1rem" }}>
                      {product.price.toLocaleString()} 원
                    </Card.Text>
                    <Card.Text className="text-danger fw-bold mb-1" style={{ fontSize: "1.2rem" }}>
                      {(
                        product.price * (1 - product.discount / 100)
                      ).toLocaleString()} 원
                    </Card.Text>
                    <Card.Text className="text-danger fw-bold" style={{ fontSize: "0.9rem" }}>
                      {product.discount}% 할인
                    </Card.Text>
                  </>
                ) : (
                  <Card.Text className="text-danger fw-bold" style={{ fontSize: "1.2rem" }}>
                    {product.price.toLocaleString()} 원
                  </Card.Text>
                )}
              </Card.Body>

              <Card.Footer className="d-flex justify-content-between bg-light">
            <Button
              variant="link"
              className="text-danger fs-5 p-0"
              onClick={(e) => {
                e.stopPropagation();
                console.log("하트 버튼 클릭");
              }}
            >
              <Heart />
            </Button>
            <Button
              variant="link"
              className="text-primary fs-5 p-0"
              onClick={(e) => {
                e.stopPropagation();
                console.log("공유 버튼 클릭");
              }}
            >
              <Share />
            </Button>
          </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Products;
