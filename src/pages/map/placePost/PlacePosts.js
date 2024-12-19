//react
import React, { useEffect, useState } from "react";
//pages
import PlaceModal from "./PostModal";
import PostItem from "./PostItem";
//css
import "../../../styles/place/PlacePosts.css";
<<<<<<< HEAD
=======
import { useNavigate } from "react-router-dom";
import LoginModal from "../../../components/common/modal/LoginModal";
import PlacePostInfoModal from "./PlacePostInfoModal";
>>>>>>> main

const PlacePosts = ({ placeId }) => {
  const [posts, setPosts] = useState([]); // 리뷰 목록
  const [updatePost, setUpdatePost] = useState(null); // 수정 중인 리뷰
  const [newPost, setNewPost] = useState({
    content: "",
    visitDate: "",
    images: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

<<<<<<< HEAD
  // Fetch
=======
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
>>>>>>> main
  useEffect(() => {
    fetch(`/api/map/placePosts/${placeId}`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("에러가 발생했숨당:", error));
  }, [placeId]);

<<<<<<< HEAD
  const handlePostSubmit = () => {
    const url = updatePost
      ? `/api/map/placePosts/${updatePost.id}`
      : `/api/map/placePosts`;
    const method = updatePost ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatePost ? updatePost : { ...newPost, placeId }),
    })
      .then((response) => response.json())
      .then((newPostData) => {
        if (updatePost) {
          setPosts((prev) =>
            prev.map((p) => (p.id === updatePost.id ? newPostData : p))
          );
        } else {
          setPosts((prev) => [newPostData, ...prev]);
        }
        setUpdatePost(null);
        setNewPost({ content: "", visitDate: "", images: [] });
        setIsModalOpen(false);
      })
      .catch((error) => console.error("에러발생~~비상비상:", error));
  };

  const handlePostDelete = (postId) => {
    fetch(`/api/map/placePosts/${postId}`, { method: "DELETE" })
      .then(() => {
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      })
      .catch((error) => console.error("삭제가되긋냐~:", error));
=======
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
>>>>>>> main
  };

  return (
    <div className="place-posts">
      {/* Add Post Button */}
      <div className="post-actions">
        <button onClick={() => setIsModalOpen(true)}>리뷰 작성</button>
      </div>

      {/* Modal */}
      <PlaceModal
        title={updatePost ? "리뷰 수정하기" : "리뷰 작성하기"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUpdatePost(null); // 초기화
          setNewPost({ content: "", visitDate: "", images: [] });
        }}
        onSubmit={handlePostSubmit}
      >
        {/* Post Content */}
        <textarea
          className="review-textarea"
          value={updatePost ? updatePost.content : newPost.content}
          onChange={(e) =>
            updatePost
              ? setUpdatePost({ ...updatePost, content: e.target.value })
              : setNewPost({ ...newPost, content: e.target.value })
          }
          placeholder="리뷰내용 작성 (500자 이내)"
          maxLength={500}
          required
        />

<<<<<<< HEAD
        {/* Images */}
        <div className="review-images">
          {(updatePost?.images || newPost.images).map((image, index) => (
            <div key={index} className="image-item">
              <img src={image} alt={`리뷰 이미지 ${index + 1}`} />
            </div>
          ))}
          <button className="add-image-button">+</button>
        </div>
        <p className="image-limit-text">이미지 최대 3장까지 등록 가능</p>
      </PlaceModal>

      {/* Posts List */}
=======
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
>>>>>>> main
      <div className="post-list">
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={post}
            isUserPost={false}
            onEdit={(id) => {
              setUpdatePost(posts.find((p) => p.id === id));
              setIsModalOpen(true);
            }}
<<<<<<< HEAD
            onDelete={handlePostDelete}
=======
            onDelete={() => {
              setPosts((prev) => prev.filter((p) => p.id !== post.id));
            }}
>>>>>>> main
          />
        ))}
      </div>
    </div>
  );
};

export default PlacePosts;
