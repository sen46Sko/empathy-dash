import * as React from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import DeleteNoteAccount from '@/components/notes/delete-note-account';

export const metadata = { title: `Notes | Delete Account` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 64px)",
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <DeleteNoteAccount/>
    </Box>
  );
}
