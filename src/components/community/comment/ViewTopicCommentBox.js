import React, { useEffect, useState } from "react";

import ViewTopicCommentInfo from "./ViewTopicCommentInfo";
import ViewTopicComments from "./ViewTopicComments";


const ViewTopicCommentBox = ({comment, setComments}) => {

  const [reComments, setReComments] = useState([]);
  const [reCommentCount, setReCommentCount] = useState(comment.reCommentCount);


  // 답글 갯수 갱신
  useEffect(() => {
    setReCommentCount(reComments.length);
  }, [reComments]);


  return (

    <div className={ comment.targetComment ? 're-comment' : 'comment' }> 
      
      <ViewTopicCommentInfo 
        comment={comment}
        setComments={setComments}
        setReComments={setReComments}
        reCommentCount={reCommentCount}
      />

      {(comment.reCommentCount + reCommentCount > 0) ? (
        <ViewTopicComments 
          targetTopic={null}
          targetComment={comment}
          comments={reComments}
          setComments={setReComments}
        />
      ) : '' }

    </div>

  );

}

export default ViewTopicCommentBox;
