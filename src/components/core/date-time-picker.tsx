import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { useSettings } from '@/hooks/use-settings';

interface DateTimePickerProps {
  value: Date | null,
  error: string | undefined,
  onChange: (date: Dayjs | null | Date) => void,
}

const CustomDateTimePicker: React.FC<DateTimePickerProps> = ({error, value, onChange }) => {
  const { settings } = useSettings();
  
  const [isOpen, setOpen] = useState(false);
  
  const handleClick = () => {
    setOpen(true); // Open the MobileDateTimePicker modal
  };
  
  const handleClose = () => {
    setOpen(false); // Close the MobileDateTimePicker modal
  };
  
  const handleChange = (val: Dayjs | null | Date) => {
    onChange(val);
  }
  
  return (
    <Box>
      <Box alignItems='center' display='flex' justifyContent='space-between' mb={1}>
        <Typography color={error ? 'var(--mui-palette-error-main)' : 'unset'}>Date</Typography>
        <Typography color={error ? 'var(--mui-palette-error-main)' : 'unset'}>Time</Typography>
      </Box>
      <Box
        onClick={handleClick}
        sx={{
          height: '42px',
          backgroundColor: 'var(--mui-palette-FilledInput-bg)',
          cursor: 'pointer',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: 'var(--mui-palette-FilledInput-hoverBg)' // Change color on hover
          }
      }}
      >
        {!value ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '5px 12px',
              justifyContent: 'space-between',
            }}
          >
            <Typography color={settings.colorScheme === 'light' ? '#667085' : '#9fa6ad'}>MM/DD</Typography>
            <Box
              sx={{
                borderLeft: '1px solid #9fa6ad',
                paddingLeft: '8px',
              }}
            >
              <Typography color={settings.colorScheme === 'light' ? '#667085' : '#9fa6ad'}>12:00</Typography>
            </Box>
          </Box>
          ) : (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              padding: '5px 12px',
              justifyContent: 'space-between',
            }}
          >
            <Typography color='text.primary'>{dayjs(new Date(value)).format('MM/DD')}</Typography>
            <Box
              sx={{
                borderLeft: '1px solid #9fa6ad',
                paddingLeft: '8px',
              }}
            >
              <Typography color='text.primary'>{dayjs(new Date(value)).format('HH:mm')}</Typography>
            </Box>
          </Box>
        )}
      </Box>
      <MobileDateTimePicker
        defaultValue={dayjs('2022-04-17T15:30')}
        onChange={handleChange}
        onClose={handleClose}
        open={isOpen}
        sx={{
        position: 'absolute',
        zIndex: -1,
      }}/>
    </Box>
  );
};

export default CustomDateTimePicker;
