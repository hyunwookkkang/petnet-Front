import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom"; // Link 추가
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Main.css";

const MyMainPage = () => {

  const userInfo = {
    nickname: "토리",
    userId: "tori0628",
    points: 1500, // 내 보유 포인트
  };

  return (
    <div>

      {/* 콘텐츠를 네비게이션 아래로 배치 */}
      <Container fluid className="mt-4 content-wrapper">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <h1 className="text-center app-title">마이페이지</h1>
          </Col>
        </Row>

        {/* User Info and Points */}
        <Row className="mb-4">
          <Col>
            <Card className="user-info-box">
              <Card.Body>
                <Card.Title className="text-center">내 정보</Card.Title>
                <Row>
                  <Col>
                    <p>닉네임: {userInfo.nickname}</p>
                    <p>아이디: {userInfo.userId}</p>
                  </Col>
                  <Col className="text-end">
                    <p className="points-display">내 보유 포인트: {userInfo.points}P</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Sections */}
        <Row xs={1} md={1} lg={1} className="g-4">

          {/* 회원 관리 */}
          <Col>
            <Card className="section">
              <Card.Body>
                <Card.Title className="section-title">회원 관리</Card.Title>
                <ul className="list-unstyled">
                  <li className="section-item">
                    <Link to="/updateUser">내 정보 보기</Link>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>

          {/* 상품 관리 */}
          <Col>
            <Card className="section">
              <Card.Body>
                <Card.Title className="section-title">상품 관리</Card.Title>
                <ul className="list-unstyled">
                  <li className="section-item">
                    <Link to="/my/reviews">내 상품 리뷰 보기</Link>
                  </li>
                  <li className="section-item">
                    <Link to="/my/wishlist">찜한 상품 보기</Link>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>

          {/* 판매 관리 */}
          <Col>
            <Card className="section">
              <Card.Body>
                <Card.Title className="section-title">판매 관리</Card.Title>
                <ul className="list-unstyled">
                  <li className="section-item">
                    <Link to="/my/orders">내 주문 내역 보기</Link>
                  </li>
                  <li className="section-item">
                    <Link to="/my/refunds">내 환불 내역 보기</Link>
                  </li>
                  <li className="section-item">
                    <Link to="/my/addresses">내 배송지 관리</Link>
                  </li>
                  <li className="section-item">
                    <Link to="/my/coupons">보유중인 쿠폰</Link>
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
                    <Link to="/my/posts">내가 쓴 게시글 보기</Link>
                  </li>
                  <li className="section-item">
                    <Link to="/my/comments">내가 쓴 댓글 보기</Link>
                  </li>
                  <li className="section-item">
                    <Link to="/my/scraps">내 스크랩 게시글 보기</Link>
                  </li>
                </ul>
              </Card.Body>
            </Card>
          </Col>

          {/* 기프티콘샵 */}
          <Col>
            <Card className="section">
              <Card.Body>
                <Card.Title className="section-title">기프티콘샵</Card.Title>
                <ul className="list-unstyled">
                  <li className="section-item">
                    <Link to="/my/gifticons">기프티콘 목록</Link>
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
                    <Link to="/my/map-reviews">내가 쓴 장소리뷰 보기</Link>
                  </li>
                  <li className="section-item">
                    <Link to="/my/favorites">나의 즐겨찾기 보기</Link>
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

export default MyMainPage;
