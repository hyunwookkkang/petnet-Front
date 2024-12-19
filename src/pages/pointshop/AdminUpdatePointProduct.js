import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Input, InputNumber, Select, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { showSuccessToast, showErrorToast } from "../../components/common/alert/CommonToast";

const AdminUpdatePointProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]); // 이미지 파일 리스트
  const [imagePreview, setImagePreview] = useState(null); // 미리보기 이미지 URL
  const [originalData, setOriginalData] = useState(null); // 기존 상품 데이터
  const [loading, setLoading] = useState(true);

  // 기존 상품 데이터 가져오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/pointshop/pointProducts/${productId}`);
        const product = response.data;
        setOriginalData(product);
        setImagePreview(product.imageIds ? `/api/images/${product.imageIds}` : null);
        form.setFieldsValue({
          productName: product.productName,
          price: product.price,
          validityDate: product.validityDate,
          brandCategory: product.brandCategory,
        });
      } catch (error) {
        console.error("Error fetching product data:", error);
        showErrorToast("상품 정보를 가져오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, form]);

  // 업로드된 파일 리스트 처리
  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(originalData?.imageIds ? `/api/images/${originalData.imageIds}` : null);
    }
  };

  const handleSubmit = async (values) => {
    const bodyData = new FormData();
    bodyData.append("productName", values.productName);
    bodyData.append("price", values.price);
    bodyData.append("validityDate", values.validityDate);
    bodyData.append("brandCategory", values.brandCategory);

    if (fileList.length > 0) {
      bodyData.append("imageFiles", fileList[0].originFileObj);
    }

    try {
      await axios.put(`/api/pointshop/pointProducts/Admin/${productId}`, bodyData);
      showSuccessToast("상품이 성공적으로 수정되었습니다.");
      navigate("/point-product-management");
    } catch (error) {
      console.error("Error updating product:", error);
      showErrorToast("상품 수정에 실패했습니다.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!originalData) {
    return <div>상품 정보를 가져올 수 없습니다.</div>;
  }

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px", color: "#FEBE98" }}>포인트 상품 수정</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: "24px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form.Item
          label="포인트 상품명"
          name="productName"
          rules={[{ required: true, message: "상품명을 입력해주세요." }]}
        >
          <Input placeholder="상품명을 입력해주세요" />
        </Form.Item>

        <Form.Item
          label="포인트 가격"
          name="price"
          rules={[{ required: true, message: "가격을 입력해주세요." }]}
        >
          <InputNumber placeholder="가격을 입력해주세요" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="유효 기간 (일)"
          name="validityDate"
          rules={[{ required: true, message: "유효 기간을 선택해주세요." }]}
        >
          <Select placeholder="유효 기간을 선택해주세요">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((value) => (
              <Select.Option key={value} value={value}>
                {value} 일
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="브랜드 카테고리"
          name="brandCategory"
          rules={[{ required: true, message: "브랜드를 선택해주세요." }]}
        >
          <Select placeholder="브랜드를 선택해주세요">
            <Select.Option value="CU">CU</Select.Option>
            <Select.Option value="GS25">GS25</Select.Option>
            <Select.Option value="이마트24">이마트24</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="상품 이미지"
          rules={[{ required: true, message: "상품 이미지를 업로드해주세요." }]}
        >
          {imagePreview && (
            <img
              src={imagePreview}
              alt="이미지 미리보기"
              style={{ width: "100%", height: "auto", marginBottom: "10px", borderRadius: "8px" }}
            />
          )}
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            onChange={handleUploadChange}
            fileList={fileList}
          >
            <Button
              icon={<UploadOutlined style={{ fontWeight: "bold", fontSize: "18px" }} />}
              style={{ backgroundColor: "#FFFFFF", borderColor: "#FEBE98", color: "#FEBE98" }}
            >
              이미지 업로드
            </Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ backgroundColor: "#FEBE98", borderColor: "#FEBE98", color: "#FFFFFF" }}
          >
            수정하기
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminUpdatePointProduct;
