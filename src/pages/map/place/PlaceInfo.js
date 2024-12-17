import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Card, Tabs, Tab, Button } from "react-bootstrap";
import LikeButton from "../../../components/common/button/LikeButton";
import AddFavoriteItemModal from "../favorite/AddFavoriteItemModal";
import axios from "axios";
import PlacePosts from "../placePost/PlacePosts";
import "../../../styles/Main.css";
import { showErrorToast, showSuccessToast } from "../../../components/common/alert/CommonToast";
import PlaceImage from './PlaceImage';
import { Heart, HeartFill } from "react-bootstrap-icons";

const PlaceInfo = () => {
  const { placeId } = useParams();
  const [place, setPlace] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [showModal, setShowModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);

  // **1. 장소 정보 및 좋아요 상태 초기화**
 // **1. 좋아요 상태 및 장소 정보 초기화**
  useEffect(() => {
  const fetchData = async () => {
    try {
      // 장소 정보 가져오기
      const placeResponse = await axios.get(`/api/map/places/${placeId}`);
      setPlace(placeResponse.data);

      // 좋아요 상태 가져오기
      const favoriteResponse = await axios.get(`/api/map/favorites/getFavoriteId`, {
        params: { placeId },
        withCredentials: true,
        headers: { "Cache-Control": "no-cache" }, // 캐시 무효화
      });

      const fetchedFavoriteId = favoriteResponse.data;

      if (fetchedFavoriteId) {
        setFavoriteId(fetchedFavoriteId); // favoriteId 상태 설정
        setIsLiked(true); // 좋아요 상태 유지
      } else {
        setFavoriteId(null); // 초기화
        setIsLiked(false); // 좋아요 상태 false
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showErrorToast("데이터를 불러오는 중 오류가 발생했습니다.");
    }
  };

  fetchData();
}, [placeId]);

// **2. 즐겨찾기 추가 함수**
const handleAddToFavorite = async (selectedFavoriteId) => {
  try {
    await axios.post(`/api/map/favorites/item/${placeId}`, null, {
      params: { favoriteId: selectedFavoriteId },
      withCredentials: true,
    });

    showSuccessToast("항목이 즐겨찾기에 추가되었습니다!");

    // 최신 상태를 유지하기 위해 서버에서 다시 조회
    const favoriteResponse = await axios.get(`/api/map/favorites/getFavoriteId`, {
      params: { placeId },
      withCredentials: true,
    });

    const updatedFavoriteId = favoriteResponse.data;
    setFavoriteId(updatedFavoriteId); // 최신 favoriteId 설정
    setIsLiked(true); // 좋아요 상태 true
    setShowModal(false); // 모달 닫기
  } catch (error) {
    console.error("Error adding favorite:", error);
    showErrorToast("항목 추가 중 오류가 발생했습니다.");
  }
};

// **3. 즐겨찾기 삭제 함수**
const handleRemoveFromFavorite = async () => {
  if (!favoriteId) {
    showErrorToast("즐겨찾기에 추가된 항목이 없습니다.");
    return;
  }

  try {
    await axios.delete(`/api/map/favorites/item/${placeId}`, {
      params: { favoriteId }, // 명확한 파라미터 전달
      withCredentials: true,
    });

    showSuccessToast("항목이 즐겨찾기에서 제거되었습니다!");
    setFavoriteId(null); // favoriteId 초기화
    setIsLiked(false); // 좋아요 상태 false
  } catch (error) {
    console.error("Error removing favorite:", error);
    showErrorToast("항목 제거 중 오류가 발생했습니다.");
  }
};

if (!place) return <div>Loading...</div>;

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
            <Button
                variant="link"
                className="text-danger fs-3 p-0 float-end me-3"
                onClick={() => {
                  if (isLiked) {
                    handleRemoveFromFavorite();
                  } else {
                    setShowModal(true);
                  }
                }}
              >
                {isLiked ? <HeartFill /> : <Heart />}
              </Button>
              <AddFavoriteItemModal
                show={showModal}
                onClose={() => setShowModal(false)}
                placeId={placeId}
                onAddItem={handleAddToFavorite}
                onItemAdded={(newFavoriteId) => {
                  console.log("Item added with favoriteId:", newFavoriteId);
                  setFavoriteId(newFavoriteId); // 상태 업데이트
                  setIsLiked(true); // 좋아요 상태 true
                }}
              />
              <PlaceImage place={place} />
              
            </Card.Body>
            <div
              style={{
                fontSize: '50px',
                marginLeft: '20px'
              }}
            >
              {place.fcltyNm}
            </div>
            <div>
              
            </div>
          </Card>
        </Col>
      </Row>

      <div className="button-group"> 
      <Button className="button-click">
        <div>
          내부입장 <br />
          {place.inPlaceAcptPosblAt}
        </div>
      </Button>
      <Button className="button-click">
        <div>
          외부입장 <br />
          {place.outPlaceAcptPosblAt}
        </div>
      </Button>
      <Button className="button-click">
        <div>
          입장제한 <br />
          {place.entrnPosblPetSizeValue}
        </div>
      </Button>
      <Button className="button-click">
        <div>
          주차 <br />
          {place.parkngPosblAt}
        </div>
      </Button>
      </div>

      {/* 탭 구성 */}
      <Tabs
        id="place-detail-tabs"
        activeKey={activeTab}
        onSelect={(tab) => setActiveTab(tab)}
        className="mb-4"
      >
        <Tab
          eventKey="info"
          title={
            <span className={`custom-tab-title ${activeTab === "info" ? "active" : ""}`}>
              장소 상세 정보
            </span>
          }
        >
          <div className="place-detail-tabs">
            <h4>시설명: {place.fcltyNm}</h4>
            <p>
              <strong>🏪 장소 정보: </strong>
              {place.ctgryThreeNm}
            </p>
            <p>
              <strong>🕒 운영시간:</strong>
              {place.operTime}
            </p>
            <p>
              <strong>📞 전화번호:</strong> {place.telNo}
            </p>
            
            <p>
              <strong>🅿️ 주차 가능:</strong>{" "}
              {place.parkngPosblAt === "Y" ? "가능" : "불가능"}
            </p>
            <p>
              <strong>🗺️ 도로명주소: </strong>
              {place.rdnmadrNm}
            </p>
            <p>
              <strong>📆 휴무일안내: </strong>
              {place.rstdeGuidCn}
            </p>
            <p>
              <strong>🐶 반려동물 제한:</strong> {place.petLmttMtrCn || "없음"}
            </p>
            <p>
              <strong>🐈 반려동물 제한 몸무게: </strong>
              {place.entrnPosblPetSizeValue}
            </p>
            <p>
              <strong>🖥️ 홈페이지: </strong>
              {place.hmpgUrl}
            </p>
          </div>
        </Tab>

        <Tab
          eventKey="posts"
          title={
            <span className={`custom-tab-title ${activeTab === "posts" ? "active" : ""}`}>
              리뷰
            </span>
          }
        >
          <div>
            <h4>리뷰</h4>
            <PlacePosts placeId={placeId} />
          </div>
        </Tab>

        <Tab
          eventKey="more-info"
          title={
            <span className={`custom-tab-title ${activeTab === "more-info" ? "active" : ""}`}>
              추가정보
            </span>
          }
        >
          <div>
            <h4>추가정보</h4>
            <p>🏪 분류: {place.fcltyInfoDc}</p>
            <p>⁉️ 기타사항: {place.petLmttMtrCn}</p>
            <p>💸 이용가격: {place.petAcptAditChrgeValue}</p>
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default PlaceInfo;
