import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Main.css"; // 기존 MyPage 스타일 재사용

const AdminMainPage = () => {
  return (
    <div>

      {/* 콘텐츠를 네비게이션 아래로 배치 */}
      <Container className="main-page content-wrapper">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h1 className="app-title">관리자 페이지</h1>
          </Col>
        </Row>

        {/* Sections */}
        <Row xs={1} md={1} lg={1} className="g-4">
          {/* 포인트상점 */}
          <Col>
            <Card className="section">
              <Card.Body>
                <Card.Title className="section-title">포인트상점</Card.Title>
                <ul className="list-unstyled">
                  <li className="section-item">
                    <a href="/point-product-management">포인트상품관리</a>
                  </li>
                  <li className="section-item">
                    <a href="/quiz-management">퀴즈관리</a>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>

          {/* 상점 */}
          <Col>
            <Card className="section">
              <Card.Body>
                <Card.Title className="section-title">상점</Card.Title>
                <ul className="list-unstyled">
                  <li className="section-item">
                    <a href="/product-management">상품관리</a>
                  </li>
                  <li className="section-item">
                    <a href="/coupon-management">쿠폰관리</a>
                  </li>
                  <li className="section-item">
                    <a href="/order-history">주문내역관리</a>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>

          {/* 지도 */}
          <Col>
            <Card className="section">
              <Card.Body>
                <Card.Title className="section-title">지도</Card.Title>
                <ul className="list-unstyled">
                  <li className="section-item">
                    <a href="/map-registration">지도등록</a>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>

          {/* 커뮤니티 */}
          <Col>
            <Card className="section">
              <Card.Body>
                <Card.Title className="section-title">커뮤니티</Card.Title>
                <ul className="list-unstyled">
                  <li className="section-item">
                    <a href="/report-reception">신고접수</a>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AdminMainPage;
