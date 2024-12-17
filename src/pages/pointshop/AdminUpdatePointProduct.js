import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../../components/common/alert/CommonToast";

const AdminUpdatePointProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    price: "",
    validityDate: "",
    brandCategory: "",
    imageFiles: null,
  });

  const [originalData, setOriginalData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // 이미지 미리보기
  const [loading, setLoading] = useState(true);

  // 기존 상품 데이터 가져오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/pointshop/pointProducts/${productId}`);
        setOriginalData(response.data);
        setFormData({
          productName: response.data.productName || "",
          price: response.data.price || "",
          validityDate: response.data.validityDate || "",
          brandCategory: response.data.brandCategory || "",
          imageFiles: null,
        });
        // 기존 이미지 미리보기 설정
        if (response.data.imageIds) {
          setImagePreview(`/api/images/${response.data.imageIds}`);
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  // 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 이미지 파일 변경 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({
      ...prevData,
      imageFiles: file,
    }));
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    const bodyData = new FormData();
    bodyData.append("productName", formData.productName || originalData.productName);
    bodyData.append("price", formData.price || originalData.price);
    bodyData.append("validityDate", formData.validityDate || originalData.validityDate);
    bodyData.append("brandCategory", formData.brandCategory || originalData.brandCategory);

    if (formData.imageFiles) {
      bodyData.append("imageFiles", formData.imageFiles);
    }

    try {
      const response = await axios.put(`/api/pointshop/pointProducts/Admin/${productId}`, bodyData);

      if (response.status === 200) {
        showSuccessToast("상품이 성공적으로 수정되었습니다.");
        navigate("/");
      } else {
        showErrorToast("상품 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      showErrorToast("서버와 통신 중 문제가 발생했습니다.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!originalData) {
    return <div>상품 정보를 가져올 수 없습니다.</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center" }}>포인트 상품 수정</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <label>포인트 상품명:</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>

        <div>
          <label>포인트 가격:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>

        <div>
          <label>유효 기간(일):</label>
          <input
            type="number"
            name="validityDate"
            value={formData.validityDate}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          />
        </div>

        <div>
          <label>브랜드 카테고리:</label>
          <select
            name="brandCategory"
            value={formData.brandCategory}
            onChange={handleInputChange}
            style={{ width: "100%", padding: "10px", marginTop: "5px" }}
          >
            <option value="">선택</option>
            <option value="GS">GS</option>
            <option value="CU">CU</option>
            <option value="이마트24">이마트24</option>
          </select>
        </div>

        <div>
          <label>상품 이미지:</label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="이미지 미리보기"
              style={{ width: "100%", height: "auto", marginBottom: "10px" }}
            />
          )}
          <label>변경할 이미지 선택:</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            id="imageInput"
            onChange={handleFileChange}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#FF7826",
            color: "#FFF",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          수정하기
        </button>
      </form>
    </div>
  );
};

export default AdminUpdatePointProduct;
