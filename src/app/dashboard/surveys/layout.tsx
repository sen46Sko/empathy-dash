import * as React from 'react';

import { AuthGuard } from '@/components/auth/auth-guard';
import { SurveysProvider } from '@/contexts/surveys';
import { ClientsProvider } from '@/contexts/clients';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <AuthGuard>
      <SurveysProvider>
        <ClientsProvider>
          {children}
        </ClientsProvider>
      </SurveysProvider>
    </AuthGuard>
  );
}
