import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from '@mui/material/IconButton';
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useLocation } from "react-router-dom";

const Products = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]); // 상품 데이터
  const [hasMore, setHasMore] = useState(true); // 무한 스크롤 여부
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const [isFetching, setIsFetching] = useState(false); // 로딩 상태 추가

  // 쿼리 파라미터에서 검색 조건 추출
  const searchParams = new URLSearchParams(location.search);
  const queryParams = {
    searchCategory1: searchParams.get("productCategory"),
    searchCategory2: searchParams.get("animalCategory"),
    searchCondition: searchParams.get("searchCondition"),
    searchKeyword: searchParams.get("searchKeyword"),
    minValue: searchParams.get("minValue"),
    maxValue: searchParams.get("maxValue"),
    sortCondition: searchParams.get("sortCondition"),
    sortOption: searchParams.get("sortOption"),
  };

  // 상품 데이터 가져오기
  const fetchProducts = async (page) => { // page를 매개변수로 받아 페이지를 지정
    if (isFetching || !hasMore) return; // 로딩 중이거나 데이터가 없으면 실행 안 함
    setIsFetching(true);

    const queryString = new URLSearchParams(
      Object.entries(queryParams).filter(([, value]) => value !== null)
    ).toString();

    try {
      const response = await fetch(
        `/api/shop/products?currentPage=${page}&pageSize=2&${queryString}` // page를 인자로 넘겨줌
      );
      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();
      if (data.length === 0) {
        setHasMore(false); // 더 이상 데이터가 없을 때
      } else {
        setProducts((prevProducts) => [
          ...prevProducts,
          ...data.filter(
            (newProduct) =>
              !prevProducts.some((product) => product.productId === newProduct.productId)
          ),
        ]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setHasMore(false);
    } finally {
      setIsFetching(false);
    }
  };

  // 페이지 진입 시 초기화
  useEffect(() => {
    setProducts([]); // 상품 리스트 초기화
    setCurrentPage(0); // 페이지 번호 초기화
    setHasMore(true); // 더 불러올 데이터가 있다고 설정
    fetchProducts(0); // 초기 데이터 로드 (0 페이지부터)
  }, [location.search]);

  // InfiniteScroll에 페이지 증가 로직 추가
  const handleFetchMore = () => {
    setCurrentPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchProducts(nextPage); // 증가된 페이지를 넘겨서 호출
      return nextPage; // 페이지 상태 업데이트
    });
  };

  return (
    <Container style={{ height: "80vh", overflow: "auto", paddingLeft: 0, paddingRight: 0, overflowX: "hidden" }}>
      <InfiniteScroll
        dataLength={products.length}
        next={handleFetchMore} // next에 handleFetchMore 연결
        hasMore={hasMore}
        loader={isFetching ? <h4>Loading...</h4> : null} // 로딩 중일 때만 텍스트 표시
        endMessage={<p style={{ textAlign: "center" }}>모든 데이터를 불러왔습니다.</p>}
        scrollThreshold={0.95} // 95%까지 내려갔을 때 데이터를 불러오도록 설정
      >
        <Row style={{ paddingBottom: "50px", flexWrap: "wrap", marginLeft: 0, marginRight: 0 }}>
          {products.map((product) => (
            <Col xs={12} sm={6} md={4} lg={3} key={product.productId} style={{ paddingLeft: 0, paddingRight: 0 }}>
              <Link
                to={`/shop/products/${product.productId}`}
                style={{ textDecoration: "none" }}
              >
                <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
                  <CardMedia
                    component="img"
                    image={product.image || "https://via.placeholder.com/150"}
                    alt={product.productName}
                    style={{ width: "100%", height: "200px", objectFit: "cover" }}
                  />
                  <CardContent style={{ flexGrow: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      {product.animalCategory}/{product.productCategory}
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      {product.productName}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      style={{
                        textDecoration: product.discount > 0 ? "line-through" : "none",
                      }}
                    >
                      {product.price.toLocaleString()} 원
                    </Typography>
                    {product.discount > 0 && (
                      <>
                        <Typography
                          variant="h6"
                          style={{ color: "red", fontWeight: "bold" }}
                        >
                          {(
                            product.price *
                            (1 - product.discount / 100)
                          ).toLocaleString()}{" "}
                          원
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.discount}% 할인
                        </Typography>
                      </>
                    )}
                  </CardContent>
                  <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                      <ShareIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </InfiniteScroll>
    </Container>
  );
};

export default Products;
