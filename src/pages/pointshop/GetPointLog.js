import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import "../../styles/pointshop/point.css";

const UserPointLogPage = () => {
  const [pointLogs, setPointLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 이유 매핑
  const reasonMapping = {
    0: '이벤트 발생',
    1: '장소 리뷰',
    2: '퀴즈 성공',
    3: '상품 리뷰',
    4: '게시글 등록',
    5: '인기 게시글 선정',
    7: '포인트 소멸',
    8: '상품 구매',
  };

  // Fetch user point logs
  useEffect(() => {
    const fetchPointLogs = async () => {
      try {
        const response = await fetch('http://192.168.0.40:8000/api/pointshop/point/user01/getPointLog');
        if (!response.ok) {
          throw new Error('Failed to fetch point logs.');
        }
        const data = await response.json();

        // 날짜 형식을 초 단위까지만 보이도록 변환하고 이유를 매핑하며 순번 추가
        const formattedData = data.map((log, index) => ({
          id: index + 1, // 순번 추가
          ...log,
          reason: reasonMapping[log.reason] || `알 수 없음(${log.reason})`, // 이유 매핑
          pointLogDate: new Date(log.pointLogDate).toISOString().replace('T', ' ').substring(0, 19),
        }));

        setPointLogs(formattedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPointLogs();
  }, []);

  // Define DataGrid columns
  const columns = [
    { field: 'id', headerName: '순번', width: 100 }, // 순번 추가
    { field: 'reason', headerName: '이유', width: 200 },
    { field: 'pointLogDate', headerName: '날짜', width: 200 },
    { field: 'pointAmount', headerName: '포인트 변경량', width: 150 },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#FFF5EF', border: '2px solid #FF7826' }}>
      <h1 style={{ textAlign: 'center', color: '#FF7826' }}>포인트 내역</h1>
      {loading ? (
        <p>포인트 내역을 불러오는 중입니다...</p>
      ) : (
        <div style={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={pointLogs}
            columns={columns}
            pageSize={10}
          />
        </div>
      )}
    </div>
  );
};

export default UserPointLogPage;
