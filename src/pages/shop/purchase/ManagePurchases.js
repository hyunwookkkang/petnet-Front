import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner, Button } from "react-bootstrap";
import "../../../styles/pointshop/point.css";

const ManagePurchases = () => {
  const [purchases, setPurchases] = useState([]); // 구매 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [hasMore, setHasMore] = useState(true); // 무한 스크롤 여부
  const [currentPage, setCurrentPage] = useState(0); // 현재 페이지
  const navigate = useNavigate();

  // API 엔드포인트
  const apiEndpoint = () => `/api/shop/purchases/manage`;

  // 구매 데이터 가져오기
  const fetchPurchases = async (page) => {
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
        setPurchases((prevPurchases) => {
          const newPurchases = data.map((purchase) => ({
            ...purchase,
            id: purchase.purchaseId, // 각 구매에 고유 id 추가
          }));
          // 기존 데이터와 비교하여 중복 제거
          const uniquePurchases = newPurchases.filter(
            (newPurchase) => !prevPurchases.some((purchase) => purchase.id === newPurchase.id)
          );
          return [...prevPurchases, ...uniquePurchases];
        });
      }
    } catch (error) {
      console.error("Error fetching purchases:", error);
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
    setPurchases([]); // 구매 리스트 초기화
    setCurrentPage(0); // 페이지 번호 초기화
    setHasMore(true); // 더 불러올 데이터가 있다고 설정
    fetchPurchases(0); // 초기 데이터 로드 (0 페이지부터)

    // 스크롤 이벤트 리스너 등록
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (currentPage > 0) {
      fetchPurchases(currentPage); // 페이지가 변경되면 데이터 로드
    }
  }, [currentPage]);

  // 로딩 중 표시
  if (loading && currentPage === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="secondary" />
        <p className="mt-3" style={{ fontSize: "1.5rem", color: "#888" }}>
          구매 목록을 불러오는 중입니다...
        </p>
      </div>
    );
  }

  // DataGrid 열 정의
  const columns = [
    { field: "id", headerName: "구매 ID", width: 150 },
    { field: "userId", headerName: "사용자 ID", width: 150 },
    { field: "paidDate", headerName: "결제일", width: 180 },
    { field: "paymentAmount", headerName: "결제 금액", width: 150 },
    { field: "productName", headerName: "상품명", width: 200 },
    { field: "orderQuantity", headerName: "구매 수량", width: 150 },
    { field: "purchaseStatus", headerName: "구매 상태", width: 150 }
  ];

  // 상품 행 클릭 이벤트
  const handleRowClick = (params) => {
    navigate(`/shop/purchases/form/${params.id}`);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#FFF5EF", border: "2px solid #FF7826" }}>
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#FF7826" }}>구매 목록</h1>
      </div>

      <div style={{ height: 600, width: "100%", overflowX: "auto" }}>
        <DataGrid
          rows={purchases}
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

export default ManagePurchases;
