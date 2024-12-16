import React, { useState, useEffect } from "react";
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

  // 상품 정보를 수정할 때, 해당 상품의 정보를 서버에서 가져오는 useEffect
  useEffect(() => {
    if (productId) {
      // 상품 수정일 경우, 상품 정보를 서버에서 가져옵니다.
      axios
        .get(`/api/shop/products/${productId}`)
        .then((response) => {
          const product = response.data;
          setFormData({
            productName: product.productName,
            price: product.price.toString(),
            productStock: product.productStock.toString(),
            discount: product.discount.toString(),
            productDetail: product.productDetail,
            productCategory: product.productCategory,
            animalCategory: product.animalCategory,
          });
          // 기존 상품 이미지 불러오기 (필요한 경우 추가)
          setImageFiles(product.imageFiles || []);
        })
        .catch((err) => {
          console.error("상품 정보를 불러오는 중 오류 발생:", err);
          alert("상품 정보를 불러오는 중 오류가 발생했습니다.");
        });
    }
  }, [productId]); // productId가 변경될 때마다 상품 정보를 새로 불러옵니다.

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
  
    // 이미지 파일을 FormData에 추가, 비어있을 경우 추가하지 않음
    if (imageFiles.length > 0) {
      for (let i = 0; i < imageFiles.length; i++) {
        formDataToSend.append("imageFiles", imageFiles[i]);
      }
    }
  
    const apiUrl = productId ? `/api/shop/products/${productId}` : "/api/shop/products";
    const httpMethod = productId ? "put" : "post";
  
    axios
      [httpMethod](apiUrl, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert(productId ? "상품이 수정되었습니다!" : "상품이 추가되었습니다!");
        navigate("/admin");
      })
      .catch((err) => {
        console.error(err);
        alert("상품 처리 중 오류가 발생했습니다.");
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
