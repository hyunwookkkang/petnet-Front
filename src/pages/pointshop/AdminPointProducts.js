import React, { useEffect, useState } from 'react';
import { DataGrid, GridFilterOperator } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import "../../styles/pointshop/point.css";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import axios from 'axios'; // Axios 추가
import CommonModal from '../../components/common/modal/CommonModal';
import { showSuccessToast, showErrorToast } from "../../components/common/alert/CommonToast";

// 날짜 포맷 함수 (년-월-일 시:분:초)
const formatLocalDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} 
    ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

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
          style={{ width: '100px', padding: '5px', borderRadius: '5px', border: '1px solid #EDEDED' }}
        />
        <input
          type="number"
          placeholder="Max"
          value={item.value?.[1] || ''}
          onChange={(e) => handleChange(1, Number(e.target.value))}
          style={{ width: '100px', padding: '5px', borderRadius: '5px', border: '1px solid #EDEDED' }}
        />
      </div>
    );
  },
};

const PointShopAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/pointshop/pointProducts/Admin');
        const formattedData = response.data.map((product) => ({
          ...product,
          productAddDate: formatLocalDate(product.productAddDate),
        }));
        setProducts(formattedData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      await axios.delete(`/api/pointshop/pointProducts/Admin/${selectedProduct.productId}`);
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.productId !== selectedProduct.productId)
      );
      showSuccessToast('상품이 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting product:', error);
      showErrorToast('서버 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const columns = [
    {
      field: 'Delete',
      headerName: '',
      width: 60,
      renderCell: (params) => (
        <IconButton
          onClick={() => {
            setSelectedProduct(params.row);
            setShowDeleteModal(true);
          }}
          aria-label="delete"
          style={{ color: '#A9A9A9' }}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
    {
      field: 'Detail',
      headerName: '',
      width: 60,
      renderCell: (params) => (
        <IconButton
          onClick={() => navigate(`/get-point-product/${params.row.productId}`)}
          aria-label="detail"
          style={{ color: '#FEBE98' }}
        >
          <InfoIcon />
        </IconButton>
      ),
    },
    { field: 'productId', headerName: '상품ID', width: 100 },
    {
      field: 'productName',
      headerName: '포인트 상품명(수정)',
      width: 200,
      renderCell: (params) => (
        <span
          onClick={() => navigate(`/put-point-product/${params.row.productId}`)}
          style={{
            color: '#FEBE98',
            fontWeight: 'bold',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          {params.value}
        </span>
      ),
    },
    { field: 'productAddDate', headerName: '등록 일자', width: 250 },
    { field: 'validityDate', headerName: '유효 기간', width: 150 },
    { 
      field: 'price',
      headerName: '포인트 가격',
      width: 150,
      filterOperators: [betweenOperator],
    },
    { field: 'brandCategory', headerName: '브랜드 카테고리', width: 200 },
  ];

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>포인트 상품 관리</h1>
      <div style={styles.headerActions}>
        <div style={{ flex: 8 }}></div>
        <div style={{ flex: 2, textAlign: 'right', whiteSpace: 'nowrap' }}>
          <button
            onClick={() => navigate('AdminAddPointProduct')}
            style={styles.addButton}
          >
            포인트 상품 추가
          </button>
        </div>
      </div>
      {loading ? (
        <p style={styles.loadingText}>상품 정보를 불러오는 중입니다...</p>
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
      <CommonModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        title="삭제 확인"
        body={<div>{selectedProduct?.productName}를 삭제하시겠습니까?</div>}
        footer={
          <button
            style={{
              backgroundColor: '#FEBE98',
              color: '#FFFFFF',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={handleDelete}
          >
            확인
          </button>
        }
      />
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    boxShadow: '0 5px 20px rgba(0, 0, 0, 0.15)',
  },
  title: {
    textAlign: 'center',
    color: '#FEBE98',
    fontSize: '2.2rem',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  headerActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
  },
  addButton: {
    backgroundColor: '#FFFFFF',
    color: '#FEBE98',
    border: '2px solid #FEBE98',
    padding: '12px 20px',
    cursor: 'pointer',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: '18px',
    color: '#DCDCDC',
  },
};

export default PointShopAdminPage;
