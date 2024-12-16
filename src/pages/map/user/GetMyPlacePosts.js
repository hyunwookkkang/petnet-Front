import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Button, Modal, Form } from "react-bootstrap";
import { useUser } from "../../../components/contexts/UserContext";
import { Link } from "react-router-dom"; // Link 컴포넌트 추가

const GetMyPlacePosts = () => {
    const { userId } = useUser();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // 수정 모달 상태
    const [currentPost, setCurrentPost] = useState(null); // 현재 수정 중인 포스트

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
            console.log("Fetched posts:", postsWithPlaceName);
            setPosts(postsWithPlaceName);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching place posts:", error);
            setLoading(false);
        }
    };

    const handleEdit = (post) => {
        // 모달창 띄울 때 post 데이터가 제대로 있는지 확인하고, 비어있다면 기본값 설정
        setCurrentPost({
            ...post,
            content: post.content || "",
            visitDate: post.visitDate || ""
        });
        setShowModal(true); // 모달 열기
    };

    const handleDelete = async (postId) => {
        if (window.confirm("정말 삭제하시겠습니까?")) {
            try {
                await axios.delete(`/api/map/placePosts/${postId}`, {
                    params: { userId },
                });
                setPosts((prev) => prev.filter((post) => post.postId !== postId)); // 삭제된 포스트 제거
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("삭제 중 문제가 발생했습니다.");
            }
        }
    };

    const handleSave = async () => {
        if (!currentPost.content?.trim() || !currentPost.visitDate) {
            alert("모든 필드를 입력해주세요.");
            return;
        }

        console.log("CurrentPost on save:", currentPost);

        try {
            await axios.put(
                `/api/map/placePosts/${currentPost.postId}`,
                currentPost,
                {
                    params: { userId },
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            setPosts((prev) =>
                prev.map((post) =>
                    post.postId === currentPost.postId ? currentPost : post
                )
            );
            setShowModal(false);
            setCurrentPost(null);
        } catch (error) {
            console.error("Error updating post:", error);
            alert("수정 중 문제가 발생했습니다.");
        }
    };

    if (loading) {
        return <p>리뷰 목록을 불러오는 중입니다...</p>;
    }

    if (posts.length === 0) {
        return <p>작성한 리뷰가 없습니다.</p>;
    }

    return (
        <Container style={{ maxWidth: "600px" }}>
            <h2 className="text-center mb-4" style={{ color: "#FF6347", fontWeight: "bold" }}>
                내가 쓴 리뷰
            </h2>
            {posts.map((post, index) => (
                // key를 postId 대신 index로 사용 (임시방편)
                <Card key={post.postId || index} className="mb-4 border-0 shadow-sm">
                    <Card.Body>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <div>
                                <Card.Title style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                                    {/* Link 컴포넌트로 감싸기 */}
                                    <Link to={`/place/${post.placeId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        {post.fcltyNm}
                                    </Link>
                                </Card.Title>
                                <Card.Subtitle className="mb-2 text-muted" style={{ fontSize: "0.9rem" }}>
                                    작성일: {new Date(post.addDate).toLocaleDateString()} <br />
                                    방문일: {new Date(post.visitDate).toLocaleDateString()}
                                </Card.Subtitle>
                            </div>
                            <div>
                                <Button
                                    style={{
                                        backgroundColor: "#FF6347",
                                        border: "none",
                                        fontWeight: "bold",
                                        marginRight: "5px",
                                    }}
                                    onClick={() => handleEdit(post)}
                                >
                                    수정
                                </Button>
                                <Button
                                    style={{
                                        backgroundColor: "#DCDCDC",
                                        color: "#000",
                                        border: "none",
                                        fontWeight: "bold",
                                    }}
                                    onClick={() => handleDelete(post.postId)}
                                >
                                    삭제
                                </Button>
                            </div>
                        </div>
                        <Card.Text className="mt-2" style={{ fontSize: "1rem", color: "#333" }}>
                            작성 내용<br/>{post.content}
                        </Card.Text>
                    </Card.Body>
                </Card>
            ))}

            {/* 수정 모달 */}
            {currentPost && (
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>리뷰 수정</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>방문 날짜</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={currentPost.visitDate || ""}
                                    onChange={(e) =>
                                        setCurrentPost({ ...currentPost, visitDate: e.target.value })
                                    }
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>리뷰 내용</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={currentPost.content || ""}
                                    onChange={(e) =>
                                        setCurrentPost({ ...currentPost, content: e.target.value })
                                    }
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            취소
                        </Button>
                        <Button variant="primary" onClick={handleSave}>
                            저장
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default GetMyPlacePosts;
