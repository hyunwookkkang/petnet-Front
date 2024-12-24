import React, { useEffect, useState } from "react";
import { Card, Button, Spinner, Row, Col, Table, Modal, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const PurchaseInfo = () => {
  const navigate = useNavigate();
  const { purchaseId } = useParams(); // URL에서 purchaseId 가져오기
  const [purchase, setPurchase] = useState(null); // 구매 정보 저장
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [isEditingDelivery, setIsEditingDelivery] = useState(false); // 배송지 수정 모드 관리
  const [editedPurchase, setEditedPurchase] = useState({}); // 수정된 정보 저장
  const [showDeliveryModal, setShowDeliveryModal] = useState(false); // 배송지 선택 모달 상태
  const [deliveryList, setDeliveryList] = useState([]); // 배송지 목록
  const [isFetchingDelivery, setIsFetchingDelivery] = useState(false); // 배송지 로딩 상태
  const [showCancelModal, setShowCancelModal] = useState(false); // 결제 취소 모달 상태
  const [paymentId, setPaymentId] = useState(null); // 결제 ID 상태
  const [paymentAmount, setPaymentAmount] = useState(0); // 결제 금액 상태
  const [cancelReason, setCancelReason] = useState(''); // 취소 사유 상태

  // API 호출: 구매 정보 가져오기
  const fetchPurchaseDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/shop/purchases/${purchaseId}`);
      setPurchase(response.data);
      setEditedPurchase({
        ...response.data,
        zipCode: response.data.zipCode || '', // zipCode는 hidden 처리
      });
          // 결제 관련 정보 설정
      setPaymentId(response.data.paymentId);
      setPaymentAmount(response.data.paymentAmount);
    } catch (error) {
      console.error("Error fetching purchase details:", error);
    } finally {
      setLoading(false);
    }
  };

  // 배송지 목록 가져오기
  const fetchDeliveryList = async () => {
    setIsFetchingDelivery(true);
    try {
      const response = await axios.get('/api/deliveryInfo');
      setDeliveryList(response.data);
    } catch (error) {
      console.error("Error fetching delivery list:", error);
    } finally {
      setIsFetchingDelivery(false);
    }
  };

  useEffect(() => {
    fetchPurchaseDetails(); // 컴포넌트가 로드될 때 데이터 가져오기
  }, [purchaseId]);

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3" style={{ fontSize: "1.5rem", color: "#888" }}>
          결제 정보를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  // 구매 정보가 없을 때
  if (!purchase) {
    return (
      <div className="text-center py-5">
        <p style={{ fontSize: "1.5rem", color: "#888" }}>
          구매 정보를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  // 배송지 수정 버튼 클릭 시 폼 모드로 전환
  const handleEditDelivery = () => {
    setIsEditingDelivery(true);
  };

  const handleCancelEditDelivery = () => {
    setIsEditingDelivery(false);
  };

  // 배송지 선택 버튼 클릭 시 모달 열기
  const handleDeliverySelectClick = () => {
    fetchDeliveryList();
    setShowDeliveryModal(true);
  };

  // 배송지 선택
  const handleDeliverySelect = (delivery) => {
    setEditedPurchase({
      ...editedPurchase,
      buyerName:delivery.buyerName,
      deliveryAddress: delivery.deliveryAddress,
      deliveryPhoneNumber: delivery.deliveryPhoneNumber,
      zipCode: delivery.zipCode, // 선택된 배송지의 zipCode
    });
    setShowDeliveryModal(false);
  };

  // 배송지 모달 닫기
  const handleCloseDeliveryModal = () => {
    setShowDeliveryModal(false);
  };

// 수정된 배송지 저장
const handleSaveDeliveryChanges = async () => {
    try {
      const updatedPurchase = { 
        ...editedPurchase,  // 기존 수정된 정보들
        purchaseId,  // 구매 ID 추가
      };
  
      // API 호출하여 수정된 구매 정보 저장
      const response = await axios.put(`/api/shop/purchases`, updatedPurchase); 
      
      // 배송지 정보만 업데이트된 응답 처리
      setPurchase((prevPurchase) => ({
        ...prevPurchase,  // 기존 구매 정보 유지
        deliveryAddress: updatedPurchase.deliveryAddress,
        buyerName: updatedPurchase.buyerName,
        deliveryPhoneNumber: updatedPurchase.deliveryPhoneNumber,
        zipCode: updatedPurchase.zipCode, // 선택된 배송지 정보로 업데이트
      }));
      
      setIsEditingDelivery(false); // 배송지 수정 모드 종료
    } catch (error) {
      console.error("Error saving delivery changes:", error);
    }
  };
  

  const getPurchaseStatus = (status) => {
    switch (Number(status)) {
      case 0:
        return "상품 준비중";
      case 1:
        return "배송중";
      case 2:
        return "배송완료";
      case 3:
        return "배송확인";
      case 4:
        return "환불진행중";
      case 5:
        return "환불 완료";
      default:
        return "알 수 없음";
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 결제 취소 모달 열기
  const handleShowCancelModal = () => {
    setShowCancelModal(true);
  };

  // 결제 취소 모달 닫기
  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancelReason("");
  };

  // 결제 취소 처리
  const handleCancelPurchase = async () => {
    try {
      await axios.post(`/api/shop/purchases/cancel`, {
        purchaseId : purchase.purchaseId,
        paymentId: paymentId,
        comment: cancelReason,
        paymentAmount: paymentAmount
      });
      alert("결제가 성공적으로 취소되었습니다.");
      // 결제 취소 후 /shop/purchase/my로 리디렉션
      navigate('/shop/purchase/my'); 
    } catch (error) {
      console.error("Error canceling purchase:", error);
      alert("결제 취소 중 오류가 발생했습니다.");
    } finally {
      handleCloseCancelModal();
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#FFF5EF", border: "2px solid #FF7826" }}>
      <h1 style={{ color: "#FF7826", marginBottom: "20px" }}>구매 상세 정보</h1>

      <Card className="mb-4">
        <Card.Body>
          <h5>기본 정보</h5>
          <p hidden>{purchase.paymentId}</p>
          <Table bordered>
            <tbody>
              <tr>
                <td><strong>주문번호</strong></td>
                <td>{purchase.purchaseId}</td>
              </tr>
              <tr>
                <td><strong>결제 수단</strong></td>
                <td>{purchase.paymentOption}</td>
              </tr>
              <tr>
                <td><strong>예상 배송 일자</strong></td>
                <td>{new Date(purchase.deliveryDate).toISOString().split('T')[0]}</td>
              </tr>
              <tr>
                <td><strong>배송상태</strong></td>
                <td>{getPurchaseStatus(purchase.purchaseStatus)}</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* 배송지 정보 */}
      <Card className="mb-4">
        <Card.Body>
          <h5>배송지 정보</h5>
          {isEditingDelivery ? (
            <Form>
              <Form.Group controlId="deliveryAddress">
                <Form.Label>배송지</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    value={editedPurchase.deliveryAddress || ''}
                    onChange={(e) => setEditedPurchase({ ...editedPurchase, deliveryAddress: e.target.value })}
                  />
                  <Button
                    variant="outline-primary"
                    onClick={handleDeliverySelectClick}
                    style={{ marginLeft: "10px" }}
                  >
                    배송지 선택
                  </Button>
                </div>
              </Form.Group>
              <Form.Group controlId="buyerName">
                <Form.Label>구매자 이름</Form.Label>
                <Form.Control
                  type="text"
                  value={editedPurchase.buyerName || ''}
                  onChange={(e) => setEditedPurchase({ ...editedPurchase, buyerName: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="deliveryPhoneNumber">
                <Form.Label>연락처</Form.Label>
                <Form.Control
                  type="text"
                  value={editedPurchase.deliveryPhoneNumber || ''}
                  onChange={(e) => setEditedPurchase({ ...editedPurchase, deliveryPhoneNumber: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="zipCode" hidden>
                <Form.Label>우편번호</Form.Label>
                <Form.Control
                  type="text"
                  value={editedPurchase.zipCode || ''}
                  onChange={(e) => setEditedPurchase({ ...editedPurchase, zipCode: e.target.value })}
                  readOnly
                />
              </Form.Group>
            </Form>
          ) : (
            <Table bordered>
              <tbody>
                <tr>
                  <td><strong>배송지</strong></td>
                  <td>{purchase.deliveryAddress}</td>
                </tr>
                <tr>
                  <td><strong>구매자 이름</strong></td>
                  <td>{purchase.buyerName}</td>
                </tr>
                <tr>
                  <td><strong>연락처</strong></td>
                  <td>{purchase.deliveryPhoneNumber}</td>
                </tr>
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Body>
          <h5>구매 상품</h5>
          <Table bordered>
            <thead>
              <tr>
                <th>상품명</th>
                <th>주문일자</th>
                <th>수량</th>
                <th>가격</th>
              </tr>
            </thead>
            <tbody>
              <tr key={purchase.productId}>
                <td>{purchase.productName}</td>
                <td>{formatDate(purchase.paidDate)}</td>
                <td>{purchase.orderQuantity}</td>
                <td>{purchase.paymentAmount.toLocaleString()} 원</td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Row>
        <Col className="text-end">
          {!isEditingDelivery && (
            <Button variant="primary" style={{backgroundColor: "#FF6347", border: "none"}} 
            onClick={handleEditDelivery} className="me-2">
              배송지 수정하기
            </Button>
          )}
          {isEditingDelivery && (
            <Button variant="success " style={{backgroundColor: "#4CAF50", border: "none"}} 
            onClick={handleSaveDeliveryChanges} className="me-2">
              변경 내용 저장
            </Button>
        )}
        {isEditingDelivery && (
          <Button variant="danger" style={{ backgroundColor: "#FF6347", border: "none" }}
            onClick={handleCancelEditDelivery}>
            취소
          </Button>
        )}
        {purchase.purchaseStatus < 4 && (
          <Button 
            variant="danger" 
            style={{ backgroundColor: "#FF4500", border: "none" }}
            onClick={handleShowCancelModal}
          >
            결제 취소
          </Button>
        )}

      </Col>
    </Row>

    {/* 배송지 선택 모달 */}
    <Modal show={showDeliveryModal} onHide={handleCloseDeliveryModal}>
      <Modal.Header closeButton>
        <Modal.Title>배송지 선택</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isFetchingDelivery ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">배송지를 불러오는 중입니다...</p>
          </div>
        ) : (
          <Table bordered>
            <thead>
              <tr>
                <th>구매자 이름</th>
                <th>주소</th>
                <th>전화번호</th>
                <th>선택</th>
              </tr>
            </thead>
            <tbody>
              {deliveryList.map((delivery, index) => (
                <tr key={index}>
                  <td>{delivery.buyerName}</td>
                  <td>{delivery.deliveryAddress}</td>
                  <td>{delivery.deliveryPhoneNumber}</td>
                  <td>
                    <Button variant="outline-primary" onClick={() => handleDeliverySelect(delivery)}>
                      선택
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseDeliveryModal}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>

    {/* 결제 취소 모달 */}
    <Modal show={showCancelModal} onHide={handleCloseCancelModal}>
      <Modal.Header closeButton>
        <Modal.Title>결제 취소</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="cancelReason">
            <Form.Label>취소 사유</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="취소 사유를 입력하세요."
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseCancelModal}>
          닫기
        </Button>
        <Button variant="danger" style={{ backgroundColor: "#FF4500", border: "none" }}
          onClick={handleCancelPurchase}>
          결제 취소
        </Button>
      </Modal.Footer>
    </Modal>
  </div>
);
};

export default PurchaseInfo;

