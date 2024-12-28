import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import axios from "axios";

import TopicVoteButton from "../../components/community/topic/TopicVoteButton";
import TopicScrapButton from "../../components/community/topic/TopicScrapButton";
import TopicDeleteModal from "../../components/community/topic/TopicDeleteModal";
import ViewTopicCommentsBox from "../../components/community/comment/ViewTopicCommentsBox";

import { useUser } from "../../components/contexts/UserContext";
import useFetchGetTopic from "../../components/community/topic/useFetchGetTopic";

import "../../styles/Main.css"; // 기존 스타일 재사용
import "../../styles/community/TopicInfo.css";
import '../../styles/community/quill.snow.css'; // quill editor font size


const GetTopicInfo = () => {
  
  const navigate = useNavigate();

  const { topicId } = useParams(); // URL에서 topicId를 추출 (수정 시에 필요)

  const { userId, userRole } = useUser(); // 사용자 ID 가져오기
  const { fetchGetTopic /* , loading , error */ } = useFetchGetTopic();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAuthor, setIsAutor] = useState(false); // 로그인 = 작성자? 확인

  const [topic, setTopic] = useState({
    "topicId": topicId,
    "author": { "userId": '', "nickname": '' },
    "hashtags": []
  });

  
  useEffect(() => {
    // 페이지 초기화
    const fetchTopic = async () => {
      const response = await fetchGetTopic(topic.topicId);
      setTopic(response);
    };
    fetchTopic();

    // 조회수 증가 axios patch 요청 보내기
    const fetchIncreaseViewCount = async () => {
      await axios.patch(`/api/topics/${topic.topicId}`)
        .catch(err => {
          console.log('axios fetch increase view count error : ', err);
        });
    };
    fetchIncreaseViewCount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 사용자 == 작성자 비교
  useEffect(() => {
    setIsAutor(topic.author.userId === userId);
  }, [topic.author.userId, userId]);


  const hashtagClickHandler = (tag) => {
    const search = {
      category: '',
      condition: '4',
      keyword: tag
    };
    navigate('/searchTopics', { state: search });
  }


  // // 에러가 발생했을 때 표시할 메시지
  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  
  const TopicView = () => (
    <>
      {/* 제목과 스크랩 */}
      <div className="post-header topic-title">
        <h1>
          [{topic.categoryStr}] {topic.title}
        </h1>
        <TopicScrapButton topicId={topic.topicId}/>
      </div>

      <div className="topic-header">
        {/* 작성자와 버튼 */}
        <div className="post-header">
          <span className="topic-author">
            <FaUser style={{ marginRight: '5px', fontSize: '20px' }} /> 
            {topic.author.nickname}
          </span>
          <div>
            {/* 게시글 수정 버튼 */}
            { isAuthor && (
              <Button 
                as={Link} 
                to={`/editTopic/${topicId}`} 
                variant='link'
                className="topic-text-button"
              >
                수정
              </Button>
            )}
            {/* 게시글 삭제 버튼 */}
            { (["0","1"].includes(userRole) || isAuthor) && (
              <Button 
                variant='link'
                className="topic-text-button"
                onClick={() => setShowDeleteModal(true)}
              >
                삭제
              </Button>
            )}
            </div>
        </div>
        {/* 날짜 및 조회수 */}
        <div className="topic-meta">
          <div>
              <p>등록 &nbsp;{topic.addDateStr}</p>
            { topic.updateDate ? 
              <p>수정 &nbsp;{topic.updateDateStr}</p>
            : '' }
          </div>
          <div className='topic-view-count'>
            <p>조회</p> 
            <p>
              { topic.viewCount < 1000000 ?
                topic.viewCount
              : '999999+' }
            </p>
          </div>
        </div>
      </div>

      {/* 게시글 본문 */}
      <div 
        className="topic-content" 
        dangerouslySetInnerHTML={{ __html: topic.content }}
      />

      {/* 좋아요 / 싫어요 버튼 */}
      <div className="topic-votes">
        <TopicVoteButton 
          topicId={topic.topicId} 
          voteCount={topic.likeCount} 
          isLike={true} 
        />
        <TopicVoteButton 
          topicId={topic.topicId} 
          voteCount={topic.dislikeCount} 
          isLike={false} 
        />
      </div>

      {/* 해시태그 */}
      <div className="topic-hashtag-area">
        { topic.hashtags.map((content) => (
          <button 
            key={content} 
            className="topic-hashtag" 
            onClick={() => hashtagClickHandler(content)} 
          >
            # {content}
          </button>
        )) }
      </div>
      
      {/* 댓글 목록 */}
      <ViewTopicCommentsBox targetTopic={topic} />
    </>
  );


  return (

    <div className="topic-view">
      
      <TopicView />
    

      <TopicDeleteModal 
        showModal={showDeleteModal} 
        setShowModal={setShowDeleteModal} 
        topic={topic} 
      />

    </div>

  );

};

export default GetTopicInfo;
