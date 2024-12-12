import React, { useState, useEffect } from 'react';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { useUser } from "../../components/contexts/UserContext";

const GifticonManagement = () => {
  const [radioValue, setRadioValue] = useState('logs'); // 'logs' or 'list'
  const [loading, setLoading] = useState(false);
  const [gifticonsLog, setGifticonsLog] = useState([]);
  const [gifticons, setGifticons] = useState([]);
  const [products, setProducts] = useState({});
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate(); // 상세 페이지로 이동
  const { userId } = useUser(); // UserContext에서 userId 가져오기

  // 로그인 확인
  useEffect(() => {
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login"); // 로그인 페이지로 리디렉션
    }
  }, [userId, navigate]);

  const radios = [
    { name: '사용 전', value: 'logs' },
    { name: '사용 후', value: 'list' },
  ];

  const fetchData = async (viewType) => {
    if (!userId) {
      console.error("userId가 없습니다. 데이터를 가져올 수 없습니다.");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (viewType === 'logs') {
        response = await axios.post('/api/pointshop/gifticons', { userId });
      } else if (viewType === 'list') {
        response = await axios.post('/api/pointshop/gifticons/gifticonLog', { userId });
      }

      const gifticonData = response.data;
      console.log(`${viewType === 'logs' ? '사용 전' : '사용 후'} 데이터:`, gifticonData);

      const productRequests = gifticonData.map((gifticon) =>
        axios
          .get(`/api/pointshop/pointProducts/${gifticon.productId}`)
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

      if (viewType === 'logs') {
        setGifticonsLog(gifticonData);
      } else if (viewType === 'list') {
        setGifticons(gifticonData);
      }
      setProducts(productMap);
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

  useEffect(() => {
    if (userId) {
      fetchData('logs'); // 기본적으로 "사용 전" 데이터를 가져옴
    }
  }, [userId]);

  if (!userId) {
    return (
      <div className="text-center">
        <p>로그인이 필요합니다. 로그인 후 다시 시도해주세요.</p>
      </div>
    );
  }

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
              name="radio"
              value={radio.value}
              checked={radioValue === radio.value}
              onChange={(e) => handleToggleChange(e.currentTarget.value)}
              style={{
                backgroundColor: radioValue === radio.value ? '#FD9251' : '#feb98e',
                color: '#FFFFFF',
                borderColor: '#FD9251',
                fontWeight: 'bold',
              }}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </div>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {radioValue === 'logs' &&
            (gifticonsLog.length > 0 ? (
              gifticonsLog.map((gifticon) => {
                const product = products[gifticon.productId];
                const imageUrl = product?.imageIds?.[0]
                  ? `/api/images/${product.imageIds[0]}`
                  : "https://via.placeholder.com/150";

                return (
                  <div className="col-md-4 mb-4" key={gifticon.voucherId}>
                    <div
                      className="card h-100"
                      style={{
                        backgroundColor: '#FFF5EF',
                        border: '2px solid #FF7826',
                        borderRadius: '10px',
                      }}
                    >
                      <img
                        src={imageUrl}
                        className="card-img-top"
                        alt={product?.productName || "상품 이미지"}
                        style={{ height: "200px", objectFit: "cover", borderRadius: "10px 10px 0 0" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title" style={{ color: '#FF7826', fontWeight: 'bold' }}>
                          {product?.productName || "상품명 없음"}
                        </h5>
                        <p className="card-text" style={{ color: '#666' }}>
                          <strong>브랜드:</strong> {product?.brandCategory || "브랜드 없음"}<br />
                          <strong>바코드 번호:</strong> {gifticon.barcodeNumber}<br />
                          <strong>유효 기간:</strong> {gifticon.validityDate}
                        </p>
                        <button
                          className="btn w-100"
                          style={{
                            backgroundColor: '#FF9251',
                            color: '#FFFFFF',
                            borderColor: '#FF7826',
                            fontWeight: 'bold',
                          }}
                          onClick={() => navigate(`/gifticons/${gifticon.voucherId}`)}
                        >
                          상세보기
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>표시할 데이터가 없습니다.</p>
            ))}
          {radioValue === 'list' &&
            (gifticons.length > 0 ? (
              gifticons.map((gifticon) => {
                const product = products[gifticon.productId];
                const imageUrl = product?.imageIds?.[0]
                  ? `/api/images/${product.imageIds[0]}`
                  : "https://via.placeholder.com/150";

                return (
                  <div className="col-md-4 mb-4" key={gifticon.voucherId}>
                    <div
                      className="card h-100"
                      style={{
                        backgroundColor: '#FFF5EF',
                        border: '2px solid #FF7826',
                        borderRadius: '10px',
                      }}
                    >
                      <img
                        src={imageUrl}
                        className="card-img-top"
                        alt={product?.productName || "상품 이미지"}
                        style={{ height: "200px", objectFit: "cover", borderRadius: "10px 10px 0 0" }}
                      />
                      <div className="card-body">
                        <h5 className="card-title" style={{ color: '#FF7826', fontWeight: 'bold' }}>
                          {product?.productName || "상품명 없음"}
                        </h5>
                        <p className="card-text" style={{ color: '#666' }}>
                          <strong>브랜드:</strong> {product?.brandCategory || "브랜드 없음"}<br />
                          <strong>바코드 번호:</strong> {gifticon.barcodeNumber}<br />
                          <strong>유효 기간:</strong> {gifticon.validityDate}<br />
                          <strong>사용 날짜:</strong> {gifticon.expirationDate || "N/A"}
                        </p>
                        <button
                          className="btn w-100"
                          style={{
                            backgroundColor: '#FF9251',
                            color: '#FFFFFF',
                            borderColor: '#FF7826',
                            fontWeight: 'bold',
                          }}
                          onClick={() => navigate(`/gifticons/${gifticon.voucherId}`)}
                        >
                          상세보기
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>표시할 데이터가 없습니다.</p>
            ))}
        </div>
      )}
    </div>
  );
};

export default GifticonManagement;
