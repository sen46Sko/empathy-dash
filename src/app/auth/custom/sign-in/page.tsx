import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { SignInForm } from '@/components/auth/custom/sign-in-form';
import { GuestGuard } from '@/components/auth/guest-guard';
import { SplitLayout } from '@/components/auth/split-layout';
import { SignInWrapper } from '@/components/auth/custom/sign-in-wrapper';

export const metadata: Metadata = { title: `Sign in | ${config.site.name}` };

export default function Page(): React.JSX.Element {
  return (
    <GuestGuard>
      <SplitLayout>
        <SignInWrapper/>
      </SplitLayout>
    </GuestGuard>
  );
}
