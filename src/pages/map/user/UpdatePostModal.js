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

    const UpdatePostModal = ({ isOpen, onClose, onSubmit, post }) => {
    const [updatedPost, setUpdatedPost] = useState({ content: "", visitDate: "" });
    const [fileList, setFileList] = useState([]);
    const [existingImages, setExistingImages] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    useEffect(() => {
        if (isOpen && post) {
        setUpdatedPost({
            content: post.content || "",
            visitDate: post.visitDate || "",
        });
        setExistingImages(
            post.images?.map((image, index) => ({
            uid: `existing-${index}`,
            name: `Existing Image ${index + 1}`,
            status: "done",
            url: `/api/images/${image}`,
            })) || []
        );
        setFileList([]);
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
        formData.append("content", updatedPost.content);
        formData.append("visitDate", updatedPost.visitDate);

        existingImages.forEach((image) => {
        if (image.url) {
            const imageName = image.url.split("/").pop();
            formData.append("existingImages", imageName);
        }
        });

        fileList.forEach((file) => {
        if (file.originFileObj) {
            formData.append("newImages", file.originFileObj);
        }
        });

        try {
        if (!post?.postId) {
            showErrorToast("유효한 postId가 없습니다.");
            return;
        }

        const response = await fetch(`/api/map/placePosts/${post.postId}`, {
            method: "PUT",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("서버 오류 발생");
        }

        showSuccessToast("리뷰가 성공적으로 수정되었습니다.");
        onSubmit();
        onClose();
        } catch (error) {
        console.error("Error updating post:", error);
        showErrorToast("리뷰 수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <Modal
        title="리뷰 수정"
        visible={isOpen}
        onCancel={onClose}
        onOk={handleOk}
        className="updatePostModal-custom-modal"
        >
        <div>
            <label>방문 날짜</label>
            <DatePicker
            style={{ width: "100%" }}
            onChange={(date, dateString) =>
                setUpdatedPost({ ...updatedPost, visitDate: dateString })
            }
            />
        </div>

        <div>
            <label>리뷰 내용</label>
            <Input.TextArea
            rows={4}
            value={updatedPost.content}
            onChange={(e) =>
                setUpdatedPost({ ...updatedPost, content: e.target.value })
            }
            />
        </div>

        <div>
            <label>기존 이미지</label>
            {existingImages.map((image) => (
            <Image key={image.uid} src={image.url} style={{ width: 100 }} />
            ))}
        </div>

        <div>
            <label>새 이미지 추가</label>
            <Upload
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
            >
            {fileList.length >= 3 ? null : <div>Upload</div>}
            </Upload>
        </div>
        </Modal>
    );
    };

    export default UpdatePostModal;
