import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import { useUser } from "../../../components/contexts/UserContext";
import useFetchTopicInfo from "../../../components/community/topic/useFetchGetTopic";
import useFetchAddTopic from "../../../components/community/topic/useFetchAddTopic";
import useFetchUpdateTopic from "../../../components/community/topic/useFetchUpdateTopic";
//import "../../../styles/community/TopicForm.css"; // 폼 스타일을 위한 추가 스타일 시트 (옵션)

const EditTopicInfo = () => {

  const navigate = useNavigate();

  const { topicId } = useParams(null); // URL에서 topicId를 추출 (수정 시에 필요)

  const { topic, loading, error } = useFetchTopicInfo(topicId); // 페이지 초기화
  const { fetchAddTopic, addLoading, addError } = useFetchAddTopic(); // submit-add
  const { fetchUpdateTopic, updateLoading, updateError } = useFetchUpdateTopic(); // submit-update

  const { userId } = useUser(''); // 사용자 ID 가져오기

  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isDownloadable, setIsDownloadable] = useState(false);

  const [isAuthor, setIsAutor] = useState(false); // 로그인 = 작성자? 확인

  useEffect(() => {
    if (topic) {
      setTitle(topic.title);
      setCategory(topic.category);
      setContent(topic.content);
      setHashtags(topic.hashtags);
      setImageFiles(topic.imageFiles);
      setIsDownloadable(topic.isDownloadable);
      setIsAutor(topic.author.userId === userId);
    }
  }, [topic, userId]);

  
  const setContentHandler = (e) => {
    
  }

  const appendHashtagHandler = (e) => {

  }
  const removeHashtagHandler = (e) => {

  }

  const submitHandler = async (e) => {
    e.preventDefault();

    
    
    const newTopic = {
      'topicId': topicId,
      'author': { 'userId': userId },
      'category': category,
      'title': title,
      'content': content,
      'hashtags': hashtags,
      'imageFiles': imageFiles,
      'isDownloadable': isDownloadable
    };

    //setLoading(true);

    const submitTopic = topic ? fetchUpdateTopic : fetchAddTopic;
    try {
      await submitTopic(newTopic);  // 선택된 함수 실행 (updateTopic 또는 addTopic)
    } 
    catch(err) {
      console.log(err);
    }
  };

  if ((error && topicId) || addError || updateError) {
    return <div>Error: {error || addError || updateError}</div>;
  }

  if (isAuthor) {
    return <div>Error: you are not author</div>;
  }

  if (loading || addLoading || updateLoading) {
    return <div>Loading...</div>;
  }

  return (

    <div className="topic-form">
      <h2>{topic ? '게시글 수정' : '새 게시글 작성'}</h2>

      {/* {error && <div className="error-message">{error}</div>} */}

      <form onSubmit={submitHandler}>
        {/* 제목 입력 */}
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* 카테고리 선택 */}
        <div className="form-group">
          <label htmlFor="category">카테고리</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        {/* 내용 입력 */}
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent/*Handler*/(e.target.value)}
            required
          ></textarea>
        </div>

        {/* 해시태그 입력 */}
        <div className="form-group">
          <label htmlFor="hashtags">해시태그</label>
          <input
            type="text"
            id="hashtags"
            value={hashtags}
            onChange={(e) => setHashtags/*Handler*/(e.target.value)}
            placeholder="#태그 #입력"
          />
        </div>

          {/* 첨부파일 저장 */}
          <input
            type="hidden"
            id="imageFiles"
            value={imageFiles}
          />

        {/* 제출 버튼 */}
        <div className="form-actions">
          { topic ? (
            <button type="submit" disabled={loading}>
            '수정하기' 
            </button>
          ) : (
            <button type="submit" disabled={loading}>
              '게시하기'
            </button>
          )}
        </div>

      </form>
    </div>
    
  );

};

export default EditTopicInfo;
