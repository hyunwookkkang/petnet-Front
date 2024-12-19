import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"; // Link 추가
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/mypage/Mypage.css";
import { useUser } from "../../components/contexts/UserContext";
import { showErrorToast } from "../../components/common/alert/CommonToast";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

//icons
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';  //주문내역
import SavingsIcon from '@mui/icons-material/Savings';  //가계부
import RedeemIcon from '@mui/icons-material/Redeem';  //기프티콘
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';  //포인트 얻기
import LocalParkingRoundedIcon from '@mui/icons-material/LocalParkingRounded';


const MyMainPage = () => {
  
  const { userId, nickname, myPoint } = useUser();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);


  
  useEffect(() => {

    if(userId ===null){
      return;
    }

    if(!userId){
      setError("로그인이 필요합니다."); // 로그인이 필요한 경우 처리
      showErrorToast("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
      return;
    }

  });

  const images = [
    '/assets/common/cat1.png', // 첫 번째 이미지
    '/assets/common/cat2.png'  // 두 번째 이미지
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 400);

    // 컴포넌트가 unmount 될 때 interval을 클리어
    return () => clearInterval(interval);
  }, []);

  return (
    <div>

      {/* 콘텐츠를 네비게이션 아래로 배치 */}
      <Container fluid className="mt-4 content-wrapper">
        {/* User Info and Points */}
        <Row className="mb-4 justify-content-center">
          <Col>
            <Card className="my-user-info-box">
              <Card.Body className = "text-center">
                <Card.Title><p style={{ fontSize: '30px' }}>안녕하세요 <span className="my-nickname-text">{nickname}</span> 님!</p> <br/>
                
                </Card.Title>
                <Row className="d-flex flex-wrap justify-content-center align-items-center">
                  <Col xs="auto" className="my-icon-container">
                    <p className="my-icon-text">
                      <span style={{ fontWeight: 'bold', fontSize: '24px', color: "#FEBE98" }}>{myPoint || 0}P</span>
                      내 보유포인트
                    </p>
                  </Col>

                  <Col xs="auto" className="my-icon-container" onClick={() => navigate("/shop/purchase/my")}>
                    <p className="my-icon-text">
                      <span style={{ fontSize: '24px', color: "#FEBE98" }}><ShoppingBasketOutlinedIcon /></span>
                      주문내역
                    </p>
                  </Col>

                  <Col xs="auto" className="my-icon-container" onClick={() => navigate("/gifticons")}>
                    <p className="my-icon-text">
                      <span style={{ fontSize: '24px', color: "#FEBE98" }}><RedeemIcon /></span>
                      기프티콘
                    </p>
                  </Col>

                  {/* <Col xs="auto" className="my-icon-container" onClick={() => navigate("/cashbook")}>
                    <p className="my-icon-text">
                      <span style={{ fontSize: '24px', color: "#FEBE98" }}><SavingsIcon /></span>
                      가계부
                    </p>
                  </Col> */}
                  <hr style={{ border: "0.5px solid #FEBE98", width: "100%" }} />
                </Row>
              </Card.Body>
                <Button className = "my-get-point-button" onClick={() => navigate("/pointQuiz")}>
                  <PaidOutlinedIcon />&nbsp;퀴즈 맞추고 100P 받기!
                </Button>
                <div className ="my-cat-text"><img src={images[imageIndex]} alt="Image" />  </div>
            </Card>
          </Col>
        </Row>

        <Row xs={1} md={1} lg={1} className="g-4">
        {/* 회원 관리 */}
        <Col>
          <Card className="my-section">
            <Card.Body>
              <Card.Title className="my-section-title">회원 관리</Card.Title>
              <ListGroup>
                <ListGroup.Item
                  key="updateUser"
                  className="my-flex-between"
                  onClick={() => navigate("/updateUser")} // 네비게이션 설정
                >
                  내 정보 보기
                  <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* 상품 관리 */}
        <Col>
          <Card className="my-section">
            <Card.Body>
              <Card.Title className="my-section-title">상품 관리</Card.Title>
              <ListGroup>
                <ListGroup.Item
                  key="myReviews"
                  className="my-flex-between"
                  onClick={() => navigate("/my/reviews")}
                >
                  내 상품 리뷰 보기
                  <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                </ListGroup.Item>
                <ListGroup.Item
                  key="myWishlist"
                  className="my-flex-between"
                  onClick={() => navigate("/my/wishlist")}
                >
                  찜한 상품 보기
                  <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* 판매 관리 */}
        <Col>
          <Card className="my-section">
            <Card.Body>
              <Card.Title className="my-section-title">판매 관리</Card.Title>
              <ListGroup>
                
                <ListGroup.Item
                  key="myRefunds"
                  className="my-flex-between"
                  onClick={() => navigate("/my/refunds")}
                >
                  내 환불 내역 보기
                  <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                </ListGroup.Item>
                <ListGroup.Item
                  key="myAddresses"
                  className="my-flex-between"
                  onClick={() => navigate("/deliveryInfo")}
                >
                  내 배송지 관리
                  <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                </ListGroup.Item>
                <ListGroup.Item
                  key="myCoupons"
                  className="my-flex-between"
                  onClick={() => navigate("/my/coupons")}
                >
                  보유중인 쿠폰
                  <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* 커뮤니티 */}
        <Col>
          <Card className="my-section">
            <Card.Body>
              <Card.Title className="my-section-title">커뮤니티</Card.Title>
              <ListGroup>
                <ListGroup.Item
                  key="myScraps"
                  className="my-flex-between"
                  onClick={() => navigate("/getScraps")}
                >
                  내 스크랩 게시글 보기
                  <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                </ListGroup.Item>
                <ListGroup.Item
                  key="myTopics"
                  className="my-flex-between"
                  onClick={() => navigate("/getMyTopics")}
                >
                  내가 쓴 게시글 보기
                  <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                </ListGroup.Item>
                <ListGroup.Item
                  key="myComments"
                  className="my-flex-between"
                  onClick={() => navigate("/getMyComments")}
                >
                  내가 쓴 댓글 보기
                  <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                </ListGroup.Item>
                {/* <ListGroup.Item
                  key="myReports"
                  className="my-flex-between"
                  onClick={() => navigate("/getMyReports")}
                >
                  내가 보낸 신고 보기
                  <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                </ListGroup.Item> */}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>


        {/* 지도 */}
        <Col>
          <Card className="my-section">
            <Card.Body>
              <Card.Title className="my-section-title">지도</Card.Title>
              <ListGroup>
                <ListGroup.Item
                  className="my-flex-between"
                  onClick={() => navigate("/my/placeposts")}
                >
                  내가 쓴 장소리뷰 보기
                  <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                </ListGroup.Item>
                <ListGroup.Item
                  key="placeFavorite"
                  className="my-flex-between"
                  onClick={() => navigate("/placeFavorite")}
                >
                  나의 즐겨찾기 보기
                  <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    </div>
  );
};

export default MyMainPage;
