import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Tab, Tabs, Spinner } from "react-bootstrap";
import { Cart3, Heart, HeartFill } from "react-bootstrap-icons";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../../../components/contexts/UserContext";
import "../../../styles/place/Place.css";
import ProductPost from "../productPost/GetProductPosts";
import ProductImage from "./GetProductImage";
import ProductPosts from "../productPost/GetProductPosts";

const GetProduct = () => {
  const { productId } = useParams();
  const { userId } = useUser();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [wishList, setWishList] = useState([]);
  const [cartList, setCartList] = useState([]);

  // 상품 정보 및 위시리스트, 장바구니 정보 가져오기
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        // 상품 정보 가져오기
        const productResponse = await axios.get(`/api/shop/products/${productId}`);
        const productData = productResponse.data;

        let fetchedWishList = [];
        let fetchedCartList = [];
        if (userId) {
          const wishListResponse = await axios.get(`/api/shop/products/wish/${userId}`);
          const cartListResponse = await axios.get(`/api/shop/products/cart/${userId}`);
          fetchedWishList = wishListResponse.data.map((wishItem) => wishItem.product.productId);
          fetchedCartList = cartListResponse.data.map((cartItem) => cartItem.product.productId);
        }

        // 상태 업데이트
        setWishList(fetchedWishList);
        setCartList(fetchedCartList);

        // 상품 데이터에 위시리스트 및 장바구니 상태 추가
        setProduct({
          ...productData,
          isWished: fetchedWishList.includes(Number(productId)),  // productId를 Number로 변환
          isInCart: fetchedCartList.includes(Number(productId)),  // productId를 Number로 변환
        });

        console.log("isWished:", fetchedWishList.includes(Number(productId)));
        console.log("isInCart:", fetchedCartList.includes(Number(productId)));
      } catch (error) {
        console.error("상품 정보 가져오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId, userId]);

  // 위시리스트 추가/제거
  const toggleWish = async (productId) => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      let updatedWishList;

      if (wishList.includes(productId)) {
        // 위시리스트에서 제거
        await axios.delete(`/api/shop/products/wish/${productId}`);
        updatedWishList = wishList.filter((id) => id !== productId);
        alert("찜 목록에서 제거되었습니다.");
      } else {
        // 위시리스트에 추가
        await axios.post(`/api/shop/products/wish/${productId}`);
        updatedWishList = [...wishList, productId];
        alert("찜 목록에 물건이 추가되었습니다.");
      }

      setWishList(updatedWishList);

      // 상품 목록에서 해당 상품의 isWished 값 업데이트
      setProduct((prevProduct) => ({
        ...prevProduct,
        isWished: updatedWishList.includes(productId),
      }));
    } catch (error) {
      console.error("위시리스트 업데이트 오류:", error);
    }
  };

  // 장바구니 추가
  const addToCart = async (productId) => {
    if (!userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (cartList.includes(productId)) {
      alert("이미 장바구니에 있는 상품입니다.");
      return;
    }

    try {
      // 장바구니에 추가 요청
      await axios.post(`/api/shop/products/cart/${productId}`);

      // 장바구니 목록에 상품 추가
      setCartList((prevCartList) => [...prevCartList, productId]);

      // 상품 목록에서 해당 상품의 isInCart 값 업데이트
      setProduct((prevProduct) => ({
        ...prevProduct,
        isInCart: true,
      }));

      alert("장바구니에 물건이 추가되었습니다.");
    } catch (error) {
      console.error("장바구니 추가 오류:", error);
    }
  };

  // 구매 처리
  const handlePurchase = async () => {
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 후 다시 시도해주세요.");
      return;
    }

    try {
      await axios.post("/api/shop/purchase", { userId, productId });
      alert("구매가 완료되었습니다!");
    } catch (error) {
      console.error("구매 처리 오류:", error);
      alert("구매 처리에 실패했습니다.");
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

  return (
    <Container>
      <Row>
        <Col>
          <Card className="place-button-box">
            <Card.Body style={{ padding: "10px" }}>
              <ProductImage productId={productId} />
            </Card.Body>
            <div style={{ display: "flex", justifyContent: "space-around", padding: "15px" }}>
              <Button
                variant="outline-danger"
                onClick={() => toggleWish(Number(productId))}  // productId를 Number로 변환하여 전달
                style={{ flex: "1", margin: "0 10px" }}
              >
                {product.isWished ? <HeartFill /> : <Heart />}
              </Button>
              <Button
                variant="outline-primary"
                onClick={() => addToCart(Number(productId))}  // productId를 Number로 변환하여 전달
                style={{ flex: "1", margin: "0 10px" }}
              >
                <Cart3 /> 장바구니
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <Card className="place-button-box">
            <Card.Body style={{ padding: "30px" }}>
              <Card.Title className="text-left text-muted">
                <h6>{product.animalCategory}/{product.productCategory}</h6>
              </Card.Title>
              <Col className="text-left">
                <h4><strong>{product.productName}</strong></h4>
              </Col>
              <Col className="text-left">
                <p className="text-muted" style={{ textDecoration: product.discount > 0 ? "line-through" : "none" }}>
                  {product.price.toLocaleString()} 원
                </p>
                {product.discount > 0 && (
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    {(product.price * (1 - product.discount / 100)).toLocaleString()} 원
                  </p>
                )}
              </Col>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Button
            variant="warning"
            onClick={handlePurchase}
            style={{ width: "100%", padding: "10px", fontSize: "1.25rem", backgroundColor: "#FF6347" }}
          >
            구매하기
          </Button>
        </Col>
      </Row>
      <Tabs activeKey={activeTab} onSelect={(tab) => setActiveTab(tab)} className="mb-4">
        <Tab eventKey="info" title="상품 상세 정보">
          <div>
            <p>{product.productName}</p>
            <p><strong>상품 상세:</strong> {product.productDetail}</p>
          </div>
        </Tab>
        <Tab eventKey="posts" title="리뷰">
          <ProductPosts productId={productId} />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default GetProduct;
