import React from 'react';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

interface CalendarHeaderProps {
  current: Date,
  onLeft: () => void,
  onRight: () => void,
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({onRight, onLeft, current}) => {
  return (
    <Box display='flex' alignItems='center' gap={1} justifyContent='center' pt={2} pb={3}>
      <ChevronLeftIcon onClick={onLeft} style={{color: '#667085', cursor: 'pointer'}}/>
        <Box>
          <Typography sx={{fontWeight: 600}}>
            {dayjs(current).format('MMMM YYYY')}
          </Typography>
        </Box>
      <ChevronRightIcon onClick={onRight} style={{color: '#667085', cursor: 'pointer'}}/>
    </Box>
  );
};

export default CalendarHeader;
