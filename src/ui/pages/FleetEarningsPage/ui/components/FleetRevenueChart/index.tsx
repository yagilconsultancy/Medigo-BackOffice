'use client';

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
import { pxToRem } from '../../../../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type ChartDataPoint = {
  month: string;
  medride: number;
  caretransit: number;
  healthhaul: number;
  saferide: number;
  mobicare: number;
  apex: number;
};

// ─── Chart Data (Sep 2025 – Mar 2026) ───────────────────────────────────────

const chartData: ChartDataPoint[] = [
  {
    month: "Sep '25",
    medride: 18,
    caretransit: 14,
    healthhaul: 10,
    saferide: 8,
    mobicare: 12,
    apex: 9,
  },
  {
    month: "Oct '25",
    medride: 22,
    caretransit: 16,
    healthhaul: 12,
    saferide: 10,
    mobicare: 14,
    apex: 11,
  },
  {
    month: "Nov '25",
    medride: 28,
    caretransit: 20,
    healthhaul: 15,
    saferide: 12,
    mobicare: 17,
    apex: 13,
  },
  {
    month: "Dec '25",
    medride: 48,
    caretransit: 36,
    healthhaul: 28,
    saferide: 22,
    mobicare: 31,
    apex: 24,
  },
  {
    month: "Jan '26",
    medride: 55,
    caretransit: 42,
    healthhaul: 32,
    saferide: 26,
    mobicare: 36,
    apex: 28,
  },
  {
    month: "Feb '26",
    medride: 68,
    caretransit: 52,
    healthhaul: 40,
    saferide: 32,
    mobicare: 45,
    apex: 35,
  },
  {
    month: "Mar '26",
    medride: 83,
    caretransit: 64,
    healthhaul: 49,
    saferide: 39,
    mobicare: 54,
    apex: 42,
  },
];

// ─── Fleet Config ───────────────────────────────────────────────────────────

const fleetConfig = [
  { key: 'medride', label: 'MedRide Express', color: '#2F6FED' },
  { key: 'caretransit', label: 'CareTransit Co.', color: '#10B981' },
  { key: 'healthhaul', label: 'HealthHaul LLC', color: '#F59E0B' },
  { key: 'saferide', label: 'SafeRide Medical', color: '#0EA5E9' },
  { key: 'mobicare', label: 'MobiCare Transport', color: '#8B5CF6' },
  { key: 'apex', label: 'Apex Medical Rides', color: '#6366F1' },
];

// ─── Custom Tooltip ─────────────────────────────────────────────────────────

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;

  const total = payload.reduce((sum, entry) => sum + (entry.value ?? 0), 0);

  return (
    <Stack
      sx={{
        background: '#FFFFFF',
        border: '0.67px solid #E8ECF0',
        borderRadius: '12px',
        boxShadow: '0px 8px 28px 0px rgba(0, 0, 0, 0.12)',
        padding: '12px 16px',
        minWidth: '180px',
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
      {payload.map((entry) => {
        const config = fleetConfig.find((f) => f.key === entry.dataKey);
        return (
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
                  background: config?.color ?? entry.color,
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
                {config?.label}
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
              ${entry.value}k
            </Typography>
          </RowStack>
        );
      })}
      <RowStack
        spacing={'8px'}
        sx={{
          justifyContent: 'space-between',
          marginTop: '6px',
          paddingTop: '6px',
          borderTop: '0.67px solid #E8ECF0',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: pxToRem(12),
            color: '#374151',
          }}
        >
          Total
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: pxToRem(12),
            color: '#111827',
          }}
        >
          ${total}k
        </Typography>
      </RowStack>
    </Stack>
  );
};

// ─── Component ──────────────────────────────────────────────────────────────

export const FleetRevenueChart = () => {
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
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(12),
              color: '#10B981',
            }}
          >
            +43.9% MoM
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
        Monthly gross revenue per fleet · Sep 2025 – Mar 2026
      </Typography>

      {/* Legend */}
      <RowStack
        spacing={'16px'}
        sx={{ marginBottom: '16px', flexWrap: 'wrap' }}
      >
        {fleetConfig.map((fleet) => (
          <RowStack key={fleet.key} spacing={'6px'}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '2px',
                background: fleet.color,
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
              {fleet.label}
            </Typography>
          </RowStack>
        ))}
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
            $1432k
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: '#9CA3AF',
            }}
          >
            7-Month Total
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
            $205k
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: '#9CA3AF',
            }}
          >
            Avg / Month
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
            Mar &apos;26 · $331k
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(11),
              color: '#9CA3AF',
            }}
          >
            Best Month
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
            {fleetConfig.map((fleet) => (
              <linearGradient
                key={fleet.key}
                id={`gradient-${fleet.key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor={fleet.color} stopOpacity={0.18} />
                <stop offset="95%" stopColor={fleet.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
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
            tickFormatter={(value) => `$${value}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          {fleetConfig.map((fleet) => (
            <Area
              key={fleet.key}
              type="monotone"
              dataKey={fleet.key}
              stroke={fleet.color}
              strokeWidth={2}
              fill={`url(#gradient-${fleet.key})`}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, fill: '#FFFFFF' }}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </Stack>
  );
};
