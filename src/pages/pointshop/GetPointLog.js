import React, { useEffect, useState } from "react";
import { Table, Button, Card, Statistic, Modal, Space, Tag } from "antd";
import { DollarCircleOutlined } from "@ant-design/icons"; // Ant Design 아이콘
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/contexts/UserContext";

const GetPointLog = () => {
  const [pointLogs, setPointLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentApi, setCurrentApi] = useState("getPointLog");
  const [showAlert, setShowAlert] = useState(false);

  const { userId, myPoint } = useUser();
  const navigate = useNavigate();
  const todayDate = new Date().toISOString().slice(0, 10);

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
          key: index + 1, // Table의 고유 키
          ...log,
          reasonText: reasonMapping[log.reason] || `알 수 없음(${log.reason})`,
          pointLogDate: new Date(log.pointLogDate).toLocaleString(), // 포맷팅
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

  const columns = [
    {
      title: "순번",
      dataIndex: "key",
      key: "key",
      width: 80,
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
      title: "포인트 변경량",
      dataIndex: "pointAmount",
      key: "pointAmount",
    },
  ];

  const checkItems = [
    { reason: 1, label: "오늘 장소 리뷰" },
    { reason: 2, label: "오늘 퀴즈 성공" },
    { reason: 3, label: "오늘 상품 리뷰" },
    { reason: 4, label: "오늘 게시글 등록" },
  ];

  const handleApiChange = (apiKey) => {
    setCurrentApi(apiKey);
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#F0F0F0", minHeight: "100vh" }}>
      {/* 헤더 */}
      <Card style={{ marginBottom: "20px" }}>
        <Statistic
          title="보유 포인트"
          value={myPoint || 0}
          suffix="P"
          prefix={<DollarCircleOutlined style={{ color: "#FEBE98" }} />} // Ant Design 아이콘 사용
          valueStyle={{ color: "#FEBE98" }}
        />
      </Card>

      {/* 오늘 기록 체크 */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {checkItems.map((item) => (
          <Tag
            key={item.reason}
            color={pointLogs.some(
              (log) =>
                log.pointLogDate.slice(0, 10) === todayDate &&
                log.reason === String(item.reason)
            )
              ? "green"
              : "volcano"}
          >
            {item.label}: {pointLogs.some(
              (log) =>
                log.pointLogDate.slice(0, 10) === todayDate &&
                log.reason === String(item.reason)
            )
              ? "⭕"
              : "❌"}
          </Tag>
        ))}
      </div>

      {/* 버튼 그룹 */}
      <Space style={{ marginBottom: "20px" }}>
        <Button
          type="default"
          style={{
            backgroundColor: currentApi === "getPointLog" ? "#FEBE98" : "#DCDCDC",
            color: "#FFFFFF",
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
  pagination={{ pageSize: 10 }}
  style={{ border: "none", backgroundColor: "#FFFFFF" }} // 테두리 제거 및 배경색 유지
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
