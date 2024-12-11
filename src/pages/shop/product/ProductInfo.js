//react
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//react bootstrap
import { Button, Card, Col, Container, Row, Tab, Tabs } from "react-bootstrap";
//pages
//components
import LikeButton from "../../../components/common/button/LikeButton";
//css
import "../../../styles/place/Place.css";
import ProductImage from "./ProductImage";


const ProductInfo = () => {
  const { productId } = useParams(); // URL에서 placeId 추출
  const [product, setProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("info"); // 탭 상태

  useEffect(() => {
    
    fetch(`/api/shop/products/${productId}`)
      .then((response) => response.json())
      .then((data) => setProduct(data))
      .catch((error) => console.error("Error fetching place detail:", error));
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  

  return (
    <Container>
      <Row>
        {/* <Col xs={12} md={6}>
          
          <PlaceImage />
          
        </Col> */}
      


      <Row className="mb-4">
        <Col>
          <Card className="place-button-box">
          <Card.Body style={{ padding: '10px' }}>
              <ProductImage />
                  {/* <Image
                src={`https://maps.googleapis.com/maps/api/place/photo?key=API_KEY&photo_reference=${place.photoRef}`}
                alt={place.fcltyNm}
                fluid
                  /> */}
                </Card.Body>
            </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="place-button-box">
              <Card.Body style={{ padding: '30px' }}>
                <Card.Title className="text-left text-muted">
                 <h6>{product.animalCategory}/{product.productCategory}</h6>
                </Card.Title>
                <Col className="text-left">
                  <h4><strong>{product.productName}</strong></h4>
                </Col>
                <Col className="text-left">
                  <div>
                    {/* Original Price */}
                    <p
                      className="text-muted"
                      style={{
                        textDecoration: product.discount > 0 ? "line-through" : "none",
                        fontSize: product.discount === 0 ? "1.25rem" : "",
                      }}
                    >
                      {product.price.toLocaleString()} 원
                    </p>

                    {/* Discounted Price */}
                    {product.discount > 0 && (
                      <>
                        <p
                          style={{
                            color: "red",
                            fontWeight: "bold",
                            fontSize: "1.25rem", // Approx. h6 in MUI
                          }}
                        >
                          {(
                            product.price *
                            (1 - product.discount / 100)
                          ).toLocaleString()}{" "}
                          원
                        </p>
                        <p className="text-muted" style={{ fontSize: "0.875rem" }}>
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
    
      <Row className="mb-4">
        <Col>
          <Card className="place-button-box">
              <Card.Body style={{ padding: '3px' }}>
                {/* <Card.Title className="text-center">{place.fcltyNm}</Card.Title> */}
                <Row>
                  <Col sm={11}>
                    <Button size="lg" variant="primary" className="w-100">
                      구매하기
                    </Button>
                  </Col>
                  <Col sm={1}>
                    <Button size="sm" variant="secondary" className="w-100">
                      <LikeButton />
                    </Button>
                  </Col>
                </Row>                 
              </Card.Body>
            </Card>
        </Col>
      </Row>
      
    </Row>

      {/* 탭 구성 */}
      <Tabs
        id="place-detail-tabs"
        activeKey={activeTab}
        onSelect={(tab) => setActiveTab(tab)}
        className="mb-4"
      >

     
     
        <Tab eventKey="info" title="장소 상세 정보">
          <div className="place-detail-tabs">
            <p>상품 정보: {product.productName}</p>
            
            {/* 장소상세보기 */}
            <p>
            <strong>상품 상세:</strong>{product.productDetail}
            </p>         
          </div>
        </Tab>

        {/* 리뷰Tab */}
        <Tab eventKey="posts" title="리뷰">
          <div>
            <h4>리뷰</h4>
            {/* <PlacePosts placeId = {placeId}/> */}
            {/* 로그인상태 추가 예정  isLoggedIn = {isLoggedIn}*/}
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default ProductInfo;
