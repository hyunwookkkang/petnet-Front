import React, { useState } from 'react';
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
  
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [votedCount, setVotedCount] = useState(voteCount);

  const [vote, setVote] = useState({
    'userId': '',
    'topicId': '',
    'isLike': ''
  });

  // 좋아요 버튼 클릭 시 처리
  const voteTopic = async () => {
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login"); // 로그인 페이지로 리다이렉트
      return;
    }

    setVote({
      'userId': userId,
      'topicId': topicId,
      'isLike': isLike
    })

    try {
      const aleadyVoted = await fetchGetVote(vote);
      if (aleadyVoted) {
        setSnackbarOpen(true);
      }
      else {
        fetchAddVote(vote);
        setVotedCount(votedCount + 1);
      }
    } 
    catch(err) {
      console.log(err);
    }
  };

  return (

    <div>

        <button 
          onClick={() => voteTopic()}
          disabled={loadingGet || loadingAdd}
        > 
          <FaThumbsUp/> 
          {isLike ? ' 좋아요 ' : ' 싫어요 '} 
          ({votedCount}) 
        </button>

        <Snackbar
          open={snackbarOpen}
          TransitionComponent={Grow}
          message={ '이미 ' + (isLike ? '좋아요' : '싫어요') + ' 한 게시글 입니다' }
          autoHideDuration={1200}
        />

        <Snackbar
          open={errorGet || errorAdd}
          TransitionComponent={Grow}
          message="vote fetch error"
          autoHideDuration={1200}
        />

    </div>

  );

};

export default TopicVoteButton;
