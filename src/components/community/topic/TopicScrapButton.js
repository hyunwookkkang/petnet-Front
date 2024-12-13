import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { Snackbar } from '@mui/material';
import { Grow } from '@mui/material';

import { useUser } from '../../contexts/UserContext';
import useFetchGetScrap from './useFetchGetScrap';
import useFetchAddScrap from './useFetchAddScrap';
import useFetchDeleteScrap from './useFetchDeleteScrap';

const TopicScrapButton = ({ topicId }) => {

  const navigate = useNavigate();

  const { userId } = useUser();

  const { fetchGetScrap, loading: loadingGet/*, error: errorGet*/ } = useFetchGetScrap();
  const { fetchAddScrap, loading: loadingAdd/*, error: errorAdd*/ } = useFetchAddScrap();
  const { fetchDeleteScrap, loading: loadingDel/*, error: errorDel*/ } = useFetchDeleteScrap();
  
  const [loading, setLoading] = useState(false);
  const [sracpMessage, setScrapMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const [isScrap, setIsScrap] = useState(false);

  useEffect(() => {   
    const fetchScrap = async () => {
      const aleadyScrap = await fetchGetScrap(userId, topicId);
      setIsScrap(aleadyScrap);
    }
    fetchScrap();
  }, [fetchGetScrap, userId, topicId]);

  // 스크랩 버튼 클릭 시 처리
  const scrapTopic = async () => {
    if (!userId) {
      alert("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      navigate("/login"); // 로그인 페이지로 리다이렉트
      return;
    }

    setLoading(true);

    // scrap <=> unscrap
    const fetchScrap = isScrap ? fetchDeleteScrap : fetchAddScrap;    

    fetchScrap(userId, topicId)
      .then(() => {
        setIsScrap(!isScrap);
        setScrapMessage(true);
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (

    <div>

        <button 
          onClick={() => scrapTopic()}
          disabled={loading || loadingGet || loadingAdd || loadingDel}
        > 
          { isScrap ? (
            <><FaBookmark/> 스크랩 취소 </>
          ) : (
            <><FaRegBookmark/> 스크랩 </>
          )} 
        </button>

        <Snackbar
          open={sracpMessage}
          TransitionComponent={Grow}
          message={ '게시글이 스크랩 ' + (isScrap ? '' : '취소') + ' 되었습니다' }
          autoHideDuration={1200}
          onClose={() => setScrapMessage(false)}
        />

        <Snackbar
          open={errorMessage}
          TransitionComponent={Grow}
          message={'fetch scrap error'}
          autoHideDuration={1200}
          onClose={() => setErrorMessage(false)}
        />

    </div>

  );

};

export default TopicScrapButton;