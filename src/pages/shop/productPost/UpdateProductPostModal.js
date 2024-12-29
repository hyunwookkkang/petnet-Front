// UpdatePostModal.js
import React, { useState, useEffect } from "react";
import { Modal, Upload, DatePicker, Input, Image, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  showErrorToast,
  showSuccessToast,
} from "../../../components/common/alert/CommonToast";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const UpdateProductPostModal = ({ isOpen, onClose, onSubmit, post }) => {
  const [updatedPost, setUpdatedPost] = useState({ content: "", visitDate: "" });
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // (1) 삭제할 이미지 ID를 담는 상태 추가
  const [removedImageIds, setRemovedImageIds] = useState([]);

  useEffect(() => {
    if (isOpen && post) {
      setUpdatedPost({
        content: post.content || "",
      });
      // 모달이 새로 열릴 때마다 파일 리스트, 삭제 목록 초기화
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

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  // (2) 기존 이미지 삭제 버튼 동작
  const handleRemoveExistingImage = (imageId) => {
    // 삭제할 이미지 ID 추가
    setRemovedImageIds((prev) => [...prev, imageId]);
  };

  const handleOk = async () => {
    if (!updatedPost.content.trim()) {
      showErrorToast("모든 필드를 작성해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("productPostId", post.productPostId); 
    formData.append("content", updatedPost.content);

    // (3) 새로 업로드하는 이미지들을 formData에 추가
    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("imageFiles", file.originFileObj);
      }
    });

    // (4) 삭제할 이미지 ID들을 formData에 추가
    //     서버에서 @RequestParam(value="removedImageIds") List<Integer>로 받으므로
    //     배열 형태로 여러번 append
    removedImageIds.forEach((id) => {
      formData.append("removedImageIds", id);
    });

    try {
      const response = await axios.put(
        `/api/shop/productPost/${post.productPostId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Request Data:", formData);
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
        <Button
        key="submit"
        type="primary"
        onClick={handleOk}
        style={{ backgroundColor: '#febe98', borderColor: '#febe98' }}
      >
        저장
      </Button>
      ,
      ]}
    >

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

      {/* (5) 기존 이미지 표시. 여기서 각 이미지 우측에 "삭제" 버튼 추가 */}
      <div style={{ marginBottom: "10px" }}>
        <label>기존 이미지</label>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {post?.images?.map((imageId) => {
            // removedImageIds에 포함되어 있다면 이미 "삭제" 상태로 보고 안 보여줌줌
            if (removedImageIds.includes(imageId)) {
              return null; // 삭제 요청을 한 상태라면 리스트에서 임시로 숨기기
            }

            return (
              <div
                key={imageId}
                style={{ position: "relative", display: "inline-block" }}
              >
                <Image
                  src={`/api/images/${imageId}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                  preview={{ src: `/api/images/${imageId}` }}
                />
                {/* 작은 X 버튼처럼 보이도록 스타일*/}
                <Button
                  type="text"
                  danger
                  onClick={() => handleRemoveExistingImage(imageId)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "#fff",
                  }}
                >
                  X
                </Button>
              </div>
            );
          })}
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
          {fileList.length < 3 ? uploadButton : null} {/* 최대 3장 제한 */}
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

export default UpdateProductPostModal;
