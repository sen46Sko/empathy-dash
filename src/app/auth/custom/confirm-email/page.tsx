import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { SplitLayout } from '@/components/auth/split-layout';
import ConfirmRegisterEmail from '@/components/auth/custom/confirm-register-email';
import { AuthIncompleteGuard } from '@/components/auth/auth-incomplete-guard';

export const metadata: Metadata = { title: `Confirm Email | ${config.site.name}` };

export default function Page(): React.JSX.Element {
  return (
    <AuthIncompleteGuard>
      <SplitLayout>
        <ConfirmRegisterEmail />
      </SplitLayout>
    </AuthIncompleteGuard>
  );
}
