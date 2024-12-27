import React from "react";
import { Button, Form } from "react-bootstrap";

const ProductForm = ({ formData = {}, onChange, onSubmit, isEditMode, onFileChange, imageFiles }) => (
    <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
            <Form.Label>상품명</Form.Label>
            <Form.Control
                type="text"
                name="productName"
                value={formData.productName || ""}
                onChange={onChange}
                placeholder="상품명 입력"
                required
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>상품 가격</Form.Label>
            <Form.Control
                type="number"
                name="price"
                value={formData.price || ""}
                onChange={onChange}
                placeholder="KRW"
                required
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>재고 수량</Form.Label>
            <Form.Control
                type="number"
                name="productStock"
                value={formData.productStock || ""}
                onChange={onChange}
                placeholder="재고 수량 입력"
                required
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>할인율</Form.Label>
            <Form.Control
                type="number"
                name="discount"
                value={formData.discount || ""}
                onChange={onChange}
                placeholder="%"
                required
            />
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>상품 카테고리</Form.Label>
            <Form.Select
                name="productCategory"
                value={formData.productCategory || "사료"}
                onChange={onChange}
            >
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
            <Form.Select
                name="animalCategory"
                value={formData.animalCategory || "강아지"}
                onChange={onChange}
            >
                <option value="강아지">강아지</option>
                <option value="고양이">고양이</option>
            </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
            <Form.Label>상품 상세정보</Form.Label>
            <Form.Control
                as="textarea"
                rows={3}
                name="productDetail"
                value={formData.productDetail || ""}
                onChange={onChange}
                placeholder="상품 상세정보 입력"
            />
        </Form.Group>

        {/* 이미지 파일 입력 추가 */}
        <Form.Group className="mb-3">
            <Form.Label>상품 이미지 (최대 3개)</Form.Label>
            <Form.Control
                type="file"
                name="imageFiles"
                multiple
                accept="image/*"
                onChange={onFileChange} // onChange 핸들러 추가
            />
            <div className="image-preview">
                {imageFiles.length > 0 && (
                    <ul>
                        {Array.from(imageFiles).map((file, index) => (
                            <li key={index}>{file.name}</li>
                        ))}
                    </ul>
                )}
            </div>
            {imageFiles.length >= 3 && (
                <div className="image-limit-text">이미지는 최대 3개까지 등록할 수 있습니다.</div>
            )}
        </Form.Group>

        <Button variant="primary" type="submit">
            {isEditMode ? "수정하기" : "추가하기"}
        </Button>
        <Button
            variant="secondary"
            style={{ marginLeft: "10px" }}
            onClick={() => (window.location.href = "/shop/products/manage")}
        >
            취소하기
        </Button>
    </Form>
);

export default ProductForm;
