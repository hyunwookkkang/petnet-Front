// src/components/place/UpdatePostModal.js
import React, { useState, useEffect } from "react";
import { Modal, Upload, DatePicker, Input, Image, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
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
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    useEffect(() => {
        if (isOpen && post) {
            setUpdatedPost({
                content: post.content || "",
                visitDate: post.visitDate || "",
            });
            setFileList([]); // 새 이미지 업로드를 위해 초기화
        }
    }, [isOpen, post]);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const handleOk = async () => {
      if (!updatedPost.content.trim() || !updatedPost.visitDate) {
          showErrorToast("모든 필드를 작성해주세요.");
          return;
      }
  
      const formData = new FormData();
      formData.append("postId", post.postId); // postId 추가
      formData.append("content", updatedPost.content);
      formData.append("visitDate", updatedPost.visitDate);
  
      fileList.forEach((file) => {
          if (file.originFileObj) {
              formData.append("imageFiles", file.originFileObj);
          }
      });
  
      try {
          const response = await axios.put(`/api/map/placePosts/${post.postId}`, formData, {
              headers: {
                  "Content-Type": "multipart/form-data",
              },
          });
  
          console.log("Request Data:", formData); // formData 확인
          console.log("Response data:", response.data);
  
          showSuccessToast("리뷰가 성공적으로 수정되었습니다.");
          onSubmit();
          onClose();
      } catch (error) {
          console.error("Error updating post:", error);
          showErrorToast(`리뷰 수정 중 오류가 발생했습니다: ${error.message}`);
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

            {/* 기존 이미지 표시 (읽기 전용) */}
            <div style={{ marginBottom: "10px" }}>
                <label>기존 이미지</label>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {post?.images?.map((imageId) => (
                        <Image
                            key={imageId}
                            src={`/api/images/${imageId}`}
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                            preview={{ src: `/api/images/${imageId}` }}
                        />
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
                    {fileList.length < 3 ? uploadButton : null} {/* 최대 3장으로 제한 */}
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
