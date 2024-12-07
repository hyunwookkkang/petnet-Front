import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";

const GifticonManagement = () => {
  const [gifticonsLog, setGifticonsLog] = useState([]);
  const [gifticons, setGifticons] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState(""); // 버튼 선택 상태 관리 ("logs" or "list")

  // Fetch Gifticon Logs
  const fetchGifticonLog = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.0.40:8000/api/pointshop/gifticons/gifticonLog');
      const gifticonData = response.data;

      // 상품 데이터 가져오기
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
    } catch (error) {
      console.error("Error fetching gifticon logs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Gifticons
  const fetchGifticons = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.0.40:8000/api/pointshop/gifticons');
      const gifticonData = response.data;

      // 상품 데이터 가져오기
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
    } catch (error) {
      console.error("Error fetching gifticons:", error);
    } finally {
      setLoading(false);
    }
  };

  // 버튼 클릭 시 데이터 가져오기
  const handleViewChange = (viewType) => {
    setView(viewType);
    if (viewType === "logs") {
      fetchGifticonLog();
    } else if (viewType === "list") {
      fetchGifticons();
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">기프티콘 관리</h1>
      <div className="d-flex justify-content-center mb-4">
        <button className="btn btn-primary mx-2" onClick={() => handleViewChange("logs")}>
          사용한 기프티콘 보기
        </button>
        <button className="btn btn-secondary mx-2" onClick={() => handleViewChange("list")}>
          전체 기프티콘 보기
        </button>
      </div>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {view === "logs" &&
            gifticonsLog.map((gifticon) => {
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
                      <button className="btn btn-primary w-100">상세보기</button>
                    </div>
                  </div>
                </div>
              );
            })}
          {view === "list" &&
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
                      <button className="btn btn-primary w-100">상세보기</button>
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

export default GifticonManagement;
