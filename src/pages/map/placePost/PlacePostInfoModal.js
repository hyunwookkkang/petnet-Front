import React from "react";
import { Modal, Button } from "react-bootstrap";

const PostDetailModal = ({ isOpen, post, onClose }) => {
    return (
        <Modal show={isOpen} onHide={onClose} centered>
        <Modal.Header closeButton>
            <Modal.Title>리뷰 상세보기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {post ? (
            <>
                <p>
                <strong>작성자 ID:</strong> {post.authorId}
                </p>
                <p>
                <strong>방문일:</strong> {post.visitDate}
                </p>
                <p>
                <strong>내용:</strong> {post.content}
                </p>
                {/* 이미지 표시 */}
                {post.images && post.images.length > 0 && (
                <div className="modal-images">
                    {post.images.map((image, idx) => (
                    <img
                        key={idx}
                        src={image} // 이미지 경로
                        alt={`리뷰 이미지 ${idx + 1}`}
                        style={{
                        maxWidth: "100%",
                        height: "auto",
                        marginBottom: "10px",
                        }}
                    />
                    ))}
                </div>
                )}
            </>
            ) : (
            <p>로딩 중...</p>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={onClose}>
            닫기
            </Button>
        </Modal.Footer>
        </Modal>
    );
};

export default PostDetailModal;
