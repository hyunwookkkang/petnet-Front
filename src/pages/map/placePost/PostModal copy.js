import React, { useState, useEffect } from "react";
import { Modal, Upload, DatePicker, Input, Image } from "antd";
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

const PostModal = ({ title, isOpen, onClose, onSubmit, post, placeId }) => {
  const [newPost, setNewPost] = useState({ content: "", visitDate: "" });
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (isOpen) {
      setNewPost({ content: "", visitDate: "" }); // 입력 필드 초기화
      setFileList([]); // 업로드된 이미지 초기화
      setPreviewImage(""); // 이미지 프리뷰 초기화
    }
  }, [isOpen]);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleOk = async () => {
    if (!newPost.content.trim() || !newPost.visitDate) {
      showErrorToast("모든 필드를 작성해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("content", newPost.content);
    formData.append("visitDate", newPost.visitDate);

    fileList.forEach((file) => {
      formData.append("imageFiles", file.originFileObj || file);
    });

    try {
      const response = await fetch(`/api/map/placePosts/${placeId}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("서버 오류 발생");
      }

      showSuccessToast("리뷰가 성공적으로 등록되었습니다.");
      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error submitting post:", error);
      showErrorToast("리뷰 등록 중 오류가 발생했습니다.");
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
      title={title}
      visible={isOpen}
      onCancel={onClose}
      onOk={handleOk}
      className="postModal-custom-modal"
    >
      <div style={{ marginBottom: "10px" }}>
        <label className="date-picker-label">방문 날짜</label>
        <DatePicker
          style={{ width: "100%" }}
          onChange={(date, dateString) =>
            setNewPost({ ...newPost, visitDate: dateString })
          }
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label className="postModal-text-area-label">리뷰 내용</label>
        <Input.TextArea
          rows={4}
          placeholder="리뷰 내용을 작성하세요."
          value={newPost.content}
          onChange={(e) =>
            setNewPost({ ...newPost, content: e.target.value })
          }
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>이미지 추가</label>
        <Upload
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
      </div>

      {previewImage && (
        <Image
          wrapperStyle={{ display: "none" }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) =>
              !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </Modal>
  );
};

export default PostModal;