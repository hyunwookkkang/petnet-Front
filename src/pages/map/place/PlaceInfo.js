//react
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
//react bootstrap
import { Container, Row, Col, Card, Tabs, Tab, ButtonGroup } from "react-bootstrap";
//pages
import PlacePosts from "../placePost/PlacePosts";
import PlaceImage from "./PlaceImage";
//components
import LikeButton from "../../../components/common/button/LikeButton";
import AddFavoriteItemModal from "../favorite/AddFavoriteItemModal";
import axios from "axios";
import PlacePosts from "../placePost/PlacePosts";
import "../../../styles/Main.css";
import "../../../styles/place/PlaceInfoButton.css";

import { showErrorToast, showSuccessToast } from "../../../components/common/alert/CommonToast";
import PlaceImage from './PlaceImage';
import { Heart, HeartFill } from "react-bootstrap-icons";

const PlaceInfo = () => {
  const { placeId } = useParams(); // URL에서 placeId 추출
  const [place, setPlace] = useState(null);
  const [activeTab, setActiveTab] = useState("info"); // 탭 상태

  useEffect(() => {

    let isMounted = true; // 컴포넌트 언마운트 체크
    
  const fetchData = async () => {
    try {
      // 장소 정보 가져오기
      const response = await axios.get(`/api/map/places/${placeId}`);
      setPlace(response.data);

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

  if (!place) {
    return <div>Loading...</div>;
  }

  

  return (
    <Container>
      <Row>
        {/* <Col xs={12} md={6}>
          
          <PlaceImage />
          
        </Col> */}
      


      <Row className="mb-4">
        <Col>
          <Card className="place-button-box">
          <Card.Body style={{ padding: '3px' }}>
              < div className="like-button-container">
                <LikeButton />
              </div>
              <PlaceImage />
                  {/* <Image
                src={`https://maps.googleapis.com/maps/api/place/photo?key=API_KEY&photo_reference=${place.photoRef}`}
                alt={place.fcltyNm}
                fluid
                  /> */}
                </Card.Body>
            </Card>
        </Col>
      </Row>

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
                fontSize: '30px',
                marginLeft: '20px',
                color: '#FF6347 '
              }}
            >
              {place.fcltyNm}
            </div>
            <div>
              
            </div>
          </Card>
        </Col>
      </Row>

      <div className="place-info-button-group">
        <button className="place-info-button">
          <div>
            내부입장 <br />
            {place.inPlaceAcptPosblAt}
          </div>
        </button>
        <button className="place-info-button">
          <div>
            외부입장 <br />
            {place.outPlaceAcptPosblAt}
          </div>
        </button>
        <button className="place-info-button">
          <div>
            입장제한 <br />
            {place.entrnPosblPetSizeValue}
          </div>
        </button>
        <button className="place-info-button">
          <div>
            주차 <br />
            {place.parkngPosblAt}
          </div>
        </button>
      </div>



      {/* 탭 구성 */}
      <Tabs
        id="place-detail-tabs"
        activeKey={activeTab}
        onSelect={(tab) => setActiveTab(tab)}
        className="mb-4"
      >
        <Tab eventKey="info" title="장소 상세 정보">
          <div className="place-detail-tabs">
          <p
            style={{
              fontSize: '30px',
              marginLeft: '20px'
            }}>
            {place.fcltyNm}
          </p>
            <div
              style={{
                fontSize: '18px',
                marginLeft: '10px'
              }}
            >
              
            <p>
              🏪 장소 정보: 
              {place.ctgryThreeNm}
            </p>
            <p>
              🕒 운영시간:
              {place.operTime}
            </p>
            <p>
              📞 전화번호: {place.telNo}
            </p>
            <p>
              🅿️ 주차 가능:{" "}
              {place.parkngPosblAt === "Y" ? "가능" : "불가능"}
            </p>
            <p>
              🗺️ 도로명주소: 
              {place.rdnmadrNm}
            </p>
            <p>
              📆 휴무일안내: 
              {place.rstdeGuidCn}
            </p>
            <p>
              🐶 반려동물 제한: {place.petLmttMtrCn || "없음"}
            </p>
            <p>
              🐈 반려동물 제한 몸무게: 
              {place.entrnPosblPetSizeValue}
            </p>
            <p>
              🖥️ 홈페이지: 
              {place.hmpgUrl}
            </p>
            {/* 장소상세보기 */}
          </div>
        </Tab>

        {/* 리뷰Tab */}
        <Tab eventKey="posts" title="리뷰">
          <div>
            <h4>리뷰</h4>
            <PlacePosts placeId = {placeId}/>
            {/* 로그인상태 추가 예정  isLoggedIn = {isLoggedIn}*/}
          </div>
        </Tab>

        {/* 추가정보Tab */}
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
