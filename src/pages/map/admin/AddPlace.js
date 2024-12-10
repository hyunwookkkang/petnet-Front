import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom"; // useNavigate import 추가


const AddPlace = () => {
        const [formData, setFormData] = useState({
        placeId: "",
        fcltyNm: "",
        ctgryThreeNm: "식당", // 기본값
        ctyprvnSignguNm: "",
        lcLa: "",
        lcLo: "",
        rdnmadrNm: "",
        hmpgUrl: "",
        telNo: "",
        rstdeGuidCn: "",
        operTime: "",
        parkngPosblAt: "Y", // 기본값
        entrnPosblPetSizeValue: "소형",
        petLmttMtrCn: "",
        petAcptAditChrgeValue: "",
        inPlaceAcptPosblAt: "N",
        outPlaceAcptPosblAt: "Y",
        fcltyInfoDc: ""
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

        axios.post("/api/places", payload)
        .then(res => {
            alert("장소가 추가되었습니다!");
            // 필요하다면 상태 초기화나 화면전환 로직 추가
            setFormData({
            placeId: "",
            fcltyNm: "",
            ctgryThreeNm: "식당",
            ctyprvnSignguNm: "",
            lcLa: "",
            lcLo: "",
            rdnmadrNm: "",
            hmpgUrl: "",
            telNo: "",
            rstdeGuidCn: "",
            operTime: "",
            parkngPosblAt: "Y",
            entrnPosblPetSizeValue: "소형",
            petLmttMtrCn: "",
            petAcptAditChrgeValue: "",
            inPlaceAcptPosblAt: "N",
            outPlaceAcptPosblAt: "Y",
            fcltyInfoDc: ""
            });
        })
        .catch(err => {
            console.error(err);
            alert("장소 추가 중 오류가 발생했습니다.");
        });
    };

    const handleCancel = () => {
        navigate("/admin"); // /admin 경로로 이동
    };

    return (
        <Container style={{ maxWidth: "500px", marginTop: "20px" }}>
        <h3 className="mb-4">지도관리자 페이지 (장소추가)</h3>
        <p>입력해야할 자료: 장소명, 카테고리(식당/카페/여행지), 주소, 좌표(위도,경도), 홈페이지URL, 휴무일 안내, 운영시간, 반려동물 입장가능 크기(소형/중형/...), 기타 동반여부(실내/실외)</p>
        <Form onSubmit={handleSubmit}>
            {/* <Form.Group className="mb-3">
            <Form.Label>장소 ID (숫자)</Form.Label>
            <Form.Control type="number" name="placeId" value={formData.placeId} onChange={handleChange} placeholder="예: 1" />
            </Form.Group> */}

            <Form.Group className="mb-3">
            <Form.Label>장소명</Form.Label>
            <Form.Control type="text" name="fcltyNm" value={formData.fcltyNm} onChange={handleChange} placeholder="장소명 입력" required />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>카테고리</Form.Label>
            <Form.Select name="ctgryThreeNm" value={formData.ctgryThreeNm} onChange={handleChange}>
                <option value="식당">식당</option>
                <option value="카페">카페</option>
                <option value="여행지">여행지</option>
            </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>주소(시/도/구)</Form.Label>
            <Form.Control type="text" name="ctyprvnSignguNm" value={formData.ctyprvnSignguNm} onChange={handleChange} placeholder="서울특별시 강남구" />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>위도 (예: 37.5665)</Form.Label>
            <Form.Control type="text" name="lcLa" value={formData.lcLa} onChange={handleChange} placeholder="위도 입력" />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>경도 (예: 126.9780)</Form.Label>
            <Form.Control type="text" name="lcLo" value={formData.lcLo} onChange={handleChange} placeholder="경도 입력" />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>도로명 주소</Form.Label>
            <Form.Control type="text" name="rdnmadrNm" value={formData.rdnmadrNm} onChange={handleChange} placeholder="도로명 주소" />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>홈페이지 URL</Form.Label>
            <Form.Control type="text" name="hmpgUrl" value={formData.hmpgUrl} onChange={handleChange} placeholder="직접입력" />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>전화번호(예:010-0000-0000)</Form.Label>
            <Form.Control type="text" name="telNo" value={formData.telNo} onChange={handleChange} placeholder="예:010-0000-0000" />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>휴무일안내</Form.Label>
            <Form.Control type="text" name="rstdeGuidCn" value={formData.rstdeGuidCn} onChange={handleChange} placeholder="직접입력" />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>운영시간(예:10:00~20:00)</Form.Label>
            <Form.Control type="text" name="operTime" value={formData.operTime} onChange={handleChange} placeholder="운영시간 입력" />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>주차가능여부(Y/N)</Form.Label>
            <Form.Select name="parkngPosblAt" value={formData.parkngPosblAt} onChange={handleChange}>
                <option value="Y">Y</option>
                <option value="N">N</option>
            </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>반려동물 입장가능 크기</Form.Label>
            <Form.Control type="text" name="entrnPosblPetSizeValue" value={formData.entrnPosblPetSizeValue} onChange={handleChange} placeholder="소형/중형/대형" />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>기타 동반여부(실내/실외)</Form.Label>
            <Form.Control type="text" name="petLmttMtrCn" value={formData.petLmttMtrCn} onChange={handleChange} placeholder="실내/실외" />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>반려동물 반차 추가요금</Form.Label>
            <Form.Control type="text" name="petAcptAditChrgeValue" value={formData.petAcptAditChrgeValue} onChange={handleChange} placeholder="추가요금 정보 입력" />
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>실내입장가능여부(N/Y)</Form.Label>
            <Form.Select name="inPlaceAcptPosblAt" value={formData.inPlaceAcptPosblAt} onChange={handleChange}>
                <option value="N">N</option>
                <option value="Y">Y</option>
            </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>야외입장가능여부(Y/N)</Form.Label>
            <Form.Select name="outPlaceAcptPosblAt" value={formData.outPlaceAcptPosblAt} onChange={handleChange}>
                <option value="Y">Y</option>
                <option value="N">N</option>
            </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
            <Form.Label>상세정보 (직접입력)</Form.Label>
            <Form.Control as="textarea" rows={3} name="fcltyInfoDc" value={formData.fcltyInfoDc} onChange={handleChange} placeholder="상세정보 입력" />
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

export default AddPlace;
