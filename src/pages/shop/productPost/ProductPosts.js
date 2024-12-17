import React, { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../../../components/contexts/UserContext";
import { useNavigate } from "react-router-dom";
import PostItem from "../../map/placePost/PostItem";
import PostModal from "../../map/placePost/PostModal";

const ProductPost = ({ productId }) => {
  const { userId } = useUser(); // 사용자 ID 가져오기
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]); // 게시물 목록
  const [nicknameMap, setNicknameMap] = useState({}); // 사용자 ID와 닉네임 매핑
  const [newPost, setNewPost] = useState({
    content: "",
    images: [],
  });
  const [updatePost, setUpdatePost] = useState(null); // 수정할 게시물
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 사용자 닉네임 가져오기
  const fetchNickname = async (authorId) => {
    if (nicknameMap[authorId]) return; // 이미 있으면 중복 호출 X
    try {
      const response = await axios.get(`/api/user/test`, {
        params: { userId: authorId },
      });
      setNicknameMap((prev) => ({
        ...prev,
        [authorId]: response.data.nickname,
      }));
    } catch (error) {
      console.error("Error fetching nickname:", error);
    }
  };

  // 게시물 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/shop/productPost/${productId}`);
        const fetchedPosts = response.data;

        // 닉네임 가져오기
        fetchedPosts.forEach((post) => fetchNickname(post.author_id));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [productId]);

  // 게시물 저장/수정
  const handleSubmitPost = async () => {
    if (!newPost.content.trim()) {
      alert("게시물 내용을 입력해 주세요.");
      return;
    }

    const url = updatePost
      ? `/api/shop/productPost/${updatePost.id}`
      : `/api/shop/productPost`;
    const method = updatePost ? "PUT" : "POST";

    try {
      const response = await axios({
        method,
        url,
        data: updatePost ? updatePost : { ...newPost, productId },
        headers: { "Content-Type": "application/json" },
      });

      if (updatePost) {
        setPosts((prev) =>
          prev.map((p) => (p.id === updatePost.id ? response.data : p))
        );
      } else {
        setPosts((prev) => [response.data, ...prev]);
      }

      setIsModalOpen(false);
      setUpdatePost(null);
      setNewPost({ content: "", images: [] });
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  // 게시물 작성 모달 열기
  const handleAddPost = () => {
    setIsModalOpen(true);
    setNewPost({ content: "", images: [] });
  };

  return (
    <div className="product-posts">
      {/* 게시물 작성 버튼 */}
      <div className="post-actions">
        <button
          style={{ backgroundColor: "#FF6347", border: "none" }}
          onClick={handleAddPost}
        >
          게시물 작성
        </button>
      </div>

      {/* 게시물 작성/수정 모달 */}
      <PostModal
        title={updatePost ? "게시물 수정하기" : "게시물 작성하기"}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUpdatePost(null);
        }}
        onSubmit={handleSubmitPost}
      >
        <textarea
          value={updatePost ? updatePost.content : newPost.content}
          onChange={(e) =>
            updatePost
              ? setUpdatePost({ ...updatePost, content: e.target.value })
              : setNewPost({ ...newPost, content: e.target.value })
          }
          placeholder="게시물 내용을 입력하세요."
          maxLength={500}
        />
      </PostModal>

      {/* 게시물 목록 */}
      <div className="post-list">
        {posts.map((post) => (
          <PostItem
            key={post.id}
            post={{
              ...post,
              nickname: nicknameMap[post.author_id] || "닉네임 로딩 중...",
            }}
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
    </div>
  );
};

export default ProductPost;
