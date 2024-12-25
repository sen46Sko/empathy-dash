'use client';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { useParams, useRouter } from 'next/navigation';
import { useSurveys } from '@/hooks/use-surveys';
import CircularProgress from '@mui/material/CircularProgress';
import BackButton from '@/components/core/back-button';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import CustomButton from '@/components/core/custom-button';
import { CalendarIcon } from '@mui/x-date-pickers';
import SurveyUserResponseLine from '@/components/dashboard/surveys/survey-user-response-line';
import SendSurveyModal from '@/components/dashboard/surveys/send-survey-modal';
import { useClients } from '@/hooks/use-clients';

const SurveyDetails: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { fetchSurveyDetailsById, surveyDetails, isLoading } = useSurveys();
  const { fetchClientsList, clientsList } = useClients();
  const [isSendOpen, setOpen] = useState(false);
  const [sendMode, setSendMode] = useState<'now' | 'schedule'>('now')
  const rootRef = React.useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (id) {
      fetchSurveyDetailsById(Number(id as string));
    }
    
    if (!clientsList.length) {
      fetchClientsList()
    }
  }, []);
  
  const openModal = (mode: 'now' | 'schedule') => {
    setOpen(true);
    setSendMode(mode)
  }
  
  const closeModal = () => {
    setOpen(false);
  }
  
  const handleGoBack = () => {
    router.back();
  }
  
  return (
    <Box>
      {
        isSendOpen ? (
          <SendSurveyModal sendModeValue={sendMode} onClose={closeModal} id={id as string}/>
        ) : null
      }
      
      
      {isLoading ? (
        <Box
          sx={{
            height: '100vh - 64px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size="30px" />
        </Box>
      ) : (
        <>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
            <Box
              sx={{
                flexBasis: '50%',
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <BackButton onClick={handleGoBack}/>
              </Box>
              <Typography sx={{ fontSize: 32 }}>{surveyDetails?.name}</Typography>
            </Box>
          <Box>
            <Box display='flex' gap={2} justifyContent='center'>
              <CustomButton disabled={false} endIcon={<SendIcon/>} onClick={() => {openModal('now')}} sx={{height: 42}} text='Send' type="button"/>
              <CustomButton disabled={false} endIcon={<CalendarIcon/>} onClick={() => {openModal('schedule')}} sx={{height: 42}} text='Schedule Survey' type="button" variant='outlined'/>
            </Box>
          </Box>
        </Box>
        <Box>
          {surveyDetails?.SurveyResult.map((item, index) => {
            return (<SurveyUserResponseLine line={item} key={index}/>)
          })}
        </Box>
        </>
      )}
    
    </Box>
  );
};

export default SurveyDetails;
