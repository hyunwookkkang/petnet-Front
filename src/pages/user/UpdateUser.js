import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import React, { useCallback, useState } from "react";
import DatePicker from "react-datepicker"; // DatePicker 컴포넌트 임포트
import "react-datepicker/dist/react-datepicker.css"; // 스타일 임포트

function UpdateUser() {

    const userInfo ={
        nickname: "토리",
        userId: "tori0628",
    };


    // range 함수 정의
    const range = (start, end, step = 1) => {
    const result = [];
    for (let i = start; i <= end; i += step) {
        result.push(i);
    }
    return result;
    };


  //navigation const
  const navigate = useNavigate();

  //signup
  const handleSingupNavigation = (path) => {
    console.log("수정하기");
    navigate(path);
    //마이페이지로 돌아가는데 이건수정해주세염
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
    // <Container
    //     className="d-flex justify-content-center align-items-center"
    //     style={{ height: "100vh" }}
    // >
                

                <Form>

                <Form.Group>
                    <Form.Label as="h2">
                        내 정보 보기
                    </Form.Label>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>ID </Form.Label>
                    <Form.Control type="text" placeholder={userInfo.userId} readOnly/>
                </Form.Group>

                

                <Form.Group className="mb-3">
                    <Form.Label>닉네임</Form.Label>
                    <Form.Control type="text" placeholder={userInfo.nickname} />
                </Form.Group>

                <Form.Group className="mb-3" >
                    <Form.Label>생일</Form.Label> <br/>
                    <DatePicker
                    showIcon
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    dateFormat="yyyy-MM-dd" // 날짜 형식 변경
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

                <Form.Group>
                <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    style={{ backgroundColor: "#ccc", border: "none" }}
                    >
                    <div onClick={() => handleSingupNavigation("/my")}>
                        수정하기
                    </div>
                </Button>
                </Form.Group>
            
        </Form>


    // </Container>
    );
}

export default UpdateUser;
