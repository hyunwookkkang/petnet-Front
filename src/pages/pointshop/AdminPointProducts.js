import React, { useEffect, useState } from 'react';
import { DataGrid, GridFilterOperator } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom'; // 페이지 이동에 사용

// 커스텀 연산자 정의 (Between 연산자)
const betweenOperator: GridFilterOperator<any, number> = {
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
        const response = await fetch('http://192.168.0.40:8000/api/pointshop/pointProducts/Admin');
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
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <button
          onClick={() => navigate(`/get-point-product/${params.row.productId}`)} // 상세 페이지로 이동
          style={{
            backgroundColor: '#FF7826',
            color: '#FFF',
            border: 'none',
            padding: '5px 10px',
            cursor: 'pointer',
            borderRadius: '5px',
          }}
        >
          상세 보기
        </button>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#FFF5EF', border: '2px solid #FF7826' }}>
      <h1 style={{ textAlign: 'center', color: '#FF7826' }}>포인트 상품 관리</h1>
      {loading ? (
        <p>상품 정보를 불러오는 중입니다...</p>
      ) : (
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={10}
            getRowId={(row) => row.productId} // 고유 ID
          />
        </div>
      )}
    </div>
  );
};

export default PointShopAdminPage;
