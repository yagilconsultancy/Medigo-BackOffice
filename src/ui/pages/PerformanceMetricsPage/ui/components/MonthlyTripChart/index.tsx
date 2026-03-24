'use client';

import { Box, Stack, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { pxToRem } from '../../../../../../common';

const chartData = [
  { month: 'Sep', trips: 255 },
  { month: 'Oct', trips: 310 },
  { month: 'Nov', trips: 283 },
  { month: 'Dec', trips: 264 },
  { month: 'Jan', trips: 346 },
  { month: 'Feb', trips: 382 },
  { month: 'Mar', trips: 360 },
  { month: 'Apr', trips: 360 },
  { month: 'May', trips: 360 },
];

export const MonthlyTripChart = () => {
  return (
    <Box
      sx={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '0.67px solid #F0F4F8',
        boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
        padding: '24px',
        height: '100%',
      }}
    >
      <Stack spacing={'4px'} sx={{ marginBottom: '20px' }}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 500,
            fontSize: pxToRem(18),
            color: '#111827',
          }}
        >
          Monthly Trip Performance
        </Typography>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#6B7280',
          }}
        >
          Total trips completed across the fleet per month
        </Typography>
      </Stack>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#F0F4F8"
          />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: pxToRem(11),
              fill: '#9CA3AF',
              fontWeight: 400,
            }}
            dy={8}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: pxToRem(10),
              fill: '#9CA3AF',
              fontWeight: 400,
            }}
            domain={[0, 420]}
            ticks={[0, 105, 210, 315, 420]}
            dx={-5}
          />
          <Tooltip
            contentStyle={{
              background: '#FFFFFF',
              border: '1px solid #F0F4F8',
              borderRadius: '8px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
              fontSize: '13px',
            }}
            cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }}
          />
          <Bar
            dataKey="trips"
            fill="#2F6FED"
            fillOpacity={0.85}
            radius={[4, 4, 0, 0]}
            barSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};
