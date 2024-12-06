import * as React from 'react';
import type { Metadata } from 'next';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { config } from '@/config';
import { AppUsage } from '@/components/dashboard/overview/app-usage';
import { Summary } from '@/components/dashboard/overview/summary';
import DashboardCalendar from '@/components/dashboard/overview/dashobard-calendar';
import TaskChart from '@/components/dashboard/overview/task-chart';

export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <Stack spacing={4}>
        <Grid container spacing={4}>
          <Grid md={4} xs={12}>
            <Summary amount={31} diff={15} title="Avg Surveys Sent" trend="up"  />
          </Grid>
          <Grid md={4} xs={12}>
            <Summary amount={240} diff={0.5} title="Rating Avg" trend="down" />
          </Grid>
          <Grid md={4} xs={12}>
            <Summary amount={21} diff={12} title="Client Satisfaction" trend="up" />
          </Grid>
        </Grid>
        <Grid container spacing={4}>
          <Grid xs={12} md={8} lg={8}>
            <AppUsage
              data={[
                { name: 'Jan', rating: 4.5, counter: 100 },
                { name: 'Feb', rating: 1.2, counter: 90 },
                { name: 'Mar', rating: 2.0, counter: 120 },
                { name: 'Apr', rating: 4.8, counter: 110 },
                { name: 'May', rating: 3.9, counter: 80 },
                { name: 'Jun', rating: 4.6, counter: 130 },
                { name: 'Jul', rating: 3.3, counter: 105 },
                { name: 'Aug', rating: 4.7, counter: 140 },
                { name: 'Sep', rating: 4.1, counter: 95 },
                { name: 'Oct', rating: 4.4, counter: 125 },
                { name: 'Nov', rating: 4.0, counter: 85 },
                { name: 'Dec', rating: 4.9, counter: 150 },
              ]}
            />
          </Grid>
          <Grid xs={12} md={4} lg={4} spacing={4}>
            <DashboardCalendar/>
            <TaskChart/>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  
  );
}
