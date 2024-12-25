import React, { useState } from 'react';
import type { SurveyResult } from '@/types/surveys/survey.types';
import { Box } from '@mui/system';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import moment from 'moment-timezone';
import Card from '@mui/material/Card';
import { Modal } from '@mui/material';
import type { CustomThemeType } from '@/styles/theme/types';
import ErrorIcon from '@mui/icons-material/Error';
import Button from '@mui/material/Button';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import SendSurveyModal from '@/components/dashboard/surveys/send-survey-modal';

interface SurveyUserResponseLineProps {
  line: SurveyResult,
}

const SurveyUserResponseLine: React.FC<SurveyUserResponseLineProps> = ({line}) => {
  const [isOpen, setIsOpen] = useState(false);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { survey_id, id, results, patient, patient_id, created_at } = line;
  
  const toggleCollapse = () => {
    setIsOpen((prev) => !prev);
  }
  
  return (
    <Card sx={{mt: 3, p: 2}}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography>{patient.full_name}</Typography>
          <Typography
            sx={{
              fontSize: '0.6rem',
              color: 'text.secondary'
            }}
          >
            {moment(new Date(created_at)).tz(timezone).format("DD MMM, YYYY")}
          </Typography>
        </Box>
        
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
          onClick={toggleCollapse}
        >
          <KeyboardArrowDownRoundedIcon
            sx={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        </Box>
      </Box>
      <Collapse in={isOpen}>
        <Box
          mt={2}
        >
          {results.map((item, index) => {
            return (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  borderTop: '1px solid',
                  borderColor: '#DCDFE4',
                  py: 2,
                }}
              >
                <Typography
                  sx={{
                    mr: 0.5,
                    color: 'text.secondary',
                  }}
                >
                  {`${index + 1}.`}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    sx={{
                      color: 'text.secondary',
                    }}
                  >
                    {item.question.question}
                  </Typography>
                  <Typography
                    sx={{
                      fw: 500,
                      maxWidth: '50%',
                    }}
                  >
                    {item.answer}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      </Collapse>
    </Card>
  );
};

export default SurveyUserResponseLine;
