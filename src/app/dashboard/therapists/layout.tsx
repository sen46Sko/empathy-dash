import * as React from 'react';
import { TherapistsProvider } from '@/contexts/therapists';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <TherapistsProvider>
      {children}
    </TherapistsProvider>
  );
}
