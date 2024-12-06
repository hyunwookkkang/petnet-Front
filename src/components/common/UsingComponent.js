import React from "react";
import MultipleSelectCheckmarks from "./select/MultipleSelectCheckmarks";
import SearchBar from "./searchBar/SearchBar";
import Carousel from "./carousel/ImageCarousel";
import LikeButton from "./button/LikeButton";
import { Container, Row, Col, Card } from "react-bootstrap";
import DeletableChips from "./button/DeletableChips";
import HomeIcon from "./icon/HomeIcon";
import AlignItemsList from "./listcommon/AlignItemsList";
import SelectSmall from "./select/SelectSmall";
import BadgeVisibility from "./badge/BadgeVisibility";
import SelectedListItem from "./listcommon/SelectedListItem";
import SlideTransition from "./slide/SlideTransition";


function UsingComponent(){
    console.log('Rendering UsingComponent'); 

    return (
        <div>
            <br/><br/>
            <h2><b>"MUI install"</b></h2>
            <h5>npm install @mui/material @emotion/react @emotion/styled<br/>
                npm install @mui/material @mui/styled-engine-sc styled-components<br/>
                npm install @mui/icons-material<br/>
                기타 사이트 : https://mui.com/material-ui/getting-started/installation/
            </h5>
            <br/><br/>
            
            <h2><b>"MUI 아이콘 사용법"</b></h2>
            <h5>
                1. 사이트로 이동해서 아이콘 클릭하고 import문 복사하기<br/>
                https://mui.com/material-ui/material-icons/?query=food<br/>
                2. 사용하고 싶은 컴포넌트에 붙여넣기<br/>
                import FastfoodIcon from '@mui/icons-material/Fastfood';<br/>
                3. 사용하고 싶은 곳에 넣기<br/>
                Fastfood + Icon<br/>
            </h5>
            <br/><br/>

        {/* 단순 불러오기 : import & <SearchBar/>
            ** onSearch걸기 이때 return문 위에 const handle =()=>{} 정의해주셔야합니다
            ** 참고 -> /components/map/MapMain.js
            ** import SearchBar from "../../components/SearchBar";
             ** <SearchBar placeholder="오늘은 어디를 갈까?" onSearch={handleSearch} />
        */}
        <br/><br/>
        {/* 검색바*/}
        <h5><b>"../../components/SearchBar"</b></h5>
        <SearchBar />
        <br/><br/>

        {/* 사진(미완성)수정예정*/}
        <h5><b>"./carousel/ImageCarousel"수정예정</b></h5>
        <Carousel />
        <br/><br/>

        

        {/******각자 컴포넌트의 필요한 곳에 복붙하세요******/}
        {/* 다중선택 드롭다운 */}
        <h5><b>"./select/MultipleSelectCheckmarks"</b></h5>
        <MultipleSelectCheckmarks/>
        <br/><br/>

        {/*리스트 */}
        <h5><b>"./select/SelectSmall"</b></h5>
        <SelectSmall/>
        <br/><br/>

        {/* 좋아요 텍스트와 버튼을 가로로 정렬 */}
        <h5><b>"./button/LikeButton"</b></h5>
        <div style={{ position: "relative", display: "flex", alignItems: "center"  }}>
            <h4 style={{ marginRight: '10px' }}>좋아요~</h4>
            <LikeButton />
        </div>
        <br/><br/>

        {/* 삭제 버튼을 가로로 정렬 */}
        <h5><b>"./button/DeletableChips"</b></h5>
        <div style={{ position: "relative", display: "flex", alignItems: "center"  }}>
            <h4 style={{ marginRight: '10px' }}>삭제버튼</h4> 
            <DeletableChips/>
        </div>
        <br/><br/>

        {/* 증가뱃지*/}
        <h5><b>"./badge/BadgeVisibility"</b></h5>
        <BadgeVisibility/>
        <br/><br/>
        
        {/*Card사용법 */}
        <Container fluid className="mt-4 content-wrapper">
            <Row xs={1} md={2} lg={3} className="g-4">
                <Col>
                    <Card className="section">
                            <h5><b>"긁어서 사용하세여 이 h5는 삭제하고 사용바람"</b></h5>
                            <Card.Body>
                                <Card.Title className="section-title">
                                    BootStrap Card사용 <br/>
                                    Main.css의 MyPage CSS사용
                                </Card.Title>
                                    <ul className="list-unstyled">
                                    <li className="section-item">
                                        Main.css의 MyPage CSS사용 주석확인 ㄱ <br/>
                                        .section-item
                                    </li>
                                    <li className="section-item">
                                        색이 바뀌는 이유는 <br/>
                                        .section-item:hover
                                    </li>
                                </ul>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
            <br/><br/>

        {/*아이콘 사용법 */}
        <h5><b>"./icon/HomeIcon"</b></h5>
        <HomeIcon/>
        <br/><br/>

        {/*리스트 */}
        <h5><b>"./listcommon/AlignItemsList"</b></h5>
        <AlignItemsList />
        <br/><br/>

        {/*아이콘 & 텍스트 리스트 */}
        <h5><b>"./listcommon/SelectedListItem"</b></h5>
        <SelectedListItem/>
        <br/><br/>

        {/*사라지는알림 */}
        <h5><b>"./slide/SlideTransition"</b></h5>
        <SlideTransition/>
        <br/><br/>

        </div>
    );
}

export default UsingComponent;