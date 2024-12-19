import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import React, { useCallback, useState } from "react";
import DatePicker from "react-datepicker"; // DatePicker 컴포넌트 임포트
import "react-datepicker/dist/react-datepicker.css"; // 스타일 임포트
//import Form from 'react-bootstrap';

function Signup() {


// range 함수 정의
    const range = (start, end, step = 1) => {
    const result = [];
    for (let i = start; i <= end; i += step) {
        result.push(i);
    }
    return result;
    };
  //비밀번호, 비밀번호 확인
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  //비밀번호 메세지
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordConfirmMessage, setPasswordConfirmMessage] = useState("");

  //비밀번호 유효성 검사
  const [isPassword, setIsPassword] = useState(false);
  const [isPasswordConfirm, setIsPasswordConfirm] = useState(false);

  //password
  const onChangePassword = useCallback((e) => {
    const passwordRegrex =
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,25}$/; //password 문자열 길이 8~25자
    const passwordCurrent = e.target.value; // e.target이란 이벤트가 발생한 html요소(이벤트 처리시 사용)
    setPassword(passwordCurrent); //e.target.value는 이벤트가 발생한 HTML 요소의 현재 값
    //사용자가 텍스트 입력란에 입력한 텍스트나 비밀번호 필드에 입력한 값이 e.target.value로 반환

    if (!passwordRegrex.test(passwordCurrent)) {
      setPasswordMessage(
        "숫자+영문자+특수문자!@#$%^*+=- 조합으로 8~25자리를 입력해주세요!"
      );
      setIsPassword(false);
    } else {
      setPasswordMessage("안전한 비밀번호입니다");
      setIsPassword(true);
    }
  }, []);

  //passwordConfirm

  const onChangePasswordConfrim = useCallback(
    (e) => {
      const passwordConfirmCurrent = e.target.value;
      setPasswordConfirm(passwordConfirmCurrent);

      if (password === passwordConfirmCurrent) {
        setPasswordConfirmMessage("똑같이 입력하셨습니다.");
        setIsPasswordConfirm(true);
      } else {
        setPasswordConfirmMessage("다르게 입력하셨습니다.");
        setIsPasswordConfirm(false);
      }
    },
    [password]
  );

  //navigation const
  const navigate = useNavigate();

  //signup
  const handleSingupNavigation = (path) => {
    console.log("회원가입 버튼");
    navigate(path);
    //회원가입페이지이동 로직
  };
  
  //react-datepicker
  const [startDate, setStartDate] = useState(new Date());
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
                <Form>
                <Form.Group className="mb-3">
                    <Form.Label>ID</Form.Label>
                    <Form.Control type="text" placeholder="아이디를 입력하세요" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                    type="password"
                    value={password}
                    onChange={onChangePassword}
                    placeholder="패스워드를 입력하세요"
                    />
                    <p>{passwordMessage}</p>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password Check</Form.Label>
                    <Form.Control
                    type="password"
                    value={passwordConfirm}
                    onChange={onChangePasswordConfrim}
                    placeholder="패스워드확인"
                    />
                    <p>{passwordConfirmMessage}</p>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>닉네임</Form.Label>
                    <Form.Control type="text" placeholder="닉네임을 입력하세요" />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>생일</Form.Label>
                    {/* <Form.Control type="text" placeholder="생일을 입력하세요" /> */}
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
                            onChange={({ target: { value } }) =>
                            changeYear(value)
                            }
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
                    style={{ backgroundColor: "#ccc", border: "none" }}
                    >
                    <div onClick={() => handleSingupNavigation("/singup")}>
                        회원가입하기
                    </div>
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
