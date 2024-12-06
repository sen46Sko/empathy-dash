import * as React from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import { config } from '@/config';
import ClientSurveyBlock from '@/components/dashboard/surveys/client-survey-block';

export const metadata = { title: `Overview | Clients | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Box>
      <ClientSurveyBlock/>
    </Box>
  );
}
