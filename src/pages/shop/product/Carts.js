import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from '@mui/material/IconButton';
import Typography from "@mui/material/Typography";
import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from '../../../components/contexts/UserContext';

const Carts = () => {
  const { userId } = useUser();
  const [items, setItems] = useState([]); // 상품 데이터
  const [isFetching, setIsFetching] = useState(false); // 로딩 상태 추가
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // 리다이렉트를 위한 navigate 함수

  // 상품 데이터 가져오기
  useEffect(() => {
    if (userId === null) return;

    if (!userId) {
      setError("로그인이 필요합니다.");
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setIsFetching(true);
        setError(null);
        const response = await axios.get(`/api/shop/products/cart/${userId}`);
        setItems(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchData();
  }, [userId, navigate]);

  // 수량 변경 처리 함수
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      alert("최소 수량은 1개입니다.");
      return;
    }

    try {
      // 프론트엔드 상태 업데이트
      const updatedItems = items.map((item) =>
        item.itemId === itemId ? { ...item, quantity: newQuantity } : item
      );
      setItems(updatedItems);

      // 서버 업데이트 요청
      await axios.put("/api/shop/products/cart", {
        itemId,
        quantity: newQuantity,
      });
    } catch (error) {
      console.error("수량 업데이트 오류:", error);
      alert("수량 변경 중 오류가 발생했습니다.");
    }
  };

  if (isFetching) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const handlePurchaseClick = () => {
    // 구매하기 버튼 클릭 시 addpurchase로 리다이렉트
    navigate("/shop/purchase");
  };

  return (
    <Container>
      <Row
        style={{
          paddingBottom: "50px",
          flexWrap: "wrap",
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        {items.map((productItem) => (
          <Col
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={productItem.itemId}
            style={{ paddingLeft: 0, paddingRight: 0 }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
              onClick={() =>
                navigate(`/shop/products/${productItem.product.productId}`)
              } // 카드 클릭 시 링크로 이동
            >
              <CardMedia
                component="img"
                image={
                  productItem.product.image || "https://via.placeholder.com/150"
                }
                alt={productItem.product.productName}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
              <CardContent style={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {productItem.product.animalCategory}/
                  {productItem.product.productCategory}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                  {productItem.product.productName}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  style={{
                    textDecoration:
                      productItem.product.discount > 0 ? "line-through" : "none",
                  }}
                >
                  {productItem.product.price.toLocaleString()} 원
                </Typography>
                {productItem.product.discount > 0 && (
                  <>
                    <Typography
                      variant="h6"
                      style={{ color: "red", fontWeight: "bold" }}
                    >
                      {(
                        productItem.product.price *
                        (1 - productItem.product.discount / 100)
                      ).toLocaleString()}{" "}
                      원
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {productItem.product.discount}% 할인
                    </Typography>
                  </>
                )}
              </CardContent>
              <CardActions disableSpacing>
                <IconButton
                  aria-label="add to favorites"
                  onClick={(e) => e.stopPropagation()} // 이벤트 전파 차단
                >
                  <FavoriteIcon />
                </IconButton>
                <IconButton
                  aria-label="share"
                  onClick={(e) => e.stopPropagation()} // 이벤트 전파 차단
                >
                  <ShareIcon />
                </IconButton>
                <Button
                  variant="outline-dark"
                  onClick={(e) => {
                    e.stopPropagation(); // 이벤트 전파 차단
                    handleQuantityChange(productItem.itemId, productItem.quantity - 1);
                  }}
                >
                  -
                </Button>
                <input
                  type="number"
                  value={productItem.quantity}
                  onClick={(e) => e.stopPropagation()} // 이벤트 전파 차단
                  onChange={(e) => {
                    const newQuantity = parseInt(e.target.value, 10) || 1;
                    handleQuantityChange(productItem.itemId, newQuantity);
                  }}
                  style={{ width: "50px", textAlign: "center" }}
                />
                <Button
                  variant="outline-dark"
                  onClick={(e) => {
                    e.stopPropagation(); // 이벤트 전파 차단
                    handleQuantityChange(productItem.itemId, productItem.quantity + 1);
                  }}
                >
                  +
                </Button>
              </CardActions>
            </Card>
          </Col>
        ))}
        <div className="d-grid gap-2 mt-2">
          <Button variant="primary" size="lg" onClick={handlePurchaseClick}>
            구매하기
          </Button>
          <Button variant="secondary" size="lg">
            삭제하기
          </Button>
        </div>
      </Row>
    </Container>
  );
};

export default Carts;
