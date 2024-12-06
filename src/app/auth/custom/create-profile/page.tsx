import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import CompleteProfileTemplate from '@/components/auth/custom/complete-profile-template';
import { AuthIncompleteGuard } from '@/components/auth/auth-incomplete-guard';

export const metadata: Metadata = { title: `Create Profile | ${config.site.name}` };

export default function Page(): React.JSX.Element {

  return (
    <AuthIncompleteGuard>
      <CompleteProfileTemplate/>
    </AuthIncompleteGuard>
  );
}
