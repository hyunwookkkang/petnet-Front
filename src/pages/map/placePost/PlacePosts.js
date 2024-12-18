import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../components/contexts/UserContext";
import PostModal from "./PostModal";
import PostItem from "./PostItem";
import "../../../styles/place/PlacePosts.css";
import { useNavigate } from "react-router-dom";
import LoginModal from "../../../components/common/modal/LoginModal";
import DatePicker from "react-datepicker";
import PlacePostInfoModal from "./PlacePostInfoModal";

const PlacePosts = ({ placeId }) => {
  const { userId } = useUser();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [place, setPlace] = useState(null);
  const [updatePost, setUpdatePost] = useState(null);
  const [newPost, setNewPost] = useState({ content: "", visitDate: "" });
  const [imageFiles, setImageFiles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  
      // 중복된 postId 제거
      const uniquePosts = response.data.reduce((acc, current) => {
        const x = acc.find((item) => item.postId === current.postId);
        if (!x) {
          acc.push(current);
        }
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

  // 이미지 파일 추가 핸들러
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // 이미지 파일 중복 추가 방지 및 최대 3개 제한
    const validFiles = files.slice(0, 3 - imageFiles.length);
    if (validFiles.length > 0) {
      setImageFiles([...imageFiles, ...validFiles]);
    } else {
      alert("이미지는 최대 3개까지 등록할 수 있습니다.");
    }
  };

  // 리뷰 저장/수정 핸들러
  const handlePostSubmit = async () => {
    if (!newPost.content.trim() || !newPost.visitDate) {
      alert("모든 필드를 작성해주세요.");
      return;
    }
  
    if (isSubmitting) return; // 중복 제출 방지
    setIsSubmitting(true);
  
    try {
      const formData = new FormData();
      formData.append("content", newPost.content);
      formData.append("visitDate", newPost.visitDate);
      formData.append("placeId", placeId);
  
      // 이미지 파일 한 번만 추가
      imageFiles.forEach((file) => formData.append("imageFiles", file));
  
      const url = updatePost
        ? `/api/map/placePosts/${updatePost.id}`
        : `/api/map/placePosts/${placeId}`;
      const method = updatePost ? "put" : "post";
  
      await axios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      // 전체 리뷰 다시 불러오기
      await fetchPosts();
  
      resetForm();
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("리뷰 등록 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };  

  // 폼 초기화
  const resetForm = () => {
    setUpdatePost(null);
    setNewPost({ content: "", visitDate: "" });
    setImageFiles([]);
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
          onClose={resetForm}
          onSubmit={handlePostSubmit}
        >
          <div className="review-modal">
            {/* 방문 날짜 */}
            <div className="form-group">
              <label>방문 날짜</label>
              <DatePicker
                selected={
                  updatePost?.visitDate
                    ? new Date(updatePost.visitDate)
                    : new Date(newPost.visitDate || new Date())
                }
                onChange={(date) => {
                  const formattedDate = date.toISOString().split("T")[0];
                  updatePost
                    ? setUpdatePost({ ...updatePost, visitDate: formattedDate })
                    : setNewPost({ ...newPost, visitDate: formattedDate });
                }}
                maxDate={new Date()}
                dateFormat="yyyy-MM-dd"
                className="input-field"
              />
            </div>

            {/* 리뷰 내용 */}
            <div className="form-group">
              <label>리뷰 내용</label>
              <textarea
                value={updatePost ? updatePost.content : newPost.content}
                onChange={(e) =>
                  updatePost
                    ? setUpdatePost({ ...updatePost, content: e.target.value })
                    : setNewPost({ ...newPost, content: e.target.value })
                }
                placeholder="리뷰 내용을 작성하세요."
                maxLength={100}
                className="textarea-field"
              />
            </div>

            {/* 이미지 추가 */}
            <div className="form-group">
              <label>이미지 추가</label>
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileChange} 
                className="input-field"
              />
              <div className="image-list">
                {imageFiles.map((file, idx) => (
                  <div key={idx} className="image-name">{file.name}</div>
                ))}
              </div>
            </div>
          </div>
      </PostModal>

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
