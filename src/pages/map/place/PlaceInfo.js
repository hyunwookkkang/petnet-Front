import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Tabs, Tab, ButtonGroup, Button } from "react-bootstrap";
import LikeButton from "../../../components/common/button/LikeButton";
import AddFavoriteItemModal from "../favorite/AddFavoriteItemModal";
import axios from "axios";
import PlacePosts from "../placePost/PlacePosts";
import PlaceImage from "./PlaceImage";
import "../../../styles/Main.css";
const PlaceInfo = () => {
  const { placeId } = useParams(); // URL에서 placeId 추출
  const [place, setPlace] = useState(null); // 장소 정보 상태
  const [activeTab, setActiveTab] = useState("info"); // 탭 상태
  const [showModal, setShowModal] = useState(false); // 모달 상태

  useEffect(() => {
    // 장소 정보 가져오기
    fetch(`/api/map/places/${placeId}`)
      .then((response) => response.json())
      .then((data) => setPlace(data))
      .catch((error) => console.error("Error fetching place detail:", error));
  }, [placeId]);

  // 선택한 즐겨찾기에 항목(placeId) 추가
  const handleAddToFavorite = async (favoriteId) => {
    try {
      await axios.post(
        `/api/map/favorites/item/${placeId}`,
        null,
        {
          params: { favoriteId },
          withCredentials: true,
        }
      );
      alert("항목이 즐겨찾기에 추가되었습니다!");
      setShowModal(false); // 모달 닫기
    } catch (error) {
      console.error("Error adding item to favorite:", error);
      alert("항목 추가 중 오류가 발생했습니다.");
    }
  };

  if (!place) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Card className="place-button-box">
            <Card.Body style={{ padding: "3px" }}>
              <div className="like-button-container">
                {/* 좋아요 버튼 */}
                <LikeButton onClick={() => setShowModal(true)} />

                {/* 즐겨찾기 모달 */}
                <AddFavoriteItemModal
                  show={showModal}
                  onClose={() => setShowModal(false)}
                  placeId={placeId} // placeId 전달
                  onAddItem={handleAddToFavorite} // 항목 추가 함수 전달
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      
        <Button className="button-click">
          <div>
            내부입장 <br/>
            {place.inPlaceAcptPosblAt}
          </div>
        </Button>
        <Button className="button-click">
          <div>
            외부입장 <br/>
            {place.outPlaceAcptPosblAt}
          </div>
        </Button> 
        <Button className="button-click">
          <div>
            입장제한 <br/>
            {place.entrnPosblPetSizeValue}
          </div>
        </Button>
        <Button className="button-click">
          <div>
            주차 <br/>
            {place.parkngPosblAt}
          </div>
        </Button>
      
      

      {/* 탭 구성 */}
      <Tabs
        id="place-detail-tabs"
        activeKey={activeTab}
        onSelect={(tab) => setActiveTab(tab)}
        className="mb-4"
      >
        <Tab eventKey="info" title="장소 상세 정보">
          <div className="place-detail-tabs">
            <p>장소 정보: {place.ctgryThreeNm}</p>
            <p>
              <strong>운영시간:</strong>
              {place.operTime}
            </p>
            <p>
              <strong>전화번호:</strong> {place.telNo}
            </p>
            <p>
              <strong>반려동물 제한:</strong> {place.petLmttMtrCn || "없음"}
            </p>
            <p>
              <strong>주차 가능:</strong>{" "}
              {place.parkngPosblAt === "Y" ? "가능" : "불가능"}
            </p>
            <p>
              <strong>시설명: </strong>
              {place.fcltyNm}
            </p>
            <p>
              <strong>도로명주소: </strong>
              {place.rdnmadrNm}
            </p>
            <p>
              <strong>전화번호: </strong>
              {place.telNo}
            </p>
            <p>
              <strong>운영시간: </strong>
              {place.operTime}
            </p>
            <p>
              <strong>휴무일안내: </strong>
              {place.rstdeGuidCn}
            </p>
            <p>
              <strong>반려동물 제한 사항: </strong>
              {place.entrnPosblPetSizeValue}
            </p>
            <p>
              <strong>홈페이지: </strong>
              {place.hmpgUrl}
            </p>
          </div>
        </Tab>

        <Tab eventKey="posts" title="리뷰">
          <div>
            <h4>리뷰</h4>
            <PlacePosts placeId={placeId} />
          </div>
        </Tab>

        <Tab eventKey="more-info" title="추가정보">
          <div>
            <h4>추가정보</h4>
            <p>분류: {place.fcltyInfoDc}</p>
            <p>기타사항: {place.petLmttMtrCn}</p>
            <p>이용가격: {place.petAcptAditChrgeValue}</p>
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default PlaceInfo;
