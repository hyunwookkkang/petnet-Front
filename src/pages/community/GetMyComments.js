import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

import LoginModal from "../../components/common/modal/LoginModal";
import ViewMyCommentInfo from "../../components/community/comment/ViewMyCommentInfo";

import { useUser } from "../../components/contexts/UserContext";
import useFetchGetMyComments from "../../components/community/comment/useFetchGetMyComments";

import "../../styles/Main.css"; // 기존 스타일 재사용


const GetMyComments = () => {

  const { userId } = useUser(); // 사용자 ID 가져오기
  const { fetchGetMyComments, error } = useFetchGetMyComments();

  const [showLoginModal, setShowLoginModal] = useState(false);

  const [comments, setComments] = useState([]);


  useEffect(() => {
    // 로그인 검사
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    const fetchComments = async () => {
      const response = await fetchGetMyComments(userId);
      setComments(response || []);
    };
    fetchComments();
    
  }, [fetchGetMyComments, userId]);


  const commentsView = comments.map((comment) => (
    <ViewMyCommentInfo 
      key={comment.commentId}
      comment={comment}
      setComments={setComments}
    />
  ));


  // 에러가 발생했을 때 표시할 메시지
  if (error) {
    return <div>Error: {error}</div>;
  }

  
  return (

    <Container>
            
      <h1 style={{ textAlign: "center", margin: "5px" }}>
        내가 쓴 댓글
      </h1>

      <br/>
      
      <div>
        { comments.length === 0 ? (
          <h5 className="community-empty-list">
            아직 작성한 댓글이 없습니다
          </h5>
        ) : (
          <ul style={{ 
            paddingInlineStart: '0',
            borderTop: '1px solid #DCDCDC'
          }}>
            { commentsView }
          </ul>
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

export default GetMyComments;
