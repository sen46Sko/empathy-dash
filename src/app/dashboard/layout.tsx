import * as React from 'react';

import { AuthGuard } from '@/components/auth/auth-guard';
import { DynamicLayout } from '@/components/dashboard/layout/dynamic-layout';
import { GuestGuard } from '@/components/auth/guest-guard';
import { ClientsProvider } from '@/contexts/clients';
import { TherapistsProvider } from '@/contexts/therapists';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <AuthGuard>
      <ClientsProvider>
          <DynamicLayout>{children}</DynamicLayout>
      </ClientsProvider>
    </AuthGuard>
  );
}
