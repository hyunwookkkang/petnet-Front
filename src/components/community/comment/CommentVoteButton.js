import React, { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { Snackbar } from '@mui/material';
import { Grow } from '@mui/material';

import LoginModal from '../../common/modal/LoginModal';

import { useUser } from '../../contexts/UserContext';
import useFetchGetVote from '../topic/useFetchGetVote';
import useFetchAddVote from '../topic/useFetchAddVote';
import useFetchDeleteVote from '../useFetchDeleteVote';

import "../../../styles/Main.css";
import "../../../styles/community/Comment.css";


const CommentVoteButton = ({ commentId, setLikeCount }) => {

  const { userId } = useUser();
  const { fetchGetVote, loading: getLoading } = useFetchGetVote();
  const { fetchAddVote, loading: addLoading } = useFetchAddVote();
  const { fetchDeleteVote, loading: deleteLoading } = useFetchDeleteVote();
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [isVoted, setIsVoted] = useState(false);

  const [vote] = useState({
    "userId": userId || '',
    "targetCommentId": commentId,
    "isLike": true
  });


  useEffect(() => {   
    const fetchVote = async () => {
      const resVote = await fetchGetVote(vote);
      setIsVoted(resVote);
    }
    fetchVote();
  }, [fetchGetVote, vote]);


  // 버튼 클릭 시 처리
  const voteCommentHandler = async () => {
    // 로그인 검사
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);

    // voted <=> unvoted
    const fetchScrap = isVoted ? fetchDeleteVote : fetchAddVote; 
    const modifyValue = isVoted ? (-1) : (+1);
    try {
      await fetchScrap(vote);
      setIsVoted(!isVoted);
      setLikeCount((prevCount) => (prevCount + modifyValue));
    } 
    catch(err) {
      console.log(err);
      setErrorMessage(true);
    }
    finally {
      setLoading(false);
    }
  };

  return (

    <div>

        <button 
          onClick={() => voteCommentHandler()}
          disabled={ loading || getLoading || addLoading || deleteLoading }
          style={{ all: 'unset' }}
        > 
          { isVoted ? (
            <FaHeart style={{ color: '#FF6347' }} />
          ) : (
            <FaRegHeart/> 
          )} 
        </button>


        <Snackbar
          open={errorMessage}
          TransitionComponent={Grow}
          message={'fetch like vote error'}
          autoHideDuration={1200}
          onClose={() => setErrorMessage(false)}
        />

        <LoginModal 
          showModal={showLoginModal} 
          setShowModal={setShowLoginModal}
        />

    </div>

  );

};

export default CommentVoteButton;
