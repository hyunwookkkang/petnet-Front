import React, { useEffect } from "react";

import ViewTopicCommentBox from "./ViewTopicCommentBox";

import useFetchGetTopicComments from "./useFetchGetTopicComments";
import useFetchGetReComments from "./useFetchGetReComments";


const ViewTopicComments = ({targetTopic, targetComment, comments, setComments}) => {

  const { fetchGetTopicComments, loading: tcLoading, error: tcError } = useFetchGetTopicComments();
  const { fetchGetReComments, loading: rcLoading, error: rcError } = useFetchGetReComments();


  // 페이지 초기화
  useEffect(() => {
    // 댓글 or 답글 호출 구분
    const fetchGetComments = targetComment 
      ? fetchGetReComments(targetComment.commentId)
      : fetchGetTopicComments(targetTopic.topicId);

    const fetchGetCommentsHandler = async () => {
      const response = await fetchGetComments;
      setComments(response || []);
    };
    fetchGetCommentsHandler();

  }, [targetTopic, targetComment, setComments, fetchGetTopicComments, fetchGetReComments]);


  const commentsView = comments.map((comment) => (
    <ViewTopicCommentBox 
      key={comment.commentId}
      comment={comment}
      setComments={setComments}
    />
  ));
  

  // 로딩 중일 때 표시할 메시지
  if (tcLoading || rcLoading) {
    return <div>Loading...</div>;
  }

  // 에러가 발생했을 때 표시할 메시지
  if (tcError || rcError) {
    return <div>Error: { tcError || rcError }</div>;
  }


  return (

    <div>

      <ul>
        { commentsView }
      </ul>

    </div>

  );

}

export default ViewTopicComments;
