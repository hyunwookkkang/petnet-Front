import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios';
import '../../../styles/Carousel.css';

function ProductImage({ productId }) {
  const [images, setImages] = useState([]); // 이미지 데이터 상태

  // 상품 데이터를 가져오는 함수
  const fetchProductData = async () => {
    try {
      // 상품 데이터 API 호출
      const response = await axios.get(`/api/shop/products/${productId}`);
      const productData = response.data;

      // 상품 데이터에서 images 속성 추출 및 업데이트
      if (productData.images && productData.images.length > 0) {
        setImages(productData.images);
      } else {
        setImages([]); // 이미지가 없을 경우 빈 배열
      }
    } catch (error) {
      console.error("상품 데이터 불러오기 오류:", error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductData(); // productId가 변경되면 상품 데이터 불러오기
    }
  }, [productId]);

  return (
    <Carousel className='carousel' interval={3000} fade={false} indicators controls style={{ height: "100%", overflow: "hidden" }}>
      {/* 각 이미지를 Carousel.Item에 추가 */}
      {images.length > 0 ? (
        images.map((imageId, index) => (
          <Carousel.Item key={index}>
            <img
              src={`/api/images/${imageId}`} // 이미지 URL
              alt={`Slide ${index + 1}`}  // 이미지 설명
              className="d-block w-100" // Bootstrap 클래스: 이미지가 Carousel에 맞게 가로 크기를 채우도록
            />
          </Carousel.Item>
        ))
      ) : (
        <Carousel.Item>
          <img
            src="https://via.placeholder.com/150" // 기본 이미지 URL
            alt="No Images Available"  // 이미지 설명
            className="d-block w-100"
          />
        </Carousel.Item>
      )}
    </Carousel>
  );
}

export default ProductImage;
