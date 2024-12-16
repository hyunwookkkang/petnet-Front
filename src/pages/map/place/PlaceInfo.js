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

const PlaceInfo = () => {
  const { placeId } = useParams(); // URL에서 placeId 추출
  const [place, setPlace] = useState(null); // 장소 정보 상태
  const [activeTab, setActiveTab] = useState("info"); // 탭 상태
  const [showModal, setShowModal] = useState(false); // 모달 상태
  const [isLiked, setIsLiked] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null); // 현재 장소의 favoriteId 상태

  // 장소 정보와 좋아요 상태 초기화
  useEffect(() => {
    // 장소 정보 가져오기
    const fetchPlaceInfo = async () => {
      try {
        const response = await axios.get(`/api/map/places/${placeId}`);
        setPlace(response.data);
      } catch (error) {
        console.error("Error fetching place detail:", error);
      }
    };

    // 좋아요 상태 가져오기
    const fetchFavoriteId = async () => {
      try {
        const response = await axios.get(`/api/map/favorites/getFavoriteId`, {
          params: { placeId },
        });
        const fetchedFavoriteId = response.data;
        if (fetchedFavoriteId) {
          setFavoriteId(fetchedFavoriteId);
          setIsLiked(true);
        } else {
          setFavoriteId(null);
          setIsLiked(false);
        }
      } catch (error) {
        console.error("Error checking like status:", error);
      }
    };

    fetchPlaceInfo();
    fetchFavoriteId();
  }, [placeId]);

  // 선택한 즐겨찾기에 항목(placeId) 추가
  const handleAddToFavorite = async (favoriteId) => {
    if (isLiked) {
      showErrorToast("이미 즐겨찾기에 추가된 항목입니다.");
      return; // 중복 요청 방지
    }
    try {
      await axios.post(
        `/api/map/favorites/item/${placeId}`,
        null,
        {
          params: { favoriteId },
          withCredentials: true,
        }
      );
      showSuccessToast("항목이 즐겨찾기에 추가되었습니다!");
      setIsLiked(true); // 좋아요 상태 업데이트
      setFavoriteId(favoriteId); // favoriteId 저장
      setShowModal(false); // 모달 닫기
    } catch (error) {
      console.error("Error adding item to favorite:", error);
      showErrorToast("항목 추가 중 오류가 발생했습니다.");
    }
  };

  // 즐겨찾기 삭제
  const handleRemoveFromFavorite = async () => {
    if (!isLiked) {
      showErrorToast("즐겨찾기에 없는 항목입니다.");
      return; // 중복 요청 방지
    }
    try {
      await axios.delete(`/api/map/favorites/item/${placeId}`, {
        params: { favoriteId },
        withCredentials: true,
      });
      showSuccessToast("항목이 즐겨찾기에서 제거되었습니다!");
      setIsLiked(false); // 좋아요 상태 업데이트
      setFavoriteId(null); // favoriteId 초기화
    } catch (error) {
      console.error("Error removing item from favorite:", error);
      showErrorToast("항목 제거 중 오류가 발생했습니다.");
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
                <LikeButton
                  onClick={() => {
                    if (isLiked) {
                      handleRemoveFromFavorite(); // 좋아요 상태일 때 제거
                    } else {
                      setShowModal(true); // 좋아요 상태가 아닐 때 모달 열기
                    }
                  }}
                  liked={isLiked} // LikeButton 컴포넌트에 좋아요 상태 전달
                />

                {/* 즐겨찾기 모달 */}
                {isLiked ? null : (
                  <AddFavoriteItemModal
                    show={showModal}
                    onClose={() => setShowModal(false)}
                    placeId={placeId} // placeId 전달
                    onAddItem={handleAddToFavorite} // 항목 추가 함수 전달
                  />
                )}
              </div>
              <div>
                <PlaceImage/>
              </div>
            </Card.Body>
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
