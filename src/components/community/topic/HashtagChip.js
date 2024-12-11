import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const HashtagChip = ({ items, removeItem }) => {

  const handleRemoveItem = (item) => {
    removeItem(item);  // 부모에서 전달된 removeItem 함수 호출
  };

  return (

    <Stack direction="row" spacing={1} flexWrap="wrap">
      {items.map((item, index) => (
        <Chip
          key={index}
          label={item}
          variant="outlined"
          onDelete={() => handleRemoveItem(item)}
          style={{ marginBottom: 10 }} // 각 Chip에 아래 여백 추가
        />
      ))}
    </Stack>

  );

}

export default HashtagChip;