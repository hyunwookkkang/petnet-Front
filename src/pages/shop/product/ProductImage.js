//react
import Carousel from 'react-bootstrap/Carousel';
import React from 'react';
//css
import '../../../styles/Carousel.css';

function ProductImage() {

    const images =[
        '/assets/common/tori1.jpg',
        '/assets/common/tori2.jpg',
        '/assets/common/tori3.jpg',
        '/assets/common/tori4.jpg',
    ];
  return (
    <Carousel className='carousel' interval={3000} fade={false} indicators controls style= {{ height: "100%", overflow: "hidden" }}>
      {/* 각 이미지를 Carousel.Item에 추가 */}
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <img
            src={image}  // public 폴더 내 이미지 경로 사용
            alt={`Slide ${index + 1}`}  // 이미지 설명
            className="d-block w-100"// Bootstrap 클래스: 이미지가 Carousel에 맞게 가로 크기를 채우도록
          />
          {/* <Carousel.Caption>
            <h3>Slide {index + 1} label</h3>
            <p>Description for slide {index + 1}</p>
          </Carousel.Caption> */}
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default ProductImage;