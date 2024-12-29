import React, { useState, useEffect } from "react";
import { Modal, Upload, DatePicker, Input, Image, Button, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useUser } from "../../../components/contexts/UserContext";
import { showErrorToast, showSuccessToast } from "../../../components/common/alert/CommonToast";
import UpdateProductPostModal from "./UpdateProductPostModal"
import { useNavigate } from "react-router-dom";

const GetMyPlacePosts = () => {
  const { userId } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const navigate = useNavigate();

  // 리뷰 목록 가져오기
  useEffect(() => {
    if (userId) fetchMyPlacePosts();
  }, [userId]);

  const fetchMyPlacePosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/shop/productPost/myProductPost`);
      const data = await response.json();

      // postId로 중복 제거
      const uniquePosts = data.reduce((acc, post) => {
        if (!acc.find((item) => item.productPostId === post.productPostId)) {
          acc.push(post);
        }
        return acc;
      }, []);

      setPosts(uniquePosts);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching place posts:", error);
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setCurrentPost(post);
    setShowModal(true);
  };

  const handleDelete = async (productPostId) => {
    try {
      const response = await fetch(`/api/shop/productPost/${productPostId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        showSuccessToast("게시물이 성공적으로 삭제되었습니다.");
        fetchMyPlacePosts();
      } else {
        throw new Error("삭제 요청 실패");
      }
    } catch (error) {
      console.error("Error deleting place post:", error);
      showErrorToast("게시물 삭제에 실패했습니다.");
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentPost(null);
  };

  const handleNavigation = (productId) => {
    navigate(`/shop/products/${productId}`);
  };

  if (loading) return <p>리뷰 목록을 불러오는 중입니다...</p>;
  if (posts.length === 0) return <p>작성한 리뷰가 없습니다.</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>내가 쓴 리뷰</h2>
      {posts.map((post) => (
        <Card key={post.postId} style={{ marginBottom: "20px" }}>
          <Card.Meta
            title={
              <span
                onClick={() => handleNavigation(post.product.productId)}
                style={{ cursor: "pointer", color: "#1890ff" }}
              >
                {post.product.productName || "상품 이름 없음"}
              </span>
            }
            description={
              <>
                <p>작성일: {new Date(post.addDate).toLocaleDateString()}</p>
                <p>최종 수정일: {new Date(post.updateDate).toLocaleDateString()}</p>
                <p>{post.content}</p>
              </>
            }
          />
          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <Button onClick={() => handleEdit(post)}>수정</Button>
            <Button danger onClick={() => handleDelete(post.productPostId)}>
              삭제
            </Button>
          </div>
        </Card>
      ))}

      {/* 수정 모달 */}
      <UpdateProductPostModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSubmit={fetchMyPlacePosts}
        post={currentPost}
      />
    </div>
  );
};

export default GetMyPlacePosts;
