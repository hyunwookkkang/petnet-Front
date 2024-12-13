import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import "../../styles/pointshop/point.css";
import { useUser } from "../../components/contexts/UserContext";
import CommonModal from "../../components/common/modal/CommonModal";

const GetPointLog = () => {
  const [pointLogs, setPointLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentApi, setCurrentApi] = useState('getPointLog');
  const [userPoint, setUserPoint] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const { userId } = useUser();
  const navigate = useNavigate();

  const apiEndpoints = (userId) => ({
    getPointLog: `/api/pointshop/point/${userId}/getPointLog`,
    getPointAddLog: `/api/pointshop/point/${userId}/getPointAddLog`,
    getPointUpdateLog: `/api/pointshop/point/${userId}/getPointUpdateLog`,
  });

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

  useEffect(() => {
    if (!userId) {
      setShowAlert(true);
      return;
    }

    const fetchPointLogs = async () => {
      try {
        setLoading(true);
        const response = await fetch(apiEndpoints(userId)[currentApi]);
        if (!response.ok) {
          throw new Error('Failed to fetch point logs.');
        }
        const data = await response.json();

        const formattedData = data.map((log, index) => ({
          id: index + 1,
          ...log,
          reason: reasonMapping[log.reason] || `알 수 없음(${log.reason})`,
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
  }, [currentApi, userId]);

  useEffect(() => {
    if (!userId) {
      setShowAlert(true);
      return;
    }

    const fetchUserPoint = async () => {
      try {
        const response = await fetch(`/api/pointshop/point/${userId}/getUserPoint`);
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
  }, [userId]);

  const columns = [
    { field: 'id', headerName: '순번', width: 100 },
    { field: 'reason', headerName: '이유', width: 200 },
    { field: 'pointLogDate', headerName: '날짜', width: 200 },
    { field: 'pointAmount', headerName: '포인트 변경량', width: 150 },
  ];

  return (
    <div style={{ padding: '20px', background: '#FFFFFF', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#FF6347', fontSize: '2rem', fontWeight: 'bold' }}>포인트 내역</h1>
        <div style={{
          backgroundColor: '#FEBE98',
          color: '#FFFFFF',
          padding: '10px 20px',
          borderRadius: '5px',
          fontWeight: 'bold',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
        }}>
          현재 포인트: {userPoint !== null ? userPoint : '불러오는 중...'}
        </div>
      </div>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setCurrentApi('getPointLog')}
          style={{
            flex: 1,
            backgroundColor: currentApi === 'getPointLog' ? '#FF6347' : '#FFFFFF',
            color: currentApi === 'getPointLog' ? '#FFFFFF' : '#FF6347',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #FF6347',
            fontWeight: 'bold',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          전체 로그
        </button>
        <button
          onClick={() => setCurrentApi('getPointAddLog')}
          style={{
            flex: 1,
            backgroundColor: currentApi === 'getPointAddLog' ? '#ECB392' : '#FFFFFF',
            color: currentApi === 'getPointAddLog' ? '#FFFFFF' : '#ECB392',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ECB392',
            fontWeight: 'bold',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          적립 로그
        </button>
        <button
          onClick={() => setCurrentApi('getPointUpdateLog')}
          style={{
            flex: 1,
            backgroundColor: currentApi === 'getPointUpdateLog' ? '#EEA092' : '#FFFFFF',
            color: currentApi === 'getPointUpdateLog' ? '#FFFFFF' : '#EEA092',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #EEA092',
            fontWeight: 'bold',
            boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          사용 로그
        </button>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '20px', fontSize: '1.2rem', color: '#DCDCDC' }}>
          포인트 내역을 불러오는 중입니다...
        </div>
      ) : (
        <div style={{ height: 600, width: '100%', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)', background: '#EDEDED' }}>
          <DataGrid
            rows={pointLogs}
            columns={columns}
            pageSize={10}
            style={{ backgroundColor: '#FFFFFF', border: 'none' }}
          />
        </div>
      )}

      <CommonModal
        show={showAlert}
        onHide={() => {
          setShowAlert(false);
          navigate("/login");
        }}
        title="로그인 필요"
        body={<div>로그인이 필요한 서비스입니다.<br /> 로그인 화면으로 이동합니다.</div>}
        footer={
          <button
            style={{ backgroundColor: "#FF6347", color: "#FFFFFF", border: "none", padding: "10px 20px", borderRadius: "5px", fontWeight: "bold", cursor: "pointer" }}
            onClick={() => {
              setShowAlert(false);
              navigate("/login");
            }}
          >
            확인
          </button>
        }
      />
    </div>
  );
};

export default GetPointLog;
