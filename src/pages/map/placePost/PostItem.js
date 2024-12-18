import React from "react";
import { useUser } from "../../../components/contexts/UserContext"; // UserContext 추가
import "../../../styles/place/PostItem.css";

const PostItem = ({ post, isUserPost, onEdit, onDelete, onClick }) => {
  const { userId } = useUser(); // 현재 로그인된 사용자 ID 가져오기

  // 작성자 ID 추출 (post.author_id 우선 사용)
  const authorId = post.authorId || post.userId || "알 수 없는 작성자";

  return (
    <div className="post-item" onClick={() => onClick(post)}>
      {/* Header */}
      <div className="post-header">
        <strong>
          작성자: {post.authorId} {authorId === userId && "(본인)"}
        </strong>
        <span>방문일: {post.visitDate || "날짜 없음"}</span>
      </div>

      {/* Images */}
      <div className="post-images">
        {(post.images || []).map((images, index) => (
          <img
            key={index}
            src={post.images && post.images.length > 0 ? `/api/images/${post.images[index]}` : "https://via.placeholder.com/150"}
            alt={`리뷰 이미지 ${index + 1}`}
            className="post-image"
          />
        ))}
      </div>

      {/* Content */}
      <p className="post-content">{post.content || "내용 없음"}</p>

      {/* Actions */}
      {isUserPost && (
        <div className="post-actions">
          <button
            className="post-edit"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(post.id);
            }}
          >
            수정
          </button>
          <button
            className="post-delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(post.id);
            }}
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
};

export default PostItem;
