import React, { useState, useEffect } from "react";
import { Card, Button, Col, Row, Table, Spinner, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { useUser } from "../../../components/contexts/UserContext";

const AddPurchase = () => {
  const { userId } = useUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryInfo, setDeliveryInfo] = useState(null); // 배송지 정보 상태
  const [deliveryList, setDeliveryList] = useState([]); // 배송지 목록 상태
  const [showDeliveryModal, setShowDeliveryModal] = useState(false); // 배송지 모달 상태
  const [isFetchingDelivery, setIsFetchingDelivery] = useState(false); // 배송지 정보 로딩 상태
  const [discount, setDiscount] = useState(0); // 할인 금액 상태
  const [paymentMethod, setPaymentMethod] = useState("card"); // 결제 수단 상태
  const [selectedCard, setSelectedCard] = useState("366"); // 카드 선택 상태
  const [isProcessingPayment, setIsProcessingPayment] = useState(false); // 결제 처리 상태

  // 데이터 가져오기
  useEffect(() => {
    let script = document.querySelector(
      `script[src="https://cdn.iamport.kr/v1/iamport.js"]`
    );

    // 만약 스크립트가 존재하지 않으면
    if (!script) {
      // 새로운 스크립트 요소를 생성
      script = document.createElement("script");
      script.src = "https://cdn.iamport.kr/v1/iamport.js";
      script.async = true;
      document.body.appendChild(script); // 스크립트를 문서의 body에 추가
    }

    const fetchCartItems = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`/api/shop/products/cart/${userId}`);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setLoading(false);
      }

      return () => {
        // 스크립트 요소가 존재하는지 확인 후 제거
        if (script && script.parentNode === document.body) {
          document.body.removeChild(script);
        }
      };
    };

    fetchCartItems();
  }, [userId]);

  // 배송지 목록을 가져오는 함수
  const fetchDeliveryList = async () => {
    setIsFetchingDelivery(true);
    try {
      const response = await axios.get(`/api/deliveryInfo`);
      setDeliveryList(response.data); // 배송지 목록 업데이트
    } catch (error) {
      console.error("Error fetching delivery info:", error);
    } finally {
      setIsFetchingDelivery(false);
    }
  };

  // 배송지 선택 모달 열기
  const handleSelectDelivery = async () => {
    await fetchDeliveryList(); // 배송지 목록 가져오기
    setShowDeliveryModal(true); // 모달 열기
  };

  // 배송지 모달 닫기
  const handleCloseDeliveryModal = () => {
    setShowDeliveryModal(false);
  };

  // 배송지 선택 처리
  const handleDeliverySelect = (delivery) => {
    setDeliveryInfo(delivery); // 선택된 배송지 정보를 상태에 저장
    setShowDeliveryModal(false); // 모달 닫기
  };

  // 상품 금액 계산
  const totalProductPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );
  const totalPayment = totalProductPrice - discount; // 총 결제 금액 = 상품 금액 - 할인 금액

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value); // 결제 수단 변경
    if (e.target.value === "simple") {
      setSelectedCard(null); // 간편 결제 선택 시 카드 드롭다운 비활성화
    }
  };

  const handleCardChange = (e) => {
    setSelectedCard(e.target.value); // 카드 종류 선택
  };
  
  const handlePayment = async () => {
    if (!deliveryInfo) {
      alert("배송지 정보를 선택해 주세요.");
      return;
    }
  
    if (!paymentMethod) {
      alert("결제 수단을 선택해 주세요.");
      return;
    }
  
    if (paymentMethod === "card" && !selectedCard) {
      alert("카드를 선택해 주세요.");
      return;
    }
  
    setIsProcessingPayment(true); // 결제 처리 시작
  
    try {
      const { IMP } = window;
      IMP.init("imp52051063");
  
      // 장바구니에서 결제 데이터를 동적으로 생성
      const productNames = items.map((item) => item.product.productName).join(", ");
      const totalQuantity = items.reduce(
        (total, item) => total + item.quantity,
        0
      );
  
      const paymentData = {
        pg: 'html5_inicis', 
        channelKey: "channel-key-2ccba774-c929-46a9-9f15-26d25e8f8d29",
        pay_method: paymentMethod, // 결제 수단
        merchant_uid: `ORD-${Date.now()}`, // 주문 번호
        name: productNames, // 상품명
        amount: totalPayment, // 결제 금액
        company: "pet-net", // 회사명
        buyer_name: deliveryInfo?.buyerName,
        buyer_tel: deliveryInfo?.deliveryPhoneNumber,
        buyer_addr: deliveryInfo?.deliveryAddress,
        buyer_postcode: deliveryInfo?.zipCode,
        card: paymentMethod === "card" ? {
          direct: {
            code: selectedCard,
            quota: 0
          }
        } : null
      };
  
      // 결제 요청
      IMP.request_pay(paymentData, async (rsp) => {
        if (rsp.success) {
          try {
            // 결제 성공 후 imp_uid를 서버로 전송하여 결제 검증
            const response = await axios.post("/api/shop/purchases/verify", {
              imp_uid: rsp.imp_uid,
              merchant_uid: rsp.merchant_uid,
            });
  
            if (response.status === 200) {
              alert("결제가 성공적으로 처리되었습니다.");
              window.location.href = response.data.redirectUrl; // 결제 페이지로 리다이렉션
            } else {
              alert("결제 검증 실패: " + response.data);
            }
          } catch (error) {
            console.error("결제 검증 오류:", error);
            alert("결제 검증 중 오류가 발생했습니다.");
          }
        } else {
          // 결제 실패 시
          console.error("결제 실패:", rsp.error_msg);
          alert(`결제 실패: ${rsp.error_msg}`);
        }
      });
    } catch (error) {
      console.error("결제 처리 중 오류:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessingPayment(false); // 처리 끝
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  return (
    <div>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>구매 상품</th>
                <th>카테고리</th>
                <th>구매 가격</th>
                <th>구매 수량</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.itemId}>
                  <td>
                    <Row>
                      <Col xs={3}>
                        <Card.Img
                          variant="top"
                          src={item.product.image || "https://via.placeholder.com/64"}
                          style={{ width: "64px", height: "64px", objectFit: "cover" }}
                        />
                      </Col>
                      <Col>
                        <strong>{item.product.productName}</strong>
                      </Col>
                    </Row>
                  </td>
                  <td>{`${item.product.animalCategory} / ${item.product.productCategory}`}</td>
                  <td>{(item.product.price * item.quantity).toLocaleString()} 원</td>
                  <td>{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* 배송지 입력 영역 */}
      <Row>
        <Col>
          <Card className="mt-4">
            <Card.Body>
              <h5>배송지 정보</h5>
              <Form>
                <Form.Group controlId="formDeliveryName">
                  <Form.Label>주문자 이름</Form.Label>
                  <Form.Control
                    type="text"
                    value={deliveryInfo?.buyerName || ''}
                    disabled
                  />
                </Form.Group>
                <Form.Group controlId="formDeliveryAddress">
                  <Form.Label>배송지 주소</Form.Label>
                  <Form.Control
                    type="text"
                    value={deliveryInfo?.deliveryAddress || ''}
                    disabled
                  />
                </Form.Group>
                <Form.Group controlId="formDeliveryPhone">
                  <Form.Label>연락처</Form.Label>
                  <Form.Control
                    type="text"
                    value={deliveryInfo?.deliveryPhoneNumber || ''}
                    disabled
                  />
                </Form.Group>
                <Button
                  variant="outline-primary"
                  className="mt-2"
                  onClick={handleSelectDelivery}
                  disabled={isFetchingDelivery} // 배송지 로딩 중 버튼 비활성화
                >
                  {isFetchingDelivery ? "Loading..." : "배송지 선택"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 결제 금액 계산 영역 */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <h5>결제 금액</h5>
              <Row>
                <Col xs={6}>상품 금액</Col>
                <Col xs={6} className="text-end">{totalProductPrice.toLocaleString()} 원</Col>
              </Row>
              <Row>
                <Col xs={6}>할인 금액</Col>
                <Col xs={6} className="text-end">{discount.toLocaleString()} 원</Col>
              </Row>
              <Row>
                <Col xs={6}><strong>총 결제 금액</strong></Col>
                <Col xs={6} className="text-end"><strong>{totalPayment.toLocaleString()} 원</strong></Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 결제 수단 선택 */}
      <Row className="mt-4">
        <Col>
          <Card>
            <Card.Body>
              <h5>결제 수단</h5>
              <Form>
                <Form.Check
                  type="radio"
                  label="카드 결제"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={handlePaymentMethodChange}
                />
                <Form.Check
                  type="radio"
                  label="간편 결제"
                  name="paymentMethod"
                  value="kakaopay"
                  checked={paymentMethod === "kakaopay"}
                  onChange={handlePaymentMethodChange}
                />

                {/* 카드 결제를 선택한 경우에만 카드 선택 드롭다운 활성화 */}
                {paymentMethod === "card" && (
                  <Form.Group controlId="formCard">
                    <Form.Label>카드 종류</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedCard}
                      onChange={handleCardChange}
                    >
                      <option value="366">신한카드</option>
                      <option value="361">BC카드</option>
                    </Form.Control>
                  </Form.Group>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 결제하기 버튼 */}
      <Row className="mt-4">
        <Col>
          <Button variant="success" size="lg" onClick={handlePayment} disabled={isProcessingPayment}>
            {isProcessingPayment ? '결제 처리 중...' : '결제하기'}
          </Button>
        </Col>
      </Row>

      {/* 배송지 정보 모달 */}
      <Modal show={showDeliveryModal} onHide={handleCloseDeliveryModal}>
        <Modal.Header closeButton>
          <Modal.Title>배송지 선택</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isFetchingDelivery ? (
            <Spinner animation="border" role="status" />
          ) : (
            <div>
              <ul>
                {deliveryList.map((delivery) => (
                  <li key={delivery.deliveryInfoId}>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleDeliverySelect(delivery)}
                      style={{ textAlign: "left", display: "block" }}
                    >
                      {delivery.buyerName} <br />
                      {delivery.deliveryAddress} <br />
                      {delivery.deliveryPhoneNumber}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AddPurchase;
