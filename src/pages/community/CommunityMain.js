import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container, ButtonGroup, Button } from "react-bootstrap";

import { useUser } from "../../components/contexts/UserContext";
import LoginModal from "../../components/common/modal/LoginModal";
import SearchBar from "../../components/common/searchBar/SearchBar";
import ViewTopics from "../../components/community/topic/ViewTopics";
import ViewAllTopics from "../../components/community/topic/ViewAllTopics";
import ViewHotTopics from "../../components/community/topic/ViewHotTopics";

import "../../styles/Main.css"; // 기존 스타일 재사용
import "../../styles/community/TopicListView.css";
import "../../styles/community/TopicInfo.css";


const CommunityMain = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { userId } = useUser();

  const [showLoginModal, setShowLoginModal] = useState(false);

  const [topicsComponent, setTopicsComponent] = useState(null);
  const [topicTab, setTopicTab] = useState('all');

  const [search, setSearch] = useState({
    category: '',
    condition: '',
    keyword: '',
    categoryStr: ''
  });
  
  
  useEffect(()=> {
    categoryChangehandler(location.state?.category || 'all');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[location.state?.category]);

  useEffect(() => {
    switch (topicTab) {
      case 'all': setTopicsComponent(<ViewAllTopics />); break;
      case 'hot': setTopicsComponent(<ViewHotTopics />); break;
      default: setTopicsComponent(<ViewTopics search={search} />); 
    }
  }, [search, topicTab]); // search & topicTab 변경될 때마다 실행


  const navigateAddTopic = () => {    
    // 로그인 검사
    if (!userId) {
      setShowLoginModal(true);
      return;
    }
    else {
      navigate(`/editTopic`);
    }
  }

  
  const categoryChangehandler = (tab) => {
    if (!Number.isNaN(tab)) {
      setSearch(prevSearch => ({ ...prevSearch, category: tab }));
    }
    else {
      setSearch(prevSearch => ({ ...prevSearch, category: '' }));
    }
    setTopicTab(tab);
    setSearch(prevSearch => ({ ...prevSearch, categoryStr: getCategoryStr(tab) }));
  }

  const getCategoryStr = (tab) => {
    switch (tab) {
      case '1': return "잡담";
      case '2': return "질문";
      case '3': return "후기";
      default : return "???";
    };
  }

  
  return (

    <Container>
      
      <div>
        <Link to={`/searchTopics`} className="link-unstyled">
          <SearchBar/>
        </Link>
        <div style={{ display: "flex", justifyContent: "flex-end", marginRight: '20px'}}>
          <Button 
            style={{ backgroundColor: "#FF6347", borderColor: "#FF6347" }}
            onClick={navigateAddTopic}>
              게시글 작성
          </Button>
        </div>
      </div>

      <ButtonGroup className="topic-tap-group" >
        <Button 
          className="topic-tap" 
          onClick={() => categoryChangehandler('all')}
        > 전체 
        </Button>
        <Button 
          className="topic-tap" 
          onClick={() => categoryChangehandler('hot')}
        > 인기 
        </Button>
        <Button 
          className="topic-tap" 
          onClick={() => categoryChangehandler('1')}
        > 잡담 
        </Button>
        <Button 
          className="topic-tap" 
          onClick={() => categoryChangehandler('2')}
        > 질문 
        </Button>
        <Button 
          className="topic-tap" 
          onClick={() => categoryChangehandler('3')}
        > 후기 
        </Button>
      </ButtonGroup>

      { topicsComponent }

      
      <LoginModal 
        showModal={showLoginModal} 
        setShowModal={setShowLoginModal}
      />

    </Container>

  );

}

export default CommunityMain;
