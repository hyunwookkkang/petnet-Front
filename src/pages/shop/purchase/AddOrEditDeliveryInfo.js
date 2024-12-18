import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";
 // 주소 검색 컴포넌트
import AddDeliveryAddress from "./AddDeliveryAddress";

const AddOrEditDeliveryInfo = () => {
  const { deliveryId } = useParams(); // 배송지 ID 파라미터
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    contact: "",
    postalCode: "",
  });

  useEffect(() => {
    if (deliveryId) {
      // 배송지 수정 모드: 기존 데이터 불러오기
      axios
        .get(`/api/deliveryInfo/${deliveryId}`)
        .then((response) => {
          const delivery = response.data;
          setFormData({
            name: delivery.name,
            address: delivery.address,
            contact: delivery.contact,
            postalCode: delivery.postalCode,
          });
        })
        .catch((err) => {
          console.error("배송지 정보를 불러오는 중 오류 발생:", err);
          alert("배송지 정보를 불러오는 중 오류가 발생했습니다.");
        });
    }
  }, [deliveryId]);

  // 폼 데이터 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 주소 선택 시 데이터 업데이트
  const handleAddressSelected = (addressData) => {
    setFormData((prev) => ({
      ...prev,
      address: addressData.address,
      postalCode: addressData.postcode,
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();

    const apiUrl = deliveryId ? `/api/deliveryInfo/${deliveryId}` : "/api/deliveryInfo";
    const httpMethod = deliveryId ? "put" : "post";

    axios[httpMethod](apiUrl, formData)
      .then(() => {
        alert(deliveryId ? "배송지가 수정되었습니다!" : "배송지가 추가되었습니다!");
        navigate("/delivery");
      })
      .catch((err) => {
        console.error("배송지 처리 중 오류 발생:", err);
        alert("배송지 처리 중 오류가 발생했습니다.");
      });
  };

  return (
    <Container style={{ maxWidth: "500px", marginTop: "20px" }}>
      <h3 className="mb-4">{deliveryId ? "배송지 수정" : "배송지 추가"}</h3>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>배송지 이름</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="배송지 이름 입력"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>주소</Form.Label>
          <AddDeliveryAddress onAddressSelected={handleAddressSelected} />
          <Form.Control
            type="text"
            name="address"
            value={formData.address}
            placeholder="주소"
            readOnly
          />
          <Form.Control
            type="text"
            name="postalCode"
            value={formData.postalCode}
            placeholder="우편번호"
            readOnly
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>연락처</Form.Label>
          <Form.Control
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="연락처 입력"
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          {deliveryId ? "수정하기" : "추가하기"}
        </Button>
        <Button variant="secondary" style={{ marginLeft: "10px" }} onClick={() => navigate("/delivery")}>
          취소하기
        </Button>
      </Form>
    </Container>
  );
};

export default AddOrEditDeliveryInfo;
