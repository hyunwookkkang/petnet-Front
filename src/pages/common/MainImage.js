//react
import Carousel from 'react-bootstrap/Carousel';
import React from 'react';
import { useNavigate } from 'react-router-dom';

//css
import '../../styles/Carousel.css';

function MainImage() {

    const navigate = useNavigate();

    const images =[
        { src: '/assets/main/Pet-net-size.png', path: '/' },
        { src: '/assets/main/map-image-size.jpg', path: '/placeMap' }, // 클릭 시 이동할 경로 포함
        { src: '/assets/main/shop-image-size.jpg', path: '/shop/products' },
        { src: '/assets/main/pointshop-image-size.jpg', path: '/pointshop-page' },
        { src: '/assets/main/commu-image-size.jpg', path: '/community' },
        { src: '/assets/main/cashbook-image-size.jpg', path: '/cashbook' },

    ];

    const handleImageClick = (path) => {
        navigate(path); // 클릭 시 해당 경로로 이동
    };
    
    return (
        <Carousel className='carousel' interval={3000} fade={false} indicators controls style={{ height: "100%", overflow: "hidden" }}>
        {/* 각 이미지를 Carousel.Item에 추가 */}
        {images.map((image, index) => (
            <Carousel.Item key={index}>
            <img
                src={image.src} // public 폴더 내 이미지 경로 사용
                alt={`Slide ${index + 1}`} // 이미지 설명
                className="d-block w-100" // Bootstrap 클래스: 이미지가 Carousel에 맞게 가로 크기를 채우도록
                onClick={() => handleImageClick(image.path)} // 클릭 이벤트 추가
                style={{ cursor: 'pointer' }} // 클릭 가능하다는 표시
            />
            </Carousel.Item>
        ))}
        </Carousel>
    );
}

export default MainImage;