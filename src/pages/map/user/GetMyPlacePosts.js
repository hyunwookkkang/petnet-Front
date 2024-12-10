import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Button } from "react-bootstrap";

const GetMyPlacePosts = ({ userId }) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyPlacePosts();
    }, []);

    const fetchMyPlacePosts = async () => {
        try {
        const response = await axios.get(`/api/user`, { params: { userId } });
        setPosts(response.data);
        setLoading(false);
        } catch (error) {
        console.error("Error fetching place posts:", error);
        setLoading(false);
        }
    };

    const handleEdit = (postId) => {
        alert(`수정 버튼 클릭됨: Post ID ${postId}`);
        // 수정 로직을 추가하거나 페이지 이동 코드 작성
    };

    const handleDelete = async (postId) => {
        if (window.confirm("정말로 삭제하시겠습니까?")) {
        try {
            await axios.delete(`/api/post/${postId}`);
            alert("리뷰가 삭제되었습니다.");
            setPosts(posts.filter(post => post.postId !== postId));
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("리뷰 삭제 중 오류가 발생했습니다.");
        }
        }
    };

    if (loading) {
        return <p>리뷰 목록을 불러오는 중입니다...</p>;
    }

    if (posts.length === 0) {
        return <p>작성한 리뷰가 없습니다.</p>;
    }

    return (
        <Container>
        <h3 className="mb-4">내가 쓴 리뷰</h3>
        {posts.map((post) => (
            <Card key={post.postId} className="mb-3">
            <Card.Body>
                <Card.Title>
                장소이름: {post.placeId} {/* placeId 대신 장소 이름을 출력하려면 추가 작업 필요 */}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                작성일자: {new Date(post.addDate).toLocaleDateString()}
                <br />
                방문날짜: {new Date(post.visitDate).toLocaleDateString()}
                </Card.Subtitle>
                <Card.Text>{post.content}</Card.Text>
                <Button
                variant="primary"
                style={{ marginRight: "10px" }}
                onClick={() => handleEdit(post.postId)}
                >
                수정
                </Button>
                <Button
                variant="danger"
                onClick={() => handleDelete(post.postId)}
                >
                삭제
                </Button>
            </Card.Body>
            </Card>
        ))}
        </Container>
    );
};

export default GetMyPlacePosts;
