import * as React from 'react';

import { AuthGuard } from '@/components/auth/auth-guard';
import { DynamicLayout } from '@/components/dashboard/layout/dynamic-layout';
import { GuestGuard } from '@/components/auth/guest-guard';
import { UserSurveyProvider } from '@/contexts/user-survey';
import { Box } from '@mui/system';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <UserSurveyProvider>
      <Box
        component="main"
        sx={{
          '--Content-margin': '0 auto',
          '--Content-maxWidth': 'var(--maxWidth-xl)',
          '--Content-paddingX': '24px',
          '--Content-paddingY': { xs: '24px', lg: '64px' },
          '--Content-padding': 'var(--Content-paddingY) var(--Content-paddingX)',
          '--Content-width': '100%',
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flex: '1 1 auto',
          flexDirection: 'column',
        }}
      >
        {children}
      </Box>
    </UserSurveyProvider>
  );
}
