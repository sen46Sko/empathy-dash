'use client';
import React from 'react';
import Box from '@mui/material/Box';
import { Cell, Pie, PieChart, PolarAngleAxis, RadialBar, RadialBarChart } from 'recharts';
import { NoSsr } from '@/components/core/no-ssr';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function TaskChart() {
  const chartSize = 280;
  const chartTickness = 28;
  
  const value = 83;
  const limit = 70;
  
  const data = [
    { name: 'System Health', value, color: 'var(--mui-palette-primary-main)' },
    { name: 'Empty', value: 100 - value, color: 'var(--mui-palette-neutral-100)' },
  ] satisfies { name: string; value: number; color: string }[];
  
  return (
    <Box mt={4}>
      <Card sx={{p: 2}}>
          <Typography textAlign='center' color='text.primary' fontSize='1.1rem' fontWeight={500} mb={3} mt={1}>Completed tasks</Typography>
          
          <Stack spacing={4}>
            <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <NoSsr fallback={<Box sx={{ height: `${chartSize}px`, width: `${chartSize}px` }} />}>
                <PieChart height={chartSize} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} width={chartSize}>
                  <Pie
                    animationDuration={300}
                    cx={chartSize / 2}
                    cy={chartSize / 2}
                    data={data}
                    dataKey="value"
                    endAngle={-270}
                    innerRadius={chartSize / 2 - chartTickness}
                    nameKey="name"
                    outerRadius={chartSize / 2}
                    startAngle={90}
                    strokeWidth={0}
                  >
                    {data.map(
                      (entry): React.JSX.Element => (
                        <Cell fill={entry.color} key={entry.name} />
                      )
                    )}
                  </Pie>
                </PieChart>
                {/*<RadialBarChart*/}
                {/*  barSize={2}*/}
                {/*  cx={chartSize / 2}*/}
                {/*  cy={chartSize / 2}*/}
                {/*  data={data}*/}
                {/*  endAngle={-270}*/}
                {/*  height={chartSize}*/}
                {/*  innerRadius={12}*/}
                {/*  outerRadius={18}*/}
                {/*  startAngle={90}*/}
                {/*  width={chartSize}*/}
                {/*>*/}
                {/*  <PolarAngleAxis*/}
                {/*    type="number"*/}
                {/*    domain={[0, 100]}*/}
                {/*    angleAxisId={0}*/}
                {/*    tick={false}*/}
                {/*  />*/}
                {/*  <RadialBar*/}
                {/*    background*/}
                {/*    clockWise*/}
                {/*    dataKey="value"*/}
                {/*    cornerRadius={chartSize / 2}*/}
                {/*    fill="#82ca9d"*/}
                {/*  />*/}
                {/*</RadialBarChart>*/}
              </NoSsr>
              <Box
                sx={{
                  alignItems: 'center',
                  bottom: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  left: 0,
                  position: 'absolute',
                  right: 0,
                  top: 0,
                }}
              >
                <Stack spacing={1} sx={{ textAlign: 'center' }}>
                  <Typography color="text.primary" fontSize='3rem' fontWeight={500} variant="body2">
                    82.24%
                  </Typography>
                </Stack>
              </Box>
            </Box>
            <Typography color="text.secondary" component="p" fontSize='0.88rem' sx={{ textAlign: 'center' }} variant="caption">
              8/10
            </Typography>
          </Stack>
      </Card>
    </Box>
  );
}

export default TaskChart;
