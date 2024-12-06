'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import BackButton from '@/components/core/back-button';
import { ResetPasswordForm } from '@/components/auth/custom/reset-password-form';
import { useRouter } from 'next/navigation';
import { ResetStageEnum } from '@/types/auth/auth.types';
import ConfirmEmail from '@/components/auth/custom/confirm-email';
import CreateNewPasswordForm from '@/components/auth/custom/create-new-password-form';
import CompletedTemplate from '@/components/auth/custom/completed-template';
import { paths } from '@/paths';

const ResetPasswordTemplate: React.FC = () => {
  const router = useRouter()
  const [stage, setStage] = useState<ResetStageEnum>(ResetStageEnum.Email);

  const handleGoBack = (): void => {
    switch (stage) {
      case ResetStageEnum.Email:
        router.back();
        break;
      case ResetStageEnum.Confirm:
      case ResetStageEnum.Password:
        setStage(ResetStageEnum.Email);
        break;
      default:
        break;
    }
  }

  const handleNextStage = (): void => {
    switch (stage) {
      case ResetStageEnum.Email:
        setStage(ResetStageEnum.Confirm);
        break;
      case ResetStageEnum.Confirm:
        setStage(ResetStageEnum.Password);
        break;
      case ResetStageEnum.Password:
        setStage(ResetStageEnum.Complete);
        break;
      default:
        break;
    }
  }

  const handleNavigateToSignIn = () => {
    router.push(paths.auth.custom.signIn);
  }

  return (
    <Box
      sx={{
        py: 2,
        px: {
          xs: 2,
          sm: 3,
          md: 10,
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'background.level3'
      }}
    >

      {stage !== ResetStageEnum.Complete && (
        <Box my={2} sx={{alignSelf: 'flex-start'}}>
          <BackButton onClick={handleGoBack}/>
        </Box>
      )}

      {stage === ResetStageEnum.Email && <ResetPasswordForm handleNextStage={handleNextStage}/>}
      {stage === ResetStageEnum.Confirm && <ConfirmEmail handleNextStage={handleNextStage}/>}
      {stage === ResetStageEnum.Password && <CreateNewPasswordForm handleNextStage={handleNextStage}/>}
      {stage === ResetStageEnum.Complete && <CompletedTemplate
        text='Your password has been reset successfully, you can access your account now'
        title='Password reset successfully!'
        onConfirm={handleNavigateToSignIn}
        buttonText={'Sign In'}
      />}
    </Box>
  );
};

export default ResetPasswordTemplate;
