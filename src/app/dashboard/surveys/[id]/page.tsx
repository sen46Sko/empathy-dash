import * as React from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import { config } from '@/config';
import SurveyDetails from '@/components/dashboard/surveys/survey-details';

export const metadata = { title: `Overview | Survey | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // height: "100vh",
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <SurveyDetails/>
    </Box>
  );
}
