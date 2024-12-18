import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../components/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../../components/common/modal/LoginModal";
import PostModal from "../../map/placePost/PostModal";
import ProductPostItem from "./ProductPostItem";

const ProductPosts = ({ productId }) => {
  const { userId, nickname } = useUser(); // 사용자 ID 및 닉네임 가져오기
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]); // 리뷰 목록
  const [product, setProduct] = useState(null); // 상품 정보
  const [userNameMap, setUserNameMap] = useState({}); // userId와 userName 매핑
  const [updatePost, setUpdatePost] = useState(null); // 수정할 리뷰
  const [newPost, setNewPost] = useState({
    content: "",
    visitDate: "",
    images: [], // 이미지 URL 목록
  }); // 새 리뷰
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [showLoginModal, setShowLoginModal] = useState(false); // 로그인 모달 상태

  const [error, setError] = useState(null);

  // 상품 데이터 Fetch
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/shop/products/${productId}`);
        setProduct(response.data); // 상품 데이터 저장
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  // 리뷰 데이터 Fetch
  useEffect(() => {
    if (userId === null) {
      return;
    }

    if (!userId) {
      setError("로그인이 필요합니다."); // 에러 상태
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login"); // 로그인 페이지로 리다이렉트
      return;
    }

    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/shop/productPost/${productId}`);
        const fetchedPosts = response.data;

        // 중복 포스트 제거 및 유저이름 가져오기 (작성자 ID 기반)
        const uniquePosts = [];
        const uniquePostIds = new Set(); // 중복을 피하기 위해 Set 사용
        const userIdsToFetch = new Set(); // 유저 이름을 가져올 userId를 저장할 Set

        fetchedPosts.forEach((post) => {
          if (!uniquePostIds.has(post.productPostId)) {
            uniquePosts.push(post);
            uniquePostIds.add(post.productPostId); // 중복된 ID는 Set에 추가하여 처리하지 않음
            if (!userNameMap[post.userId]) {
              userIdsToFetch.add(post.userId); // 아직 유저 이름을 가져오지 않은 경우
            }
          }
        });

        setPosts(uniquePosts); // 중복되지 않는 포스트만 설정
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [productId, userId, navigate, userNameMap]);

  // 이미지 업로드 핸들러
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();

    files.forEach((file) => formData.append("imageFiles", file));

    try {
      const response = await axios.post("/api/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageIds = Array.isArray(response.data) ? response.data : [];
      const imageUrls = imageIds.map((id) => `/api/images/${id}`);
      setNewPost((prev) => ({ ...prev, images: [...prev.images, ...imageUrls] }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("이미지 업로드 실패. 다시 시도해주세요.");
    }
  };

  // 리뷰 저장/수정 핸들러
  const handlePostSubmit = async () => {
    if (!newPost.content.trim()) {
      alert("모든 필드를 작성해주세요.");
      return;
    }

    const url = updatePost
      ? `/api/shop/productPost/${updatePost.productPostId}`
      : `/api/shop/productPost`;
    const method = updatePost ? "PUT" : "POST";

    try {
      const response = await axios({
        method,
        url,
        data: updatePost ? updatePost : { ...newPost, productId },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (updatePost) {
        setPosts((prev) =>
          prev.map((p) => (p.productPostId === updatePost.productPostId ? response.data : p))
        );
      } else {
        setPosts((prev) => [response.data, ...prev]);
      }

      console.log("Review Response:", response.data);

      setUpdatePost(null);
      setNewPost({ content: "", visitDate: "", images: [] });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  // 리뷰 작성 버튼 클릭 시
  const handleAddReview = () => {
    if (!userId) {
      setShowLoginModal(true); // 로그인 모달 표시
    } else {
      setIsModalOpen(true); // 리뷰 작성 모달 열기
    }
  };

  return (
    <div className="product-posts">
      {/* 리뷰 작성 버튼 */}
      <div className="post-actions">
        <button
          style={{ backgroundColor: "#FF6347", border: "none" }}
          onClick={handleAddReview}
        >
          리뷰 작성
        </button>
      </div>
      {/* 로그인 필요 모달 */}
      <LoginModal
        showModal={showLoginModal}
        setShowModal={setShowLoginModal}
        message="리뷰를 작성하려면 로그인이 필요합니다. 로그인 화면으로 이동하시겠습니까?"
      />

      {/* 리뷰 작성/수정 모달 */}
      <PostModal
        title={updatePost ? "리뷰 수정하기" : "리뷰 작성하기"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUpdatePost(null); // 수정 상태 초기화
          setNewPost({ content: "", visitDate: "", images: [] });
        }}
        onSubmit={handlePostSubmit}
      >
        <p>
          <strong>상품 이름:</strong> {product ? product.productName : "정보 없음"}
        </p>

        <textarea
          className="review-textarea"
          value={updatePost ? updatePost.content : newPost.content}
          onChange={(e) =>
            updatePost
              ? setUpdatePost({ ...updatePost, content: e.target.value })
              : setNewPost({ ...newPost, content: e.target.value })
          }
          placeholder="리뷰 내용을 작성하세요. (500자 이내)"
          maxLength={500}
          required
        />
      </PostModal>

      {/* 리뷰 목록 */}
      <div className="post-list">
        {posts.map((post) => (
          <ProductPostItem
            key={post.productPostId}
            post={{
              ...post,
              userId: post.userId, // userId로 수정
            }}
            isUserPost={post.userId === userId}
            onEdit={(id) => {
              setUpdatePost(posts.find((p) => p.productPostId === id));
              setIsModalOpen(true);
            }}
            onDelete={(id) => {
              setPosts((prev) => prev.filter((p) => p.productPostId !== id));
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductPosts;
