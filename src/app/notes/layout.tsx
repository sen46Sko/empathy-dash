import * as React from 'react';
import { NoteAuthGuard } from '@/components/auth/note-auth-guard';
import { ClientsProvider } from '@/contexts/clients';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <NoteAuthGuard>
      {children}
    </NoteAuthGuard>
  );
}
