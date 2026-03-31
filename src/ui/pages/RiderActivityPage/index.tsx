'use client';

import { Avatar, Box, LinearProgress, Stack, Typography } from '@mui/material';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import TrendingFlatOutlinedIcon from '@mui/icons-material/TrendingFlatOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import { pxToRem } from '../../../common';

// ─── Types ──────────────────────────────────────────────────────────────────

type RiderStatus = 'Active' | 'Suspended' | 'Inactive';
type Trend = 'Increasing' | 'Decreasing' | 'Stable';

type RiderActivity = {
  id: string;
  name: string;
  avatar: string;
  lastSeen: string;
  frequency: string;
  avgPerWeek: number;
  monthlyTrips: number;
  maxTrips: number;
  barColor: string;
  trend: Trend;
  status: RiderStatus;
};

// ─── Config ─────────────────────────────────────────────────────────────────

const trendConfig: Record<Trend, { color: string; icon: React.ReactNode }> = {
  Increasing: {
    color: '#059669',
    icon: <TrendingUpOutlinedIcon sx={{ fontSize: 14, color: '#059669' }} />,
  },
  Decreasing: {
    color: '#EF4444',
    icon: <TrendingDownOutlinedIcon sx={{ fontSize: 14, color: '#EF4444' }} />,
  },
  Stable: {
    color: '#6B7280',
    icon: <TrendingFlatOutlinedIcon sx={{ fontSize: 14, color: '#6B7280' }} />,
  },
};

const statusConfig: Record<RiderStatus, { color: string }> = {
  Active: { color: '#2F6FED' },
  Suspended: { color: '#EF4444' },
  Inactive: { color: '#9CA3AF' },
};

// ─── Mock Data ──────────────────────────────────────────────────────────────

const activityData: RiderActivity[] = [
  {
    id: 'R-004',
    name: 'Daniel Martinez',
    avatar: '',
    lastSeen: 'Today',
    frequency: 'Daily',
    avgPerWeek: 4.8,
    monthlyTrips: 21,
    maxTrips: 25,
    barColor: '#10B981',
    trend: 'Increasing',
    status: 'Active',
  },
  {
    id: 'R-003',
    name: 'Patricia Clark',
    avatar: '',
    lastSeen: 'Today',
    frequency: 'Daily',
    avgPerWeek: 4.2,
    monthlyTrips: 18,
    maxTrips: 25,
    barColor: '#10B981',
    trend: 'Increasing',
    status: 'Active',
  },
  {
    id: 'R-001',
    name: 'Helen Moore',
    avatar: '',
    lastSeen: 'Today',
    frequency: '3–4×/week',
    avgPerWeek: 3.5,
    monthlyTrips: 15,
    maxTrips: 25,
    barColor: '#8B5CF6',
    trend: 'Stable',
    status: 'Active',
  },
  {
    id: 'R-002',
    name: 'Robert Garcia',
    avatar: '',
    lastSeen: 'Yesterday',
    frequency: '2×/week',
    avgPerWeek: 2.1,
    monthlyTrips: 9,
    maxTrips: 25,
    barColor: '#6366F1',
    trend: 'Stable',
    status: 'Active',
  },
  {
    id: 'R-005',
    name: 'Nancy White',
    avatar: '',
    lastSeen: 'Mar 7',
    frequency: '1–2×/week',
    avgPerWeek: 1.4,
    monthlyTrips: 6,
    maxTrips: 25,
    barColor: '#F59E0B',
    trend: 'Decreasing',
    status: 'Active',
  },
  {
    id: 'R-006',
    name: 'Lisa Anderson',
    avatar: '',
    lastSeen: 'Mar 6',
    frequency: 'Weekly',
    avgPerWeek: 0.9,
    monthlyTrips: 4,
    maxTrips: 25,
    barColor: '#3B82F6',
    trend: 'Stable',
    status: 'Active',
  },
  {
    id: 'R-007',
    name: 'George Lewis',
    avatar: '',
    lastSeen: 'Feb 14',
    frequency: 'Irregular',
    avgPerWeek: 0.3,
    monthlyTrips: 1,
    maxTrips: 25,
    barColor: '#EF4444',
    trend: 'Decreasing',
    status: 'Suspended',
  },
  {
    id: 'R-008',
    name: 'James Porter',
    avatar: '',
    lastSeen: 'Jan 22',
    frequency: 'Inactive',
    avgPerWeek: 0,
    monthlyTrips: 0,
    maxTrips: 25,
    barColor: '#D1D5DB',
    trend: 'Stable',
    status: 'Inactive',
  },
];

// ─── Stat Card ──────────────────────────────────────────────────────────────

const StatCard = ({
  icon,
  value,
  label,
  valueColor,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  valueColor: string;
}) => (
  <Stack
    sx={{
      flex: 1,
      background: '#FFFFFF',
      border: '0.67px solid #E8ECF0',
      borderRadius: '14px',
      padding: '20px',
    }}
  >
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: '10px',
        background: '#F7F9FB',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '14px',
      }}
    >
      {icon}
    </Box>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 700,
        fontSize: pxToRem(24),
        lineHeight: '1.3em',
        color: valueColor,
      }}
    >
      {value}
    </Typography>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 500,
        fontSize: pxToRem(12.5),
        lineHeight: '1.5em',
        color: '#6B7280',
        marginTop: '2px',
      }}
    >
      {label}
    </Typography>
  </Stack>
);

// ─── Component ──────────────────────────────────────────────────────────────

export const RiderActivityPage = () => {
  const dailyActiveCount = activityData.filter(
    (r) => r.lastSeen === 'Today'
  ).length;
  const activeRiders = activityData.filter((r) => r.status === 'Active');
  const avgTripsPerWeek =
    activeRiders.length > 0
      ? (
          activeRiders.reduce((sum, r) => sum + r.avgPerWeek, 0) /
          activeRiders.length
        ).toFixed(1)
      : '0';
  const inactiveCount = activityData.filter(
    (r) => r.status === 'Inactive' || r.status === 'Suspended'
  ).length;

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Rider Activity"
          desc="Ride frequency, usage trends, and account status for all riders"
        />

        {/* Stat Cards */}
        <RowStack spacing={'16px'}>
          <StatCard
            icon={
              <PeopleOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
            }
            value={String(dailyActiveCount)}
            label="Daily Active Riders"
            valueColor="#2F6FED"
          />
          <StatCard
            icon={
              <ScheduleOutlinedIcon sx={{ fontSize: 18, color: '#D97706' }} />
            }
            value={avgTripsPerWeek}
            label="Avg. Trips / Week"
            valueColor="#D97706"
          />
          <StatCard
            icon={
              <PersonOffOutlinedIcon sx={{ fontSize: 18, color: '#EF4444' }} />
            }
            value={String(inactiveCount)}
            label="Inactive (30+ days)"
            valueColor="#EF4444"
          />
        </RowStack>

        {/* Activity Overview */}
        <Stack
          sx={{
            background: '#FFFFFF',
            border: '0.67px solid #E8ECF0',
            borderRadius: '16px',
            boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
            overflow: 'hidden',
          }}
        >
          {/* Section Header */}
          <Stack sx={{ padding: '20px 24px 0' }}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(16),
                color: '#111827',
              }}
            >
              Rider Activity Overview
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12.5),
                color: '#9CA3AF',
              }}
            >
              March 2026
            </Typography>
          </Stack>

          {/* Activity Rows */}
          <Stack spacing={'12px'} sx={{ padding: '16px 24px 20px' }}>
            {activityData.map((rider) => {
              const nameParts = rider.name.split(' ');
              const initials =
                nameParts.length > 1
                  ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
                  : nameParts[0].charAt(0);

              const trend = trendConfig[rider.trend];
              const status = statusConfig[rider.status];
              const progressValue = (rider.monthlyTrips / rider.maxTrips) * 100;

              return (
                <RowStack
                  key={rider.id}
                  sx={{
                    padding: '12px 16px',
                    background: '#F7F9FB',
                    border: '0.67px solid #F0F4F8',
                    borderRadius: '14px',
                  }}
                >
                  {/* Avatar + Name */}
                  <RowStack spacing={'12px'} sx={{ width: 200, flexShrink: 0 }}>
                    <Avatar
                      src={rider.avatar || undefined}
                      alt={rider.name}
                      sx={{
                        width: 38,
                        height: 38,
                        fontSize: pxToRem(12),
                        fontWeight: 600,
                        background: '#E5E7EB',
                        color: '#9CA3AF',
                      }}
                    >
                      {initials}
                    </Avatar>
                    <Stack spacing={0}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(13),
                          color: '#111827',
                          lineHeight: '1.4em',
                        }}
                      >
                        {rider.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(11),
                          color: '#9CA3AF',
                          lineHeight: '1.4em',
                        }}
                      >
                        Last seen: {rider.lastSeen}
                      </Typography>
                    </Stack>
                  </RowStack>

                  {/* Frequency */}
                  <Stack sx={{ width: 90, flexShrink: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(10),
                        color: '#9CA3AF',
                        lineHeight: '1.5em',
                      }}
                    >
                      Frequency
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(12.5),
                        color: '#374151',
                        lineHeight: '1.5em',
                      }}
                    >
                      {rider.frequency}
                    </Typography>
                  </Stack>

                  {/* Avg / week */}
                  <Stack sx={{ width: 70, flexShrink: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(10),
                        color: '#9CA3AF',
                        lineHeight: '1.5em',
                      }}
                    >
                      Avg / week
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(12.5),
                        color: '#374151',
                        lineHeight: '1.5em',
                      }}
                    >
                      {rider.avgPerWeek}
                    </Typography>
                  </Stack>

                  {/* Monthly Trips + Progress Bar */}
                  <Stack sx={{ flex: 1, minWidth: 0 }}>
                    <RowStack spacing={'6px'}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(10),
                          color: '#9CA3AF',
                        }}
                      >
                        Monthly Trips:
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 700,
                          fontSize: pxToRem(13),
                          color: '#111827',
                        }}
                      >
                        {rider.monthlyTrips}
                      </Typography>
                    </RowStack>
                    <LinearProgress
                      variant="determinate"
                      value={progressValue}
                      sx={{
                        height: 6,
                        borderRadius: '100px',
                        backgroundColor: '#F3F4F6',
                        mt: '4px',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: '100px',
                          backgroundColor: rider.barColor,
                        },
                      }}
                    />
                  </Stack>

                  {/* Trend */}
                  <RowStack
                    spacing={'4px'}
                    sx={{ width: 100, flexShrink: 0, justifyContent: 'center' }}
                  >
                    {rider.status !== 'Inactive' ? (
                      <>
                        {trend.icon}
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 500,
                            fontSize: pxToRem(11.5),
                            color: trend.color,
                          }}
                        >
                          {rider.trend}
                        </Typography>
                      </>
                    ) : (
                      <RemoveIcon sx={{ fontSize: 14, color: '#D1D5DB' }} />
                    )}
                  </RowStack>

                  {/* Status */}
                  <Box
                    sx={{
                      width: 80,
                      flexShrink: 0,
                      textAlign: 'right',
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(12),
                        color: status.color,
                      }}
                    >
                      {rider.status}
                    </Typography>
                  </Box>
                </RowStack>
              );
            })}
          </Stack>
        </Stack>
      </Stack>
    </AppDashboardLayout>
  );
};
