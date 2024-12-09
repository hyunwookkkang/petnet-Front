import React, { useEffect, useState } from "react";
import { Link, useParams } from 'react-router-dom';

import "../../../styles/Main.css"; // 기존 스타일 재사용
import "../../../styles/community/TopicInfo.css";
import useFetchTopicInfo from "../../../components/community/topic/useFetchGetTopic";
import axios from "axios";
import { useUser } from "../../../components/contexts/UserContext";

const GetTopicInfo = () => {
  
  const { topicId } = useParams(); // URL에서 topicId를 추출 (수정 시에 필요)

  const { topic, loading, error } = useFetchTopicInfo(topicId); // 페이지 초기화

  const { userId } = useUser(); // 사용자 ID 가져오기

  const [isAuthor, setIsAutor] = useState(false); // 로그인 = 작성자? 확인

  useEffect(() => {
    if (topic) {
      // 조회수 증가 axios patch 요청 보내기
      const fetchIncreaseViewCount = async () => {
        await axios.patch(`http://localhost:8000/api/topics/${topic.topicId}`)
          .catch(err => {
            console.log('axios fetch IncreaseViewCount error : ', err);
          });
      };
      fetchIncreaseViewCount();
      
      setIsAutor(topic.author.userId !== userId);
    }
  }, [topic, userId]);
  
  // 로딩 중일 때 표시할 메시지
  if (loading) {
    return <div>Loading...</div>;
  }

  // 에러가 발생했을 때 표시할 메시지
  if (error) {
    return <div>Error: {error}</div>;
  }


  const onShare = () => {
    console.log("share topic ", topic.topicId)
  }

  const onEdit = () => {
    console.log("update topic ", topic.topicId)
  }

  const onDelete = () => {
    console.log("delete topic ", topic.topicId)
  }

  const onReport = () => {
    console.log("report topic ", topic.topicId)
  }

  <Link to={`/comments/${topicId}`}>link to the topic's comments</Link>

  return (

    <div className="post-view">

      {/* 제목 */}
      <div className="post-header">
        <span>
          <h1 className="post-title">
            [{topic.categoryStr}] {topic.title}
          </h1>
        </span>
        <button className="post-extras" onClick={onShare}>공유</button>
      </div>

      {/* 작성자와 버튼 */}
      <div className="post-header">
        <span className="post-author">{topic.author.nickname}</span>
        { isAuthor ? (
          <div>
            <Link to={`/editTopic/${topicId}`}>
              <button onClick={onEdit}>수정</button>
            </Link>
            &nbsp;
            <Link to={{ pathname: "/topicDelete", state: topic }}>
              <button onClick={onDelete}>삭제</button>
            </Link>
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
      <div className="post-content">{topic.content}</div>

      {/* 좋아요 / 싫어요 버튼 */}
      <div className="post-feedback">
        <button /*onClick={onLike}*/>👍 좋아요 ({topic.likeCount})</button>
        <button /*onClick={onDislike}*/>👎 싫어요 ({topic.dislikeCount})</button>
      </div>

      {/* 해시태그 */}
      <div className="post-hashtags">
        {topic.hashtags.map((content) => (
          <button
            key={content}
            className="hashtag-button"
            /*onClick={() => onHashtagClick(tag)}*/
          >
            # {content}
          </button>
        )) }
      </div>

      {/* 첨부파일 및 기타 버튼 */}
      <div className="post-extras">
        <button /*onClick={downloadFiles}*/>첨부파일 다운로드</button>
        <button /*onClick={onToggleScrap}*/>스크랩 추가/취소</button>
        <button onClick={onReport}>게시글 신고</button>
      </div>

      {/* 댓글 */}
      <div className="post-comments-bar">
        <span className="comment-count">댓글 ({topic.commentCount})</span>
        <button className="view-comments-button" /*onClick={onToggleComments}*/>
          댓글 보기
        </button>
      </div>

    </div>

  );

};

export default GetTopicInfo;
