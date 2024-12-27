import React, { useEffect, useState } from "react";
import { Card, Row, Button } from "antd";
import { DeleteOutlined, SwapOutlined, FileImageOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../../../components/common/alert/CommonToast";
import CommonModal from "../../../components/common/modal/CommonModal";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const apiEndpoint = () => `/api/shop/products`;

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${apiEndpoint()}?currentPage=0&pageSize=100`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      await axios.delete(`/api/shop/products/${selectedProduct.productId}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product.productId !== selectedProduct.productId));
      showSuccessToast("상품이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting product:", error);
      showErrorToast("삭제가 불가능합니다");
    } finally {
      setShowDeleteModal(false);
    }
  };


  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#FEBE98" }}>상품 관리</h1>

      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <Button
          type="primary"
          style={{
            backgroundColor: "#FEBE98",
            borderColor: "#FEBE98",
          }}
          onClick={() => navigate("/shop/products/form")}
        >
        상품 추가
        </Button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", width: "100%" }}>로딩 중...</p>
      ) : (
        <Row gutter={[0, 16]} style={{ flexDirection: "column" }}>
          {products.map((product) => (
            <Card
              key={product.productId}
              hoverable
              style={{
                border: "1px solid #bfbfbf", // 카드 테두리
              }}
              title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    onClick={() => navigate(`/shop/products/form/${product.productId}`)}
                    style={{ cursor: "pointer", color: "#FEBE98", fontWeight: "bold" }}
                  >
                    {product.productName}
                  </span>
                </div>
              }
              actions={[
                <DeleteOutlined
                  style={{ color: "#FF6347", cursor: "pointer" }}
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowDeleteModal(true);
                  }}
                />,
                <EditOutlined
                  style={{ color: "#FF8000", cursor: "pointer" }}
                  onClick={() => navigate(`/shop/products/form/${product.productId}`)}
                />
              ]}
            >
              <p>상품 ID: {product.productId}</p>
              <p>상품명: {product.productName}</p>
              <p>등록일: {new Date(product.productAddDate).toLocaleDateString().replace(/\.$/, "")}</p>
              <p>가격: {product.price}P</p>
              <p>할인율: {product.discount}</p>
              <p>재고 수량: {product.productStock}</p>
            </Card>
          ))}
        </Row>
      )}

      <CommonModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        title="삭제 확인"
        body={<div>{selectedProduct?.productName}을(를) 삭제하시겠습니까?</div>}
        footer={
          <Button
            style={{
              backgroundColor: "#FF6347",
              color: "#FFFFFF",
              border: "none",
            }}
            onClick={handleDelete}
          >
            확인
          </Button>
        }
      />
    </div>
  );
};

export default ManageProducts;
