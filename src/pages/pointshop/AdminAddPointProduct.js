import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, InputNumber, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const AdminAddPointProduct = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]); // 이미지 파일 리스트

  const handleUploadChange = ({ fileList }) => {
    // 이미지 파일 1개만 허용
    if (fileList.length > 1) {
      message.error("이미지는 1개만 업로드 가능합니다.");
      return;
    }
    setFileList(fileList);
  };

  const handleSubmit = async (values) => {
    if (fileList.length === 0) {
      message.error("상품 이미지를 업로드해주세요.");
      return;
    }

    const bodyData = new FormData();
    bodyData.append("productName", values.productName);
    bodyData.append("price", values.price);
    bodyData.append("validityDate", values.validityDate);
    bodyData.append("brandCategory", values.brandCategory);
    bodyData.append("imageFiles", fileList[0].originFileObj); // 업로드한 파일 추가

    try {
      await axios.post("/api/pointshop/pointProducts/Admin", bodyData);
      message.success("포인트 상품이 성공적으로 추가되었습니다.");
      navigate("/point-product-management");
    } catch (error) {
      console.error("Error:", error);
      message.error("포인트 상품 추가에 실패했습니다.");
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "24px", color: "#FEBE98" }}>포인트 상품 추가</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Form.Item
          label='포인트 상품명'
          name="productName"
          rules={[{ required: true, message: "상품명을 입력해주세요." }]}
        >
          <Input placeholder="상품명을 입력해주세요" />
        </Form.Item>

        <Form.Item
          label='포인트 가격'
          name="price"
          rules={[{ required: true, message: "가격을 입력해주세요." }]}
        >
          <InputNumber placeholder="가격을 입력해주세요" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label='유효 기간 (일)'
          name="validityDate"
          rules={[{ required: true, message: "유효 기간을 입력해주세요." }]}
        >
          <InputNumber placeholder="유효 기간을 입력해주세요" style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label='브랜드 카테고리'
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
          label='상품 이미지'
          rules={[{ required: true, message: "상품 이미지를 업로드해주세요." }]}
        >
          <Upload
            listType="picture"
            maxCount={1}
            beforeUpload={() => false}
            onChange={handleUploadChange}
            fileList={fileList}
          >
            <Button icon={<UploadOutlined />} style={{ backgroundColor: "#FEBE98", borderColor: "#FEBE98", color: "#FFFFFF" }}>이미지 업로드</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block style={{ backgroundColor: "#FEBE98", borderColor: "#FEBE98", color: "#FFFFFF" }}>
            추가하기
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AdminAddPointProduct;
