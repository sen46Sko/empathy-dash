'use client';

import React from 'react';
import { SignUpForm } from '@/components/auth/custom/sign-up-form';
import Box from '@mui/material/Box';

const SignUpTemplate: React.FC = () => {
  return (
    <Box sx={{flex: 1, display: 'flex'}}>
      <SignUpForm />
    </Box>
  );
};

export default SignUpTemplate;
