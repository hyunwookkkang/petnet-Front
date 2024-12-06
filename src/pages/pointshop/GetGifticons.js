import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";

const GetGifticons = () => {
  const [gifticons, setGifticons] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 기프티콘 데이터 가져오기
        const gifticonResponse = await axios.get('http://192.168.0.40:8000/api/pointshop/gifticons');
        console.log('Gifticons:', gifticonResponse.data); // 기프티콘 데이터 확인
        setGifticons(gifticonResponse.data);

        // 상품 데이터 가져오기
        const productRequests = gifticonResponse.data.map((gifticon) =>
          axios
            .get(`http://192.168.0.40:8000/api/pointshop/pointProducts/${gifticon.productId}`)
            .catch((error) => {
              console.error(`Error fetching product for ID ${gifticon.productId}:`, error);
              return null; // 요청 실패 처리
            })
        );

        const productResponses = await Promise.all(productRequests);
        console.log('Product Responses:', productResponses); // 상품 데이터 확인

        // 상품 데이터 매핑
        const productMap = productResponses.reduce((map, response) => {
          if (response && response.data) {
            map[response.data.productId] = response.data;
          }
          return map;
        }, {});
        console.log('Product Map:', productMap); // 매핑된 상품 데이터 확인
        setProducts(productMap);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">기프티콘 목록</h1>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {gifticons.map((gifticon) => {
            const product = products[gifticon.productId]; // 관련 상품 데이터 가져오기
            const imageUrl = product?.imageIds?.[0]
              ? `http://192.168.0.40:8000/api/images/${product.imageIds[0]}`
              : "https://via.placeholder.com/150"; // 기본 이미지

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
                    <button className="btn btn-primary w-100">
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

export default GetGifticons;
