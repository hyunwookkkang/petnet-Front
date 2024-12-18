import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Card, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { Heart, HeartFill, Cart } from "react-bootstrap-icons";
import "../../../styles/place/Place.css";
import ProductImage from "./ProductImage";
import ProductPost from "../productPost/ProductPosts";
import { useUser } from "../../../components/contexts/UserContext";

const ProductInfo = () => {
  const { productId } = useParams();
  const { userId } = useUser(); // 로그인한 사용자 정보 가져오기
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [isWished, setIsWished] = useState(false); // 위시리스트 여부 상태

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`/api/shop/products/${productId}`);
        setProduct(response.data);

        if (userId) {
          const wishResponse = await axios.get(
            `/api/shop/products/wish/${userId}`
          );
          const wishList = wishResponse.data.map(
            (wishItem) => wishItem.product.productId
          );
          setIsWished(wishList.includes(productId));
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
  }, [productId, userId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  // 위시리스트 등록/해제 핸들러
  const handleToggleWishlist = async () => {
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
      return;
    }

    try {
      if (isWished) {
        await axios.delete(`/api/shop/products/wish/${productId}`);
        alert("상품이 위시리스트에서 제거되었습니다.");
      } else {
        await axios.post(`/api/shop/products/wish/${productId}`);
        alert("상품이 위시리스트에 등록되었습니다.");
      }
      setIsWished(!isWished);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      alert("위시리스트 업데이트에 실패했습니다.");
    }
  };

  // 장바구니 등록 핸들러
  const handleAddToCart = async () => {
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
      return;
    }

    try {
      await axios.post("/api/shop/cart", { userId, productId });
      alert("상품이 장바구니에 등록되었습니다.");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("장바구니 등록에 실패했습니다.");
    }
  };

  // 구매하기 핸들러
  const handlePurchase = async () => {
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
      return;
    }

    try {
      await axios.post("/api/shop/purchase", { userId, productId });
      alert("구매가 완료되었습니다!");
    } catch (error) {
      console.error("Error processing purchase:", error);
      alert("구매 처리에 실패했습니다.");
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <Card className="place-button-box">
            {/* 사진 영역 */}
            <Card.Body style={{ padding: "10px" }}>
              <ProductImage />
            </Card.Body>

            {/* 버튼 영역 */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                padding: "15px",
              }}
            >
              <Button
                variant="outline-danger"
                onClick={handleToggleWishlist}
                style={{ flex: "1", margin: "0 10px" }}
              >
                {isWished ? <HeartFill /> : <Heart />} 
              </Button>
              <Button
                variant="outline-primary"
                onClick={handleAddToCart}
                style={{ flex: "1", margin: "0 10px" }}
              >
                <Cart /> 장바구니
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 상품 정보 */}
      <Row className="mb-4">
        <Col>
          <Card className="place-button-box">
            <Card.Body style={{ padding: "30px" }}>
              <Card.Title className="text-left text-muted">
                <h6>
                  {product.animalCategory}/{product.productCategory}
                </h6>
              </Card.Title>
              <Col className="text-left">
                <h4>
                  <strong>{product.productName}</strong>
                </h4>
              </Col>
              <Col className="text-left">
                <div>
                  <p
                    className="text-muted"
                    style={{
                      textDecoration:
                        product.discount > 0 ? "line-through" : "none",
                      fontSize: product.discount === 0 ? "1.25rem" : "",
                    }}
                  >
                    {product.price.toLocaleString()} 원
                  </p>
                  {product.discount > 0 && (
                    <>
                      <p
                        style={{
                          color: "red",
                          fontWeight: "bold",
                          fontSize: "1.25rem",
                        }}
                      >
                        {(
                          product.price *
                          (1 - product.discount / 100)
                        ).toLocaleString()}{" "}
                        원
                      </p>
                      <p
                        className="text-muted"
                        style={{ fontSize: "0.875rem" }}
                      >
                        {product.discount}% 할인
                      </p>
                    </>
                  )}
                </div>
              </Col>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 구매하기 버튼 (상품 정보 하단) */}
      <Row>
        <Col>
          <div style={{ padding: "15px" }}>
            <Button
              variant="warning"
              onClick={handlePurchase}
              style={{
                width: "100%",
                padding: "10px",
                fontSize: "1.25rem",
                fontWeight: "bold",
                backgroundColor: "#FF6347",
                borderColor: "#FF6347",
              }}
            >
              구매하기
            </Button>
          </div>
        </Col>
      </Row>

      {/* 탭 영역 */}
      <Tabs
        id="place-detail-tabs"
        activeKey={activeTab}
        onSelect={(tab) => setActiveTab(tab)}
        className="mb-4"
      >
        <Tab eventKey="info" title="상품 상세 정보">
          <div className="place-detail-tabs">
            <p>상품 정보: {product.productName}</p>
            <p>
              <strong>상품 상세:</strong>
              {product.productDetail}
            </p>
          </div>
        </Tab>
        <Tab eventKey="posts" title="리뷰">
          <div>
            <h4>리뷰</h4>
            <ProductPost productId={productId} />
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ProductInfo;
