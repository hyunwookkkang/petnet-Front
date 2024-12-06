import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import "../../../styles/Main.css"; // 기존 스타일 재사용
import useFetchTopics from "./useFetchTopics";

const GetTopic = ({topicId}) => {
  const [topic, setTopic] = useState({});

  useFetchTopics(topicId)

  useEffect(() => {

  }, []);

  
  const navigate = useNavigate();

  const openTopicComments = (topicId) => {
    // useNavigate
    // console.log("open topic info : ", topicId)
    // navigate("/topicInfo", { state : { topicId: topicId } });
  }
  
  // 로딩 중일 때 표시할 메시지
  if (loading) {
    return <div>Loading...</div>;
  }

  // 에러가 발생했을 때 표시할 메시지
  if (error) {
    return <div>Error: {error}</div>;
  }

  // add_date -> yyyy-mm-dd hh:mm:dd
  const topicAddDateHandler = (topic) => { 
    return topic.addDateYMD + " " + topic.addDateHMS; 
  }

  const topicsView = topics.map((topic) => (
    <div 
      key={topic.topicId}
      onClick={() => openTopicInfo(topic.topicId)}
    >
      <h2>제목: {topic.title}</h2>
      <p>작성일: {topicAddDateHandler(topic)}</p>
      <p>작성자: {topic.authorId}</p>
      <p>댓글수: {topic.commentCount}</p>
    </div>
  ));

  return (
    <div>
      <h1>{topic.title}</h1>
      <p>{topic.content}</p>
      <button onClick={updateTopic}>Update Topic</button>
    </div>
  );
};

export default GetTopic;
