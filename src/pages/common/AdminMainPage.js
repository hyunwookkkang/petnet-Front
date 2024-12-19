import React, { useEffect, useState }  from "react";
import { useUser } from "../../components/contexts/UserContext";
import { Container, Row, Col, Card, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../../components/common/alert/CommonToast";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "../../styles/mypage/Mypage.css";


const AdminMainPage = () => {
  const { userId, nickname, username } = useUser();
    const [error, setError] = useState(null);
  
  const navigate = useNavigate();

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

  return (
    <div>
      <Container fluid className="mt-4 content-wrapper">
        {/* Header */}
        <Card className="my-user-info-box">
          <Card.Body className = "text-center">
              <Card.Title>
                <p style={{ fontSize: '30px' }}>안녕하세요 <span className="my-nickname-text">{username}</span> 님!</p>
                <p>관리자 페이지에 오신 것을 환영합니다!</p>
              </Card.Title>
          </Card.Body>
        </Card>

        <hr style={{ border: "0.5px solid #FEBE98" }} />
        {/* Sections */}
        <Row xs={1} md={1} lg={1} className="g-4">
          {/* 포인트상점 */}
          <Col>
            <Card className="my-section">
              <Card.Body>
                <Card.Title className="my-section-title">포인트상점</Card.Title>
                <ListGroup>
                  <ListGroup.Item
                    className="my-flex-between"
                    onClick={() => navigate("/point-product-management")}
                  >
                    포인트상품관리
                    <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                  </ListGroup.Item>
                  <ListGroup.Item
                    className="my-flex-between"
                    onClick={() => navigate("/quiz-management")}
                  >
                    퀴즈관리
                    <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* 상점 */}
          <Col>
            <Card className="my-section">
              <Card.Body>
                <Card.Title className="my-section-title">상점</Card.Title>
                <ListGroup>
                  <ListGroup.Item
                    className="my-flex-between"
                    onClick={() => navigate("/shop/products/manage")}
                  >
                    상품관리
                    <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                  </ListGroup.Item>
                  <ListGroup.Item
                    className="my-flex-between"
                    onClick={() => navigate("/coupon-management")}
                  >
                    쿠폰관리
                    <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                  </ListGroup.Item>
                  <ListGroup.Item
                    className="my-flex-between"
                    onClick={() => navigate("/shop/purchase/all")}
                  >
                    주문내역관리
                    <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                  </ListGroup.Item>
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
                    onClick={() => navigate("/addPlace")}
                  >
                    장소등록
                    <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          {/* 커뮤니티 
          <Col>
            <Card className="my-section">
              <Card.Body>
                <Card.Title className="my-section-title">커뮤니티</Card.Title>
                <ListGroup>
                  <ListGroup.Item
                    className="my-flex-between"
                    onClick={() => navigate("/report-reception")}
                  >
                    신고접수
                    <ArrowForwardIosIcon style={{ color: "#DCDCDC" }} />
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>*/}
        </Row>
      </Container>
    </div>
  );
};

export default AdminMainPage;
