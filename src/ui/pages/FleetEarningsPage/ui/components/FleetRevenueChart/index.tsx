'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { Box, Stack, Typography } from '@mui/material';
import { RowStack } from '../../../../../modules/components';
import { EmptyState } from '../../../../../modules/blocks';
import { pxToRem } from '../../../../../../common';
import { FleetRevenueTrendResponse } from '../../../../../../common/types';

// ─── Types ──────────────────────────────────────────────────────────────────

type ChartDataPoint = {
  label: string;
  revenue: number;
};

type FleetRevenueChartProps = {
  trendData?: FleetRevenueTrendResponse | null;
};

// ─── Custom Tooltip ─────────────────────────────────────────────────────────

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;

  return (
    <Stack
      sx={{
        background: '#FFFFFF',
        border: '0.67px solid #E8ECF0',
        borderRadius: '12px',
        boxShadow: '0px 8px 28px 0px rgba(0, 0, 0, 0.12)',
        padding: '12px 16px',
        minWidth: '140px',
      }}
    >
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: pxToRem(12),
          color: '#6B7280',
          marginBottom: '8px',
        }}
      >
        {label}
      </Typography>
      {payload.map((entry) => (
        <RowStack
          key={entry.dataKey}
          spacing={'8px'}
          sx={{ justifyContent: 'space-between', marginBottom: '4px' }}
        >
          <RowStack spacing={'6px'}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '2px',
                background: '#2F6FED',
              }}
            />
            <Typography
              sx={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontSize: pxToRem(12),
                color: '#6B7280',
              }}
            >
              Revenue
            </Typography>
          </RowStack>
          <Typography
            sx={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: pxToRem(12),
              color: '#111827',
            }}
          >
            ${((entry.value ?? 0) / 1000).toFixed(1)}k
          </Typography>
        </RowStack>
      ))}
    </Stack>
  );
};

export const FleetRevenueChart = ({ trendData }: FleetRevenueChartProps) => {
  const chartData = useMemo<ChartDataPoint[]>(() => {
    if (!trendData?.trend?.length) return [];
    return trendData.trend.map((point) => {
      const d = new Date(point.date);
      const label = d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      return { label, revenue: point.revenue };
    });
  }, [trendData]);

  const totalRevenue = useMemo(() => {
    if (!chartData.length) return 0;
    return chartData.reduce((sum, p) => sum + p.revenue, 0);
  }, [chartData]);

  const avgRevenue = useMemo(() => {
    if (!chartData.length) return 0;
    return totalRevenue / chartData.length;
  }, [chartData, totalRevenue]);

  if (!chartData.length) {
    return (
      <Stack
        sx={{
          background: '#FFFFFF',
          border: '0.67px solid #E8ECF0',
          borderRadius: '16px',
          padding: '24px',
        }}
      >
        <EmptyState animationSrc="/empty.json" />
      </Stack>
    );
  }

  return (
    <Stack
      sx={{
        background: '#FFFFFF',
        border: '0.67px solid #E8ECF0',
        borderRadius: '16px',
        padding: '24px',
      }}
    >
      {/* Header */}
      <RowStack sx={{ justifyContent: 'space-between', marginBottom: '4px' }}>
        <RowStack spacing={'8px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(16),
              color: '#111827',
            }}
          >
            Fleet Revenue Trends
          </Typography>
        </RowStack>
      </RowStack>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(12),
          color: '#9CA3AF',
          marginBottom: '16px',
        }}
      >
        Revenue over the last {trendData?.period_days ?? '--'} days
      </Typography>

      {/* Legend */}
      <RowStack
        spacing={'16px'}
        sx={{ marginBottom: '16px', flexWrap: 'wrap' }}
      >
        <RowStack spacing={'6px'}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '2px',
              background: '#2F6FED',
            }}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(11.5),
              color: '#6B7280',
            }}
          >
            Revenue
          </Typography>
        </RowStack>
      </RowStack>

      {/* Summary Stats */}
      <RowStack spacing={'24px'} sx={{ marginBottom: '20px' }}>
        <Stack>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(18),
              color: '#111827',
            }}
          >
            ${(totalRevenue / 1000).toFixed(0)}k
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: '#9CA3AF',
            }}
          >
            Total
          </Typography>
        </Stack>
        <Stack>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(18),
              color: '#111827',
            }}
          >
            ${(avgRevenue / 1000).toFixed(1)}k
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: '#9CA3AF',
            }}
          >
            Avg / Day
          </Typography>
        </Stack>
      </RowStack>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient
              id="gradient-revenue"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="5%" stopColor="#2F6FED" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#2F6FED" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#F0F4F8"
          />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 11,
              fill: '#9CA3AF',
              fontWeight: 400,
              fontFamily: 'Inter, sans-serif',
            }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 11,
              fill: '#9CA3AF',
              fontWeight: 400,
              fontFamily: 'Inter, sans-serif',
            }}
            dx={-5}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2F6FED"
            strokeWidth={2}
            fill="url(#gradient-revenue)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 2, fill: '#FFFFFF' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Stack>
  );
};
