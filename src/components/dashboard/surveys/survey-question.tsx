import type { ChangeEvent, Dispatch, SetStateAction} from 'react';
import React from 'react';
import { Box } from '@mui/system';
import type { ClientQuestion } from '@/types/surveys/client-survey.types';
import Typography from '@mui/material/Typography';
import CustomButton from '@/components/core/custom-button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { TextField } from '@mui/material';
import { useUserSurvey } from '@/hooks/use-user-survey';

interface SurveyQuestionProps {
  question: ClientQuestion;
  index: number,
  setAnswers: Dispatch<SetStateAction<string[]>>,
  answers: string[],
  onNext: () => void,
}

const SurveyQuestion: React.FC<SurveyQuestionProps> = ({ question, setAnswers, index, answers, onNext }) => {
  const { isSurveySendLoading } = useUserSurvey();
  
  const handleRadioChange = (
    event: React.SyntheticEvent,
    _: boolean
  ) => {
    setAnswers((prev) =>
      prev.map((item, idx) => {
        if (index === idx) {
          return (event.target as HTMLInputElement).value;
        }
        return item;
      })
    );
  };
  
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setAnswers((prev) =>
      prev.map((item, idx) => {
        if (index === idx) {
          return (event.target as HTMLInputElement).value;
        }
        return item;
      })
    );
  };
  
  return (
    <Box
      alignItems='center'
      display='flex'
      flexDirection='column'
    >
      
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        sx={{
          maxWidth: 500,
          width: '100%',
        }}
      >
        <Typography
          sx={{
            textAlign: 'center',
            fontSize: '1.2rem',
            mb: 2,
          }}
        >
          {question.question}
        </Typography>
        
        
        {question.question_type === 'selection' ? (
            <RadioGroup
              defaultValue={answers[index]}
              sx={{
                '& .MuiFormControlLabel-root': {
                  border: '1px solid var(--mui-palette-divider)',
                  borderRadius: 1,
                  gap: 2,
                  p: 2,
                  width: '100%',
                },
              }}
              value={answers[index]}
            >
              {question.options?.map((option) => {
                return (
                <FormControlLabel
                  key={option}
                  label={
                    <div>
                      <Typography
                        sx={{
                          color: 'var(--mui-palette-text-primary)',
                        }}
                        variant="inherit"
                      >
                        {option}
                      </Typography>
                    </div>
                  }
                  value={option}
                  control={<Radio />}
                  // disabled={option.disabled}
                  onChange={handleRadioChange}
                />
                )
              })}
            </RadioGroup>
        ) : null}
        
        {question.question_type === 'yes_no' ? (
          <RadioGroup
            defaultValue={answers[index]}
            sx={{
              '& .MuiFormControlLabel-root': {
                border: '1px solid var(--mui-palette-divider)',
                borderRadius: 1,
                gap: 2,
                p: 2,
                width: '100%',
              },
            }}
            value={answers[index]}
          >
            <FormControlLabel
              key={'yes'}
              label={
                <div>
                  <Typography
                    sx={{
                      color: 'var(--mui-palette-text-primary)',
                    }}
                    variant="inherit"
                  >
                    Yes
                  </Typography>
                </div>
              }
              value='Yes'
              control={<Radio />}
              onChange={handleRadioChange}
            />
            <FormControlLabel
              key={'no'}
              label={
                <div>
                  <Typography
                    sx={{
                      color: 'var(--mui-palette-text-primary)',
                    }}
                    variant="inherit"
                  >
                    No
                  </Typography>
                </div>
              }
              value='No'
              control={<Radio />}
              onChange={handleRadioChange}
            />
          </RadioGroup>
        ) : null}
        
        {question.question_type === 'text_field' ? (
          <RadioGroup
            defaultValue={answers[index]}
            sx={{
              '& .MuiFormControlLabel-root': {
                border: '1px solid var(--mui-palette-divider)',
                borderRadius: 1,
                gap: 2,
                p: 2,
                width: '100%',
              },
            }}
            value={answers[index]}
          >
            <TextField
              placeholder="Enter your answer..."
              multiline
              rows={2}
              maxRows={4}
              onChange={handleChange}
              value={answers[index]}
            />
          </RadioGroup>
        ) : null}
        
      </Box>
      
      <Box display='flex' justifyContent='center' mt={3}>
        <CustomButton disabled={!answers[index] || isSurveySendLoading} endIcon={<ArrowForwardIcon/>} onClick={onNext} text={index < answers.length - 1 ? 'Next' : 'Send'} type="button"/>
      </Box>
    </Box>
  );
};

export default SurveyQuestion;
