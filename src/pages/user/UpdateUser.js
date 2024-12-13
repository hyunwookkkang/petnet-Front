import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { useUser } from "../../components/contexts/UserContext";
import DatePicker from "react-datepicker"; // DatePicker 컴포넌트 임포트
import "react-datepicker/dist/react-datepicker.css"; // 스타일 임포트
import { showErrorToast, showSuccessToast } from "../../components/common/alert/CommonToast";
import CommonModal from "../../components/common/modal/CommonModal";

function UpdateUser() {
    const { userId, nickname, birthDate } = useUser();
    const navigate = useNavigate();

    const [updatedNickname, setUpdatedNickname] = useState(nickname || "");
    const [startDate, setStartDate] = useState(
        birthDate ? new Date(birthDate) : new Date() // 기본값 설정
    );
    const [showModal, setShowModal] = useState(false); // 모달 상태

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

    // 정보 수정 API 요청
    const handleUpdate = async () => {
        const updatedData = {
            userId, // 클라이언트에서 전달받은 ID
            nickname: updatedNickname,
            birthDate: startDate.toISOString().split("T")[0], // 날짜 형식 변환
        };

        try {
            await axios.put(`/api/users/${userId}`, updatedData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            showSuccessToast("수정되었습니다!");
            navigate("/my");
        } catch (error) {
            console.error("수정 중 오류:", error);
            showErrorToast("수정에 실패했습니다. 다시 시도해주세요.");
        }
    };

    // 회원탈퇴 API 요청
    const handleDelete = async () => {
        try {
            await axios.delete(`/api/users/${userId}`, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            showSuccessToast("회원탈퇴가 완료되었습니다.");
            navigate("/"); // 탈퇴 후 메인 페이지로 이동
        } catch (error) {
            console.error("탈퇴 중 오류:", error);
            showErrorToast("탈퇴에 실패했습니다. 다시 시도해주세요.");
        }
    };

    return (
        <>
            <Form>
                <Form.Group>
                    <Form.Label as="h2">내 정보 보기</Form.Label>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>ID </Form.Label>
                    <Form.Control type="text" placeholder={userId} readOnly />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>닉네임</Form.Label>
                    <Form.Control
                        type="text"
                        value={updatedNickname}
                        onChange={(e) => setUpdatedNickname(e.target.value)} // 상태 업데이트
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>생일</Form.Label> <br />
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
                        type="submit"
                        className="my-get-point-button"
                        onClick={handleUpdate}
                    >
                        수정하기
                    </Button>
                </Form.Group>

                <div className="text-center mt-4">
                    <Button
                        onClick={() => setShowModal(true)}
                        style={{ backgroundColor: "#DCDCDC", width: "100%", border: "none"}}
                    >
                        회원탈퇴
                    </Button>
                </div>
            </Form>

            {/* 회원탈퇴 모달 */}
            <CommonModal
                show={showModal}
                onHide={() => setShowModal(false)}
                title="회원탈퇴"
                body="정말로 탈퇴하시겠습니까?"
                footer={
                    <>
                        <Button
                            variant="secondary"
                            onClick={() => setShowModal(false)}
                        >
                            취소
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                setShowModal(false);
                                handleDelete();
                            }}
                        >
                            확인
                        </Button>
                    </>
                }
            />
        </>
    );
}

export default UpdateUser;
