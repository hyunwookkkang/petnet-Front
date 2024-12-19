import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

function LikeButton() {
  const [liked, setLiked] = useState(false);

  // 좋아요 상태 토글 함수
  const handleLikeToggle = () => {
    setLiked(!liked);
  };

  return (
    <div style={{ cursor: "pointer"}}>
        <IconButton onClick={handleLikeToggle}>
        <FavoriteIcon
          color={liked ? 'error' : 'disabled'} // 좋아요 여부에 따라 색상 변경
        />
      </IconButton>
    </div>
      
    
  );
}

export default LikeButton;
