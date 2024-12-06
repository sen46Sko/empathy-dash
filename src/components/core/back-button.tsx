import React from 'react';
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/system';

interface BackButtonProps {
  onClick: () => void,
}

const BackButton: React.FC<BackButtonProps> = ({onClick}) => {

  return (
    <Stack
      spacing={0.3}
      display='flex'
      flexDirection='row'
      sx={{
        color: 'text.secondary',
        border: '1px solid transparent',
        "&:hover": {
          borderColor: 'text.secondary',
          transition: 'all 0.2s',
          color: 'text.primary',
          cursor: 'pointer',
        },
        pr: 1,
        borderRadius: 0.5,
      }}
      onClick={onClick}
    >
      <KeyboardArrowLeftRoundedIcon sx={{color: 'inherit'}}/>
      <Typography color='inherit' component='p'>Back</Typography>
    </Stack>
  );
};

export default BackButton;
