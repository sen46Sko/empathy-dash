import * as React from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import { config } from '@/config';
import TherapistsBlock from '@/components/dashboard/therapists/therapists-block';

export const metadata = { title: `Overview | Therapists | ${config.site.name}` } satisfies Metadata;

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
      <TherapistsBlock/>
    </Box>
  );
}
