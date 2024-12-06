import React from 'react';
import Box from '@mui/material/Box';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import Typography from '@mui/material/Typography';
import CustomButton from '@/components/core/custom-button';

interface CompletedTemplateProps {
  title: string,
  text: string,
  onConfirm: () => void,
  buttonText: string,
}

const CompletedTemplate: React.FC<CompletedTemplateProps> = ({onConfirm, text, title, buttonText}) => {
  return (
    <Box maxWidth='580px' display='flex' flexGrow={1} alignItems='center' flexDirection='column' justifyContent='center'>
      <CheckCircleRoundedIcon sx={{ fontSize: 128, color: 'text' }} />

      <Typography mt={5} component='h2' sx={{fontWeight: 700}} textAlign='center' variant='h4'>{title}</Typography>
      <Typography component='p' mt={2} textAlign='center' color='text.secondary' sx={{fontSize: '1rem'}} variant='subtitle2'>{text}</Typography>

      <Box display='flex' justifyContent='center' mt={5}>
        <Box>
          <CustomButton onClick={onConfirm} text={buttonText}/>
        </Box>
      </Box>
    </Box>
  );
};

export default CompletedTemplate;
