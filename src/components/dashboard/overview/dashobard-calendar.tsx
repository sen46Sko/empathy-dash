'use client';
import React, { useState } from 'react';
import { DateCalendar } from '@mui/x-date-pickers';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import Card from '@mui/material/Card';
import CalendarHeader from '@/components/dashboard/overview/calendar-header';
import { LocalizationProvider } from '@/components/core/localization-provider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Divider from '@mui/material/Divider';
import CalendarForm from '@/components/dashboard/overview/calendar-form';

const DashboardCalendar:React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Dayjs>(dayjs(new Date()));
  
  const handleNextMonth = () => {
    setCurrentDate((prev) => prev.add(1, 'month'));
  };
  
  const handlePreviousMonth = () => {
    setCurrentDate((prev) => prev.subtract(1, 'month'));
  };
  
  const formatDayOfWeek = (day: string) => {
    const dateObj: Record<string, string> = {
      Su: 'Sun',
      Mo: 'Mon',
      Tu: 'Tue',
      We: 'Wed',
      Th: 'Thu',
      Fi: 'Fri',
      Sa: 'Sat'
    };
    
    return dateObj[day] || day.slice(0,3);
  };

  
  return (
    <Card sx={{padding: 2}}>
      <LocalizationProvider>
      <DateCalendar
        dayOfWeekFormatter={formatDayOfWeek}
        onChange={(newDate: Dayjs) => {
          setCurrentDate(newDate);
        }}
        slotProps={{
          day: (day) => ({
            sx: {
              backgroundColor: day.selected ? '#1976d2' : 'transparent',
              color: day.selected ? '#fff' : 'inherit',
              '&:hover': {
                backgroundColor: day.selected ? '#1565c0' : '#e0e0e0',
              },
            },
          }),
        }}
        slots={{
          calendarHeader: (props) => (
            <CalendarHeader
              {...props}
              current={currentDate.toDate()}
              onLeft={handlePreviousMonth}
              onRight={handleNextMonth}
            />
          ),
        }}
        sx={{
          width: '220px',
          '@media (max-width: 900)': {
            width: '220px',
          },
          '@media (min-width: 1440px)': {
            width: '290px',
          }
        }}
        value={currentDate}
      />
      </LocalizationProvider>
      
      <Box display='flex' justifyContent='center' pb={2} pt={2}>
        <Box alignItems='center' display='flex' sx={{cursor: 'pointer'}}>
          <Typography fontWeight={500} mr={2}>All Events</Typography>
          <ArrowForwardIcon/>
        </Box>
      </Box>
      
      <Divider/>
      
      <Box>
        <CalendarForm/>
      </Box>
    </Card>
  );
};

export default DashboardCalendar;
