import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Button, Container, Form, ListGroup } from "react-bootstrap";
import { Snackbar } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import LoginModal from "../../components/common/modal/LoginModal";
import TopicQuillEditor from "../../components/community/topic/TopicQuillEditor";
import HashtagEditChip from "../../components/community/topic/HashtagEditChip";

import { useUser } from "../../components/contexts/UserContext";
import useFetchGetTopic from "../../components/community/topic/useFetchGetTopic";
import useFetchAddTopic from "../../components/community/topic/useFetchAddTopic";
import useFetchUpdateTopic from "../../components/community/topic/useFetchUpdateTopic";
import useFetchGetHashtags from "../../components/community/topic/useFetchGetHashtags";

import "../../styles/Main.css";
import "../../styles/community/EditTopic.css";
import "../../styles/community/AutoComplete.css";


const EditTopicInfo = () => {

  const navigate = useNavigate();
  const quillRef = useRef();

  const { topicId } = useParams(); // URL에서 topicId를 추출 (수정 시에 필요)
  const { userId } = useUser(); // 사용자 ID 가져오기

  const { fetchGetTopic, loading , error } = useFetchGetTopic();
  const { fetchAddTopic, addLoading, addError } = useFetchAddTopic();
  const { fetchUpdateTopic, updateLoading, updateError } = useFetchUpdateTopic();
  const { fetchGetHashtags, /*loading: tagloading, error: tagError*/ } = useFetchGetHashtags();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [topic, setTopic] = useState();
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [isDownloadable, setIsDownloadable] = useState(false);

  const [isAuthor, setIsAutor] = useState(false); // 로그인 = 작성자? 확인
  const [tagSuggestions, setTagSuggestions] = useState([]); // 해시태그 자동완성
  const [hashtagTemp, setHashtagTemp] = useState('');
  const [required, setRequired] = useState('');
  
  
  // 폼 초기화
  useEffect(() => {
    // 로그인 검사
    if (!userId) {
      setShowLoginModal(true);
      return;
    }
    // topicId가 있으면 기존 정보 불러오기
    if (topicId) {
      const fetchTopic = async () => {
        const resTopic = await fetchGetTopic(topicId);
        setTopic(resTopic);
      };
      fetchTopic();
    }
  }, [fetchGetTopic, topicId, userId]);

  // 기존 topic 정보로 화면 구성
  useEffect(() => {
    if (topic) {
      setCategory(topic.category);
      setTitle(topic.title);
      setContent(topic.content);
      setHashtags(topic.hashtags);
      setImageFiles(topic.imageFiles);
      setIsDownloadable(topic.isDownloadable);
      setIsAutor(topic.author.userId === userId);
    }
  }, [topic, userId]);

  // 해시태그 자동완성
  useEffect(() => {
    const fetchSuggestions = async () => {
      // 조건 검사
      if (!hashtagTemp.trim()) {
        setTagSuggestions([]);
        return;
      }
      // 해시태그 비동기 검색
      try {
        const resHashTags = await fetchGetHashtags(hashtagTemp);
        setTagSuggestions(resHashTags || []);
      } 
      catch (err) {
        console.error(err);
        setTagSuggestions([]);
      }
    };
    // 비동기 함수 호출
    fetchSuggestions();
  }, [hashtagTemp, fetchGetHashtags]);


  const appendHashtag = (e) => {
    e.preventDefault();

    if (hashtags.includes(hashtagTemp)) {
      setSnackbarMessage('중복된 해시태그입니다.');
      setShowSnackbar(true);
    } 
    else if (hashtags.length >= 10) {
      setSnackbarMessage('최대 해시태그 갯수는 10개입니다.');
      setShowSnackbar(true);
    }
    else {
      setHashtags(prevHahstag => [...prevHahstag, hashtagTemp]);
      setHashtagTemp('');
    }
  }

  const removeHashtag = (tag) => {
    setHashtags(prevHahstag => prevHahstag.filter(i => i !== tag));
  }

  const submitTopicHandler = async (e) => {
    e.preventDefault();

    // 에디터 내용이 비어있는지 확인
    if (!content.replace(/<[^>]*>/g, '').trim()) 
    {
      setRequired('본문에 내용을 작성하세요.');
      return;
    } 
    else {
      setRequired(''); // 오류 메시지 지우기
    }

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

    // prev topic exist => update / prev topic not exist => add
    const submitTopic = topic ? fetchUpdateTopic : fetchAddTopic;
    try {
      const resTopic = await submitTopic(newTopic);
      navigate(`/getTopic/${resTopic.topicId}`);
    } 
    catch(err) {
      console.log(err);
    }
  };


  if (loading || addLoading || updateLoading) {
    return <div>Loading...</div>;
  }

  if ((topicId && error) || addError || updateError) {
    return <div>Error: {error || addError || updateError}</div>;
  }

  if (topicId && !isAuthor) {
    return <div>Error: you are not author</div>;
  }


  return (
    <Container className="d-flex justify-content-center" style={{ width: '90%' }}>
      <div>
        
        <h2>{topic ? '게시글 수정' : '게시글 '}</h2>

        <Form onSubmit={submitTopicHandler}>

          <div className="d-flex w-100">
            {/* 카테고리 선택 */}
            <Form.Group className="mb-3">
              <Form.Label htmlFor="category"></Form.Label>
              <Form.Control 
                id="category" 
                as="select" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                required 
                style={{ width: '200px' }} 
              >
                <option value="" disabled hidden>카테고리</option>
                <option value="1">잡담</option>
                <option value="2">질문</option>
                <option value="3">후기</option>
              </Form.Control>
            </Form.Group>
            
            {/* 제출 버튼 */}
            <Button 
              variant="primary" 
              type="submit" 
              className="ms-auto mb-3 submit-btn"
              disabled={loading}
            >
              { topic ? '수정하기' : '게시하기' }
            </Button>
          </div>
          
          {/* 제목 입력 */}
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="제목 (50자 이내)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={50}
              required
            />
          </Form.Group>

          {/* 내용 입력 */}
          <Form.Group>
            <Form.Label></Form.Label>
            {required && <Alert variant="danger">{required}</Alert>}
            <TopicQuillEditor 
              id="content" 
              quillRef={quillRef} 
              htmlContent={content} 
              setHtmlContent={setContent} 
              /*imageHandler={topicImageHandler}*/
            />
          </Form.Group>

        </Form>

        <br/>
        {/* 해시태그 입력 */}
        <Form onSubmit={appendHashtag}>
          
          <Form.Group className="d-flex position-relative">
            <Form.Control 
              id="input-hashtag" 
              type="text" 
              placeholder="해시태그 입력" 
              value={hashtagTemp} 
              onChange={(e) => setHashtagTemp(e.target.value)} 
              style={{ width: '250px' }} 
              required
            />

            <ListGroup className="dropdown-suggestions">
              {tagSuggestions.map((tagSuggestion, index) => (
                <ListGroup.Item
                  key={index}
                  onClick={() => setHashtagTemp(tagSuggestion)}
                >
                  {tagSuggestion}
                </ListGroup.Item>
              ))}
            </ListGroup>

            <Button className="ms-2 addTag-btn" type="submit"> 
              <AddIcon fontSize="small" />
            </Button>
          </Form.Group>

          <br/>
          {/* 해시태그 출력 */}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <HashtagEditChip items={hashtags} removeItem={removeHashtag}/>
          </div>

        </Form>

      </div>


      <LoginModal 
        showModal={showLoginModal} 
        setShowModal={setShowLoginModal}
        required={true}
      />

      <Snackbar
        open={showSnackbar}
        message={snackbarMessage}
        onClose={() => setShowSnackbar(false)}
        autoHideDuration={1200}
      />

    </Container>

  );

};

export default EditTopicInfo;
