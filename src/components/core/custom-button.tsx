import React from 'react';
import type { ButtonProps } from '@mui/material/Button/Button';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/system';

interface CustomButtonProps extends ButtonProps {
  text: string,
  variant?: 'text' | 'outlined' | 'contained',
}

const CustomButton: React.FC<CustomButtonProps> = ({disabled, text, variant, ...props }) => {
  const theme = useTheme();

  return (
    <Button
      sx={{
        px: '22px',
        color: 'info.contrastText'
      }}
      {...props}
      disabled={disabled}
      variant={variant || 'contained'}
    >
      {text || 'Send'}
    </Button>
  );
};

export default CustomButton;
