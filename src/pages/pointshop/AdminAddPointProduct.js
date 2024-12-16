import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from "../../components/common/alert/CommonToast";

const AdminAddPointProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productName: '',
    price: '',
    validityDate: '',
    brandCategory: '',
    imageFiles: null, // 단일 이미지 파일
  });

  // 폼 데이터 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 이미지 파일 변경 핸들러
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      imageFiles: e.target.files[0], // 단일 파일 선택
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // FormData 객체 생성
    const bodyData = new FormData();
    bodyData.append('productName', formData.productName);
    bodyData.append('price', formData.price);
    bodyData.append('validityDate', formData.validityDate);
    bodyData.append('brandCategory', formData.brandCategory);
    bodyData.append('imageFiles', formData.imageFiles); // 이미지 파일 추가

    try {
      const response = await fetch('/api/pointshop/pointProducts/Admin', {
        method: 'POST',
        body: bodyData,
      });

      if (response.ok) {
        showSuccessToast('포인트 상품이 성공적으로 추가되었습니다.');
        navigate('/point-product-management'); // Admin 상품 목록 페이지로 이동
      } else {
        showErrorToast('포인트 상품 추가에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      showErrorToast('서버와 통신 중 문제가 발생했습니다.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>포인트 상품 추가</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label>포인트 상품명:</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>포인트 가격:</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>유효 기간(일):</label>
          <input
            type="number"
            name="validityDate"
            value={formData.validityDate}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          />
        </div>

        <div>
          <label>브랜드 카테고리:</label>
          <select
            name="brandCategory"
            value={formData.brandCategory}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '10px', marginTop: '5px' }}
          >
            <option value="">선택</option>
            <option value="CU">CU</option>
            <option value="GS25">GS25</option>
            <option value="이마트24">이마트24</option>
          </select>
        </div>

        <div>
          <label htmlFor="imageInput" className="form-label">상품 이미지:</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            id="imageInput"
            onChange={handleFileChange}
            required
          />
        </div>


        <button
          type="submit"
          style={{
            backgroundColor: '#FF7826',
            color: '#FFF',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          추가하기
        </button>
      </form>
    </div>
  );
};

export default AdminAddPointProduct;
