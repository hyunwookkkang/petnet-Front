import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container, ButtonGroup, Button } from "react-bootstrap";

import SearchBar from "../../components/common/searchBar/SearchBar";
import ViewTopics from "../../components/community/topic/ViewTopics";
import ViewAllTopics from "../../components/community/topic/ViewAllTopics";
import ViewHotTopics from "../../components/community/topic/ViewHotTopics";

import "../../styles/Main.css"; // 기존 스타일 재사용

const CommunityMain = () => {

  const [topicsComponent, setTopicsComponent] = useState();

  const [topicTab, setTopicTab] = useState('all');

  const [search, setSearch] = useState({
    category: '',
    condition: '',
    keyword: ''
  });

  useEffect(() => {
    switch (topicTab) {
      case 'all': setTopicsComponent(<ViewAllTopics />); break;
      case 'hot': setTopicsComponent(<ViewHotTopics />); break;
      default: setTopicsComponent(<ViewTopics search={search}/>); 
    }
  }, [search, topicTab]);
  
  const categoryChangehandler = (tab) => {
    if (!Number.isNaN(tab)) {
      setSearch(prevSearch => ({ ...prevSearch, category: tab }));
    }
    else {
      setSearch(prevSearch => ({ ...prevSearch, category: '' }));
    }
    setTopicTab(tab);
  }

  const searchTopics = (searching) => { 
    setSearch(searching);
  }
  

  return (

    <Container>
      
      <div>
        <SearchBar searchTopics={searchTopics} />
        <Link to={`/editTopic`}>
          <button>게시글 작성</button>
        </Link>
      </div>

      <ButtonGroup className="button-group">
        <Button className="button-click" onClick={() => categoryChangehandler('all')}>전체</Button>
        <Button className="button-click" onClick={() => categoryChangehandler('hot')}>인기</Button>
        <Button className="button-click" onClick={() => categoryChangehandler('1')}>잡담</Button>
        <Button className="button-click" onClick={() => categoryChangehandler('2')}>질문</Button>
        <Button className="button-click" onClick={() => categoryChangehandler('3')}>후기</Button>
      </ButtonGroup>

      { topicsComponent }

    </Container>

  );

}

export default CommunityMain;
