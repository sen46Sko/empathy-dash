import React from 'react';
import { Box } from '@mui/system';
import Typography from '@mui/material/Typography';
import CustomButton from '@/components/core/custom-button';
import type { SurveyFormValues } from '@/types/surveys/survey.types';
import { QuestionTypeEnum } from '@/types/surveys/survey.types';
import Divider from '@mui/material/Divider';
import { useParams } from 'next/navigation';

interface SurveyPreviewValues {
  values: SurveyFormValues,
}

const SurveyPreview: React.FC<SurveyPreviewValues> = ({values}) => {
  const params = useParams();
  const id = params?.id;
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          p: 3,
          border: '1px solid #DCDFE4',
          borderRadius: 2,
          width: '100%'
        }}
      >
        <Typography
          sx={{
            fontWeight: 500
          }}
        >
          Rate your session
        </Typography>
        {values?.questions?.map((item, index) => {
          return <Box
            key={index}
            sx={{
              my: 3
            }}
          >
            <Typography
              sx={{
                color: 'text.secondary'
              }}
            >
              {item.question || `Question #${index + 1}`}
            </Typography>
            
            {item.question_type === QuestionTypeEnum.SELECTION && (
            
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                  mt: 2,
                }}
              >
                {item?.options?.map((option, subIndex) => (
                  <Typography
                    key={subIndex}
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    {option.value || `Option #${subIndex+1}`}
                  </Typography>
                ))}
              </Box>
            )}
            
            {item.question_type === QuestionTypeEnum.YESNO && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                  mt: 2,
                }}
              >
                <Typography
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Yes, no answer
                </Typography>
              </Box>
            )}
            
            {item.question_type === QuestionTypeEnum.TEXT && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 2,
                  mt: 2,
                }}
              >
                <Typography
                  sx={{
                    color: 'text.secondary',
                  }}
                >
                  Text field
                </Typography>
              </Box>
            )}
            
            <Divider sx={{mt: 2}}/>
          </Box>
        })}
      </Box>
      <CustomButton sx={{mt: 3}} text={id ? 'Edit Survey' : 'Create Survey'} type="submit"/>
    </Box>
  );
};

export default SurveyPreview;
