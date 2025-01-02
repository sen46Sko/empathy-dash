import * as React from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import { config } from '@/config';
import ClientDetailsBlock from '@/components/clients/clients-details-block';

export const metadata = { title: `Overview | New Client | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <ClientDetailsBlock/>
    </Box>
  );
}