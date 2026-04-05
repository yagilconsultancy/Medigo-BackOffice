'use client';

import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Avatar,
  Box,
  LinearProgress,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import TrendingDownOutlinedIcon from '@mui/icons-material/TrendingDownOutlined';
import TrendingFlatOutlinedIcon from '@mui/icons-material/TrendingFlatOutlined';
import RemoveIcon from '@mui/icons-material/Remove';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import { CustomPagination } from '../../modules/components/GridTable/ui/components/DataGridPagination/ui/components/CustomPagination';
import { EmptyState } from '../../modules/blocks';
import {
  pxToRem,
  useGetRidersActivity,
  useResolvedApiQuery,
  type AdminRiderActivityItem,
  type AdminRiderActivityResponse,
} from '../../../common';

const DEFAULT_ACTIVITY: AdminRiderActivityResponse = {
  kpis: {
    daily_active_riders: 0,
    avg_trips_per_week: 0,
    inactive_30_days: 0,
  },
  riders: [],
  total: 0,
  page: 1,
  limit: 10,
  total_pages: 0,
};

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

// ─── Helpers ────────────────────────────────────────────────────────────────

const normalizeStatus = (value?: string | null): RiderStatus => {
  const v = (value ?? '').toLowerCase();
  if (v === 'suspended') return 'Suspended';
  if (v === 'inactive') return 'Inactive';
  return 'Active';
};

const normalizeTrend = (value?: string | null): Trend => {
  const v = (value ?? '').toLowerCase();
  if (v === 'increasing' || v === 'up') return 'Increasing';
  if (v === 'decreasing' || v === 'down') return 'Decreasing';
  return 'Stable';
};

const formatLastSeen = (value?: string | null): string => {
  if (!value) return '—';
  const date = dayjs(value);
  if (!date.isValid()) return '—';
  const today = dayjs().startOf('day');
  const yesterday = today.subtract(1, 'day');
  if (date.isSame(today, 'day')) return 'Today';
  if (date.isSame(yesterday, 'day')) return 'Yesterday';
  return date.format('MMM D');
};

const resolveBarColor = (avgPerWeek: number, status: RiderStatus): string => {
  if (status === 'Inactive') return '#D1D5DB';
  if (status === 'Suspended') return '#EF4444';
  if (avgPerWeek >= 4) return '#10B981';
  if (avgPerWeek >= 3) return '#8B5CF6';
  if (avgPerWeek >= 2) return '#6366F1';
  if (avgPerWeek >= 1) return '#3B82F6';
  return '#F59E0B';
};

const mapActivity = (item: AdminRiderActivityItem): RiderActivity => {
  const fullName =
    `${item.first_name ?? ''} ${item.last_name ?? ''}`.trim() || 'Unknown';
  const status = normalizeStatus(item.status);
  const trend = normalizeTrend(item.trend);
  const avgPerWeek = item.avg_trips_per_week ?? 0;
  const monthlyTrips = item.monthly_trips ?? 0;

  return {
    id: item.user_id,
    name: fullName,
    avatar: item.avatar_url ?? '',
    lastSeen: formatLastSeen(item.last_seen),
    frequency: item.frequency || '—',
    avgPerWeek,
    monthlyTrips,
    maxTrips: 25,
    barColor: resolveBarColor(avgPerWeek, status),
    trend,
    status,
  };
};

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

export const RiderActivityPage = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const { data: activityData, isFetching } = useResolvedApiQuery(
    useGetRidersActivity,
    DEFAULT_ACTIVITY,
    {
      page: paginationModel.page + 1,
      limit: paginationModel.pageSize,
    }
  );

  const activity = useMemo<RiderActivity[]>(() => {
    return activityData.riders.map(mapActivity);
  }, [activityData]);

  const dailyActiveCount = activityData.kpis.daily_active_riders;
  const avgTripsPerWeek = activityData.kpis.avg_trips_per_week.toFixed(1);
  const inactiveCount = activityData.kpis.inactive_30_days;
  const totalCount = activityData.total;

  const handlePageChange = (newPage: number) => {
    setPaginationModel((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPaginationModel({ page: 0, pageSize: newPageSize });
  };

  if (isFetching) {
    return (
      <AppDashboardLayout>
        <Stack spacing={'24px'}>
          <Stack spacing={'6px'}>
            <Skeleton
              variant="rectangular"
              height={28}
              width={240}
              sx={{ borderRadius: '8px' }}
            />
            <Skeleton
              variant="rectangular"
              height={16}
              width={420}
              sx={{ borderRadius: '8px' }}
            />
          </Stack>
          <RowStack spacing={'16px'}>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={120}
                sx={{ flex: 1, borderRadius: '14px' }}
              />
            ))}
          </RowStack>
          <Stack
            sx={{
              background: '#FFFFFF',
              border: '0.67px solid #E8ECF0',
              borderRadius: '16px',
              overflow: 'hidden',
              padding: '20px 24px',
            }}
            spacing={'12px'}
          >
            <Skeleton
              variant="rectangular"
              height={22}
              width={220}
              sx={{ borderRadius: '6px' }}
            />
            <Skeleton
              variant="rectangular"
              height={14}
              width={120}
              sx={{ borderRadius: '6px', mb: '8px' }}
            />
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                height={62}
                sx={{ borderRadius: '14px' }}
              />
            ))}
          </Stack>
        </Stack>
      </AppDashboardLayout>
    );
  }

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
              {dayjs().format('MMMM YYYY')}
            </Typography>
          </Stack>

          {/* Activity Rows */}
          {activity.length === 0 ? (
            <Box sx={{ height: 400, width: '100%' }}>
              <EmptyState animationSrc="/empty.json" />
            </Box>
          ) : (
            <Stack spacing={'12px'} sx={{ padding: '16px 24px 12px' }}>
              {activity.map((rider) => {
                const nameParts = rider.name.split(' ');
                const initials =
                  nameParts.length > 1
                    ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`
                    : nameParts[0].charAt(0);

                const trend = trendConfig[rider.trend];
                const status = statusConfig[rider.status];
                const progressValue =
                  (rider.monthlyTrips / rider.maxTrips) * 100;

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
                    <RowStack
                      spacing={'12px'}
                      sx={{ width: 200, flexShrink: 0 }}
                    >
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
                      sx={{
                        width: 100,
                        flexShrink: 0,
                        justifyContent: 'center',
                      }}
                    >
                      {rider.status !== 'Inactive' ? (
                        <>
                          {trend.icon}
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
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
          )}

          {/* Pagination */}
          {totalCount > 0 && (
            <CustomPagination
              count={totalCount}
              page={paginationModel.page}
              pageSize={paginationModel.pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          )}
        </Stack>
      </Stack>
    </AppDashboardLayout>
  );
};
