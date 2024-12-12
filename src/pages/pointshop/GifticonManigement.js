import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { useUser } from "../../components/contexts/UserContext";
import { Container, Card, CardContent, CardMedia, Typography } from "@mui/material";
import "../../styles/common/Card.css";

const GifticonManagement = () => {
  const [radioValue, setRadioValue] = useState('logs'); // 'logs' or 'list'
  const [loading, setLoading] = useState(false);
  const [gifticonsLog, setGifticonsLog] = useState([]);
  const [gifticons, setGifticons] = useState([]);
  const [products, setProducts] = useState({});
  const navigate = useNavigate(); // 상세 페이지로 이동
  const { userId } = useUser(); // UserContext에서 userId 가져오기

  // 로그인 확인
  useEffect(() => {
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login"); // 로그인 페이지로 리디렉션
    }
  }, [userId, navigate]);

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
    <Container>
      <h1 className="text-center mb-4">기프티콘 관리</h1>
      <div className="d-flex justify-content-center mb-4">
        <div className="nav nav-pills">
          <button
            className="btn mx-2"
            style={{
              backgroundColor: radioValue === 'logs' ? 'transparent' : 'white',
              color: radioValue === 'logs' ? 'black' : '#FF6347 ',
              border: 'none',
              fontWeight: 'bold'
            }}
            onClick={() => {
              setRadioValue('logs');
              fetchData('logs');
            }}
          >
            사용 전
          </button>
          <button
            className="btn mx-2"
            style={{
              backgroundColor: radioValue === 'list' ? 'transparent' : 'white',
              color: radioValue === 'list' ? 'black' : '#FF6347 ',
              border: 'none',
              fontWeight: 'bold'
            }}
            onClick={() => {
              setRadioValue('list');
              fetchData('list');
            }}
          >
            사용 후
          </button>
        </div>
      </div>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {(radioValue === 'logs' ? gifticonsLog : gifticons).map((gifticon) => {
            const product = products[gifticon.productId];
            const imageUrl = product?.imageIds?.[0]
              ? `/api/images/${product.imageIds[0]}`
              : "https://via.placeholder.com/150";

            return (
              <Card 
                key={gifticon.voucherId} 
                className="common-card" 
                onClick={() => navigate(`/gifticons/${gifticon.voucherId}`)}
                style={{ cursor: "pointer" }}
              >
                <CardMedia
                  component="img"
                  sx={{ width: 151 }}
                  image={imageUrl}
                  alt={product?.productName || "상품 이미지"}
                />
                <CardContent>
                  <Typography component="div" variant="h5" className="common-content common-title">
                    {product?.productName || "상품명 없음"}
                  </Typography>
                  <Typography variant="subtitle1" color="#777" className="common-content common-title">
                    브랜드: {product?.brandCategory || "브랜드 없음"}
                  </Typography>
                  {radioValue === 'logs' ? (
                    <Typography variant="subtitle1" color="text.secondary" className="common-content common-title">
                      {gifticon.validityDate} 까지 사용가능
                    </Typography>
                  ) : (
                    <Typography variant="subtitle1" color="text.secondary" className="common-content common-title">
                      사용 날짜: {gifticon.expirationDate || "N/A"}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </Container>
  );
};

export default GifticonManagement;