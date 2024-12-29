import React, { useState } from "react";
// import { Modal, Button } from "react-bootstrap";
import { Modal, Image, Button } from "antd";
import "../../../styles/place/PostInfoModal.css";

const ProductPostInfoModal = ({ isOpen, post, onClose }) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
  
    const handlePreview = (image) => {
      setPreviewImage(image); // 현재 이미지 설정
      setPreviewVisible(true); // 프리뷰 모달 열기
    };
  
    return (
      <>
        {/* 메인 모달 */}
        <Modal
          title="리뷰 상세보기"
          visible={isOpen}
          onCancel={onClose}
          footer={[
            <Button key="close" onClick={onClose}>
              닫기
            </Button>,
          ]}
          centered
        >
          {post ? (
            <div className="postInfo-review-container">
              {/* 이미지 */}
              {post.images && post.images.length > 0 && (
                <div className="postInfo-review-extra-images">
                  {post.images.map((image, idx) => (
                    <Image
                      key={idx}
                      // src={image}
                      src={post.images && post.images.length > 0 ? `/api/images/${post.images[idx]}` : "https://via.placeholder.com/150"}
                      alt={`리뷰 이미지 ${idx + 1}`}
                      width={80}
                      height={80}
                      style={{
                        objectFit: "cover",
                        marginRight: "10px",
                        borderRadius: "8px",
                        cursor: "pointer",
                      }}
                      onClick={() => handlePreview(image)} // 클릭 시 프리뷰
                    />
                  ))}
                </div>
              )}
  
              {/* 작성자 및 방문일 */}
              <div className="postInfo-review-info" style={{ marginTop: "15px" }}>
                <p>
                  <strong>작성자:</strong> {post.userId}
                </p>
                <p>
                  <strong>작성일:</strong> {post.addDate}
                </p>
                <p>
                  <strong>최종 수정일:</strong> {post.updateDate}
                </p>
              </div>
  
              {/* 리뷰 내용 */}
              <p className="postInfo-review-content" style={{ marginTop: "15px" }}>
                {post.content}
              </p>
            </div>
          ) : (
            <p>로딩 중...</p>
          )}
        </Modal>
  
        {/* 이미지 프리뷰 모달 */}
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={() => setPreviewVisible(false)}
          centered
        >
          <Image src={previewImage} alt="리뷰 이미지 확대" width="100%" />
        </Modal>
      </>
    );
  };
    export default ProductPostInfoModal;
