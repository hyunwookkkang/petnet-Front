import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaThumbsUp } from 'react-icons/fa';
import { Snackbar } from '@mui/material';
import { Grow } from '@mui/material';

import { useUser } from '../../contexts/UserContext';
import useFetchGetVote from './useFetchGetVote';
import useFetchAddVote from './useFetchAddVote';

const TopicVoteButton = ({ topicId, voteCount, isLike }) => {

  const navigate = useNavigate();

  const { userId } = useUser();

  const { fetchGetVote, loading: loadingGet, error: errorGet } = useFetchGetVote();
  const { fetchAddVote, loading: loadingAdd, error: errorAdd } = useFetchAddVote();
  
  const [loading, setLoading] = useState(false);
  const [votedMessage, setVotedMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const [votedCount, setVotedCount] = useState(voteCount);
  const [isVoted, setIsVoted] = useState(false);
  const [vote, setVote] = useState({
    "userId": userId || '',
    "targetTopicId": topicId,
    "isLike": isLike
  });

  useEffect(() => {
    setVote({
      "userId": userId || '',
      "targetTopicId": topicId,
      "isLike": isLike
    });
  }, [userId, topicId, isLike]);

  useEffect(() => {   
    const fetchVote = async () => {
      const aleadyVoted = await fetchGetVote(vote);
      setIsVoted(aleadyVoted);
    }
    fetchVote();
  }, [fetchGetVote, vote]);

  // 좋아요 버튼 클릭 시 처리
  const voteTopic = async () => {
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login"); // 로그인 페이지로 리다이렉트
      return;
    }

    setLoading(true);
    try {
      if (isVoted) {
        setVotedMessage(true);
      }
      else {
        fetchAddVote(vote);
        if (errorGet || errorAdd) {
          setErrorMessage(true);
        } else {
          setVotedCount(votedCount + 1);
          setIsVoted(true);
        }
      }
    } 
    catch(err) {
      console.log(err);
    }
    finally{
      setLoading(false);
    }
  };

  return (

    <div>

        <button 
          onClick={() => voteTopic()}
          disabled={loading || loadingGet || loadingAdd}
        > 
          <FaThumbsUp/> 
          {isLike ? ' 좋아요 ' : ' 싫어요 '} 
          ({votedCount}) 
        </button>

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

    </div>

  );

};

export default TopicVoteButton;
