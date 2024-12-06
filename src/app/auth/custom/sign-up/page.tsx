import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { GuestGuard } from '@/components/auth/guest-guard';
import { SplitLayout } from '@/components/auth/split-layout';
import SignUpTemplate from '@/components/auth/custom/sign-up-template';

export const metadata: Metadata = { title: `Sign up | ${config.site.name}` };

export default function Page(): React.JSX.Element {
  return (
    <GuestGuard>
      <SplitLayout>
        <SignUpTemplate/>
      </SplitLayout>
    </GuestGuard>
  );
}
