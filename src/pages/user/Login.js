import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../../components/common/alert/CommonToast";

function Login() {
  const [userId, setUserId] = useState(""); // 사용자 ID
  const [password, setPassword] = useState(""); // 비밀번호
  const navigate = useNavigate();

  // 로그인 요청
  const handleLogin = async (e) => {
    e.preventDefault();

    const loginData = {
      userId,
      password,
    };

    try {
      const response = await axios.post("/api/users/signIn", loginData, {
        withCredentials: true, // 쿠키를 포함한 요청
      });

      if (response.status === 200) {
        showSuccessToast("로그인되었습니다!");

        console.log("로그인 성공");
        navigate("/"); // 홈으로 이동
      }
    } catch (error) {
      if (error.response) {
        showErrorToast(`로그인 실패: ${error.response.data}`)
      } else {
        console.error("로그인 중 오류:", error);
        showErrorToast("로그인 중 오류가 발생했습니다."); // 실패 메시지
      }
    }
  };

  const handleSignupNavigation = () => {
    navigate("/signup");
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
          <Card className="p-4 shadow">
            <Card.Body>
              <Card.Title
                className="text-center mb-4"
                style={{ color: "#febe98", fontWeight: "bold" }}
              >
                로그인
              </Card.Title>
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label><h5>ID</h5></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="아이디를 입력하세요"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label><h5>Password</h5></Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="패스워드를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  style={{ backgroundColor: "#febe98", border: "none" }}
                >
                  로그인
                </Button>
                <Button
                  variant="primary"
                  className="w-100"
                  style={{ backgroundColor: "#ccc", border: "none" }}
                  onClick={handleSignupNavigation}
                >
                  회원가입하기
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
