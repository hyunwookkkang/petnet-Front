import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
//import Form from 'react-bootstrap/Form';

function Login() {

    const navigate = useNavigate();
    //login
    const handleLogin =(e)=>{
        e.preventDefault();
        console.log("로그인 버튼");
        //로그인 로직
    }
    //signup
    const handleSingupNavigation =(path)=>{;
        console.log("회원가입 버튼");
        navigate(path);
        //회원가입페이지이동 로직
    }



    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4}>
            <Card className="p-4 shadow">
            <Card.Body>
                <Card.Title className="text-center mb-4" style={{ color: "#febe98", fontWeight: "bold" }}>
                로그인
                </Card.Title>
            <Form>
            <Form.Group className="mb-3">
                    <Form.Label>ID</Form.Label>
                    <Form.Control type="email" placeholder="아이디를 입력하세요" />
                    {/* <Form.Text className="text-muted">
                    아이디를 입력하세요
                    </Form.Text> */}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="패스워드를 입력하세요" />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mb-3" style={{ backgroundColor: "#febe98", border: "none" }}>
                <div onClick={() => handleLogin()}>로그인</div>
            </Button>
            <Button variant="primary" type="submit" className="w-100" style={{ backgroundColor: "#ccc", border: "none" }}>
                <div onClick={() => handleSingupNavigation("/signup")}>회원가입하기</div>
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