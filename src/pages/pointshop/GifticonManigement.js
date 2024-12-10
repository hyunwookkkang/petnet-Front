import React, { useState, useEffect } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // 상세 페이지 이동에 사용
import "bootstrap/dist/css/bootstrap.min.css";

const GifticonManagementWithToggle = () => {
  const [radioValue, setRadioValue] = useState('logs'); // 'logs' or 'list'
  const [loading, setLoading] = useState(false);
  const [gifticonsLog, setGifticonsLog] = useState([]);
  const [gifticons, setGifticons] = useState([]);
  const [products, setProducts] = useState({});
  const navigate = useNavigate(); // 상세 페이지로 이동

  const radios = [
    { name: '사용 전', value: 'logs' },
    { name: '사용 후', value: 'list' },
  ];

  const fetchData = async (viewType) => {
    setLoading(true);
    try {
      if (viewType === 'logs') {
        const response = await axios.get('http://192.168.0.40:8000/api/pointshop/gifticons/gifticonLog');
        const gifticonData = response.data;

        const productRequests = gifticonData.map((gifticon) =>
          axios
            .get(`http://192.168.0.40:8000/api/pointshop/pointProducts/${gifticon.productId}`)
            .catch((error) => {
              console.error(`Error fetching product for ID ${gifticon.productId}:`, error);
              return null;
            })
        );
        const productResponses = await Promise.all(productRequests);

        const productMap = productResponses.reduce((map, response) => {
          if (response && response.data) {
            map[response.data.productId] = response.data;
          }
          return map;
        }, {});

        setGifticonsLog(gifticonData);
        setProducts(productMap);
      } else if (viewType === 'list') {
        const response = await axios.get('http://192.168.0.40:8000/api/pointshop/gifticons');
        const gifticonData = response.data;

        const productRequests = gifticonData.map((gifticon) =>
          axios
            .get(`http://192.168.0.40:8000/api/pointshop/pointProducts/${gifticon.productId}`)
            .catch((error) => {
              console.error(`Error fetching product for ID ${gifticon.productId}:`, error);
              return null;
            })
        );
        const productResponses = await Promise.all(productRequests);

        const productMap = productResponses.reduce((map, response) => {
          if (response && response.data) {
            map[response.data.productId] = response.data;
          }
          return map;
        }, {});

        setGifticons(gifticonData);
        setProducts(productMap);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChange = (value) => {
    setRadioValue(value);
    fetchData(value); // 선택된 옵션에 따라 데이터 로드
  };

  // 컴포넌트 마운트 시 기본 데이터를 로드
  useEffect(() => {
    fetchData('logs'); // 기본적으로 "사용 전" 데이터를 가져옴
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">기프티콘 관리</h1>
      <div className="d-flex justify-content-center mb-4">
        <ButtonGroup>
          {radios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              variant="outline-primary"
              name="radio"
              value={radio.value}
              checked={radioValue === radio.value}
              onChange={(e) => handleToggleChange(e.currentTarget.value)}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status" >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {radioValue === 'logs' &&
            gifticonsLog.map((gifticon) => {
              const product = products[gifticon.productId];
              const imageUrl = product?.imageIds?.[0]
                ? `http://192.168.0.40:8000/api/images/${product.imageIds[0]}`
                : "https://via.placeholder.com/150";

              return (
                <div className="col-md-4 mb-4" key={gifticon.voucherId}>
                  <div className="card h-100" >
                    <img
                      src={imageUrl}
                      className="card-img-top"
                      alt="상품 이미지"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{gifticon.barcodeNumber}</h5>
                      <p className="card-text">
                        <strong>유효 기간:</strong> {gifticon.validityDate} <br />
                        <strong>상품 ID:</strong> {gifticon.productId}
                      </p>
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => navigate(`/gifticons/${gifticon.voucherId}`)}
                      >
                        상세보기
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          {radioValue === 'list' &&
            gifticons.map((gifticon) => {
              const product = products[gifticon.productId];
              const imageUrl = product?.imageIds?.[0]
                ? `http://192.168.0.40:8000/api/images/${product.imageIds[0]}`
                : "https://via.placeholder.com/150";

              return (
                <div className="col-md-4 mb-4" key={gifticon.voucherId}>
                  <div className="card h-100">
                    <img
                      src={imageUrl}
                      className="card-img-top"
                      alt="상품 이미지"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{gifticon.barcodeNumber}</h5>
                      <p className="card-text">
                        <strong>유효 기간:</strong> {gifticon.validityDate} <br />
                        <strong>상품 ID:</strong> {gifticon.productId}
                      </p>
                      <button
                        className="btn btn-primary w-100"
                        onClick={() => navigate(`/gifticons/${gifticon.voucherId}`)}
                      >
                        상세보기
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default GifticonManagementWithToggle;