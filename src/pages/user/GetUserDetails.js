import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Card, Button, Spinner, Modal } from "react-bootstrap";
import { showErrorToast, showSuccessToast } from "../../components/common/alert/CommonToast";

const UserDetails = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await axios.get(`/api/users/${userId}`);
                setUser(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching user details:", error);
                setError("회원 정보를 불러오는 중 오류가 발생했습니다.");
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, [userId]);

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/users/${userId}`);
            showSuccessToast("회원이 삭제되었습니다.");
            navigate("/users"); // 삭제 후 회원 목록으로 이동
        } catch (error) {
            console.error("Error deleting user:", error);
            showErrorToast("회원 삭제 중 오류가 발생했습니다.");
        }
    };

    const getRoleText = (role) => {
        switch (role) {
            case "0":
                return "최고 관리자";
            case "1":
                return "관리자";
            case "2":
                return "일반 회원";
            default:
                return "알 수 없음";
        }
    };

    if (loading) {
        return (
            <Container className="text-center" style={{ marginTop: "50px" }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return <Container className="text-danger text-center">{error}</Container>;
    }

    if (!user) {
        return <Container className="text-center">해당 회원이 존재하지 않습니다.</Container>;
    }

    return (
        <Container style={{ marginTop: "30px" }}>
            <Card>
                <Card.Header>
                    <h3>회원 상세 정보</h3>
                </Card.Header>
                <Card.Body>
                    <Card.Text style={{ marginLeft: "10px" }}>
                        <strong>회원 ID:</strong> {user.userId}
                    </Card.Text>
                    <Card.Text style={{ marginLeft: "10px" }}>
                        <strong>닉네임:</strong> {user.nickname}
                    </Card.Text>
                    <Card.Text style={{ marginLeft: "10px" }}>
                        <strong>생성 시간:</strong> {new Date(user.createTime).toLocaleString()}
                    </Card.Text>
                    <Card.Text style={{ marginLeft: "10px" }}>
                        <strong>생일:</strong> {user.birthDate}
                    </Card.Text>
                    <Card.Text style={{ marginLeft: "10px" }}>
                        <strong>보유 포인트:</strong> {user.myPoint}
                    </Card.Text>
                    <Card.Text style={{ marginLeft: "10px" }}>
                        <strong>권한:</strong> {getRoleText(user.role)}
                    </Card.Text>
                    <Button
                        variant="secondary"
                        style={{ margin: "10px" }}
                        onClick={() => navigate(-1)}
                    >
                        뒤로가기
                    </Button>
                    <Button
                        variant="danger"
                        style={{ margin: "10px" }}
                        onClick={() => setShowConfirm(true)}
                    >
                        회원 삭제
                    </Button>
                </Card.Body>
            </Card>

            {/* 회원 삭제 확인 모달 */}
            <Modal show={showConfirm} onHide={() => setShowConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>회원 삭제</Modal.Title>
                </Modal.Header>
                <Modal.Body>정말로 이 회원을 삭제하시겠습니까?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirm(false)}>
                        취소
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        삭제
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserDetails;
