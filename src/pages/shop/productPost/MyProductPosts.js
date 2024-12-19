import React, { useEffect, useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyProductPosts = () => {
  const [posts, setPosts] = useState([]); // 리뷰 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();

  // API 엔드포인트
  const apiEndpoint = "/api/shop/productPost/myProductPost";

  // 사용자 리뷰 데이터 가져오기
  const fetchMyProductPosts = async () => {
    setLoading(true); // 로딩 시작
    try {
      const response = await axios.get(apiEndpoint);
      setPosts(response.data); // 리뷰 데이터 저장
    } catch (error) {
      console.error("Error fetching product posts:", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    fetchMyProductPosts(); // 컴포넌트 로드 시 데이터 가져오기
  }, []);

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="secondary" />
        <p className="mt-3" style={{ fontSize: "1.5rem", color: "#888" }}>
          리뷰 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#FFF5EF", border: "2px solid #FF7826" }}>
      <h1 style={{ color: "#FF7826", marginBottom: "20px" }}>내가 작성한 리뷰</h1>

      {/* 리뷰 목록 출력 */}
      {posts.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>작성한 리뷰가 없습니다.</p>
      ) : (
        posts.map((post) => (
          <Card
            key={post.productPostId}
            style={{ marginBottom: "15px", padding: "15px", position: "relative" }}
          >
            <Card.Body>
              <Card.Text>
                <strong>작성자:</strong> {post.userId || "익명"}
              </Card.Text>
              <Card.Text>
                <strong>상품명:</strong> {post.product.productName}
              </Card.Text>
              <Card.Text>
                <strong>작성일:</strong> {new Date(post.addDate).toLocaleDateString()}
              </Card.Text>
              <Card.Text>
                <strong>리뷰 내용:</strong> {post.content}
              </Card.Text>

              {/* 이미지가 있을 경우 이미지 표시 */}
              {post.images && post.images.length > 0 && (
                <div>
                  <strong>리뷰 이미지:</strong>
                  <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                    {post.images.map((image, index) => (
                         <img
                           key={index}
                            src={`/api/images/${image}`} // 이미지 URL 동적 생성
                            alt={`Review Image ${index}`}
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                          />
                    ))}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        ))
      )}

      {/* 리뷰가 없을 경우 */}
      {posts.length > 0 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            style={{ backgroundColor: "#FF6347", borderColor: "#FF6347" }}
            size="lg"
            className="d-block w-100"
            onClick={() => navigate("/productPosts")} // 다른 페이지로 이동하는 버튼
          >
            다른 리뷰 보기
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyProductPosts;
