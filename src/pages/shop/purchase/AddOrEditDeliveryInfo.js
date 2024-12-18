import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import AddDeliveryAddress from "./AddDeliveryAddress";

const AddOrEditDeliveryInfo = () => {
  const { deliveryInfoId } = useParams(); // 배송지 ID 파라미터
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    buyerName: "",
    deliveryAddress: "",
    deliveryPhoneNumber: "",
    zipCode: "",
  });

  const [loading, setLoading] = useState(false); // 로딩 상태 추가

  useEffect(() => {
    if (deliveryInfoId) {
      setLoading(true); // 로딩 시작
      axios
        .get(`/api/deliveryInfo/${deliveryInfoId}`)
        .then((response) => {
          const deliveryInfo = response.data;
          setFormData({
            buyerName: deliveryInfo.buyerName || "",
            deliveryAddress: deliveryInfo.deliveryAddress || "",
            deliveryPhoneNumber: deliveryInfo.deliveryPhoneNumber || "",
            zipCode: deliveryInfo.zipCode || "",
          });
        })
        .catch((err) => {
          console.error("배송지 정보를 불러오는 중 오류 발생:", err);
          alert("배송지 정보를 불러오는 중 오류가 발생했습니다.");
        })
        .finally(() => setLoading(false)); // 로딩 종료
    }
  }, [deliveryInfoId]);

  // 폼 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 주소 선택 시 데이터 업데이트
  const handleAddressSelected = (addressData) => {
    setFormData((prev) => ({
      ...prev,
      deliveryAddress: addressData.deliveryAddress,
      zipCode: addressData.zipCode,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    const apiUrl = deliveryInfoId ? `/api/deliveryInfo/${deliveryInfoId}` : "/api/deliveryInfo";
    const httpMethod = deliveryInfoId ? "put" : "post";

    axios[httpMethod](apiUrl, formData)
      .then(() => {
        alert(deliveryInfoId ? "배송지가 수정되었습니다!" : "배송지가 추가되었습니다!");
        navigate("/deliveryInfo");
      })
      .catch((err) => {
        console.error("배송지 처리 중 오류 발생:", err);
        alert("배송지 처리 중 오류가 발생했습니다.");
      });
  };

  // 로딩 중 표시
  if (loading) {
    return (
      <Container className="text-center" style={{ padding: "20px" }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-3" style={{ fontSize: "1.2rem", color: "#555" }}>
          배송지 정보를 불러오는 중입니다...
        </p>
      </Container>
    );
  }

  return (
    <Container style={{ maxWidth: "500px", padding: "20px" }}>
      <h3 className="mb-4">{deliveryInfoId ? "배송지 수정" : "배송지 추가"}</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>이름</Form.Label>
          <Form.Control
            type="text"
            name="buyerName"
            value={formData.buyerName}
            onChange={handleChange}
            placeholder="이름 입력"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>주소</Form.Label>
          <AddDeliveryAddress onAddressSelected={handleAddressSelected} />
          <Form.Control
            type="text"
            name="deliveryAddress"
            value={formData.deliveryAddress}
            placeholder="주소"
            readOnly
          />
          <Form.Control
            type="text"
            name="zipCode"
            value={formData.zipCode}
            placeholder="우편번호"
            readOnly
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>연락처</Form.Label>
          <Form.Control
            type="text"
            name="deliveryPhoneNumber"
            value={formData.deliveryPhoneNumber}
            onChange={handleChange}
            placeholder="연락처 입력"
            required
          />
        </Form.Group>

        <Button style={{
            backgroundColor: "#FF6347",  // 버튼 배경색
            borderColor: "#FF6347",      // 버튼 테두리 색
            color: "#fff",               // 버튼 텍스트 색
        }} type="submit">
          {deliveryInfoId ? "수정하기" : "추가하기"}
        </Button>
        <Button variant="secondary" style={{ marginLeft: "10px", backgroundColor: "#DCDCDC", borderColor: "#DCDCDC", color: "#000",  }} onClick={() => navigate("/deliveryInfo")}>
          취소하기
        </Button>
      </Form>
    </Container>
  );
};

export default AddOrEditDeliveryInfo;
