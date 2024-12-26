import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Table, Button, Spinner } from "react-bootstrap";

const GetUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const response = await axios.get("/api/users");
            setUsers(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching users:", error);
            setError("회원 목록을 불러오는 중 오류가 발생했습니다.");
            setLoading(false);
        }
        };

        fetchUsers();
    }, []);

    const handleUserClick = (userId) => {
        navigate(`/users/${userId}`);
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

    return (
        <Container>
        <h2 className="mt-4 mb-4 text-center">회원 목록</h2>
        <Table striped bordered hover>
            <thead>
            <tr>
                <th>회원 ID</th>
                <th>닉네임</th>
                <th>생성 시간</th>
                {/* <th>포인트</th> */}
                <th>관리</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user) => (
                <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.nickname}</td>
                <td>{new Date(user.createTime).toLocaleString()}</td>
                {/* <td>{user.myPoint}</td> */}
                <td>
                    <Button
                    style={{
                        backgroundColor: "#FF6347",
                        border: "none",
                        fontSize: "10px",
                    }}
                    onClick={() => handleUserClick(user.userId)}
                    >
                    상세보기
                    </Button>
                </td>
                </tr>
            ))}
            </tbody>
        </Table>
        </Container>
    );
};

export default GetUsers;
