'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/system';
import { useUserSurvey } from '@/hooks/use-user-survey';
import Typography from '@mui/material/Typography';
import type { CustomThemeType } from '@/styles/theme/types';
import SurveyQuestion from '@/components/dashboard/surveys/survey-question';
import { useParams } from 'next/navigation';

const SurveyProcess:React.FC = () => {
  const { surveyData, postSurveyResponse } = useUserSurvey()
  const survey = surveyData!;
  const params = useParams();
  const id = params?.id;
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>(Array(survey.questions.length).fill(''))
  const progress = useMemo(() => {
    const res = (currentStep / survey?.questions.length) * 100;
    
    if (res >= 100) {
      return 100;
    }
    
    return res;
  }, [currentStep]);
  
  const handleNextStep = () => {
    if (currentStep >= survey.questions.length - 1) {
      postSurveyResponse(survey.questions, answers, id as string);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }
  
  return (
    <Box>
      
      <Box
        sx={{
          pt: 4,
          pb: 1,
        }}
      >
        <Typography sx={{ mb: 1, fontSize: '2rem', fw: 500, textAlign: 'center' }}>{`Questionnaire: ${survey.name}`}</Typography>
      </Box>
      
      <Box
        sx={{
          height: 10,
        }}
      >
        <Box
          sx={(theme) => {
            return {
              height: 10,
              backgroundColor: (theme as CustomThemeType).palette.primary.main,
              transition: 'all 0.2s',
              width: `${progress}%`,
            }
          }}
        />
      </Box>
      
      <Box
        sx={{
          m: 'var(--Content-margin)',
          p: 'var(--Content-padding)',
        }}
      >
        {survey.questions[currentStep] ? <SurveyQuestion
          index={currentStep}
          question={survey.questions[currentStep]}
          setAnswers={setAnswers}
          onNext={handleNextStep}
          answers={answers}
        /> : null}
      </Box>
    </Box>
  );
};

export default SurveyProcess;
