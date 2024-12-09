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
//css
import "../../../styles/place/Place.css";
//component
import FavoriteModal from "../favorite/FavoriteModal";



const PlaceInfo = () => {
  const { placeId } = useParams(); // URL에서 placeId 추출
  const [place, setPlace] = useState(null);
  const [activeTab, setActiveTab] = useState("info"); // 탭 상태
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    
    fetch(`/api/map/places/${placeId}`)
      .then((response) => response.json())
      .then((data) => setPlace(data))
      .catch((error) => console.error("Error fetching place detail:", error));
  }, [placeId]);

  if (!place) {
    return <div>Loading...</div>;
  }

  const handleLikeClick =()=>{
    setShowModal(true);
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
                <LikeButton onClick={handleLikeClick}/>
                <FavoriteModal
                  show={showModal}
                  onClose={() => setShowModal(false)}
                  onSubmit={(selectedFavorite) => {
                  console.log("선택된 즐겨찾기:", selectedFavorite);
                  setShowModal(false);
                  }}
                />
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
          <Card className="place-button-box">
              <Card.Body style={{ padding: '0px' }}>
                <Card.Title className="text-center">
                  {place.fcltyNm}

                </Card.Title>
                  <Col className="text-center">
                    <p>{place.rdnmadrNm}</p>
                  </Col>
                </Card.Body>
            </Card>
        </Col>
      </Row>
    
      <Row className="mb-4">
        <Col>
          <Card className="place-button-box">
              <Card.Body style={{ padding: '3px' }}>
                {/* <Card.Title className="text-center">{place.fcltyNm}</Card.Title> */}
                  <Col>
                  <ButtonGroup className="button-group" style={{}}>
                    <button className="button-click">
                      내부입장<br/>
                      {place.inPlaceAcptPosblAt}
                    </button>
                    <button className="button-click">
                      외부입장<br/>
                      {place.outPlaceAcptPosblAt}
                    </button>
                    <button className="button-click">
                      몸무게제한<br/>
                      {place.entrnPosblPetSizeValue}
                    </button>
                    <button className="button-click">
                      주차여부<br/>
                      {place.parkngPosblAt}
                    </button>
                    </ButtonGroup>
                  </Col>
                </Card.Body>
            </Card>
        </Col>
      </Row>
      

      <Row className="mb-4">
        <Col>
          <Card className="place-button-box">
              <Card.Body>
                {/* Google Map */}
                <div id="google-map" style={{ width: "100%", height: "200px", marginBottom: "20px" }} />
                </Card.Body>
            </Card>
        </Col>
      </Row>
    </Row>

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
            
            {/* 장소상세보기 */}
            <p>
            <strong>운영시간:</strong>{place.operTime}
            </p>
            <p>
              <strong>전화번호:</strong> {place.telNo}
            </p>
            <p>
              <strong>반려동물 제한:</strong> {place.petLmttMtrCn || "없음"}
            </p>
            <p>
              <strong>주차 가능:</strong> {place.parkngPosblAt === "Y" ? "가능" : "불가능"}
            </p>
            <p>
              <strong>시설명: </strong>{place.fcltyNm}
            </p>
            <p>
              <strong>도로명주소: </strong>{place.rdnmadrNm}
            </p>
            <p>
              <strong>전화번호: </strong>{place.telNo}
            </p>
            <p>
              <strong>운영시간: </strong>{place.operTime}
            </p>
            <p>
              <strong>휴무일안내: </strong>{place.rstdeGuidCn}
            </p>
            <p>
              <strong>반려동물 제한 사항: </strong>{place.entrnPosblPetSizeValue}
            </p>
            <p>
              <strong>홈페이지: </strong>{place.hmpgUrl}
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
