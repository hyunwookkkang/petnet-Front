import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import { useUser } from "../../components/contexts/UserContext";
import { Container, Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import CommonModal from "../../components/common/modal/CommonModal";
import "../../styles/common/Card.css";
import "../../styles/pointshop/GifticonManagement.css";

const GifticonManagement = () => {
  const [radioValue, setRadioValue] = useState('logs'); // 'logs' or 'list'
  const [loading, setLoading] = useState(false);
  const [gifticonsLog, setGifticonsLog] = useState([]);
  const [gifticons, setGifticons] = useState([]);
  const [products, setProducts] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();
  const { userId } = useUser();

  const [visibleData, setVisibleData] = useState([]); 
  const [page, setPage] = useState(1); 
  const [hasMore, setHasMore] = useState(true);


  useEffect(() => {
    if (!userId) setShowAlert(true);
  }, [userId]);

  const fetchData = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const [logsResponse, listResponse] = await Promise.all([
        axios.post('/api/pointshop/gifticons', { userId }),
        axios.post('/api/pointshop/gifticons/gifticonLog', { userId })
      ]);

      const gifticonsLogData = logsResponse.data;
      const gifticonsListData = listResponse.data;

      // 상품 정보 병합
      const allGifticons = [...gifticonsLogData, ...gifticonsListData];
      const productRequests = allGifticons.map((gifticon) =>
        axios.get(`/api/pointshop/pointProducts/${gifticon.productId}`).catch(() => null)
      );

      const productResponses = await Promise.all(productRequests);
      const productMap = productResponses.reduce((map, response) => {
        if (response && response.data) map[response.data.productId] = response.data;
        return map;
      }, {});

      setGifticonsLog(gifticonsLogData);
      setGifticons(gifticonsListData);
      setProducts(productMap);
      setVisibleData(gifticonsLogData.slice(0, 5)); // 초기 화면
      setPage(1);
      setHasMore(gifticonsLogData.length > 5);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreData = () => {
    if (loading || !hasMore) return;

    const allData = radioValue === 'logs' ? gifticonsLog : gifticons;
    const newPage = page + 1;
    const newVisibleData = allData.slice(0, newPage * 5);

    setVisibleData(newVisibleData);
    setPage(newPage);
    setHasMore(newVisibleData.length < allData.length);
  };

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  useEffect(() => {
    const allData = radioValue === 'logs' ? gifticonsLog : gifticons;
    setVisibleData(allData.slice(0, 5));
    setPage(1);
    setHasMore(allData.length > 5);
  }, [radioValue]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        loadMoreData();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [radioValue, page, hasMore]);

  return (
    <div className="gifticon-management-container">
      <Container>
        <h1 className="page-title">기프티콘 관리</h1>

        <CommonModal
          show={showAlert}
          onHide={() => {
            setShowAlert(false);
            navigate("/login");
          }}
          title="로그인 필요"
          body="로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다."
          footer={
            <button
              className="modal-confirm-button"
              style={{ backgroundColor: "#feb98e", border: 'none' }}
              onClick={() => navigate("/login")}
            >
              확인
            </button>
          }
        />

        <div className="d-flex justify-content-center mb-4">
          <div className="nav nav-pills">
            <button
              className={`btn mx-2 tab-button ${radioValue === 'logs' ? 'selected' : 'unselected'}`}
              onClick={() => setRadioValue('logs')}
            >
              사용 전
            </button>
            <button
              className={`btn mx-2 tab-button ${radioValue === 'list' ? 'selected' : 'unselected'}`}
              onClick={() => setRadioValue('list')}
            >
              사용 후
            </button>
          </div>
        </div>

        <div className="row">
          {visibleData.map((gifticon) => {
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
                <CardMedia component="img" sx={{ width: 151 }} image={imageUrl} alt="상품 이미지" />
                <CardContent>
                  <Typography variant="h5" style={{ fontFamily: "'Ownglyph_ParkDaHyun', sans-serif", fontWeight: "normal" }}>{product?.productName || "상품명 없음"}</Typography>
                  <Typography variant="subtitle1" color="#777" style={{ fontFamily: "'Ownglyph_ParkDaHyun', sans-serif", fontWeight: "normal" }}>
                    브랜드: {product?.brandCategory || "브랜드 없음"}
                  </Typography>
                  <Typography variant="subtitle1" color="#FF6347" style={{ fontFamily: "'Ownglyph_ParkDaHyun', sans-serif", fontWeight: "normal" }}>
                    {radioValue === 'logs'
                      ? `${gifticon.validityDate} 까지 사용가능`
                      : `사용 날짜: ${gifticon.expirationDate || "N/A"}`}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {loading && <div className="text-center mt-3">로딩 중...</div>}
      </Container>
    </div>
  );
};

export default GifticonManagement;
