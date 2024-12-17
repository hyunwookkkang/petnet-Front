import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import "../../styles/pointshop/point.css";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import ChangeCircleSharpIcon from '@mui/icons-material/ChangeCircleSharp';
import axios from 'axios';
import CommonModal from '../../components/common/modal/CommonModal';
import { showSuccessToast, showErrorToast } from "../../components/common/alert/CommonToast";

const formatLocalDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} 
    ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

const PointShopAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleToggleStock = async (productId) => {
    try {
      await axios.patch(`/api/pointshop/pointProducts/Admin/${productId}`);
      showSuccessToast('상품 상태가 성공적으로 변경되었습니다.');
      fetchProducts(); // 상태 업데이트를 위해 데이터 다시 불러오기
    } catch (error) {
      console.error('Error toggling product stock:', error);
      showErrorToast('상품 상태 변경에 실패했습니다.');
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
          className="delete-icon"
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
          className="info-icon"
        >
          <InfoIcon />
        </IconButton>
      ),
    },
    {
      field: 'Toggle',
      headerName: '상태 변경',
      width: 120,
      renderCell: (params) => (
        <IconButton
          onClick={() => handleToggleStock(params.row.productId)}
          aria-label="toggle"
          style={{
            color: params.row.productStock === 1 ? '#4caf50' : '#f44336', // 초록색(1) / 빨간색(0)
          }}
        >
          <ChangeCircleSharpIcon />
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
          className="product-name-link"
        >
          {params.value}
        </span>
      ),
    },
    { field: 'productAddDate', headerName: '등록 일자', width: 250 },
    { field: 'validityDate', headerName: '유효 기간', width: 150 },
    { field: 'price', headerName: '포인트 가격', width: 150 },
    { field: 'brandCategory', headerName: '브랜드 카테고리', width: 200 },
  ];

  return (
    <div className="admin-container">
      <h1 className="admin-title">포인트 상품 관리</h1>
      <div className="header-actions">
        <button onClick={() => navigate('AdminAddPointProduct')} className="add-button">
          포인트 상품 추가
        </button>
      </div>
      {loading ? (
        <p className="loading-text">상품 정보를 불러오는 중입니다...</p>
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
          <button className="confirm-delete-button" onClick={handleDelete}>
            확인
          </button>
        }
      />
    </div>
  );
};

export default PointShopAdminPage;
