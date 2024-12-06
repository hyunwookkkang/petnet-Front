import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS 가져오기

const PointProducts = () => {
  const [pointProducts, setPointProducts] = useState([]); // 상품 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null); // 현재 마우스가 올라간 버튼의 ID

  // 데이터 가져오기 함수
  const fetchPointProducts = async () => {
    setLoading(true); // 데이터 로딩 시작
    try {
      // 모든 상품 데이터를 한 번에 가져오기
      const response = await axios.get('http://192.168.0.40:8000/api/pointshop/pointProducts');
      setPointProducts(response.data); // 데이터 설정
      setLoading(false); // 로딩 완료
    } catch (error) {
      console.error('Error fetching point products:', error);
      setLoading(false); // 오류 발생 시에도 로딩 종료
    }
  };

  // 컴포넌트 마운트 시 데이터 가져오기
  useEffect(() => {
    fetchPointProducts(); // 데이터 호출
  }, []);

  if (loading) {
    return <div>Loading...</div>; // 로딩 중 로딩 메시지 표시
  }

  return (
    <div className="pointProducts" style={{ padding: '20px' }}>
      <h1 className="points-display" style={{ display: 'flex', fontSize: '80px', justifyContent: 'center' }}>포인트 상점</h1>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '20px',
        }}
      >
        {pointProducts.length === 0 ? (
          <p>상품이 없습니다.</p> // 상품이 없으면 해당 메시지 표시
        ) : (
          pointProducts.map((product) => (
            <Card style={{ backgroundColor: '#FFE2D0', width: '18rem' }} key={product.productId}>
              <Card.Img
                variant="top"
                src={`http://localhost:8000/api/images/${product.imageIds}`}
                alt={product.productName || "상품 이미지"}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body>
                <Card.Title>{product.productName}</Card.Title>
                <Card.Text>
                  <strong>가격:</strong> {product.price} 포인트<br />
                  <strong>브랜드:</strong> {product.brandCategory}
                </Card.Text>
                <Button
                  style={{
                    backgroundColor: hoveredId === product.productId ? '#FD9251' : '#feb98e', // ID에 따라 색상 설정
                    borderColor: hoveredId === product.productId ? '#ffa07a' : '#feb98e',
                  }}
                  onMouseEnter={() => setHoveredId(product.productId)} // 해당 버튼에 마우스가 올라올 때 ID 설정
                  onMouseLeave={() => setHoveredId(null)} // 마우스가 떠나면 ID 초기화
                  onClick={() => navigate(`/pointProducts/${product.productId}`)}
                >
                  구매하러 가기
                </Button>
              </Card.Body>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PointProducts;
