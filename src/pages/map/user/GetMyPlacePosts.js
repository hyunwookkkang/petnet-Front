import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Button } from "react-bootstrap";
import { useUser } from "../../../components/contexts/UserContext";

const GetMyPlacePosts = () => {
    const { userId } = useUser();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPlaceName = async (placeId) => {
        try {
            const response = await axios.get(`/api/map/places/${placeId}`);
            return response.data.fcltyNm;
        } catch (error) {
            console.error(`Error fetching place name for placeId ${placeId}:`, error);
            return "정보 없음";
        }
    };

    useEffect(() => {
        if (userId) {
            fetchMyPlacePosts();
        } else {
            console.log("userId 없음");
        }
    }, [userId]);

    const fetchMyPlacePosts = async () => {
        try {
            const response = await axios.get(`/api/map/placePosts/user`, { 
                params: { userId },
                withCredentials: true,
            });
            const postsWithPlaceName = await Promise.all(
                response.data.map(async (post) => {
                    const placeName = await fetchPlaceName(post.placeId);
                    return { ...post, fcltyNm: placeName };
                })
            );
            setPosts(postsWithPlaceName);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching place posts:", error);
            setLoading(false);
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
            <h2 className="mb-4">내가 쓴 리뷰</h2>
            {posts.map((post) => (
                <Card key={post.postId} className="mb-3">
                    <Card.Body>
                        <Card.Title>
                            장소이름: {post.fcltyNm} 
                        </Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                            작성일자: {new Date(post.addDate).toLocaleDateString()}
                            <br />
                            방문날짜: {new Date(post.visitDate).toLocaleDateString()}
                        </Card.Subtitle>
                        <Card.Text>
                            작성내용: {post.content}
                        </Card.Text>
                        <Button
                            variant="primary"
                            style={{ margin: "10px" }}
                            onClick={() => alert(`수정 버튼 클릭됨: Post ID ${post.postId}`)}
                        >
                            수정
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => alert(`삭제 버튼 클릭됨: Post ID ${post.postId}`)}
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
