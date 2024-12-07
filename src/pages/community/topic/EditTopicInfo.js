import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// chat-gpt ver
// not routed

function PostForm({ onSubmit }) {
  const [topic, setTopic] = useState({
    categoryStr: '',
    title: '',
    content: '',
    hashtags: [],
  });
  const [loading, setLoading] = useState(false);

  const { topicId } = useParams(); // URL에서 topicId를 추출
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수

  // 컴포넌트가 마운트되었을 때 수정인 경우 기존 데이터를 불러오기
  useEffect(() => {
    if (topicId) {
      setLoading(true);
      // 여기서 서버에서 데이터를 불러오는 요청을 해야 합니다.
      fetch(`/api/topics/${topicId}`)
        .then((response) => response.json())
        .then((data) => {
          setTopic({
            categoryStr: data.categoryStr,
            title: data.title,
            content: data.content,
            hashtags: data.hashtags,
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [topicId]);

  // 폼 제출 처리
  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    // onSubmit을 통해 부모 컴포넌트로 데이터를 전송
    onSubmit(topic)
      .then(() => {
        setLoading(false);
        navigate(`/topic/${topicId ? topicId : 'new'}`); // 성공 시 상세 페이지로 이동
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTopic({
      ...topic,
      [name]: value,
    });
  };

  const handleHashtagChange = (event) => {
    const { value } = event.target;
    setTopic({
      ...topic,
      hashtags: value.split(',').map((tag) => tag.trim()),
    });
  };

  return (
    <div className="post-form">
      <h2>{topicId ? 'Edit Post' : 'Create New Post'}</h2>
      <form onSubmit={handleSubmit}>
        {/* 카테고리 */}
        <div>
          <label htmlFor="categoryStr">Category</label>
          <input
            type="text"
            id="categoryStr"
            name="categoryStr"
            value={topic.categoryStr}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* 제목 */}
        <div>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={topic.title}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* 본문 */}
        <div>
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={topic.content}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        {/* 해시태그 */}
        <div>
          <label htmlFor="hashtags">Hashtags (comma separated)</label>
          <input
            type="text"
            id="hashtags"
            name="hashtags"
            value={topic.hashtags.join(', ')}
            onChange={handleHashtagChange}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save Post'}
        </button>
      </form>
    </div>
  );
}

export default PostForm;
