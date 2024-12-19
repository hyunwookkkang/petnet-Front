import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

import { useUser } from "../../contexts/UserContext";
import LoginModal from "../../common/modal/LoginModal";
import CommentAddModal from "./CommentAddModal";
import ViewTopicComments from "./ViewTopicComments";

import "../../../styles/Main.css";
import "../../../styles/community/Comment.css";


const ViewTopicCommentsBox = ({targetTopic}) => {

  const { userId } = useUser(); // 사용자 ID 가져오기

  const [comments, setComments] = useState([]);
  const [commentCnt, setCommentCnt] = useState(targetTopic.commentCount);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);


  // 댓글 갯수 갱신
  useEffect(() => {
    setCommentCnt(comments.length);
  }, [comments]);


  // 댓글 등록 버튼 클릭 시 처리
  const addCommentHandler = () => {
    // 로그인 검사
    if (!userId) {
      setShowLoginModal(true);
      return;
    }
    setShowAddModal(true);
  }
  

  const CommentsHeader = () => (
    <div className="topic-comments-bar">

      <div className="comment-count">
        <p>댓글</p>
        <p>
          { commentCnt < 10000 ? 
            commentCnt
          : '9999+' }
        </p>
      </div>
      
      <Button 
        variant='light'
        className="add-comment-button" 
        onClick={() => addCommentHandler(null)}
      >
        댓글달기
      </Button>

    </div>
  );


  return (

    <div>
      
      <CommentsHeader />

      <ViewTopicComments 
        targetTopic={targetTopic}
        targetComment={null}
        comments={comments}
        setComments={setComments}
      />


      <CommentAddModal
        showModal={showAddModal}
        setShowModal={setShowAddModal}
        targetTopic={targetTopic}
        targetComment={null}
        setComments={setComments}
      />

      <LoginModal 
        showModal={showLoginModal} 
        setShowModal={setShowLoginModal}
      />

    </div>

  );

}

export default ViewTopicCommentsBox;
