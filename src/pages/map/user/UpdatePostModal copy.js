// src/components/place/UpdatePostModal.js
import React, { useState, useEffect } from "react";
import { Modal, Upload, DatePicker, Input, Image, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "../../../styles/place/PostModal.css";
import { showErrorToast, showSuccessToast } from "../../../components/common/alert/CommonToast";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const UpdatePostModal = ({ isOpen, onClose, onSubmit, post }) => {
  const [updatedPost, setUpdatedPost] = useState({ content: "", visitDate: "" });
  const [fileList, setFileList] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (isOpen && post) {
      setUpdatedPost({
        content: post.content || "",
        visitDate: post.visitDate || "",
      });
      setExistingImages(
        post.images?.map((imageId) => ({
          uid: `existing-${imageId}`,
          name: `Existing Image ${imageId}`,
          status: "done",
          url: `/api/images/${imageId}`,
          imageId,
        })) || []
      );
      setFileList([]);
      setRemovedImageIds([]);
    }
  }, [isOpen, post]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleRemoveExistingImage = (imageUid) => {
    const imageToRemove = existingImages.find((image) => image.uid === imageUid);
    if (imageToRemove) {
      setRemovedImageIds((prev) => [...prev, imageToRemove.imageId]); // 삭제 ID 추가
      setExistingImages((prev) => prev.filter((image) => image.uid !== imageUid)); // UI 업데이트
    }
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleOk = async () => {
    if (!updatedPost.content.trim() || !updatedPost.visitDate) {
      showErrorToast("모든 필드를 작성해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("content", updatedPost.content);
    formData.append("visitDate", updatedPost.visitDate);

    // 삭제할 이미지 전달
    removedImageIds.forEach((imageId) => {
      formData.append("removedImageIds", imageId);
    });

    // 새 이미지 추가
    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("imageFiles", file.originFileObj);
      }
    });

    try {
      const response = await fetch(`/api/map/placePosts/${post.postId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("서버 오류 발생");
      }

      const updatedPostData = await response.json(); // 응답 데이터가 업데이트된 PlacePost 객체

      showSuccessToast("리뷰가 성공적으로 수정되었습니다.");
      onSubmit(); // 부모에게 변경 사항 알리기 (부모는 최신 데이터를 다시 가져옴)
      onClose(); // 모달 닫기
    } catch (error) {
      console.error("Error updating post:", error);
      showErrorToast("리뷰 수정 중 오류가 발생했습니다.");
    }
  };

  const uploadButton = (
    <div className="upload-button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <Modal
      title="리뷰 수정"
      visible={isOpen}
      onCancel={onClose}
      onOk={handleOk}
      className="updatePostModal-custom-modal"
      footer={[
        <Button key="back" onClick={onClose}>
          취소
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          저장
        </Button>,
      ]}
    >
      <div style={{ marginBottom: "10px" }}>
        <label>방문 날짜</label>
        <DatePicker
                  style={{ width: "100%" }}
                  onChange={(date, dateString) =>
                    setUpdatedPost({ ...updatedPost, visitDate: dateString })
                  }
                />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>리뷰 내용</label>
        <Input.TextArea
          rows={4}
          value={updatedPost.content}
          onChange={(e) =>
            setUpdatedPost({ ...updatedPost, content: e.target.value })
          }
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>기존 이미지</label>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {existingImages.map((image) => (
            <div key={image.uid} style={{ position: "relative" }}>
              <Image
                src={image.url}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
                preview={{ src: image.url }}
              />
              <Button
                type="text"
                danger
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  padding: 0,
                  color: "white",
                  background: "red",
                  borderRadius: "50%",
                  height: "20px",
                  width: "20px",
                }}
                onClick={() => handleRemoveExistingImage(image.uid)}
              >
                X
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>새 이미지 추가</label>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={() => false} // 파일 자동 업로드 방지
        >
          {fileList.length + existingImages.length < 3 ? uploadButton : null}
        </Upload>
      </div>

      {/* 이미지 미리보기 Modal */}
      <Modal
        visible={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Modal>
  );
};

export default UpdatePostModal;
