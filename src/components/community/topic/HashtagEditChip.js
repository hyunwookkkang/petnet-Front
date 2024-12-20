import React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';


const HashtagEditChip = ({ items, removeItem }) => {

  return (

    <Stack direction="row" spacing={1} flexWrap="wrap">
      {items.map((item, index) => (
        <Chip
          key={index}
          label={item}
          variant="outlined"
          onDelete={() => removeItem(item)}
          style={{ marginBottom: 10 }} // 각 Chip에 아래 여백 추가
        />
      ))}
    </Stack>

  );

}

export default HashtagEditChip;