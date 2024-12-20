import React from "react";
import "../../../styles/place/PostItem.css";

const ProductPostItem = ({ post, isUserPost, onEdit, onDelete }) => (
  <div className="post-item">
    {/* Header */}
    <div className="post-header">
      <strong>작성자: {post.userId || "닉네임 로딩 중..."}</strong>
      <div className="post-dates">
        <span>작성일: {post.addDate}<br/></span>
        <span>최종 수정일: {post.updateDate || post.addDate}</span>
      </div>
    </div>

    {/* Images */}
    <div className="post-images">
      {(post.images || []).map((image, index) => (
        <img key={index} src={`/api/imgaes/${image}`} alt={`리뷰 이미지 ${index + 1}`} className="post-image" />
      ))}
    </div>

    {/* Content */}
    <p className="post-content">{post.content}</p>

    {/* Actions */}
    {isUserPost && (
      <div className="post-actions">
        <button className="post-edit" onClick={() => onEdit(post.productPostId)}>
          수정
        </button>
        <button className="post-delete" onClick={() => onDelete(post.productPostId)}>
          삭제
        </button>
      </div>
    )}
  </div>
);

export default ProductPostItem;
