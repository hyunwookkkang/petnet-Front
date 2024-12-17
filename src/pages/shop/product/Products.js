import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { Heart, HeartFill, Cart3 } from "react-bootstrap-icons";
import { useUser } from "../../../components/contexts/UserContext";

const Products = () => {
  const [products, setProducts] = useState([]); // 상품 데이터
  const [wishList, setWishList] = useState([]); // 위시리스트 상품 ID
  const [cartList, setCartList] = useState([]); // 장바구니 상품 ID
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 무한 스크롤 여부
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const navigate = useNavigate();
  const { userId } = useUser();

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

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const productsResponse = await axios.get(`/api/shop/products?currentPage=0&pageSize=6`); // 첫 페이지 상품

      let fetchedWishList = [];
      let fetchedCartList = [];
      if (userId) {
        const wishListResponse = await axios.get(`/api/shop/products/wish/${userId}`); // 위시리스트
        const cartListResponse = await axios.get(`/api/shop/products/cart/${userId}`); // 장바구니
        fetchedWishList = wishListResponse.data.map((wishItem) => wishItem.product.productId);
        fetchedCartList = cartListResponse.data.map((cartItem) => cartItem.product.productId); // 장바구니 상품 ID
      }

      // 상품 목록에 `isWished` 및 `isInCart` 플래그 추가
      const updatedProducts = productsResponse.data.map((product) => ({
        ...product,
        isWished: fetchedWishList.includes(product.productId), // 위시리스트에 포함 여부
        isInCart: fetchedCartList.includes(product.productId), // 장바구니에 포함 여부
      }));

      setWishList(fetchedWishList); // 위시리스트 상태 설정
      setCartList(fetchedCartList); // 장바구니 상태 설정
      setProducts(updatedProducts); // 상품 상태 설정
      setHasMore(updatedProducts.length > 0); // 더 가져올 데이터가 있는지 설정

      console.log("초기 로드 - 상품 목록:", updatedProducts);
    } catch (error) {
      console.error("초기 데이터 로드 오류:", error);
      setHasMore(false); // 에러 발생 시 무한 스크롤 중지
    } finally {
      setLoading(false);
    }
  };

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
      } else {
        // 위시리스트에 추가
        await axios.post(`/api/shop/products/wish/${productId}`);
        updatedWishList = [...wishList, productId];
      }

      setWishList(updatedWishList);

      // 상품 목록에서 해당 상품의 isWished 값 업데이트
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId === productId
            ? { ...product, isWished: updatedWishList.includes(productId) }
            : product
        )
      );

      console.log("위시리스트 업데이트 완료:", updatedWishList);
    } catch (error) {
      console.error("위시리스트 업데이트 오류:", error);
    }
  };

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
      await axios.post(`/api/shop/products/cart/${productId}`, { productId });

      // 장바구니 목록에 상품 추가
      setCartList((prevCartList) => [...prevCartList, productId]);

      // 상품 목록에서 해당 상품의 isInCart 값 업데이트
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId === productId
            ? { ...product, isInCart: true }
            : product
        )
      );

      console.log("장바구니에 상품 추가 완료");
    } catch (error) {
      console.error("장바구니 추가 오류:", error);
    }
  };

  const handleScroll = () => {
    const bottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.scrollHeight;
    if (bottom && hasMore) {
      setCurrentPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchProducts(nextPage);
        return nextPage;
      });

      // 스크롤을 50px 위로 올리기
      window.scrollBy(0, -50);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [userId]); // userId 변경 시 데이터 재로드

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, currentPage]);

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex flex-grow-1 justify-content-center">
          <h1 className="text-warning mb-0" style={{ fontSize: "2rem" }}>
            상품 목록
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
        {products.map((product) => (
          <Col key={product.productId}>
            <Card
              className="h-100 shadow-sm"
              style={{ cursor: "pointer", border: "none" }}
              onClick={() => navigate(`/shop/products/${product.productId}`)}
            >
              <div className="overflow-hidden" style={{ height: "200px" }}>
                <Card.Img
                  variant="top"
                  src={product.images && product.images.length > 0 ? `/api/images/${product.images[0]}` : "https://via.placeholder.com/150"}
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
                      {(product.price * (1 - product.discount / 100)).toLocaleString()} 원
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
                    toggleWish(product.productId);
                  }}
                >
                  {product.isWished ? <HeartFill /> : <Heart />}
                </Button>
                <Button
                  variant="link"
                  className="text-primary fs-5 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product.productId);
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

export default Products;
