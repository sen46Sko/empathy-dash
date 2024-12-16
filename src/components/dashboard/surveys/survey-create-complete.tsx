import React, { useEffect } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CustomButton from '@/components/core/custom-button';
import { useParams, useRouter } from 'next/navigation';
import { useSurveys } from '@/hooks/use-surveys';

interface SurveyCreateProps {
  title?: string,
  description?: string,
}

const SurveyCreateComplete: React.FC<SurveyCreateProps> = ({
  title,
  description
  }) => {
  const router = useRouter();
  const { setSuccess, setSendComplete } = useSurveys();
  const params = useParams();
  const id = params?.id;
  
  const handleNavigate = () => {
    router.back();
    setSuccess(false);
    setSendComplete(false);
  };
  
  useEffect(() => {
    return () => {
      setSuccess(false);
      // setSendComplete(false)
    }
  }, [])
  
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        position: 'absolute',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        left: '50%',
      }}
    >
      <CheckCircleIcon sx={{fontSize: '6rem'}}/>
      <Typography
        sx={{
          fontSize: '2rem',
          textAlign: 'center',
        }}
      >
        {title || `Survey ${!id ? 'created' : 'edited'} successfully!`}
      </Typography>
      <Typography
        sx={{
          color: 'text.secondary',
          textAlign: 'center',
        }}
      >
        {description || 'Check your surveys list to review the information or edit if needed'}
      </Typography>
      <CustomButton onClick={handleNavigate} sx={{mt: 5}} text="Done" type="button"/>
    </Box>
  );
};

export default SurveyCreateComplete;
