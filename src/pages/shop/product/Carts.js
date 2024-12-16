import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { useUser } from "../../../components/contexts/UserContext";
import { Cart3, Heart } from "react-bootstrap-icons";

const Carts = () => {
  const { userId } = useUser();
  const [products, setProducts] = useState([]); // 장바구니 상품 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태
  const navigate = useNavigate();

  // 장바구니 데이터 가져오기
  useEffect(() => {
    // userId가 null일 경우 로그인 페이지로 네비게이션
    if (userId === null) {
      setError("로그인이 필요합니다.");
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
      return;
    }

    const fetchCartProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/api/shop/products/cart/${userId}`);
        setProducts(response.data); // 응답이 정상적으로 받아지면 상태 업데이트
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // userId가 존재할 때만 데이터를 가져오도록 실행
    if (userId) {
      fetchCartProducts();
    }
  }, [userId, navigate]); // userId와 navigate가 변경될 때마다 실행

  // 수량 변경 처리 함수
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      alert("최소 수량은 1개입니다.");
      return;
    }

    try {
      // 프론트엔드 상태 업데이트 (새로운 수량 반영)
      const updatedProducts = products.map((productItem) =>
        productItem.itemId === itemId
          ? { ...productItem, quantity: newQuantity } // productItem의 quantity만 업데이트
          : productItem
      );
      setProducts(updatedProducts); // 상태 업데이트

      // 서버에 수량 업데이트 요청
      await axios.put("/api/shop/products/cart", {
        itemId,
        quantity: newQuantity,
      });
    } catch (error) {
      console.error("수량 업데이트 오류:", error);
      alert("수량 변경 중 오류가 발생했습니다.");
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

  const handlePurchaseClick = () => {
    navigate("/shop/purchase"); // 구매하기 페이지로 이동
  };

  const handleRemoveClick = () => {
    alert("삭제하기 기능은 아직 구현되지 않았습니다."); // 삭제하기 알림
  };

  return (
    <Container className="py-4" style={{ background: "linear-gradient(135deg, #FFFFFF, #EDEDED)" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex flex-grow-1 justify-content-center">
          <h1 className="text-warning mb-0" style={{ fontSize: "2rem" }}>
            장바구니
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
          <Col key={productItem.itemId}>
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
                {/* 숨겨진 input 필드 추가 */}
                <input type="hidden" value={productItem.itemId} />

                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // 이벤트 전파 방지
                    const newQuantity = productItem.quantity - 1;
                    handleQuantityChange(productItem.itemId, newQuantity);
                  }}
                >
                  -
                </Button>
                <span>{productItem.quantity}</span>
                <Button
                  variant="outline-dark"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation(); // 이벤트 전파 방지
                    const newQuantity = productItem.quantity + 1;
                    handleQuantityChange(productItem.itemId, newQuantity);
                  }}
                >
                  +
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="d-grid gap-2 mt-4">
        <Button variant="primary" size="lg" onClick={handlePurchaseClick}>
          구매하기
        </Button>
        <Button variant="secondary" size="lg" onClick={handleRemoveClick}>
          삭제하기
        </Button>
      </div>
    </Container>
  );
};

export default Carts;
