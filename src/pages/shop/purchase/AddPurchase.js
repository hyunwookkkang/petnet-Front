import React, { useState, useEffect } from "react";
import { Card, Button, Col, Row, Table, Spinner, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { useUser } from "../../../components/contexts/UserContext";

const AddPurchase = () => {
  const { userId } = useUser();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [deliveryList, setDeliveryList] = useState([]);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [isFetchingDelivery, setIsFetchingDelivery] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [selectedCard, setSelectedCard] = useState("366");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    let script = document.querySelector('script[src="https://cdn.iamport.kr/v1/iamport.js"]');
    if (!script) {
      script = document.createElement("script");
      script.src = "https://cdn.iamport.kr/v1/iamport.js";
      script.async = true;
      document.body.appendChild(script);
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
    };

    fetchCartItems();
  }, [userId]);

  const fetchDeliveryList = async () => {
    setIsFetchingDelivery(true);
    try {
      const response = await axios.get("/api/deliveryInfo");
      setDeliveryList(response.data);
    } catch (error) {
      console.error("Error fetching delivery info:", error);
    } finally {
      setIsFetchingDelivery(false);
    }
  };

  const handleSelectDelivery = async () => {
    await fetchDeliveryList();
    setShowDeliveryModal(true);
  };

  const handleCloseDeliveryModal = () => {
    setShowDeliveryModal(false);
  };

  const handleDeliverySelect = (deliveryInfo) => {
    setDeliveryInfo(deliveryInfo);
    setShowDeliveryModal(false);
  };

  const totalProductPrice = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  // 각 상품의 할인 금액을 계산하여 총 할인 금액을 구함
  const totalDiscount = items.reduce(
    (total, item) => total + (item.product.price * item.quantity * (item.product.discount / 100)),
    0
  );

  // 총 결제 금액은 원래의 금액에서 할인 금액을 뺀 금액
  const totalPayment = totalProductPrice - totalDiscount;

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
    if (e.target.value === "simple") {
      setSelectedCard(null);
    }
  };

  const handleCardChange = (e) => {
    setSelectedCard(e.target.value);
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

    setIsProcessingPayment(true);

    try {
      const { IMP } = window;
      IMP.init("imp52051063");

      const productNames = items.map((item) => item.product.productName).join(", ");
      const totalQuantity = items.reduce(
        (total, item) => total + item.quantity,
        0
      );

      const paymentData = {
        pg: 'html5_inicis',
        channelKey: "channel-key-2ccba774-c929-46a9-9f15-26d25e8f8d29",
        pay_method: paymentMethod,
        merchant_uid: `ORD-${Date.now()}`,
        name: productNames,
        amount: totalPayment,
        company: "pet-net",
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

      IMP.request_pay(paymentData, async (rsp) => {
        if (rsp.success) {
          try {
            const response = await axios.post("/api/shop/purchases/verify", {
              imp_uid: rsp.imp_uid,
              merchant_uid: rsp.merchant_uid,
            });

            if (response.status === 200) {
              alert("결제가 성공적으로 처리되었습니다.");
              window.location.href = response.data.redirectUrl;
            } else {
              alert("결제 검증 실패: " + response.data);
            }
          } catch (error) {
            console.error("결제 검증 오류:", error);
            alert("결제 검증 중 오류가 발생했습니다.");
          }
        } else {
          console.error("결제 실패:", rsp.error_msg);
          alert(`결제 실패: ${rsp.error_msg}`);
        }
      });
    } catch (error) {
      console.error("결제 처리 중 오류:", error);
      alert("결제 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return <Spinner animation="border" role="status" />;
  }

  return (
    <div>
      <Row>
        <Col>
          <Table striped bordered hover >
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

      <Row>
        <Col>
          <Card className="mt-4" style={{ padding: "20px" }}>
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
                  style={{ backgroundColor: "#FEBE98", borderColor: "#FEBE98", marginTop: "10px", marginLeft: "10px", marginRight: "10px" }}
                  className="mt-2"
                  onClick={handleSelectDelivery}
                  disabled={isFetchingDelivery}
                >
                  {isFetchingDelivery ? "Loading..." : "배송지 선택"}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="mt-4" style={{ padding: "20px" }}>
            <Card.Body>
              <h5>결제 금액</h5>
              <Row>
                <Col xs={6}>상품 금액</Col>
                <Col xs={6} className="text-end">{totalProductPrice.toLocaleString()} 원</Col>
              </Row>
              <Row>
                <Col xs={6}>할인 금액</Col>
                <Col xs={6} className="text-end">{totalDiscount.toLocaleString()} 원</Col>
              </Row>
              <Row>
                <Col xs={6}><strong>총 결제 금액</strong></Col>
                <Col xs={6} className="text-end"><strong>{totalPayment.toLocaleString()} 원</strong></Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col>
          <Card style={{ padding: "20px" }}>
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
                {paymentMethod === "card" && (
                  <Form.Group controlId="formCard" style={{ marginLeft: "10px", marginRight: "10px" }}>
                    <Form.Label>카드 종류</Form.Label>
                    <Form.Control
                      as="select"
                      value={selectedCard}
                      onChange={handleCardChange}
                      style={{ marginLeft: "10px", marginRight: "10px" }}
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

      <Row className="mt-4">
        <Col>
          <Button
            style={{ backgroundColor: "#FF6347", borderColor: "#FF6347"}}
            size="lg"
            className="d-block w-100"
            onClick={handlePayment}
            disabled={isProcessingPayment}
          >
            {isProcessingPayment ? '결제 처리 중...' : '결제하기'}
          </Button>
        </Col>
      </Row>

      <Modal show={showDeliveryModal} onHide={handleCloseDeliveryModal}>
        <Modal.Header closeButton>
          <Modal.Title>배송지 선택</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
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
                      style={{ marginBottom: "10px", width: "100%" }}
                    >
                      {delivery.buyerName} ({delivery.deliveryAddress})
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeliveryModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddPurchase;
