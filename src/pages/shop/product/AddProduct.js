import axios from "axios";
import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // useNavigate import 추가


const AddProduct = () => {
        const [formData, setFormData] = useState({
        productName: "",
        price: "0",
        productStock: "0", // 기본값
        discount: "0",
        productDetail: "",
        productCategory: "강아지",
        animalCategory: "사료"
    });

    const navigate = useNavigate(); // useNavigate 훅 사용

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 숫자 필드 변환
        const payload = { 
        ...formData, 
        lcLa: parseFloat(formData.lcLa), 
        lcLo: parseFloat(formData.lcLo),
        placeId: formData.placeId ? parseInt(formData.placeId,10) : null
        };

        axios.post("/api/shop/products", payload)
        .then(res => {
            alert("상품이 추가되었습니다!");
            // 필요하다면 상태 초기화나 화면전환 로직 추가
            setFormData({
                productName: "",
                price: "0",
                productStock: "0", // 기본값
                discount: "0",
                productDetail: "",
                productCategory: "사료",
                animalCategory: "강아지"
            });
        })
        .catch(err => {
            console.error(err);
            alert("상품 추가 중 오류가 발생했습니다.");
        });
    };

    const handleCancel = () => {
        navigate("/admin"); // /admin 경로로 이동
    };

    return (
        <Container style={{ maxWidth: "500px", marginTop: "20px" }}>
        <h3 className="mb-4">상점관리자 페이지 (상품추가)</h3>
        <p>입력해야할 자료: 상품명, 상품 가격, 재고 수량, 할인율, 상품 카테고리(사료, 간식, 장난감, 산책용품, 의류, 미용용품, 위생용품), 동물 카테고리(강아지, 고양이), 상품 상세정보</p>
        <Form onSubmit={handleSubmit}>
            {/* <Form.Group className="mb-3">
            <Form.Label>장소 ID (숫자)</Form.Label>
            <Form.Control type="number" name="placeId" value={formData.placeId} onChange={handleChange} placeholder="예: 1" />
            </Form.Group> */}

            <Form.Group className="mb-3">
            <Form.Label>상품명</Form.Label>
            <Form.Control type="text" name="productName" value={formData.productName} onChange={handleChange} placeholder="상품명 입력" required />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>상품 가격</Form.Label>
            <Form.Control type="number" name="price" value={formData.price} onChange={handleChange} placeholder="KRW" required />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>재고 수량</Form.Label>
            <Form.Control type="number" name="productStock" value={formData.productStock} onChange={handleChange} placeholder="재고 수량 입력" required />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>할인율</Form.Label>
            <Form.Control type="number" name="discount" value={formData.discount} onChange={handleChange} placeholder="%" required />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>상품 카테고리</Form.Label>
            <Form.Select name="productCategory" value={formData.productCategory} onChange={handleChange}>
                <option value="사료">사료</option>
                <option value="간식">간식</option>
                <option value="장난감">장난감</option>
                <option value="산책용품">산책용품</option>
                <option value="의류">의류</option>
                <option value="미용용품">미용용품</option>
                <option value="위생용품">위생용품</option>
            </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>동물 카테고리</Form.Label>
            <Form.Select name="animalCategory" value={formData.animalCategory} onChange={handleChange}>
                <option value="강아지">강아지</option>
                <option value="고양이">고양이</option>
            </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>상품 상세정보 (직접입력)</Form.Label>
            <Form.Control as="textarea" rows={3} name="productDetail" value={formData.productDetail} onChange={handleChange} placeholder="상품 상세정보 입력" />
            </Form.Group>

            <Button variant="primary" type="submit">
                추가하기
            </Button>
            <Button variant="secondary" style={{ marginLeft: "10px" }} onClick={() => {window.location.href="/admin"}}>
                취소하기
            </Button>
        </Form>
        </Container>
    );
};

export default AddProduct;
