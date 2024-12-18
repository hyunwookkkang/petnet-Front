import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../../styles/pointshop/GetPointLog.css";
import { useUser } from "../../components/contexts/UserContext";
import CommonModal from "../../components/common/modal/CommonModal";
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined'; // 포인트 아이콘 추가

// 날짜 포맷팅
const formatLocalDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} 
          ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
};

const GetPointLog = () => {
  const [pointLogs, setPointLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentApi, setCurrentApi] = useState('getPointLog');
  const [userPoint, setUserPoint] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const { userId } = useUser();
  const navigate = useNavigate();
  const todayDate = new Date().toISOString().slice(0, 10);

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

  const apiEndpoints = (userId) => ({
    getPointLog: `/api/pointshop/point/${userId}/getPointLog`,
    getPointAddLog: `/api/pointshop/point/${userId}/getPointAddLog`,
    getPointUpdateLog: `/api/pointshop/point/${userId}/getPointUpdateLog`,
  });

  useEffect(() => {
    if (!userId) {
      setShowAlert(true);
      return;
    }

    const fetchLogs = async () => {
      setLoading(true);
      try {
        const response = await axios.get(apiEndpoints(userId)[currentApi]);
        const formattedData = response.data.map((log, index) => ({
          id: index + 1,
          ...log,
          reasonText: reasonMapping[log.reason] || `알 수 없음(${log.reason})`,
          pointLogDate: formatLocalDate(log.pointLogDate),
        }));

        setPointLogs(formattedData);
      } catch (error) {
        console.error("Error fetching point logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [currentApi, userId]);

  useEffect(() => {
    if (!userId) {
      setShowAlert(true);
      return;
    }

    const fetchUserPoint = async () => {
      try {
        const response = await axios.get(`/api/pointshop/point/${userId}/getUserPoint`);
        setUserPoint(response.data);
      } catch (error) {
        console.error("Error fetching user points:", error);
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

  const checkItems = [
    { reason: 1, label: '오늘 장소 리뷰' },
    { reason: 2, label: '오늘 퀴즈 성공' },
    { reason: 3, label: '오늘 상품 리뷰' },
    { reason: 4, label: '오늘 게시글 등록' },
  ];

  return (
    <div className="point-log-container" style={{ fontFamily: "Ownglyph_ParkDaHyun, sans-serif" }}>
      <div className="point-log-header">
        <h1 className="point-log-title">포인트 내역</h1>
        <div className="my-user-info-box text-center">
          <p className="my-icon-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <PaidOutlinedIcon sx={{ color: "#FEBE98", marginRight: "6px", fontSize: "28px" }} />
            <span style={{ fontWeight: "bold", fontSize: "24px", color: "#FEBE98" }}>
              {userPoint !== null ? userPoint : '0'}P
            </span>
          </p>
        </div>
      </div>

      <div className="today-check-container">
        {checkItems.map(item => (
          <div
            key={item.reason}
            style={{fontSize: '12px'}}
            className={`today-log-card ${pointLogs.some(log => log.pointLogDate.slice(0, 10) === todayDate && log.reason === String(item.reason)) ? 'text-o' : 'text-x'}`}
          >
            {item.label}: {pointLogs.some(log => log.pointLogDate.slice(0, 10) === todayDate && log.reason === String(item.reason)) ? '⭕' : '❌'}
          </div>
        ))}
      </div>

      <div className="button-group">
        {["getPointLog", "getPointAddLog", "getPointUpdateLog"].map((apiKey) => (
          <button
            key={apiKey}
            onClick={() => setCurrentApi(apiKey)}
            className={`log-button ${currentApi === apiKey ? 'active' : ''}`}
            style={{fontSize: '16px'}}
          >
            {apiKey === "getPointLog" ? "전체 로그" : apiKey === "getPointAddLog" ? "적립 로그" : "사용 로그"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-text">포인트 내역을 불러오는 중입니다...</div>
      ) : (
        <div className="datagrid-container">
          <DataGrid
            rows={pointLogs}
            columns={columns}
            pageSize={10}
            style={{ backgroundColor: '#FFFFFF', border: 'none', fontFamily: 'Ownglyph_ParkDaHyun, sans-serif' }}
          />
        </div>
      )}

      {/* 포인트 이용 안내 */}
      <div className="product-info-box">
        <h2>포인트 이용 안내</h2>
        <ul>
          <li>장소 리뷰 작성 시 100P 적립 (하루에 한 번)</li>
          <li>퀴즈 참여 점수 70점 이상일 시시 100P 적립 (하루에 한 번)</li>
          <li>상품 리뷰 작성 시 100P 적립 (하루에 한 번)</li>
          <li>게시글 등록 시 100P 적립 (하루에 한 번)</li>
          <li>인기 게시글 선정 시 200P 적립 (제한 없음)</li>
          <li>매년 1월 1일, 보유 포인트 소멸</li>
        </ul>
      </div>

      {/* 로그인 모달 */}
      <CommonModal
        show={showAlert}
        onHide={() => {
          setShowAlert(false);
          navigate("/login");
        }}
        title="로그인 필요"
        body="로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다."
        footer={
          <button
            className="modal-confirm-button"
            style={{ backgroundColor: "#feb98e", border: 'none' }}
            onClick={() => navigate("/login")}
          >
            확인
          </button>
        }
      />
    </div>
  );
};

export default GetPointLog;
