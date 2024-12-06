import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../../styles/pointshop/point.css";

const GetPointProduct = () => {
  const { productId } = useParams(); // URL에서 productId를 가져옵니다.
  const [product, setProduct] = useState(null); // 상품 정보를 저장할 상태 변수
  const [loading, setLoading] = useState(true); // 로딩 상태

  // 상품 상세 정보 가져오기
  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(`http://192.168.0.40:8000/api/pointshop/pointProducts/${productId}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>상품 정보를 가져올 수 없습니다.</div>;
  }

  return (
    <div 
      className="pointProduct"
      style={{
        display: 'flex',
        flexDirection: 'column', 
        color :'#FF7826',
        backgroundColor: '#FFF5EF',
        border: '2px solid #FF7826',
        alignItems: 'center', // 수직 중앙 정렬
        gap: '20px', // 각 항목 간격
        padding: '20px', // 내부 여백 추가
      }}
    >
      <h1 style={{ textAlign: 'center' }}>포인트 상품 상세</h1>
      {product.imageIds && (
        <img 
          src={`http://192.168.0.40:8000/api/images/${product.imageIds}`}
          alt={product.productName}
          style={{ width: '100%', height: 'auto' }}
        />
      )}
      <div style={{ textAlign: 'center' }}> {/* 텍스트 부분 */}
        <p  style={{  fontSize: '40px'}}>{product.productName}</p>
        <p style={{ fontSize: '20px'}}>가격: {product.price} 포인트</p>
        <p style={{ fontSize: '20px'}}>브랜드: {product.brandCategory}</p>
        <p style={{ color :'#FF7826', fontSize: '20px'}}>유효 기간: {product.validityDate}일</p>
        <div className="points-display">
          <p>[포인트 상품 이용 안내]</p>
          <p>-포인트 상품 구매시 교환 환불 및 연장은 불가하니 참고해 주시기 바랍니다.</p>
          <p>-상품의 해당 브랜드 편의점에서 상품 교환이 가능합니다.</p>
          <p>- 해당 상품이 일부 편의점에서 취급하지 않는 상품일 수 있습니다.</p>
        </div>
        <button className="button-click">구매하기</button>
      </div>
    </div>
  );
};

export default GetPointProduct;
