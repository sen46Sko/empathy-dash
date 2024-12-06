'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { NoSsr } from '@/components/core/no-ssr';
import { useState } from 'react';
import { MultiSelect } from '@/components/core/multi-select';
import Select from '@mui/material/Select';

const bars = [
  { name: 'This year', dataKey: 'rating', color: 'var(--mui-palette-primary-400)' },
] satisfies { name: string; dataKey: string; color: string }[];

export interface AppUsageProps {
  data: { name: string; rating: number; counter: number }[];
}

const stockOptions = [
  { label: 'Weekly', value: 'weekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
] as const;

export function AppUsage({ data }: AppUsageProps): React.JSX.Element {
  const chartHeight = 300;
  const [barGraphData, setBarGraphData] = useState<{x: number, y: number} | null>(null)

  return (
    <Card>
      
      <Box
        alignItems='center'
        display='flex'
        justifyContent='space-between'
        px={4}
        py={2}
      >
        <CardHeader sx={{py: 0}} title="Evaluation rating" />
        <Box>
          <MultiSelect label="Monthly" options={stockOptions} value={[stockOptions[1].value]} />
        </Box>
      </Box>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
          {/*<Stack spacing={3} sx={{ flex: '0 0 auto', justifyContent: 'space-between', width: '240px' }}>*/}
          {/*  <Stack spacing={2}>*/}
          {/*    <Typography color="success.main" variant="h2">*/}
          {/*      +28%*/}
          {/*    </Typography>*/}
          {/*    <Typography color="text.secondary">*/}
          {/*      increase in app usage with{' '}*/}
          {/*      <Typography color="text.primary" component="span">*/}
          {/*        6,521*/}
          {/*      </Typography>{' '}*/}
          {/*      new products purchased*/}
          {/*    </Typography>*/}
          {/*  </Stack>*/}
          {/*  <div>*/}
          {/*    <Typography color="text.secondary" variant="body2">*/}
          {/*      <Typography color="primary.main" component="span" variant="subtitle2">*/}
          {/*        This year*/}
          {/*      </Typography>{' '}*/}
          {/*      is forecasted to increase in your traffic by the end of the current month*/}
          {/*    </Typography>*/}
          {/*  </div>*/}
          {/*</Stack>*/}
          <Stack divider={<Divider />} spacing={2} sx={{ flex: '1 1 auto' }}>
            <NoSsr fallback={<Box sx={{ height: `${chartHeight}px` }} />}>
              <ResponsiveContainer height={chartHeight}>
                <BarChart barGap={-32} data={data} margin={{ top: 15, right: 0, bottom: 0, left: 0 }}>
                  <CartesianGrid stroke="#e0e0e0" strokeDasharray="15 10" vertical={false} />
                  <YAxis
                    axisLine={false}
                    domain={[0, 5]}
                    tick={{ fontSize: '0.85rem', fill: '#707070' }}
                    tickCount={6}
                    tickLine={false}
                    type="number"
                    width={20}
                  />
                  <XAxis
                    axisLine={false}
                    dataKey="name"
                    dy={10}
                    tick={{ fontSize: '0.85rem', fill: '#707070'  }}
                    tickLine={false}
                    type="category"
                  />
                  {bars.map(
                    (bar, index): React.JSX.Element => (
                      <Bar
                        animationDuration={300}
                        barSize={32}
                        dataKey={bar.dataKey}
                        fill={bar.color}
                        key={bar.name}
                        name={bar.name}
                        onMouseLeave={() => {
                          setBarGraphData(null)
                        }}
                        onMouseOver={(val: {x: number, y: number}) => {
                          setBarGraphData(val)
                        }}
                        radius={[16, 16, 0, 0]}
                        style={{ cursor: 'pointer' }}
                        xAxisId={index}
                      />
                    )
                  )}
                  <Tooltip active={Boolean(barGraphData)} animationDuration={0} content={<TooltipContent />} cursor={false} position={{ x: barGraphData?.x, y: barGraphData ? barGraphData?.y - 48 : 0 }}/>
                </BarChart>
              </ResponsiveContainer>
            </NoSsr>
            {/*<Legend />*/}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function Legend(): React.JSX.Element {
  return (
    <Stack direction="row" spacing={2}>
      {bars.map((bar) => (
        <Stack direction="row" key={bar.name} spacing={1} sx={{ alignItems: 'center' }}>
          <Box sx={{ bgcolor: bar.color, borderRadius: '2px', height: '4px', width: '16px' }} />
          <Typography color="text.secondary" variant="caption">
            {bar.name}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

interface TooltipContentProps {
  active?: boolean;
  payload?: { fill: string; name: string; dataKey: string; value: number; payload: { counter: number } }[];
  label?: string;
}

function TooltipContent({ active, payload }: TooltipContentProps): React.JSX.Element | null {
  if (!active || !payload || payload.length === 0) {
    return null;
  }
  
  return (
    <Box>
        {payload.map(
          (entry): React.JSX.Element => (
            <Box alignItems='center' display='flex' flexDirection='column' justifyContent='center' >
              <Box
                alignItems='center'
                display='flex'
                justifyContent='center'
                mb={1}
                sx={{backgroundColor: 'var(--mui-palette-primary-400)', width: '32px', height: '24px', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              >
                <Typography color="common.white" fontSize='0.75rem' variant="body2">
                  {`${entry.payload.counter}`}
                </Typography>
              </Box>
              <Box mb={1} sx={{backgroundColor: 'var(--mui-palette-primary-400)', width: '8px', height: '8px', borderRadius: '50%'}} />
            </Box>
          )
        )}
    </Box>
  );
}
