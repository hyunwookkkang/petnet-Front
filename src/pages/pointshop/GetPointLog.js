import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import "../../styles/pointshop/point.css";

const UserPointLogPage = () => {
  const [pointLogs, setPointLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentApi, setCurrentApi] = useState('getPointLog'); // 현재 API 상태
  const [userPoint, setUserPoint] = useState(null);

  const apiEndpoints = {
    getPointLog: 'http://192.168.0.40:8000/api/pointshop/point/user01/getPointLog',
    getPointAddLog: 'http://192.168.0.40:8000/api/pointshop/point/user01/getPointAddLog',
    getPointUpdateLog: 'http://192.168.0.40:8000/api/pointshop/point/user01/getPointUpdateLog',
  };

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

  // Fetch point logs based on the selected API
  useEffect(() => {
    const fetchPointLogs = async () => {
      try {
        setLoading(true); // 로딩 상태 시작
        const response = await fetch(apiEndpoints[currentApi]);
        if (!response.ok) {
          throw new Error('Failed to fetch point logs.');
        }
        const data = await response.json();

        // 날짜 형식 변환 및 이유 매핑
        const formattedData = data.map((log, index) => ({
          id: index + 1, // 순번 추가
          ...log,
          reason: reasonMapping[log.reason] || `알 수 없음(${log.reason})`,
          pointLogDate: new Date(log.pointLogDate).toISOString().replace('T', ' ').substring(0, 19),
        }));

        setPointLogs(formattedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // 로딩 상태 종료
      }
    };

    fetchPointLogs();
  }, [currentApi]); // currentApi가 변경될 때마다 데이터 재호출

  // Fetch user point
  useEffect(() => {
    const fetchUserPoint = async () => {
      try {
        const response = await fetch('http://192.168.0.40:8000/api/pointshop/point/user01/getUserPoint');
        if (!response.ok) {
          throw new Error('Failed to fetch user point.');
        }
        const data = await response.json();
        setUserPoint(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserPoint();
  }, []);

  // Define DataGrid columns
  const columns = [
    { field: 'id', headerName: '순번', width: 100 },
    { field: 'reason', headerName: '이유', width: 200 },
    { field: 'pointLogDate', headerName: '날짜', width: 200 },
    { field: 'pointAmount', headerName: '포인트 변경량', width: 150 },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#FFF5EF', border: '2px solid #FF7826' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#FF7826' }}>포인트 내역</h1>
        <div style={{
          backgroundColor: '#FF7826',
          color: '#FFF',
          padding: '10px 20px',
          borderRadius: '5px',
          fontWeight: 'bold',
        }}>
          현재 포인트: {userPoint !== null ? userPoint : '불러오는 중...'}
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setCurrentApi('getPointLog')}
          style={{
            marginRight: '10px',
            backgroundColor: currentApi === 'getPointLog' ? '#FF7826' : '#FFF',
            color: currentApi === 'getPointLog' ? '#FFF' : '#FF7826',
            padding: '10px 20px',
            borderRadius: '5px',
            border: '1px solid #FF7826',
            cursor: 'pointer',
          }}
        >
          전체 로그
        </button>
        <button
          onClick={() => setCurrentApi('getPointAddLog')}
          style={{
            marginRight: '10px',
            backgroundColor: currentApi === 'getPointAddLog' ? '#FF7826' : '#FFF',
            color: currentApi === 'getPointAddLog' ? '#FFF' : '#FF7826',
            padding: '10px 20px',
            borderRadius: '5px',
            border: '1px solid #FF7826',
            cursor: 'pointer',
          }}
        >
          적립 로그
        </button>
        <button
          onClick={() => setCurrentApi('getPointUpdateLog')}
          style={{
            backgroundColor: currentApi === 'getPointUpdateLog' ? '#FF7826' : '#FFF',
            color: currentApi === 'getPointUpdateLog' ? '#FFF' : '#FF7826',
            padding: '10px 20px',
            borderRadius: '5px',
            border: '1px solid #FF7826',
            cursor: 'pointer',
          }}
        >
          사용 로그
        </button>
      </div>
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
