'use client';
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { useParams, useRouter } from 'next/navigation';
import SurveyForm from '@/components/dashboard/surveys/survey-form';
import { useSurveys } from '@/hooks/use-surveys';
import CircularProgress from '@mui/material/CircularProgress';
import SurveyCreateComplete from '@/components/dashboard/surveys/survey-create-complete';

interface CreateSurveyProps {
  isEdit?: boolean,
}

const CreateSurveyWrapper: React.FC<CreateSurveyProps> = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { fetchSurveyById, isLoading, isSuccess } = useSurveys();
  
  useEffect(() => {
    if (id ) {
      fetchSurveyById(Number(id));
    }
  }, [id]);
  
  return (
    <Box sx={{display: 'flex', flexGrow: 1, flexDirection: 'column', position: 'relative', pt: 3, pb: 2, justifyContent: 'space-between'}}>
      {
        isSuccess ? (
          <SurveyCreateComplete/>
          ) : (
          <>
            {id ? isLoading ? (
              <Box
                sx={{
                  flexGrow: 1,
                  position: 'relative',
                  height: '100%',
                }}
              >
                <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)'}}>
                  <CircularProgress />
                </Box>
              </Box>
            ) : <SurveyForm/> : null}
            {!id ? <SurveyForm/> : null}
          </>
        )
      }
    </Box>
  );
};

export default CreateSurveyWrapper;
