import * as React from 'react';
import type { Metadata } from 'next';

import { config } from '@/config';
import { Faqs } from '@/components/marketing/home/faqs';
import { Features } from '@/components/marketing/home/features';
import { Hero } from '@/components/marketing/home/hero';
import { Included } from '@/components/marketing/home/included';
import { Productivity } from '@/components/marketing/home/productivity';
import { StartBuilding } from '@/components/marketing/home/start-building';
import { Testimonails } from '@/components/marketing/home/testimonials';
import { useUser } from '@/hooks/use-user';
import { AuthGuard } from '@/components/auth/auth-guard';
import CircularProgress from '@mui/material/CircularProgress';
import { Box } from '@mui/system';

export const metadata = { title: config.site.name, description: config.site.description } satisfies Metadata;

export default function Page(): React.JSX.Element {

  return (
    <main>
      <AuthGuard>
      {/*<Hero />*/}
      {/*<Productivity />*/}
      {/*<Included />*/}
      {/*<Features />*/}
      {/*<Testimonails />*/}
      {/*<Faqs />*/}
        <Box
          sx={{
            height: '100vh',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress size="30px" />
        </Box>
      {/*<StartBuilding />*/}
      </AuthGuard>
    </main>
  );
}
