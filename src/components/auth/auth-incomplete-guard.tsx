'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useUser } from '@/hooks/use-user';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthIncompleteGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);
  
  const checkPermissions = async (): Promise<void> => {
    if (isLoading) {
      return;
    }
    
    if (error) {
      setIsChecking(false);
      return;
    }
    
    if (!user) {
      logger.debug('[AuthGuard]: User is not logged in, redirecting to sign in');
      
      router.replace(paths.auth.custom.signIn);
    }
    
    if (user) {
      logger.debug('[GuestGuard]: User is logged in, confirmed, and terms were accepted, redirecting to dashboard');
      router.refresh();
      router.replace(paths.dashboard.overview);
    }
    
    setIsChecking(false);
  };
  
  React.useEffect(() => {
    checkPermissions().catch(() => {
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, [user, error, isLoading]);
  
  if (isChecking) {
    return null;
  }
  
  if (error) {
    return <Alert color="error">{error}</Alert>;
  }
  
  return <React.Fragment>{children}</React.Fragment>;
}
