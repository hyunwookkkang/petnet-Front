import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useUser } from "../../../components/contexts/UserContext";
import { Heart, HeartFill, Cart3 } from "react-bootstrap-icons";

const Wishes = () => {
  const { userId } = useUser();
  const [products, setProducts] = useState([]); // 위시리스트 상품 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigate = useNavigate();

  // 위시리스트 데이터 가져오기
  useEffect(() => {
    if (userId === null) {
      setError("로그인이 필요합니다.");
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
      return;
    }

    const fetchWishProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/api/shop/products/wish/${userId}`);
        setProducts(response.data); // 응답이 정상적으로 받아지면 상태 업데이트
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchWishProducts();
    }
  }, [userId, navigate]);

  const toggleWish = async (productId) => {
    try {
      // 위시리스트에서 제거 요청 (DELETE)
      await axios.delete(`/api/shop/products/wish/${productId}`);

      // 로컬 상태에서 해당 상품을 제거
      setProducts(products.filter((productItem) => productItem.product.productId !== productId));
    } catch (error) {
      console.error("위시리스트 제거 오류:", error);
      alert("위시리스트에서 제거 중 오류가 발생했습니다.");
    }
  };

  const addToCart = async (productId) => {
    try {
      // 장바구니에 추가 요청 (POST)
      await axios.post(`/api/shop/products/cart/${productId}`, { productId });

      alert("장바구니에 추가되었습니다.");
    } catch (error) {
      console.error("장바구니 추가 오류:", error);
      alert("장바구니에 추가 중 오류가 발생했습니다.");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="secondary" />
        <p className="mt-3" style={{ fontSize: "1.5rem", color: "#888" }}>
          로딩 중입니다...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <p className="text-danger" style={{ fontSize: "1.5rem" }}>
          {error}
        </p>
      </div>
    );
  }

  // 상품이 없을 때 메시지 추가
  if (products.length === 0) {
    return (
        <Container className="py-4" style={{ background: "linear-gradient(135deg, #FFFFFF, #EDEDED)" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex flex-grow-1 justify-content-center">
          <h1 className="text-warning mb-0" style={{ fontSize: "2rem" }}>
            찜 상품 목록
          </h1>
        </div>
        <div className="d-flex align-items-center">
          <Button
            variant="link"
            className="text-dark fs-5 p-0 me-3"
            onClick={() => navigate(`/shop/products/cart/${userId}`)}
          >
            <Cart3 />
          </Button>
          <Button
            variant="link"
            className="text-dark fs-5 p-0"
            onClick={() => navigate(`/shop/products/wish/${userId}`)}
          >
            <Heart />
          </Button>
        </div>
      </div>
        <div className="text-center py-5">
            <p className="text-warning" style={{ fontSize: "1.5rem" }}>
            모든 찜 상품 목록을 불러왔습니다.
            </p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ background: "linear-gradient(135deg, #FFFFFF, #EDEDED)" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex flex-grow-1 justify-content-center">
          <h1 className="text-warning mb-0" style={{ fontSize: "2rem" }}>
           찜 상품 목록
          </h1>
        </div>
        <div className="d-flex align-items-center">
          <Button
            variant="link"
            className="text-dark fs-5 p-0 me-3"
            onClick={() => navigate(`/shop/products/cart/${userId}`)}
          >
            <Cart3 />
          </Button>
          <Button
            variant="link"
            className="text-dark fs-5 p-0"
            onClick={() => navigate(`/shop/products/wish/${userId}`)}
          >
            <Heart />
          </Button>
        </div>
      </div>
      <Row
        className="g-0"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
        }}
      >
        {products.map((productItem) => (
          <Col key={productItem.product.productId}>
            <Card
              className="h-100 shadow-sm"
              style={{ cursor: "pointer", border: "none" }}
              onClick={() => navigate(`/shop/products/${productItem.product.productId}`)}
            >
              <div className="overflow-hidden" style={{ height: "200px" }}>
                <Card.Img
                  variant="top"
                  src={productItem.product.image || "https://via.placeholder.com/150"}
                  alt={productItem.product.productName}
                  style={{ objectFit: "cover", height: "100%" }}
                />
              </div>

              <Card.Body style={{ padding: "20px" }}>
                <Card.Text className="text-muted mb-1" style={{ fontSize: "0.9rem" }}>
                  {productItem.product.animalCategory} / {productItem.product.productCategory}
                </Card.Text>
                <Card.Title className="h6 mb-3 text-dark" style={{ fontSize: "1.1rem" }}>
                  {productItem.product.productName}
                </Card.Title>

                {productItem.product.discount > 0 ? (
                  <>
                    <Card.Text className="text-muted text-decoration-line-through mb-1" style={{ fontSize: "1rem" }}>
                      {productItem.product.price ? productItem.product.price.toLocaleString() : "가격 정보 없음"} 원
                    </Card.Text>
                    <Card.Text className="text-danger fw-bold mb-1" style={{ fontSize: "1.2rem" }}>
                      {productItem.product.price && productItem.product.discount
                        ? (productItem.product.price * (1 - productItem.product.discount / 100)).toLocaleString()
                        : "할인 가격 없음"} 원
                    </Card.Text>
                    <Card.Text className="text-danger fw-bold" style={{ fontSize: "0.9rem" }}>
                      {productItem.product.discount}% 할인
                    </Card.Text>
                  </>
                ) : (
                  <Card.Text className="text-danger fw-bold" style={{ fontSize: "1.2rem" }}>
                    {productItem.product.price ? productItem.product.price.toLocaleString() : "가격 정보 없음"} 원
                  </Card.Text>
                )}
              </Card.Body>

              <Card.Footer className="d-flex justify-content-between bg-light">
                <Button
                  variant="link"
                  className="text-danger fs-5 p-0"
                  onClick={(e) => {
                    e.stopPropagation(); // 이벤트 전파 방지
                    toggleWish(productItem.product.productId);
                  }}
                >
                  <HeartFill />
                </Button>
                <Button
                  variant="link"
                  className="text-primary fs-5 p-0"
                  onClick={(e) => {
                    e.stopPropagation(); // 이벤트 전파 방지
                    addToCart(productItem.product.productId);
                  }}
                >
                  <Cart3 />
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Wishes;
