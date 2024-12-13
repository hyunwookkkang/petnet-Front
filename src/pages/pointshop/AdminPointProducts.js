import React, { useEffect, useState } from 'react';
import { DataGrid, GridFilterOperator } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom'; // 페이지 이동에 사용
import "../../styles/pointshop/point.css";
import StorefrontIcon from '@mui/icons-material/Storefront';





const betweenOperator = {
  label: 'Between',
  value: 'between',
  getApplyFilterFn: (filterItem) => {
    if (!Array.isArray(filterItem.value) || filterItem.value.length !== 2) {
      return null;
    }
    if (filterItem.value[0] == null || filterItem.value[1] == null) {
      return null;
    }
    return (value) => {
      return (
        value != null && filterItem.value[0] <= value && value <= filterItem.value[1]
      );
    };
  },
  InputComponent: ({ item, applyValue }) => {
    const handleChange = (index, newValue) => {
      const newValues = [...(item.value || [null, null])];
      newValues[index] = newValue;
      applyValue({ ...item, value: newValues });
    };

    return (
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="number"
          placeholder="Min"
          value={item.value?.[0] || ''}
          onChange={(e) => handleChange(0, Number(e.target.value))}
          style={{ width: '100px' }}
        />
        <input
          type="number"
          placeholder="Max"
          value={item.value?.[1] || ''}
          onChange={(e) => handleChange(1, Number(e.target.value))}
          style={{ width: '100px' }}
        />
      </div>
    );
  },
};

// React 컴포넌트
const PointShopAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // 페이지 이동 함수

  // 데이터 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/pointshop/pointProducts/Admin');
        if (!response.ok) {
          throw new Error('데이터를 불러오는 데 실패했습니다.');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // DataGrid의 열 정의
  const columns = [
    { field: 'productId', headerName: '포인트 상품 ID', width: 150 },
    { field: 'productName', headerName: '포인트 상품명', width: 200 },
    { field: 'productAddDate', headerName: '등록 일자', width: 200 },
    { field: 'validityDate', headerName: '유효 기간', width: 100 },
    { 
      field: 'price',
      headerName: '포인트 가격',
      width: 150,
      filterOperators: [betweenOperator], // Between 필터 추가
    },
    { field: 'brandCategory', headerName: '브랜드 카테고리', width: 200 },
    {
      field: 'Detail',
      headerName: '상품 상세정보',
      width: 150,
      renderCell: (params) => (
        <button
          onClick={() => navigate(`/get-point-product/${params.row.productId}`)} // 상세 정보
          style={{
            backgroundColor: '#FF7826',
            color: '#FFF',
            border: 'none',
            padding: '5px 10px',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          상세 정보 조회
        </button>
      ),
    },
    {
      field: 'Put',
      headerName:'상품 수정',
      width: 150,
      renderCell: (params) => (
        <button
          onClick={() => navigate(`/put-point-product/${params.row.productId}`)} // 상품수정
          style={{
            backgroundColor: '#FF7826',
            color: '#FFF',
            border: 'none',
            padding: '5px 10px',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
          >
            포인트 상품 수정
          </button>
      ),
    },
    {
      field: 'Delete',
      headerName: '상품 삭제',
      width: 150,
      renderCell: (params) => (
        <button
          onClick={async () => {
            const productId = params.row.productId; // 현재 행의 상품 ID 가져오기
            const confirmDelete = window.confirm(`${params.row.productName}를 삭제하시겠습니까?`); // 삭제 확인
            if (confirmDelete) {
              try {
                const response = await fetch(
                  `/api/pointshop/pointProducts/Admin/${productId}`,
                  {
                    method: 'DELETE',
                  }
                );
                if (response.ok) {
                  alert('상품이 성공적으로 삭제되었습니다.');
                  // 데이터 새로고침
                  setProducts((prevProducts) =>
                    prevProducts.filter((product) => product.productId !== productId)
                  );
                } else {
                  alert('상품 삭제 실패.');
                }
              } catch (error) {
                console.error('Error:', error);
                alert('error');
              }
            }
          }}
          style={{
            backgroundColor: '#FF7826',
            color: '#FFF',
            border: 'none',
            padding: '5px 10px',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          포인트 상품 삭제
        </button>
      ),
    }
  ];

  return (

    <div style={{ padding: '20px', backgroundColor: '#FFF5EF', border: '2px solid #FF7826' }}>
      <h1 style={{ textAlign: 'center', color: '#FF7826' }}>포인트 상품 관리</h1>
      <div
          style={{
            display: 'flex', // Flexbox 사용
            justifyContent: 'space-between', // 양쪽 정렬
            alignItems: 'center', // 세로 정렬
            padding: '10px 0', // 상하 여백
        }}>
          {/* 왼쪽 공간 */}
          <div style={{ flex: 8 }}>
            {/* 비어있는 공간 또는 다른 요소 배치 가능 */}
          </div>
    
          {/* 오른쪽 버튼 */}
          <div style={{ flex: 2 }}>
            <div onClick={() => navigate('AdminAddPointProduct')}
              style={{
                backgroundColor: '#FF7826',
                color: '#FFF',
                border: 'none',
                padding: '10px 20px',
                cursor: 'pointer',
                borderRadius: '5px',
                textAlign: 'center', // 텍스트 정렬(가운데로 가짐)
                width: '200px',
              }}
            >
              포인트 상품 추가
            </div>
          </div>
        </div>
      {loading ? (
        <p>상품 정보를 불러오는 중입니다...</p>
      ) : (
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={10}
            getRowId={(row) => row.productId} 
          />
        </div>
      )}
    </div>
  );
};

export default PointShopAdminPage;