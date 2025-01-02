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
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import Card from '@mui/material/Card';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';

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
          <SendSurveyModal id={id as string} onClose={closeModal} sendModeValue={sendMode}/>
        ) : null
      }
      
      
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
            {isLoading ? <Box
              sx={{
                display: 'flex',
              }}
            >
              <Box sx={{width: 150, height: 48, paddingTop: 1, paddingBottom: 1}}><Skeleton style={{height: 32}}/></Box>
            </Box> : <Typography sx={{ fontSize: 32 }}>{surveyDetails?.name}</Typography>}
          </Box>
          <Box>
            <Box display='flex' gap={2} justifyContent='center'>
              <CustomButton disabled={isLoading} endIcon={<SendIcon/>} onClick={() => {openModal('now')}} sx={{height: 42}} text='Send' type="button"/>
              <CustomButton disabled={isLoading} endIcon={<CalendarIcon/>} onClick={() => {openModal('schedule')}} sx={{height: 42}} text='Schedule Survey' type="button" variant='outlined'/>
            </Box>
          </Box>
        </Box>
        <Box>
          {!isLoading && surveyDetails?.SurveyResult.map((item, index) => {
            return (<SurveyUserResponseLine key={index} line={item}/>)
          })}
          
          {isLoading ? <>
              {[1,2,3].map((item) => {
                return (
                  <Card key={`${item}-index`} sx={{mt: 3, p: 1.4, display: 'flex', justifyContent: 'space-between'}}>
                    <Box>
                      <Skeleton style={{fontSize: 12, lineHeight: 1, width: 100, margin: 0}}/>
                      <Skeleton style={{height: 12, width: 50, margin: 0}}/>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <KeyboardArrowDownRoundedIcon
                        sx={{
                          transform: 'rotate(0deg)',
                          transition: 'transform 0.3s ease',
                          color: 'text.secondary',
                        }}
                      />
                    </Box>
                  </Card>
                )
              })}
            </> : null}
        </Box>
      </>
    
    </Box>
  );
};

export default SurveyDetails;
