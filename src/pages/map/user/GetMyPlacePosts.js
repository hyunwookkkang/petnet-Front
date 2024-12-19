import React, { useState, useEffect } from "react";
import { Modal, Upload, DatePicker, Input, Image, Button, Card } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useUser } from "../../../components/contexts/UserContext";
import { showErrorToast, showSuccessToast } from "../../../components/common/alert/CommonToast";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const GetMyPlacePosts = () => {
  const { userId } = useUser();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // 리뷰 목록 가져오기
  useEffect(() => {
    if (userId) fetchMyPlacePosts();
  }, [userId]);

  const fetchMyPlacePosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/map/placePosts/user?userId=${userId}`);
      const data = await response.json();
      setPosts(data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching place posts:", error);
      setLoading(false);
    }
  };

  const handleEdit = (post) => {
    setCurrentPost(post);
    setExistingImages(
      post.images?.map((image, index) => ({
        uid: `existing-${index}`,
        name: `Existing Image ${index + 1}`,
        status: "done",
        url: `/api/images/${image}`,
      })) || []
    );
    setFileList([]);
    setShowModal(true);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleFileChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleDeleteImage = (uid) => {
    setExistingImages((prev) => prev.filter((image) => image.uid !== uid));
  };

  const handleSave = async () => {
    if (!currentPost.content?.trim() || !currentPost.visitDate) {
      showErrorToast("모든 필드를 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("content", currentPost.content);
    formData.append("visitDate", currentPost.visitDate);

    // 기존 이미지 추가
    existingImages.forEach((image) => {
      if (image.url) {
        const imageName = image.url.split("/").pop();
        formData.append("existingImages", imageName);
      }
    });

    // 새 이미지 추가
    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("newImages", file.originFileObj);
      }
    });

    try {
      const response = await fetch(`/api/map/placePosts/${currentPost.postId}?userId=${userId}`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("서버 오류 발생");
      }

      showSuccessToast("리뷰가 성공적으로 수정되었습니다.");
      setShowModal(false);
      setCurrentPost(null);
      fetchMyPlacePosts();
    } catch (error) {
      console.error("Error updating post:", error);
      showErrorToast("리뷰 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>리뷰 목록을 불러오는 중입니다...</p>;
  if (posts.length === 0) return <p>작성한 리뷰가 없습니다.</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>내가 쓴 리뷰</h2>
      {posts.map((post) => (
        <Card key={post.postId} style={{ marginBottom: "20px" }}>
          <Card.Meta
            title={post.fcltyNm}
            description={
              <>
                <p>작성일: {new Date(post.addDate).toLocaleDateString()}</p>
                <p>방문일: {new Date(post.visitDate).toLocaleDateString()}</p>
                <p>{post.content}</p>
              </>
            }
          />
          <Button style={{ marginTop: "10px" }} onClick={() => handleEdit(post)}>
            수정
          </Button>
        </Card>
      ))}

      {/* 수정 모달 */}
      <Modal
        title="리뷰 수정"
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleSave}
      >
        <div style={{ marginBottom: "10px" }}>
          <label>방문 날짜</label>
          <DatePicker
          style={{ width: "100%" }}
          onChange={(date, dateString) =>
            setCurrentPost({ ...currentPost, visitDate: dateString })
          }
        />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>리뷰 내용</label>
          <Input.TextArea
            rows={4}
            value={currentPost?.content || ""}
            onChange={(e) =>
              setCurrentPost({ ...currentPost, content: e.target.value })
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
                  style={{ position: "absolute", top: 0, right: 0 }}
                  onClick={() => handleDeleteImage(image.uid)}
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
            onChange={handleFileChange}
          >
            {fileList.length + existingImages.length >= 3 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        </div>
      </Modal>
    </div>
  );
};

export default GetMyPlacePosts;
