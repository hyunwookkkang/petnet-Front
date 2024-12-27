import React, { useEffect, useState } from "react";
import { Card, Button, Spinner } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from '../../../components/common/alert/CommonToast';

const DeliveryInfos = () => {
  const [deliveryList, setDeliveryList] = useState([]); // 배송지 목록
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [selectedDeliveries, setSelectedDeliveries] = useState([]); // 선택된 배송지 목록
  const navigate = useNavigate();

  // API 엔드포인트
  const apiEndpoint = () => `/api/deliveryInfo`;

  // 배송지 데이터 가져오기
  const fetchDeliveryInfo = async () => {
    setLoading(true); // 로딩 시작
    try {
      const response = await axios.get(apiEndpoint());
      const data = response.data;
      // 최대 5개의 배송지만 저장
      setDeliveryList(data.slice(0, 5));
    } catch (error) {
      console.error("Error fetching delivery info:", error);
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  useEffect(() => {
    fetchDeliveryInfo(); // 컴포넌트 로드 시 데이터 가져오기
  }, []);

  // 배송지 추가 버튼 클릭 이벤트
  const handleAddDelivery = () => {
    navigate("/deliveryInfo/form"); // 배송지 추가 폼으로 이동
  };

  // 배송지 클릭 이벤트: 수정 페이지로 이동
  const handleEditDelivery = (deliveryInfoId) => {
    navigate(`/deliveryInfo/form/${deliveryInfoId}`); // 수정 페이지로 이동
  };

  // 배송지 삭제
  const handleDeleteDelivery = async (deliveryInfoId) => {
    try {
      await axios.delete(`/api/deliveryInfo/${deliveryInfoId}`);
      showSuccessToast("배송지가 삭제되었습니다.");
      fetchDeliveryInfo(); // 데이터 갱신
    } catch (error) {
      console.error("배송지 삭제 중 오류 발생:", error);
      showErrorToast("배송지 삭제 중 오류가 발생했습니다.");
    }
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="secondary" />
        <p className="mt-3" style={{ fontSize: "1.5rem", color: "#888" }}>
          배송지 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#FFF5EF", border: "2px solid #FF7826" }}>
      <h1 style={{ color: "#FF7826", marginBottom: "20px" }}>배송지 목록</h1>

      {/* 배송지 목록 출력 */}
      {deliveryList.map((deliveryInfo) => (
        <Card
          key={deliveryInfo.deliveryInfoId}
          style={{ marginBottom: "15px", padding: "15px", position: "relative" }}
        >
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              display: "flex",
              gap: "10px",
            }}
          >
            {/* 수정 버튼 */}
            <Button
              variant="link"
              style={{ padding: "0", color: "#FF7826" }}
              onClick={() => handleEditDelivery(deliveryInfo.deliveryInfoId)}
            >
              수정
            </Button>
            {/* 삭제 버튼 */}
            <Button
              variant="link"
              style={{ padding: "0", color: "red" }}
              onClick={() => handleDeleteDelivery(deliveryInfo.deliveryInfoId)}
            >
              삭제
            </Button>
          </div>
          <Card.Body>
            <Card.Text>
              <strong>주소:</strong> {deliveryInfo.deliveryAddress}
            </Card.Text>
            <Card.Text>
              <strong>우편번호:</strong> {deliveryInfo.zipCode}
            </Card.Text>
            <Card.Text>
              <strong>이름:</strong> {deliveryInfo.buyerName}
            </Card.Text>
            <Card.Text>
              <strong>연락처:</strong> {deliveryInfo.deliveryPhoneNumber}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}

      {/* 배송지 추가 버튼 */}
      {deliveryList.length < 5 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button
            style={{ backgroundColor: "#FF6347", borderColor: "#FF6347", marginTop: "10px" }}
            size="lg"
            className="d-block w-100"
            onClick={handleAddDelivery}
          >
            배송지 추가
          </Button>
        </div>
      )}

      {deliveryList.length >= 5 && (
        <p style={{ textAlign: "center", marginTop: "20px", color: "red" }}>
          배송지는 최대 5개까지만 등록할 수 있습니다.
        </p>
      )}
    </div>
  );
};

export default DeliveryInfos;
