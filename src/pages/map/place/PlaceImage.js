//react
import Carousel from 'react-bootstrap/Carousel';
import React from 'react';
//css
import '../../../styles/Carousel.css';

function PlaceImage() {

    const images =[
        '/assets/common/tori1.jpg',
        '/assets/common/tori2.jpg',
        '/assets/common/tori3.jpg',
        '/assets/common/tori4.jpg',
    ];
  return (
    <Carousel className="carousel" interval={3000} fade={false} indicators controls>
      {images.length > 0 ? (
        images.map((image, index) => (
          <Carousel.Item key={index}>
            {/* <img src={image} alt={`Slide ${index + 1}`} className="d-block w-100" /> */}
          </Carousel.Item>
        ))
      ) : (
        <p>Loading images...</p>
      )}
    </Carousel>
  );
}

export default PlaceImage;