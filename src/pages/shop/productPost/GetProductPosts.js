import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../components/contexts/UserContext";
import "../../../styles/place/PlacePosts.css";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../../components/common/modal/LoginModal";
import ProductPostInfoModal from "./ProductPostInfoModal";
import ProductPostItem from "./ProductPostItem";
import ProductPostModal from "./ProductPostModal";

const GetProductPosts = ({ productId }) => {
  const { userId } = useUser();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [product, setProduct] = useState(null);
  const [updatePost, setUpdatePost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 상세보기 모달 상태
  const [selectedPost, setSelectedPost] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // 상세 모달 열기
  const openInfoModal = (post) => {
    setSelectedPost(post);
    setIsInfoModalOpen(true);
  };

  // 상세 모달 닫기
  const closeInfoModal = () => {
    setSelectedPost(null);
    setIsInfoModalOpen(false);
  };

  // 장소 데이터 Fetch
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/shop/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching place:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  // 리뷰 목록 Fetch
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/shop/productPost/${productId}`);
      const uniquePosts = response.data.reduce((acc, current) => {
        const x = acc.find((item) => item.productPostId === current.productPostId);
        if (!x) acc.push(current);
        return acc;
      }, []);
      setPosts(uniquePosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchPosts();
    else navigate("/login");
  }, [productId, userId, navigate]);

  // 폼 초기화
  const resetForm = () => {
    setUpdatePost(null);
    setIsModalOpen(false);
  };

  return (
    <div className="place-posts">
      {/* 리뷰 작성 버튼 */}
      <div className="post-actions">
        <button
          style={{ backgroundColor: "#FF6347", border: "none" }}
          onClick={() =>
            userId ? setIsModalOpen(true) : setShowLoginModal(true)
          }
        >
          리뷰 작성
        </button>
      </div>

      {/* 로그인 필요 모달 */}
      <LoginModal
        showModal={showLoginModal}
        setShowModal={setShowLoginModal}
        message="리뷰를 작성하려면 로그인이 필요합니다."
      />

      {/* 리뷰 작성/수정 모달 */}
      <ProductPostModal
        title={updatePost ? "리뷰 수정하기" : "리뷰 작성하기"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUpdatePost(null); // 상태 리셋
        }}
        onSubmit={fetchPosts}
        post={updatePost} // 수정 모드인지 여부를 확인
        productId={productId}
      />

      {/* 리뷰 목록 */}
      <div className="post-list">
        {posts.map((post) => (
          <ProductPostItem
            key={post.productPostId}
            post={post}
            onClick={() => openInfoModal(post)}
            isUserPost={post.user_id === userId}
            onEdit={() => {
              setUpdatePost(post);
              setIsModalOpen(true);
            }}
            onDelete={() => {
              setPosts((prev) => prev.filter((p) => p.userId !== post.userId));
            }}
          />
        ))}
      </div>
      <ProductPostInfoModal
        isOpen={isInfoModalOpen}
        post={selectedPost}
        onClose={closeInfoModal}
      />
    </div>
  );
};

export default GetProductPosts;
