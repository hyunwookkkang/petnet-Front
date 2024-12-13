import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ProductForm from "./ProductForm";

const AddOrEditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: "",
    price: "0",
    productStock: "0",
    discount: "0",
    productDetail: "",
    productCategory: "사료",
    animalCategory: "강아지",
  });

  const [imageFiles, setImageFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length + imageFiles.length <= 3) {
      setImageFiles([...imageFiles, ...files]);
    } else {
      alert("이미지는 최대 3개까지 등록할 수 있습니다.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("productName", formData.productName);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("productStock", formData.productStock);
    formDataToSend.append("discount", formData.discount);
    formDataToSend.append("productCategory", formData.productCategory);
    formDataToSend.append("animalCategory", formData.animalCategory);
    formDataToSend.append("productDetail", formData.productDetail);

    // 이미지 파일을 FormData에 추가
    for (let i = 0; i < imageFiles.length; i++) {
      formDataToSend.append("imageFiles", imageFiles[i]);
    }

    axios
      .post("/api/shop/products", formDataToSend)
      .then(() => {
        alert("상품이 추가되었습니다!");
        navigate("/admin");
      })
      .catch((err) => {
        console.error(err);
        alert("상품 추가 중 오류가 발생했습니다.");
      });
  };

  return (
    <ProductForm
      formData={formData}
      onChange={handleChange}
      onSubmit={handleSubmit}
      isEditMode={Boolean(productId)}
      onFileChange={handleFileChange} // 파일 변경 핸들러 전달
      imageFiles={imageFiles} // 이미지 파일 목록 전달
    />
  );
};

export default AddOrEditProduct;
