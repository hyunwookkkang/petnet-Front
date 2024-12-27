import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { Container } from "react-bootstrap";
import { FaThumbsUp } from "react-icons/fa";

import LoginModal from "../../components/common/modal/LoginModal";
import TopicSearchBar from "../../components/community/topic/TopicSearchBar";

import { useUser } from "../../components/contexts/UserContext";
import useFetchGetMyTopics from "../../components/community/topic/useFetchGetMyTopics";

import "../../styles/Main.css"; // 기존 스타일 재사용


const GetMyTopics = () => {

  const navigate = useNavigate();

  const { userId } = useUser(''); // 사용자 ID 가져오기
  const { fetchGetMyTopics, error } = useFetchGetMyTopics();

  const [showLoginModal, setShowLoginModal] = useState(false);

  const [topics, setTopics] = useState([]);
  
  const [search, setSearch] = useState({
    "category": '',
    "condition": '',
    "keyword": ''
  });


  useEffect(() => {
    // 로그인 검사
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    const fetchTopics = async () => {
      const response = await fetchGetMyTopics(userId, search);
      setTopics(response || []);
    };
    fetchTopics();

  }, [fetchGetMyTopics, userId, search, navigate]);


  const topicsView = topics.map((topic) => (

    <div key={topic.topicId}>

      <Link className="link-unstyled" to={`/getTopic/${topic.topicId}`}>
        <li className="topics-normal-item">

          <div className="topics-header">
            <strong className="topics-title">
              [{topic.categoryStr}] {topic.title}
            </strong>
            
            <span className="topics-comments">
              댓글 {topic.commentCount}
            </span>
          </div>

          <div className="topics-footer">
            <span className="comment-likes">
              <FaThumbsUp/>
              <div>
                { topic.likeCount < 10000 ?
                  topic.likeCount
                : '9999+' }
              </div>
            </span>

            <span className="topics-date">
              {topic.addDateStr}
            </span>
          </div>

        </li>
      </Link>

    </div>

  ));


  // 에러가 발생했을 때 표시할 메시지
  if (error) {
    return <div>Error: {error}</div>;
  }

  
  return (

    <Container>
      
      <h1 style={{ textAlign: "center", margin: "5px" }}>
        내가 쓴 게시글
      </h1>
      
      <TopicSearchBar setSearch={setSearch}/>
      <br/>
      
      <div>
        { topics.length === 0 ? (
          <h5 className="community-empty-list">
            아직 작성한 게시글이 없습니다
          </h5> // topics가 빈 배열일 경우
        ) : (
          <ul style={{ paddingInlineStart: '0' }}>
            { topicsView }
          </ul> // topics 배열에 데이터가 있을 경우
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

export default GetMyTopics;
