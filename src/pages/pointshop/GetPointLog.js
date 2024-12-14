import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import "../../styles/pointshop/GetPointLog.css"; // CSS 파일 import
import { useUser } from "../../components/contexts/UserContext";
import CommonModal from "../../components/common/modal/CommonModal";
import "../../styles/pointshop/GetPointProduct.css"
// 로컬 시간대에 맞게 날짜를 변환하는 함수
const formatLocalDate = (dateStr) => {
  const date = new Date(dateStr); // UTC 시간을 로컬 시간대로 변환
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월을 2자리로 표시
  const day = String(date.getDate()).padStart(2, '0'); // 일을 2자리로 표시
  const hours = String(date.getHours()).padStart(2, '0'); // 시간을 2자리로 표시
  const minutes = String(date.getMinutes()).padStart(2, '0'); // 분을 2자리로 표시
  const seconds = String(date.getSeconds()).padStart(2, '0'); // 초를 2자리로 표시

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`; // YYYY-MM-DD HH:MM:SS 형식
};

const GetPointLog = () => {
  const [pointLogs, setPointLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentApi, setCurrentApi] = useState('getPointLog');
  const [userPoint, setUserPoint] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const { userId } = useUser();
  const navigate = useNavigate();

  // 오늘 날짜 (YYYY-MM-DD)
  const todayDate = new Date().toISOString().slice(0, 10);

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
          reasonText: reasonMapping[log.reason] || `알 수 없음(${log.reason})`,
          pointLogDate: formatLocalDate(log.pointLogDate), // 로컬 시간대로 변환
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
    { field: 'reasonText', headerName: '이유', width: 200 },
    { field: 'pointLogDate', headerName: '날짜', width: 200 },
    { field: 'pointAmount', headerName: '포인트 변경량', width: 150 },
  ];

  // 오늘 날짜에 reason 별로 적립 기록 있는지 확인
  const reasonsToCheck = [1, 2, 3, 4]; 
  const todayCheck = {};
  reasonsToCheck.forEach(r => {
    todayCheck[r] = pointLogs.some(log => {
      const logDate = log.pointLogDate.slice(0, 10); // YYYY-MM-DD
      return logDate === todayDate && log.reason === String(r); // String(r)로 비교
    });
  });

  const checkItems = [
    { reason: 1, label: '오늘 장소 리뷰' },
    { reason: 2, label: '오늘 퀴즈 성공' },
    { reason: 3, label: '오늘 상품 리뷰' },
    { reason: 4, label: '오늘 게시글 등록' },
  ];

  return (
    <div className="point-log-container">
      <div className="point-log-header">
        <h1 className="point-log-title">포인트 내역</h1>
        <div className="point-log-userpoint">
          <h5> 현재 포인트: {userPoint !== null ? userPoint : '불러오는 중...'}</h5>
        </div>
      </div>

      <div className="today-check-container">
        {checkItems.map(item => {
          const isO = todayCheck[item.reason]; 
          const textColorClass = isO ? 'text-o' : 'text-x'; 
          return (
            <div key={item.reason} className={`today-log-card ${textColorClass}`}>
              {item.label}: {isO ? '⭕' : '❌'}
            </div>
          );
        })}
      </div>

      <div className="button-group">
        <button
          onClick={() => setCurrentApi('getPointLog')}
          className={`log-button ${currentApi === 'getPointLog' ? 'active' : ''}`}
        >
          전체 로그
        </button>
        <button
          onClick={() => setCurrentApi('getPointAddLog')}
          className={`log-button ${currentApi === 'getPointAddLog' ? 'active' : ''}`}
        >
          적립 로그
        </button>
        <button
          onClick={() => setCurrentApi('getPointUpdateLog')}
          className={`log-button ${currentApi === 'getPointUpdateLog' ? 'active' : ''}`}
        >
          사용 로그
        </button>
      </div>

      {loading ? (
        <div className="loading-text">포인트 내역을 불러오는 중입니다...</div>
      ) : (
        <div className="datagrid-container">
          <DataGrid
            rows={pointLogs}
            columns={columns}
            pageSize={10}
            style={{ backgroundColor: '#FFFFFF', border: 'none' }}
          />
        </div>
      )}

      <div className="product-info-box">
        <h2>포인트 이용 안내</h2>
        <ul>
          <li>장소 리뷰 작성 시 100P 적립 (하루에 한 번)</li>
          <li>퀴즈 참여 시, 10문제 중 7문제 이상 맞추면 100P 적립 (하루에 한 번)</li>
          <li>상품 리뷰 작성 시 100P 적립 (하루에 한 번)</li>
          <li>게시글 등록 시 100P 적립 (하루에 한 번)</li>
          <li>인기 게시글로 선정된 경우 200P 적립 (일일 제한 없음)</li>
          <li>매년 1월 1일, 보유 포인트 소멸</li>
        </ul>
      </div>

      <CommonModal
        show={showAlert}
        onHide={() => {
          setShowAlert(false);
          navigate("/login");
        }}
        title="로그인 필요"
        body={<div>로그인이 필요한 서비스입니다.<br /> 로그인 화면으로 이동합니다.</div>}
        footer={
          <button className="modal-confirm-button"
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
