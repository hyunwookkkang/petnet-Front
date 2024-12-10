import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../styles/pointshop/point.css";
import { useUser } from "../../components/contexts/UserContext";

const GetPointProduct = () => {
  const { productId } = useParams(); // URL에서 productId를 가져옵니다.
  const [product, setProduct] = useState(null); // 상품 정보를 저장할 상태 변수
  const [loading, setLoading] = useState(true); // 로딩 상태
  const { userId } = useUser(); // UserContext에서 userId 가져오기
  const navigate = useNavigate();
  const [error, setError] = useState(null); // 에러 상태

  // 상품 상세 정보 가져오기
  useEffect(() => {

    // 유저 ID 확인
    if (userId === null) {
      console.log("UserContext 초기화 중...");
      return; // userId가 초기화되지 않았다면 대기
    }

    if (!userId) {
      console.log("로그인하지 않은 사용자입니다.");
      // 로그인하지 않은 경우에도 상품 정보를 조회할 수 있도록 허용
    } else {
      console.log(`로그인된 사용자 ID: ${userId}`);
    }

    fetchProductDetail();
  }, [userId, productId]); // userId를 의존성에 추가

    const fetchProductDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://192.168.0.40:8000/api/pointshop/pointProducts/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Error fetching product details:', error);
        setError("상품 정보를 가져오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    

  // 구매 버튼 클릭 시 처리
  const handlePurchase = async () => {
    if (!userId) {
      alert("구매하려면 로그인이 필요합니다.");
      navigate("/login"); // 로그인 페이지로 리디렉션
      return;
      
    }

    try {
      await axios.post(
        `http://192.168.0.40:8000/api/pointshop/pointProducts/${productId}`,
        { userId },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      alert("구매가 완료되었습니다!");
      navigate("/pointProducts"); // 포인트 상품 목록으로 이동
    } catch (error) {
      console.error('Error purchasing product:', error);
      alert("구매에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // 로딩 중 화면
  if (loading) {
    return <div>Loading...</div>;
  }

  // 에러 화면
  if (error) {
    return (
      <div className="text-center">
        <p>{error}</p>
      </div>
    );
  }

  // 상품 상세 정보 렌더링
  return (
    <div
      className="pointProduct"
      style={{
        display: 'flex',
        flexDirection: 'column',
        color: '#FF7826',
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
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '40px' }}>{product.productName}</p>
        <p style={{ fontSize: '20px' }}>가격: {product.price} 포인트</p>
        <p style={{ fontSize: '20px' }}>브랜드: {product.brandCategory}</p>
        <p style={{ color: '#FF7826', fontSize: '20px' }}>유효 기간: {product.validityDate}일</p>
        <div className="points-display">
          <p>[포인트 상품 이용 안내]</p>
          <p>- 포인트 상품 구매시 교환 환불 및 연장은 불가하니 참고해 주시기 바랍니다.</p>
          <p>- 상품의 해당 브랜드 편의점에서 상품 교환이 가능합니다.</p>
          <p>- 해당 상품이 일부 편의점에서 취급하지 않는 상품일 수 있습니다.</p>
        </div>
        <button
          className="button-click"
          onClick={handlePurchase} // 구매 버튼 클릭 이벤트
          style={{
            backgroundColor: '#FF7826',
            color: 'white',
            padding: '10px 50px',
          }}
        >
          구매하기
        </button>
      </div>
    </div>
  );
};

export default GetPointProduct;