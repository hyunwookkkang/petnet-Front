import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import React, { useCallback, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../../components/common/alert/CommonToast";


function Signup() {
  const [userId, setUserId] = useState(""); // 사용자 ID
  const [nickname, setNickname] = useState(""); // 닉네임
  const [password, setPassword] = useState(""); // 비밀번호
  const [passwordConfirm, setPasswordConfirm] = useState(""); // 비밀번호 확인
  const [startDate, setStartDate] = useState(new Date()); // 생일

  // 메시지
  const [passwordMessage, setPasswordMessage] = useState(""); // 비밀번호 유효성
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState(""); // 비밀번호 확인
  // 체크
  const [isPasswordValid, setIsPasswordValid] = useState(false); // 비밀번호 유효성 여부
  const [isPasswordConfirmValid, setIsPasswordConfirmValid] = useState(false); // 비밀번호 확인 여부

    const navigate = useNavigate();

  // range 함수 정의
    const range = (start, end, step = 1) => {
    const result = [];
    for (let i = start; i <= end; i += step) {
        result.push(i);
    }
    return result;
    };

    const years = range(1990, new Date().getFullYear() + 1, 1);
    const months = [
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월",
    ];

  // 비밀번호 유효성 검사
    const onChangePassword = useCallback((e) => {
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/;
        const currentPassword = e.target.value;
        setPassword(currentPassword);

        if (!passwordRegex.test(currentPassword)) {
            setPasswordMessage(
            "숫자+영문자+특수문자(!@#$%^*+=-) 조합으로 8~25자를 입력해주세요!"
            );
            setIsPasswordValid(false);
        } else {
            setPasswordMessage("안전한 비밀번호입니다.");
            setIsPasswordValid(true);
        }
    }, []);

  // 비밀번호 확인
    const onChangePasswordConfirm = useCallback(
        (e) => {
        const confirmPassword = e.target.value;
        setPasswordConfirm(confirmPassword);

        if (password === confirmPassword) {
            setPasswordConfirmMessage("비밀번호가 일치합니다.");
            setIsPasswordConfirmValid(true);
        } else {
            setPasswordConfirmMessage("비밀번호가 일치하지 않습니다.");
            setIsPasswordConfirmValid(false);
        }
        },
        [password]
    );

  // 회원가입 요청
    const handleSignup = async (e) => {
        e.preventDefault();

        if (!isPasswordValid || !isPasswordConfirmValid) {
            showErrorToast("비밀번호를 올바르게 입력해주세요.");
        return;
        }

        const userData = {
        userId,
        nickname,
        password,
        birthDate: startDate.toISOString().split("T")[0],
        };

        try {
        const response = await axios.post("/api/users/signUp", userData, {
            headers: {
            "Content-Type": "application/json",
            },
        });

        if (response.status === 200) {
            showSuccessToast("회원가입이 성공적으로 완료되었습니다.");
            navigate("/login"); // 회원가입 후 로그인 페이지로 이동
        }
        } catch (error) {
        if (error.response) {
            // 서버 응답 에러 처리
            showErrorToast(`회원가입 실패: ${error.response.data}`);
        } else {
            // 네트워크 또는 기타 에러 처리
            console.error("회원가입 중 오류:", error);
            showErrorToast("입력하신 정보를 다시 확인해주세요.");
        }
        }
    };

    return (
        <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
        >
        <Row className="w-100 justify-content-center">
            <Col xs={12} sm={8} md={6} lg={4}>
            <Card className="p-4 shadow">
                <Card.Body>
                <Card.Title
                    className="text-center mb-4"
                    style={{ color: "#febe98", fontWeight: "bold" }}
                >
                    회원가입
                </Card.Title>
                <Form onSubmit={handleSignup}>
                    <Form.Group className="mb-3">
                    <Form.Label>ID</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="아이디를 입력하세요"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                    </Form.Group>

                    <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="패스워드를 입력하세요"
                        value={password}
                        onChange={onChangePassword}
                    />
                    <p>{passwordMessage}</p>
                    </Form.Group>

                    <Form.Group className="mb-3">
                    <Form.Label>Password Check</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="패스워드 확인"
                        value={passwordConfirm}
                        onChange={onChangePasswordConfirm}
                    />
                    <p>{passwordConfirmMessage}</p>
                    </Form.Group>

                    <Form.Group className="mb-3">
                    <Form.Label>닉네임</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="닉네임을 입력하세요"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                    </Form.Group>

                    <Form.Group className="mb-3">
                    <Form.Label>생일</Form.Label>
                    <DatePicker
                        showIcon
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        renderCustomHeader={({
                        date,
                        changeYear,
                        changeMonth,
                        decreaseMonth,
                        increaseMonth,
                        prevMonthButtonDisabled,
                        nextMonthButtonDisabled,
                        }) => (
                        <div
                            style={{
                            margin: 10,
                            display: "flex",
                            justifyContent: "center",
                            }}
                        >
                            <button
                            onClick={decreaseMonth}
                            disabled={prevMonthButtonDisabled}
                            >
                            {"<"}
                            </button>
                            <select
                            value={date.getFullYear()}
                            onChange={({ target: { value } }) => changeYear(value)}
                            >
                            {years.map((option) => (
                                <option key={option} value={option}>
                                {option}
                                </option>
                            ))}
                            </select>
                            <select
                            value={months[date.getMonth()]}
                            onChange={({ target: { value } }) =>
                                changeMonth(months.indexOf(value))
                            }
                            >
                            {months.map((option) => (
                                <option key={option} value={option}>
                                {option}
                                </option>
                            ))}
                            </select>
                            <button
                            onClick={increaseMonth}
                            disabled={nextMonthButtonDisabled}
                            >
                            {">"}
                            </button>
                        </div>
                        )}
                    />
                    </Form.Group>

                    <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    style={{ backgroundColor: "#febe98", border: "none" }}
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

export default Signup;
