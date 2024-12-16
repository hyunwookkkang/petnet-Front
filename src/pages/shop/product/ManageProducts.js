import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner, Button } from "react-bootstrap";
import "../../../styles/pointshop/point.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]); // 상품 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 무한 스크롤 여부
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const navigate = useNavigate();

  // API 엔드포인트
  const apiEndpoint = () => `/api/shop/products`;

  // 상품 데이터 가져오기
  const fetchProducts = async (page) => {
    if (!hasMore) return; // 더 이상 데이터가 없으면 실행 안 함
    setLoading(true); // 로딩 시작
  
    try {
      const response = await axios.get(
        `${apiEndpoint()}?currentPage=${page}&pageSize=10`
      );
      const data = response.data;
  
      if (data.length === 0) {
        setHasMore(false); // 더 이상 데이터가 없을 때
      } else {
        // 중복 제거 로직
        setProducts((prevProducts) => {
          const newProducts = data.map((product) => ({
            ...product,
            id: product.productId, // 각 상품에 고유 id 추가
          }));
          // 기존 데이터와 비교하여 중복 제거
          const uniqueProducts = newProducts.filter(
            (newProduct) => !prevProducts.some((product) => product.id === newProduct.id)
          );
          return [...prevProducts, ...uniqueProducts];
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setHasMore(false); // 에러가 발생하면 더 이상 데이터가 없다고 처리
    } finally {
      setLoading(false); // 로딩 종료
    }
  };
  

  // 스크롤 이벤트 처리
  const handleScroll = (e) => {
    const bottom =
      e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;

    if (bottom && !loading && hasMore) {
      setCurrentPage((prevPage) => prevPage + 1); // 페이지 증가
    }
  };

  useEffect(() => {
    setProducts([]); // 상품 리스트 초기화
    setCurrentPage(0); // 페이지 번호 초기화
    setHasMore(true); // 더 불러올 데이터가 있다고 설정
    fetchProducts(0); // 초기 데이터 로드 (0 페이지부터)

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (currentPage > 0) {
      fetchProducts(currentPage); // 페이지가 변경되면 데이터 로드
    }
  }, [currentPage]);

  // 로딩 중 표시
  if (loading && currentPage === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="secondary" />
        <p className="mt-3" style={{ fontSize: "1.5rem", color: "#888" }}>
          상품 목록을 불러오는 중입니다...
        </p>
      </div>
    );
  }

  // DataGrid 열 정의
  const columns = [
    { field: "id", headerName: "순번", width: 100 },
    { field: "image", headerName: "이미지", width: 150, renderCell: (params) => <img src={params.value} alt="Product" style={{ width: "50px", height: "50px" }} /> },
    { field: "productName", headerName: "상품명", width: 200 },
    { field: "price", headerName: "가격", width: 150 },
    { field: "discount", headerName: "할인율", width: 150 }
  ];

  // 상품 추가 버튼 클릭 이벤트
  const handleAddProduct = () => {
    navigate("/shop/products/form");
  };

  // 상품 행 클릭 이벤트
  const handleRowClick = (params) => {
    navigate(`/shop/products/form/${params.id}`);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#FFF5EF", border: "2px solid #FF7826" }}>
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#FF7826" }}>상품 목록</h1>
        <Button variant="primary" onClick={handleAddProduct}>상품 추가</Button>
      </div>

      <div style={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={products}
          columns={columns}
          pageSize={10}
          onRowClick={handleRowClick}
        />
      </div>

      {loading && hasMore && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Spinner animation="border" variant="secondary" />
          <p>데이터를 불러오는 중입니다...</p>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
