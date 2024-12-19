import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../components/contexts/UserContext";
import PostModal from "./PostModal";
import PostItem from "./PostItem";
import "../../../styles/place/PlacePosts.css";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../../components/common/modal/LoginModal";
import PlacePostInfoModal from "./PlacePostInfoModal";

const PlacePosts = ({ placeId }) => {
  const { userId } = useUser();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [place, setPlace] = useState(null);
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
    const fetchPlace = async () => {
      try {
        const response = await axios.get(`/api/map/places/${placeId}`);
        setPlace(response.data);
      } catch (error) {
        console.error("Error fetching place:", error);
      }
    };
    fetchPlace();
  }, [placeId]);

  // 리뷰 목록 Fetch
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`/api/map/placePosts/${placeId}`);
      const uniquePosts = response.data.reduce((acc, current) => {
        const x = acc.find((item) => item.postId === current.postId);
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
  }, [placeId, userId, navigate]);

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
      <PostModal
        title={updatePost ? "리뷰 수정하기" : "리뷰 작성하기"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUpdatePost(null); // 상태 리셋
        }}
        onSubmit={fetchPosts}
        post={updatePost} // 수정 모드인지 여부를 확인
        placeId={placeId}
      />

      {/* 리뷰 목록 */}
      <div className="post-list">
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            onClick={() => openInfoModal(post)}
            isUserPost={post.author_id === userId}
            onEdit={() => {
              setUpdatePost(post);
              setIsModalOpen(true);
            }}
            onDelete={() => {
              setPosts((prev) => prev.filter((p) => p.id !== post.id));
            }}
          />
        ))}
      </div>
      <PlacePostInfoModal
        isOpen={isInfoModalOpen}
        post={selectedPost}
        onClose={closeInfoModal}
      />
    </div>
  );
};

export default PlacePosts;
