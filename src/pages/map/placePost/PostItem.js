//react
import React from "react";
//css
import "../../../styles/place/PostItem.css";

const PostItem = ({ post, isUserPost, onEdit, onDelete }) => (
  <div className="post-item">
    {/* Header */}
    <div className="post-header">
      <strong>{post.nickname}</strong>
      {/* <span>작성일: {post.createdAt}</span> 필요시 각자 주석치거나 넣으세영*/}
      <span>방문일: {post.visitDate}</span>
    </div>

    {/* Images */}
    <div className="post-images">
      {post.images.map((image, index) => (
        <img key={index} src={image} alt={`리뷰 이미지 ${index + 1}`} className="post-image" />
      ))}
    </div>

    {/* Content */}
    <p className="post-content">{post.content}</p>

    {/* Actions */}
    {isUserPost && (
      <div className="post-actions">
        <button className="post-edit" onClick={() => onEdit(post.id)}>
          수정
        </button>
        <button className="post-delete" onClick={() => onDelete(post.id)}>
          삭제
        </button>
      </div>
    )}
  </div>
);

export default PostItem;
