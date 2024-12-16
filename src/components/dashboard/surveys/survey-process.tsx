'use client';
import React, { useEffect } from 'react';
import { useUserSurvey } from '@/hooks/use-user-survey';
import { useParams } from 'next/navigation';
import { Box } from '@mui/system';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import SurveyProcess from '@/components/dashboard/surveys/survey-process';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const ClientSurveyBlock:React.FC = () => {
  const params = useParams();
  const id = params?.id;
  const { fetchSurvey, surveyData, isLoading } = useUserSurvey();
  
  useEffect(() => {
    fetchSurvey(id as string);
  }, []);
  
  return (
    <Box>
      {isLoading ? (
        <Box
          sx={{
            height: '100vh',
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
              display: "flex",
              flexDirection: "column",
              height: "100vh",
              // maxWidth: 'var(--Content-maxWidth)',
              // width: 'var(--Content-width)',
            }}
          >
            {surveyData ? (
              <>
                {surveyData?.SurveyInvite[0]?.status !== 'complete' ? (
                  <SurveyProcess/>
                ) : (
                  <Box sx={{flexGrow: 1, alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column'}}>
                    <CheckCircleIcon sx={{fontSize: '6rem'}}/>
                    <Typography
                      sx={{
                        fontSize: '2rem',
                        textAlign: 'center',
                      }}
                    >
                      This survey has already been completed!
                    </Typography>
                    <Typography
                      sx={{
                        color: 'text.secondary',
                        textAlign: 'center',
                      }}
                    >
                      Thank you for your time and participation.
                    </Typography>
                  </Box>
                )}
              </>
            ) : null}
          </Box>
        </>
      )}
    
    </Box>
  );
};

export default ClientSurveyBlock;
