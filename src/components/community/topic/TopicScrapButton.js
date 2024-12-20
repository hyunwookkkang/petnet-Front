import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { Snackbar } from '@mui/material';
import { Grow } from '@mui/material';

import LoginModal from '../../common/modal/LoginModal';

import { useUser } from '../../contexts/UserContext';
import useFetchGetScrap from './useFetchGetScrap';
import useFetchAddScrap from './useFetchAddScrap';
import useFetchDeleteScrap from './useFetchDeleteScrap';

import '../../../styles/community/TopicButton.css'


const TopicScrapButton = ({ topicId }) => {

  const { userId } = useUser();

  const { fetchGetScrap, loading: loadingGet/*, error: errorGet*/ } = useFetchGetScrap();
  const { fetchAddScrap, loading: loadingAdd/*, error: errorAdd*/ } = useFetchAddScrap();
  const { fetchDeleteScrap, loading: loadingDel/*, error: errorDel*/ } = useFetchDeleteScrap();
  
  const [loading, setLoading] = useState(false);
  const [sracpMessage, setScrapMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [isScrap, setIsScrap] = useState(false);


  useEffect(() => {   
    const fetchScrap = async () => {
      const aleadyScrap = await fetchGetScrap(userId, topicId);
      setIsScrap(aleadyScrap);
    }
    fetchScrap();
  }, [fetchGetScrap, userId, topicId]);


  // 스크랩 버튼 클릭 시 처리
  const scrapTopicHandler = async () => {
    // 로그인 검사
    if (!userId) {
      setShowLoginModal(true);
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

        <Button 
          variant="link"
          className='scrap-button'
          onClick={() => scrapTopicHandler()}
          disabled={loading || loadingGet || loadingAdd || loadingDel}
        > 
          { isScrap ?
            <FaBookmark/>
          : <FaRegBookmark/>
          }
        </Button>


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

        <LoginModal 
          showModal={showLoginModal} 
          setShowModal={setShowLoginModal}
        />

    </div>

  );

};

export default TopicScrapButton;
