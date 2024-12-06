import * as React from 'react';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

export default function DeletableChips() {
  const handleDelete = () => {
    console.info('You clicked the delete icon.');
  };

  return (
    <Stack direction="row" spacing={1}>
      <Chip label="삭제" onDelete={handleDelete} />
      <Chip label="Delete" variant="outlined" onDelete={handleDelete} />
    </Stack>
  );
}