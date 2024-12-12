import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../components/contexts/UserContext";
import PostModal from "./PostModal";
import PostItem from "./PostItem";
import "../../../styles/place/PlacePosts.css";
import { useNavigate } from "react-router-dom";

const PlacePosts = ({ placeId }) => {
  const { userId, nickname } = useUser(); // 사용자 ID 및 닉네임 가져오기
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]); // 리뷰 목록
  const [place, setPlace] = useState(null); // 장소 정보
  const [nicknameMap, setNicknameMap] = useState({}); // userId와 nickname 매핑
  const [updatePost, setUpdatePost] = useState(null); // 수정할 리뷰
  const [newPost, setNewPost] = useState({
    content: "",
    visitDate: "",
    images: [], // 이미지 URL 목록
  }); // 새 리뷰
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지
  const [error, setError] = useState(null);

  // 장소 데이터 Fetch
  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await axios.get(`/api/map/places/${placeId}`);
        setPlace(response.data); // 장소 데이터 저장
      } catch (error) {
        console.error("Error fetching place:", error);
      }
    };

    fetchPlace();
  }, [placeId]);

  // 닉네임 가져오기 함수
  const fetchNickname = async (authorId) => {
    if (nicknameMap[authorId]) return; // 이미 닉네임이 있는 경우 호출하지 않음
    try {
      const response = await axios.get(`/api/user/nickname`, {
        params: { userId: authorId },
      });
      setNicknameMap((prev) => ({
        ...prev,
        [authorId]: response.data.nickname, // 닉네임 매핑
      }));
    } catch (error) {
      console.error(`Error fetching nickname for userId ${authorId}:`, error);
    }
  };

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
        const response = await axios.get(`/api/map/placePosts/${placeId}`);
        const fetchedPosts = response.data;

        // 닉네임 가져오기 (작성자 ID 기반)
        fetchedPosts.forEach((post) => fetchNickname(post.author_id));

        setPosts(fetchedPosts); // 리뷰 목록 저장
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [placeId, userId, navigate]);

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
    if (!newPost.content.trim() || !newPost.visitDate) {
      alert("모든 필드를 작성해주세요.");
      return;
    }

    const url = updatePost
      ? `/api/map/placePosts/${updatePost.id}`
      : `/api/map/placePosts`;
    const method = updatePost ? "PUT" : "POST";

    try {
      const response = await axios({
        method,
        url,
        data: updatePost ? updatePost : { ...newPost, placeId },
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (updatePost) {
        setPosts((prev) =>
          prev.map((p) => (p.id === updatePost.id ? response.data : p))
        );
      } else {
        setPosts((prev) => [response.data, ...prev]);
      }

      setUpdatePost(null);
      setNewPost({ content: "", visitDate: "", images: [] });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  const handleAddReview = () => {
    setIsModalOpen(true);
    setErrorMessage(""); // 에러 메시지 초기화
  };

  return (
    <div className="place-posts">
      {/* 리뷰 작성 버튼 */}
      <div className="post-actions">
        <button style={{backgroundColor: "#FF6347", border: "none"}} onClick={handleAddReview}>리뷰 작성</button>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>

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
          <strong>장소 이름:</strong> {place ? place.fcltyNm : "정보 없음"}
        </p>

        <div>
          <label htmlFor="visitDate">방문 날짜:</label>
          <input
            type="date"
            id="visitDate"
            value={updatePost ? updatePost.visitDate : newPost.visitDate}
            onChange={(e) =>
              updatePost
                ? setUpdatePost({ ...updatePost, visitDate: e.target.value })
                : setNewPost({ ...newPost, visitDate: e.target.value })
            }
            required
          />
        </div>

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

        <div className="review-images">
          <label htmlFor="imageUpload" className="image-upload-label">
            이미지 추가:
          </label>
          <input
            type="file"
            id="imageUpload"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />
          <div className="image-preview">
            {newPost.images.map((image, index) => (
              <div key={index} className="image-item">
                <img src={image} alt={`리뷰 이미지 ${index + 1}`} />
              </div>
            ))}
          </div>
        </div>
        <p className="image-limit-text">이미지 최대 3장까지 등록 가능</p>
      </PostModal>

      {/* 리뷰 목록 */}
      <div className="post-list">
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={{
              ...post,
              nickname: nicknameMap[post.author_id] || "닉네임 로딩 중...",
            }}
            isUserPost={post.author_id === userId}
            onEdit={(id) => {
              setUpdatePost(posts.find((p) => p.id === id));
              setIsModalOpen(true);
            }}
            onDelete={(id) => {
              setPosts((prev) => prev.filter((p) => p.id !== id));
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default PlacePosts;
