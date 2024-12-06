import * as React from 'react';
import type { Metadata } from 'next';
import { config } from '@/config';
import TermsTemplate from '@/components/auth/custom/terms-template';
import { AuthIncompleteGuard } from '@/components/auth/auth-incomplete-guard';

export const metadata: Metadata = { title: `Terms & Condition | ${config.site.name}` };

export default function Page(): React.JSX.Element {
  return (
    <AuthIncompleteGuard>
      <TermsTemplate/>
    </AuthIncompleteGuard>
  );
}
