import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";

import { useUser } from "../../../components/contexts/UserContext";
import TopicVoteButton from "../../../components/community/topic/TopicVoteButton";
import TopicScrapButton from "../../../components/community/topic/TopicScrapButton";
import useFetchTopicInfo from "../../../components/community/topic/useFetchGetTopic";

import "../../../styles/Main.css"; // 기존 스타일 재사용
import "../../../styles/community/TopicInfo.css";
import '../../../styles/community/quill.snow.css'; // quill editor font size
import TopicDeleteModal from "../../../components/community/topic/TopicDeleteModal";
import ViewTopicComments from "../../../components/community/comment/ViewTopicComments";

const GetTopicInfo = () => {
  
  const navigate = useNavigate();

  const { topicId } = useParams(); // URL에서 topicId를 추출 (수정 시에 필요)

  const { userId } = useUser(); // 사용자 ID 가져오기
  const { topic, loading, error } = useFetchTopicInfo(topicId); // 페이지 초기화

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAuthor, setIsAutor] = useState(false); // 로그인 = 작성자? 확인

  useEffect(() => {
    if (topic) {
      // 조회수 증가 axios patch 요청 보내기
      const fetchIncreaseViewCount = async () => {
        await axios.patch(`/api/topics/${topic.topicId}`)
          .catch(err => {
            console.log('axios fetch increase view count error : ', err);
          });
      };
      fetchIncreaseViewCount();
      
      setIsAutor(topic.author.userId === userId);
    }
  }, [topic, userId]);


  const hashtagClickHandler = (tag) => {
    const search = {
      category: '',
      condition: '4',
      keyword: tag
    };
    navigate('/searchTopics', { state: search });
  }

  
  // 로딩 중일 때 표시할 메시지
  if (loading) {
    return <div>Loading...</div>;
  }

  // 에러가 발생했을 때 표시할 메시지
  if (error) {
    return <div>Error: {error}</div>;
  }

  // <Link to={`/comments/${topicId}`}>link to the topic's comments</Link>

  return (

    <div className="post-view">

      {/* 제목 */}
      <div className="post-header">
        <h1 className="post-title">
          [{topic.categoryStr}] {topic.title}
        </h1>
      </div>

      {/* 작성자와 버튼 */}
      <div className="post-header">
        <span className="post-author">{topic.author.nickname}</span>
        { isAuthor ? (
          <div>
            <Link to={`/editTopic/${topicId}`}>
              <button>수정</button>
            </Link>
            &nbsp;
            <button onClick={() => setShowDeleteModal(true)}>삭제</button>
          </div>
        ) : "" }
      </div>

      {/* 날짜 및 조회수 */}
      <div className="post-meta">
        <div className="post-dates">
          <p>등록: {topic.addDateStr}</p>
          { topic.updateDate ? (
            <p>수정: {topic.updateDateStr}</p>
          ) : "" }
        </div>
        <p className="post-views">조회수: {topic.viewCount}</p>
      </div>

      {/* 게시글 본문 */}
      <div dangerouslySetInnerHTML={{ __html: topic.content }}/>


      {/* 이미지 가져오기 테스트 */}
      <div dangerouslySetInnerHTML={{ __html: `<img src="/api/images/local/23" />` }}/>
      <br/>


      {/* 좋아요 / 싫어요 버튼 */}
      <div className="post-feedback">
        <TopicVoteButton topicId={topic.topicId} voteCount={topic.likeCount} isLike={true}/>
        <TopicVoteButton topicId={topic.topicId} voteCount={topic.dislikeCount} isLike={false}/>
      </div>

      {/* 해시태그 */}
      <div className="post-hashtags">
        {topic.hashtags.map((content) => (
          <button
            key={content}
            className="hashtag-button"
            onClick={() => hashtagClickHandler(content)}
          >
            # {content}
          </button>
        )) }
      </div>

      {/* 기타 버튼 */}
      <div className="post-extras">
        <TopicScrapButton topicId={topic.topicId}/>
        <button /*onClick={onReport}*/>신고</button>
      </div>

      {/* 댓글 */}
      <div>
        <ViewTopicComments targetTopic={topic} commentCount={topic.commentCount}/>
      </div>


      <TopicDeleteModal
        showModal={showDeleteModal} 
        setShowModal={setShowDeleteModal}
        topic={topic}
      />

    </div>

  );

};

export default GetTopicInfo;
