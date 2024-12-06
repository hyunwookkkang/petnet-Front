import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "../../../styles/Carousel.css";


function ImageCarousel() {
  const settings = {
    dots: true, // 슬라이더 하단의 dots 활성화
    lazyLoad: true, // lazy load 이미지
    infinite: true, // 무한 루프
    speed: 500, // 슬라이드 전환 속도
    slidesToShow: 1, // 한 번에 보여줄 슬라이드 개수
    slidesToScroll: 1, // 한 번에 스크롤할 슬라이드 개수
    arrows: true,  
    adaptiveHeight: false, // 높이 자동 조정 비활성화
    centerMode: false, // 중앙 정렬 비활성화
    variableWidth: false, // 가변 너비 비활성화
  };

  return (
    <div className="slider-container">
      <Slider {...settings}>
        <div>
          <img src="/assets/common/tori1.jpg" alt="tori1" />
        </div>
        <div>
          <img src="/assets/common/tori2.jpg" alt="tori2" />
        </div>
        <div>
          <img src="/assets/common/tori3.jpg" alt="tori3" />
        </div>
        <div>
          <img src="/assets/common/tori4.jpg" alt="tori4" />
        </div>
      </Slider>
    </div>
  );
}

export default ImageCarousel;
