import React, { useState, useEffect } from "react";
import { Modal, Upload, DatePicker, Input, Image, Button, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useUser } from "../../../components/contexts/UserContext";
import { showErrorToast, showSuccessToast } from "../../../components/common/alert/CommonToast";
import UpdatePostModal from "./UpdatePostModal";

const GetMyPlacePosts = () => {
  const { userId } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);

  // 리뷰 목록 가져오기
  useEffect(() => {
    if (userId) fetchMyPlacePosts();
  }, [userId]);

  const fetchMyPlacePosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/map/placePosts/user?userId=${userId}`);
      const data = await response.json();

      // postId로 중복 제거
      const uniquePosts = data.reduce((acc, post) => {
        if (!acc.find((item) => item.postId === post.postId)) {
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

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentPost(null);
  };

  if (loading) return <p>리뷰 목록을 불러오는 중입니다...</p>;
  if (posts.length === 0) return <p>작성한 리뷰가 없습니다.</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>내가 쓴 리뷰</h2>
      {posts.map((post) => (
        <Card key={post.postId} style={{ marginBottom: "20px" }}>
          <Card.Meta
            title={post.fcltyNm || "시설 이름 없음"}
            description={
              <>
                <p>작성일: {new Date(post.addDate).toLocaleDateString()}</p>
                <p>방문일: {new Date(post.visitDate).toLocaleDateString()}</p>
                <p>{post.content}</p>
              </>
            }
          />
          <Button style={{ marginTop: "10px" }} onClick={() => handleEdit(post)}>
            수정
          </Button>
        </Card>
      ))}

      {/* 수정 모달 */}
      <UpdatePostModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSubmit={fetchMyPlacePosts}
        post={currentPost}
      />
    </div>
  );
};

export default GetMyPlacePosts;
