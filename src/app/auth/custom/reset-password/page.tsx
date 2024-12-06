import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { GuestGuard } from '@/components/auth/guest-guard';
import ResetPasswordTemplate from '@/components/auth/custom/reset-password-template';

export const metadata: Metadata = { title: `Reset password | ${config.site.name}` };

export default function Page(): React.JSX.Element {

  return (
    <GuestGuard>
      <ResetPasswordTemplate/>
    </GuestGuard>
  );
}
