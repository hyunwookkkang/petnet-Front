import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Spinner, Dropdown } from "react-bootstrap";
import { Heart, HeartFill, Cart3 } from "react-bootstrap-icons";
import { useUser } from "../../../components/contexts/UserContext";
import { toast } from "react-toastify";
import { Snackbar } from "@mui/material";
import LoginModal from "../../../components/common/modal/LoginModal";

const GetProducts = () => {
  const [products, setProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("상품 전체");
  const [selectedAnimalCategory, setSelectedAnimalCategory] = useState("동물 전체");
  const { userId } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const categories = [
    "상품 전체", "사료", "간식", "장난감", "산책용품", "의류", "미용용품", "위생용품"
  ];

  const animalCategories = ["동물 전체", "강아지", "고양이"];

  // fetchProducts 함수 수정
  const fetchProducts = async (page, category = "상품 전체", animalCategory = "동물 전체") => {
    if (!hasMore) return;
    setLoading(true);

    try {
      let url = `/api/shop/products?currentPage=${page}&pageSize=6`;

      // 상품 전체가 아니면 카테고리 추가
      if (category !== "상품 전체") {
        url += `&searchCategory1=${category}`;
      }

      // 동물 전체가 아니면 동물 카테고리 추가
      if (animalCategory !== "동물 전체") {
        url += `&searchCategory2=${animalCategory}`;
      }

      const response = await axios.get(url);

      if (response.data.length === 0) {
        setHasMore(false);
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

  // fetchInitialData 함수 수정
  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(location.search);
      const categoryParam = params.get("searchCategory1") || "상품 전체";
      const animalCategoryParam = params.get("searchCategory2") || "동물 전체";

      let productsResponse;
      if (categoryParam === "상품 전체" && animalCategoryParam === "동물 전체") {
        // "상품 전체"와 "동물 전체"일 경우 파라미터 없이 기본 데이터 가져오기
        productsResponse = await axios.get(`/api/shop/products?currentPage=0&pageSize=1000`);
      } else {
        // 필요한 카테고리 파라미터만 추가
        productsResponse = await axios.get(
          `/api/shop/products?currentPage=0&pageSize=1000&${categoryParam !== "상품 전체" ? `searchCategory1=${categoryParam}` : ""}${animalCategoryParam !== "동물 전체" ? `&searchCategory2=${animalCategoryParam}` : ""}`
        );
      }

      let fetchedWishList = [];
      let fetchedCartList = [];
      if (userId) {
        const wishListResponse = await axios.get(`/api/shop/products/wish/${userId}`);
        const cartListResponse = await axios.get(`/api/shop/products/cart/${userId}`);
        fetchedWishList = wishListResponse.data.map((wishItem) => wishItem.product.productId);
        fetchedCartList = cartListResponse.data.map((cartItem) => cartItem.product.productId);
      }

      const updatedProducts = productsResponse.data.map((product) => ({
        ...product,
        isWished: fetchedWishList.includes(product.productId),
        isInCart: fetchedCartList.includes(product.productId),
      }));

      setWishList(fetchedWishList);
      setCartList(fetchedCartList);
      setProducts(updatedProducts);
      setHasMore(updatedProducts.length > 0);
    } catch (error) {
      console.error("초기 데이터 로드 오류:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const toggleWish = async (productId) => {
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    try {
      let updatedWishList;

      if (wishList.includes(productId)) {
        await axios.delete(`/api/shop/products/wish/${productId}`);
        updatedWishList = wishList.filter((id) => id !== productId);
        toast.success("찜 목록에서 제거되었습니다.");
      } else {
        await axios.post(`/api/shop/products/wish/${productId}`);
        updatedWishList = [...wishList, productId];
        toast.success("찜 목록에 물건이 추가되었습니다.");
      }

      setWishList(updatedWishList);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId === productId
            ? { ...product, isWished: updatedWishList.includes(productId) }
            : product
        )
      );
    } catch (error) {
      console.error("위시리스트 업데이트 오류:", error);
    }
  };

  const addToCart = async (productId) => {
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    if (cartList.includes(productId)) {
      setSnackbarMessage("이미 장바구니에 있는 상품입니다.");
      setShowSnackbar(true);
      return;
    }

    try {
      await axios.post(`/api/shop/products/cart/${productId}`, { productId });
      setCartList((prevCartList) => [...prevCartList, productId]);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.productId === productId
            ? { ...product, isInCart: true }
            : product
        )
      );
      toast.success("장바구니에 물건이 추가되었습니다.");
    } catch (error) {
      console.error("장바구니 추가 오류:", error);
    }
  };

  const handleScroll = () => {
    const bottom = window.innerHeight + document.documentElement.scrollTop === document.documentElement.scrollHeight;
    if (bottom && hasMore) {
      setCurrentPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchProducts(nextPage, selectedCategory, selectedAnimalCategory);
        return nextPage;
      });
      window.scrollBy(0, -50);
    }
  };

  const handleCategoryChange = (category) => {
    const params = new URLSearchParams(location.search);
  
    if (category === "상품 전체") {
      params.delete("searchCategory1");
    } else {
      params.set("searchCategory1", category);
    }
  
    navigate(`/shop/products?${params.toString()}`);
    setSelectedCategory(category);
    setCurrentPage(0); 
    setProducts([]);
    fetchProducts(0, category, selectedAnimalCategory);
  };
  
  const handleAnimalCategoryChange = (animalCategory) => {
    const params = new URLSearchParams(location.search);
  
    if (animalCategory === "동물 전체") {
      params.delete("searchCategory2");
    } else {
      params.set("searchCategory2", animalCategory);
    }
  
    navigate(`/shop/products?${params.toString()}`);
    setSelectedAnimalCategory(animalCategory);
    setCurrentPage(0); 
    setProducts([]);
    fetchProducts(0, selectedCategory, animalCategory);
  };

  useEffect(() => {
    fetchInitialData();
  }, [userId, location.search]);

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
        <p className="mt-3" style={{ fontSize: "1.5rem", color: "#888" }}>로딩 중입니다...</p>
      </div>
    );
  }

  return (
    <Container className="py-4" style={{ background: "linear-gradient(135deg, #FFFFFF, #EDEDED)" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex flex-grow-1 justify-content-center">
          <h1 className="text-warning mb-0" style={{ fontSize: "2rem" }}>상품 목록</h1>
        </div>
        <div className="d-flex align-items-center">
          <Button variant="link" className="text-dark fs-5 p-0 me-3" onClick={() => navigate(`/shop/products/cart/${userId}`)}><Cart3 /></Button>
          <Button variant="link" className="text-dark fs-5 p-0" onClick={() => navigate(`/shop/products/wish/${userId}`)}><Heart /></Button>
        </div>
      </div>

      <Row className="mb-3 g-0">
        <Col xs="auto" className="pe-2">
          <Dropdown onSelect={handleCategoryChange}>
            <Dropdown.Toggle variant="light" style={{ width: '100%' }}>
              {selectedCategory}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {categories.map((category) => (
                <Dropdown.Item key={category} eventKey={category}>
                  {category}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col xs="auto" className="ps-2">
          <Dropdown onSelect={handleAnimalCategoryChange}>
            <Dropdown.Toggle variant="light" style={{ width: '100%' }}>
              {selectedAnimalCategory}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {animalCategories.map((animalCategory) => (
                <Dropdown.Item key={animalCategory} eventKey={animalCategory}>
                  {animalCategory}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      <Row className="g-0" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {products.map((product) => (
          <Col key={product.productId}>
            <Card className="h-100 shadow-sm" style={{ cursor: "pointer", border: "none" }} onClick={() => navigate(`/shop/products/${product.productId}`)}>
              <div className="overflow-hidden" style={{ height: "200px" }}>
                <Card.Img
                  variant="top"
                  src={product.images && product.images.length > 0 ? `/api/images/${product.images[0]}` : "https://via.placeholder.com/150"}
                  alt={product.productName}
                  style={{ objectFit: "cover", height: "100%" }}
                />
              </div>

              <Card.Body style={{ padding: "6px" }}>
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
                  className="fs-5 p-0"
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

      {!hasMore && (
        <div className="text-center my-4">
          <p className="text-muted">모든 데이터를 불러왔습니다.</p>
        </div>
      )}


      <LoginModal 
        showModal={showLoginModal} 
        setShowModal={setShowLoginModal}
      />

      <Snackbar
        open={showSnackbar}
        message={snackbarMessage}
        onClose={() => setShowSnackbar(false)}
        autoHideDuration={1200}
      />

    </Container>
  );
};

export default GetProducts;
