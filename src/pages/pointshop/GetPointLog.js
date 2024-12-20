import React, { useEffect, useState } from "react";
import { Table, Button, Card, Statistic, Modal, Space} from "antd";
import { DollarCircleOutlined } from "@ant-design/icons"; // Ant Design 아이콘
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/contexts/UserContext";

const GetPointLog = () => {
  const [pointLogs, setPointLogs] = useState([]);
  const [addLogs, setAddLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentApi, setCurrentApi] = useState("getPointLog");
  const [showAlert, setShowAlert] = useState(false);

  const { userId, myPoint } = useUser();
  const navigate = useNavigate();

  const todayDate = new Date()
    .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    .replace(/-/g, ".");

  const reasonMapping = {
    0: "이벤트 발생",
    1: "장소 리뷰",
    2: "퀴즈 성공",
    3: "상품 리뷰",
    4: "게시글 등록",
    5: "인기 게시글 선정",
    7: "포인트 소멸",
    8: "상품 구매",
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
          key: index + 1,
          ...log,
          pointLogDate: new Date(log.pointLogDate)
            .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
            .replace(/-/g, ".")
            .replace(/\.$/, ""),
          reasonText: reasonMapping[log.reason] || `알 수 없음(${log.reason})`,
        }));
        setPointLogs(formattedData);

        if (currentApi === "getPointAddLog" || addLogs.length === 0) {
          const addLogResponse = await axios.get(apiEndpoints(userId)["getPointAddLog"]);
          const formattedAddLogs = addLogResponse.data.map((log, index) => ({
            key: index + 1,
            ...log,
            pointLogDate: new Date(log.pointLogDate)
              .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
              .replace(/-/g, "."),
            reasonText: reasonMapping[log.reason] || `알 수 없음(${log.reason})`,
          }));
          setAddLogs(formattedAddLogs);
        }
      } catch (error) {
        console.error("Error fetching point logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [currentApi, userId]);

  const isCompleted = (reason) =>
    addLogs.some(
      (log) => log.pointLogDate === todayDate && log.reason === String(reason)
    );

  const columns = [
    {
      title: "순번",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "이유",
      dataIndex: "reasonText",
      key: "reasonText",
    },
    {
      title: "날짜",
      dataIndex: "pointLogDate",
      key: "pointLogDate",
    },
    {
      title: "포인트 변동량",
      dataIndex: "pointAmount",
      key: "pointAmount",
    },
  ];

  const checkItems = [
    { reason: 1, label: "장소 리뷰" },
    { reason: 2, label: "퀴즈 성공" },
    { reason: 3, label: "상품 리뷰" },
    { reason: 4, label: "게시글 등록" },
  ];

  const handleApiChange = (apiKey) => {
    setCurrentApi(apiKey);
  };

  return (
    <div style={{ padding: "10px", backgroundColor: "#F0F0F0", minHeight: "100vh" }}>
      <h1 style={{  textAlign: "center"}}>포인트 내역 </h1>
      {/* 헤더 */}
      <div style={{display: "flex",justifyContent: "flex-end",alignItems: "center",backgroundColor: "#F0F0F0",}}>
      <DollarCircleOutlined style={{ color: "#FEBE98", fontSize: "24px", marginRight: "5px" }} />
      <span style={{ color: "#FEBE98",fontSize: "20px" }}>{myPoint || 0}P</span>
    </div>

      {/* 오늘 기록 체크 */}
      <div
        style={{
          border: "1px solid #E0E0E0",
          borderRadius: "5px",
          backgroundColor: "#FFFFFF",
          marginBottom: "10px",
        }}
      >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "5px",
        }}
      >
        {checkItems.map((item) => (
          <div key={item.reason} style={{ fontSize: "16px" }}>
            {item.label}
            {isCompleted(item.reason) ? ":✅" : ":❎"}
          </div>
        ))}
      </div>
      </div>
      {/* 버튼 그룹 */}
      <Space style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center", 
        marginBottom: "10px", 
        wigth: "100%"
        
      }}>
        <Button
          type="default"
          style={{
            backgroundColor: currentApi === "getPointLog" ? "#FEBE98" : "#DCDCDC",
            color: "#FFFFFF",
            border: "#FFFFFF",
            fontSize: "20px",
          }}
          onClick={() => handleApiChange("getPointLog")}
        >
          전체 로그
        </Button>
        <Button
          type="default"
          style={{
            backgroundColor: currentApi === "getPointAddLog" ? "#FEBE98" : "#DCDCDC",
            color: "#FFFFFF",
            border: "#FFFFFF",
            fontSize: "20px",
          }}
          onClick={() => handleApiChange("getPointAddLog")}
        >
          적립 로그
        </Button>
        <Button
          type="default"
          style={{
            backgroundColor: currentApi === "getPointUpdateLog" ? "#FEBE98" : "#DCDCDC",
            color: "#FFFFFF",
            border: "#FFFFFF",
            fontSize: "20px",
          }}
          onClick={() => handleApiChange("getPointUpdateLog")}
        >
          사용 로그
        </Button>
      </Space>

      {/* 테이블 */}
      <Table
        dataSource={pointLogs}
        columns={columns}
        loading={loading}
        pagination={{
          pageSize: 10,
          position: ["bottomCenter"], // 페이지네이션을 하단 중앙으로 위치시킴
        }}
        style={{ border: "none", backgroundColor: "#FFFFFF" }}
      />

      {/* 포인트 이용 안내 */}
      <Card style={{ marginTop: "20px" }}>
        <h2>포인트 이용 안내</h2>
        <ul>
          <li>장소 리뷰 작성 시 100P 적립 (하루에 한 번)</li>
          <li>퀴즈 70점 이상 시 100P 적립 (하루에 한 번)</li>
          <li>상품 리뷰 작성 시 100P 적립 (하루에 한 번)</li>
          <li>게시글 등록 시 100P 적립 (하루에 한 번)</li>
          <li>인기 게시글 선정 시 200P 적립 (제한 없음)</li>
          <li>매년 1월 1일에 모든 보유 포인트 소멸</li>
        </ul>
      </Card>

      {/* 모달 */}
      <Modal
        visible={showAlert}
        onOk={() => navigate("/login")}
        onCancel={() => setShowAlert(false)}
        title="로그인 필요"
        okText="확인"
        cancelText="취소"
      >
        로그인이 필요한 서비스입니다. 로그인 화면으로 이동합니다.
      </Modal>
    </div>
  );
};

export default GetPointLog;
