import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import NotesSignIn from '@/components/auth/notes/notes-sign-in';
import { NoteGuestGuard } from '@/components/auth/note-guest-guard';

export const metadata: Metadata = { title: `Sign in | Notes For Therapy` };

export default function Page(): React.JSX.Element {
  return (
    <NoteGuestGuard>
      <NotesSignIn/>
    </NoteGuestGuard>
  );
}
