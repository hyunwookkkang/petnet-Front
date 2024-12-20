import React, { useEffect, useState } from "react";
import { Card, Row, Button } from "antd";
import { DeleteOutlined, SwapOutlined, FileImageOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { showSuccessToast, showErrorToast } from "../../components/common/alert/CommonToast";
import CommonModal from "../../components/common/modal/CommonModal";

const PointShopAdminPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/pointshop/pointProducts/Admin");
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
      await axios.delete(`/api/pointshop/pointProducts/Admin/${selectedProduct.productId}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product.productId !== selectedProduct.productId));
      showSuccessToast("상품이 성공적으로 삭제되었습니다.");
    } catch (error) {
      console.error("Error deleting product:", error);
      showErrorToast("기프티콘 발급된 상품이라 삭제가 불가능합니다. 상태를 변경시키고 모든 기프티콘이 만료가 되면 삭제가 가능합니다. ");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleToggleStock = async (productId) => {
    try {
      await axios.patch(`/api/pointshop/pointProducts/Admin/${productId}`);
      showSuccessToast("상품 상태가 성공적으로 변경되었습니다.");
      fetchProducts();
    } catch (error) {
      console.error("Error toggling stock:", error);
      showErrorToast("상품 상태 변경에 실패했습니다.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", color: "#FEBE98" }}>포인트 상품 관리</h1>

      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <Button
          type="primary"
          style={{
            backgroundColor: "#FEBE98",
            borderColor: "#FEBE98",
          }}
          onClick={() => navigate("AdminAddPointProduct")}
        >
        포인트 상품 추가
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
                    onClick={() => navigate(`/get-point-product/${product.productId}`)}
                    style={{ cursor: "pointer", color: "#FEBE98", fontWeight: "bold" }}
                  >
                    {product.productName}
                  </span>
                  <span
                    style={{ color: product.productStock === 1 ? "#52c41a" : "#FF6347", fontWeight: "bold" }}
                  >
                    상태: {product.productStock === 1 ? "구매가능" : "구매불가"}
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
                  onClick={() => navigate(`/put-point-product/${product.productId}`)}
                />,
                <SwapOutlined
                  style={{ color: product.productStock === 1 ? "#52c41a" : "#FF6347", cursor: "pointer" }}
                  onClick={() => handleToggleStock(product.productId)}
                />,
              ]}
            >
              <p>상품 ID: {product.productId}</p>
              <p>등록일: {new Date(product.productAddDate).toLocaleDateString().replace(/\.$/, "")}</p>
              <p>유효 기간: {product.validityDate}일</p>
              <p>포인트 가격: {product.price}P</p>
              <p>브랜드: {product.brandCategory}</p>
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

export default PointShopAdminPage;
