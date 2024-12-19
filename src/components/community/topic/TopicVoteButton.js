import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { Snackbar } from '@mui/material';
import { Grow } from '@mui/material';

import { useUser } from '../../contexts/UserContext';
import useFetchGetVote from './useFetchGetVote';
import useFetchAddVote from './useFetchAddVote';
import LoginModal from '../../common/modal/LoginModal';

import "../../../styles/Main.css";
import "../../../styles/community/Comment.css";


const TopicVoteButton = ({ topicId, voteCount, isLike }) => {

  const { userId } = useUser();

  const { fetchGetVote, loading: loadingGet/*, error: errorGet*/ } = useFetchGetVote();
  const { fetchAddVote, loading: loadingAdd/*, error: errorAdd*/ } = useFetchAddVote();
  
  const [loading, setLoading] = useState(false);
  const [votedMessage, setVotedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [votedCount, setVotedCount] = useState(voteCount);
  const [isVoted, setIsVoted] = useState(false);

  const [vote] = useState({
    "userId": userId || '',
    "targetTopicId": topicId,
    "isLike": isLike
  });


  useEffect(() => { 
    const fetchVote = async () => {
      const aleadyVoted = await fetchGetVote(vote);
      setIsVoted(aleadyVoted);
    }
    fetchVote();
  }, [fetchGetVote, vote]);

  
  // 버튼 클릭 시 처리
  const voteTopic = async () => {
    //로그인 검사
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);
    
    if (isVoted) {
      setVotedMessage(true);
      setLoading(false);
    }
    else {
      fetchAddVote(vote)
        .then(() => {
          setIsVoted(true);
          setVotedCount(votedCount + 1);
        })
        .catch((err) => {
          console.log(err);
          setErrorMessage(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };


  return (

    <div>

      <Button
        className='topic-vote-button'
        onClick={() => voteTopic()}
        disabled={loading || loadingGet || loadingAdd}
      > 
        { isLike ? 
          <><FaThumbsUp/> 좋아요</>
        : <><FaThumbsDown/> 싫어요</>
        }
        <br/>
        ( { voteCount < 1000 ?
            voteCount
          : '999+' } ) 
      </Button>


      <Snackbar
        open={votedMessage}
        TransitionComponent={Grow}
        message={ '이미 ' + (isLike ? '좋아요' : '싫어요') + ' 한 게시글 입니다' }
        autoHideDuration={1200}
        onClose={() => setVotedMessage(false)}
      />

      <Snackbar
        open={errorMessage}
        TransitionComponent={Grow}
        message={'vote fetch error'}
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

export default TopicVoteButton;
