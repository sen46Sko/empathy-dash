'use client';

import * as React from 'react';
import { useUser } from '@/hooks/use-user';
import { SignInForm } from '@/components/auth/custom/sign-in-form';
import { ActivateForm } from '@/components/auth/custom/activate-account';

export function SignInWrapper(): React.JSX.Element {
  const { user } = useUser();
  
  return (
    <>
      {user?.status === 'pending' && <ActivateForm/> }
      
      {!user && <SignInForm />}
    </>
  );
}
