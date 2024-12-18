import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios';
import '../../../styles/Carousel.css';

function ProductImage({ productId }) {
  const [images, setImages] = useState([]); // 이미지 데이터 상태

  // 이미지 데이터를 가져오는 함수
  const fetchImages = async () => {
    try {
      const response = await axios.get(`/api/shop/products/images/${productId}`);
      setImages(response.data); // 이미지 목록 업데이트
    } catch (error) {
      console.error("이미지 불러오기 오류:", error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchImages(); // productId가 변경되면 이미지 불러오기
    }
  }, [productId]);

  return (
    <Carousel className='carousel' interval={3000} fade={false} indicators controls style={{ height: "100%", overflow: "hidden" }}>
      {/* 각 이미지를 Carousel.Item에 추가 */}
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <img
            src={image ? image : "https://via.placeholder.com/150"}  // 이미지 URL
            alt={`Slide ${index + 1}`}  // 이미지 설명
            className="d-block w-100" // Bootstrap 클래스: 이미지가 Carousel에 맞게 가로 크기를 채우도록
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ProductImage;
