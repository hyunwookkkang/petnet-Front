import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Container } from "react-bootstrap";

import LoginModal from "../../components/common/modal/LoginModal";
import TopicSearchBar from "../../components/community/topic/TopicSearchBar";
import TopicScrapButton from "../../components/community/topic/TopicScrapButton";

import { useUser } from "../../components/contexts/UserContext";
import useFetchGetScrapTopics from "../../components/community/topic/useFetchGetScrapTopics";

import "../../styles/Main.css"; // 기존 스타일 재사용


const GetScrapTopics = () => {

  const navigate = useNavigate();

  const { userId } = useUser(''); // 사용자 ID 가져오기
  const { fetchGetScrapTopics, error } = useFetchGetScrapTopics();

  const [showLoginModal, setShowLoginModal] = useState(false);

  const [topics, setTopics] = useState([]);
    
  const [search, setSearch] = useState({
    "category": '',
    "condition": '',
    "keyword": ''
  });


  // 페이지 초기화
  useEffect(() => {
    // 로그인 검사
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    const fetchTopics = async () => {
      const response = await fetchGetScrapTopics(userId, search);
      setTopics(response || []);
    };
    fetchTopics();
    
  }, [fetchGetScrapTopics, userId, search, navigate]);



  const topicsView = topics.map((topic) => (

    <div key={topic.topicId}>

      <Link className="link-unstyled" to={`/getTopic/${topic.topicId}`}>
        <h2>제목: {topic.title}</h2>
        <p>작성일: {topic.addDateStr}</p>
        <p>작성자: {topic.author.userId}</p>
        <p>댓글수: {topic.commentCount}</p>
      </Link>

      <TopicScrapButton topicId={topic.topicId}/>

    </div>

  ));


  // 에러가 발생했을 때 표시할 메시지
  if (error) {
    return <div>Error: {error}</div>;
  }


  return (

    <Container>
      
      <TopicSearchBar setSearch={setSearch}/>
      <br/>

      <div>
        <h1>View Scrap Topics</h1>
        <br/>
        { topics.length === 0 ? (
          <p>내 스크랩 게시글이 없습니다</p> // topics가 빈 배열일 경우
        ) : (
          <ul>{topicsView}</ul> // topics 배열에 데이터가 있을 경우
        )}
      </div>


      <LoginModal 
        showModal={showLoginModal} 
        setShowModal={setShowLoginModal}
        required={true}
      />

    </Container>

  );

}

export default GetScrapTopics;
