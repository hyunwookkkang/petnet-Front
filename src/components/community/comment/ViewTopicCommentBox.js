import React, { useState } from "react";

import LoginModal from "../../common/modal/LoginModal";
import CommentAddModal from "./CommentAddModal";
import ViewTopicComments from "./ViewTopicComments";

import { useUser } from "../../contexts/UserContext";

import "../../../styles/Main.css";
import "../../../styles/community/Comment.css";


const ViewTopicCommentBox = ({targetTopic}) => {

  const { userId } = useUser(); // 사용자 ID 가져오기

  const [comments, setComments] = useState([]);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);


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
      <span className="comment-count">댓글 ({targetTopic.commentCount})</span>
      <button 
        className="view-comments-button" 
        onClick={() => addCommentHandler(null)}
      >
        댓글 쓰기
      </button>
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

export default ViewTopicCommentBox;
