//react
import React, { useEffect, useState } from "react";
//pages
import PlaceModal from "./PostModal";
import PostItem from "./PostItem";
//css
import "../../../styles/place/PlacePosts.css";

const PlacePosts = ({ placeId }) => {
  const [posts, setPosts] = useState([]); // 리뷰 목록
  const [updatePost, setUpdatePost] = useState(null); // 수정 중인 리뷰
  const [newPost, setNewPost] = useState({
    content: "",
    visitDate: "",
    images: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  // Fetch
  useEffect(() => {
    fetch(`/api/map/placePosts/${placeId}`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("에러가 발생했숨당:", error));
  }, [placeId]);

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
            onDelete={handlePostDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default PlacePosts;
