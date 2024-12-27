import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { GuestGuard } from '@/components/auth/guest-guard';
import NotesSignIn from '@/components/auth/notes/notes-sign-in';

export const metadata: Metadata = { title: `Sign in | ${config.site.name}` };

export default function Page(): React.JSX.Element {
  return (
    <GuestGuard>
      <NotesSignIn/>
    </GuestGuard>
  );
}
