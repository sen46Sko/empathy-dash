'use client';
import React, { useState } from 'react';
import { SplitLayout } from '@/components/auth/split-layout';
import CreateProfile from '@/components/auth/custom/create-profile';
import type { User } from '@/types/user';
import Box from '@mui/material/Box';
import CompletedTemplate from '@/components/auth/custom/completed-template';
import { useUser } from '@/hooks/use-user';

const CompleteProfileTemplate: React.FC = () => {
  const [data, setData] = useState<User | null>(null);
  const { setUser } = useUser();
  
  const handleNavigateToDashboard = () => {
    setUser(data);
  }
  
  const handleCreateProfile = (userData: User) => {
    setData(userData);
  }

  return (
    <>
      
      {data ? <Box sx={{
        py: 2,
        px: {
          xs: 2,
          sm: 3,
          md: 10,
        },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh'
      }}>
        <CompletedTemplate
          buttonText="Go to Dashboard"
          onConfirm={handleNavigateToDashboard}
          text='Your profile is complete, now you can start managing your clients and tasks on Empathy Dashboard'
          title='You’re ready!'
        />
      </Box> : (
        <SplitLayout>
          <CreateProfile handleNext={handleCreateProfile}/>
        </SplitLayout>
      )}
    </>
  );
};

export default CompleteProfileTemplate;
