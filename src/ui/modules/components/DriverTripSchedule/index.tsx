'use client';

import { useMemo, useState } from 'react';
import { Box, Chip, CircularProgress, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { pxToRem } from '../../../../common';
import { RowStack } from '../RowStack';

// ─── Trip Buckets ───────────────────────────────────────────────────────────

export type TripBucket = 'current' | 'upcoming' | 'previous';

/** Ride is over — nothing else will happen on it. */
const TERMINAL_STATUSES = ['completed', 'cancelled', 'no_show'];

/** Driver is actively working the ride right now. */
const LIVE_STATUSES = ['driver_en_route', 'driver_arrived', 'in_progress'];

export const bucketForTrip = (
  status: string,
  scheduledAt?: string | null
): TripBucket => {
  const normalized = (status || '').toLowerCase();
  if (TERMINAL_STATUSES.includes(normalized)) return 'previous';
  if (LIVE_STATUSES.includes(normalized)) return 'current';
  // Assigned/confirmed but not started: it's upcoming until its slot arrives,
  // then it counts as current so overdue pickups stay visible.
  return scheduledAt && dayjs(scheduledAt).isAfter(dayjs())
    ? 'upcoming'
    : 'current';
};

const tripStatusChipStyles = (status: string) => {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'completed') {
    return { background: '#ECFDF5', color: '#059669' };
  }
  if (normalized === 'cancelled' || normalized === 'no_show') {
    return { background: '#FEF2F2', color: '#DC2626' };
  }
  if (LIVE_STATUSES.includes(normalized)) {
    return { background: '#EEF2FF', color: '#4338CA' };
  }
  return { background: '#FEF3C7', color: '#B45309' };
};

export const BUCKET_META: Record<
  TripBucket,
  { label: string; description: string; accent: string }
> = {
  current: {
    label: 'Current',
    description: 'In progress or due now',
    accent: '#4338CA',
  },
  upcoming: {
    label: 'Upcoming',
    description: 'Scheduled ahead',
    accent: '#B45309',
  },
  previous: {
    label: 'Previous',
    description: 'Completed or closed',
    accent: '#059669',
  },
};

const titleCase = (value?: string | null, fallback = '—') => {
  if (!value) return fallback;
  return value
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

// ─── Trip Card ──────────────────────────────────────────────────────────────

export type TripCardData = {
  key: string;
  id: string;
  fare: string;
  status: string;
  rider: string;
  pickup: string;
  dropoff: string;
  date: string;
  bucket: TripBucket;
  sortValue: number;
};

export const TripCard = ({ trip }: { trip: TripCardData }) => {
  const chip = tripStatusChipStyles(trip.status);
  return (
    <Stack
      spacing={'8px'}
      sx={{
        background: '#F7F9FB',
        border: '0.67px solid #F0F2F5',
        borderLeft: `3px solid ${BUCKET_META[trip.bucket].accent}`,
        borderRadius: '14px',
        padding: '16px',
      }}
    >
      <RowStack justifyContent={'space-between'}>
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(11.5),
            color: '#2F6FED',
          }}
        >
          {trip.id}
        </Typography>
        <RowStack spacing={'8px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 700,
              fontSize: pxToRem(12.5),
              color: '#059669',
            }}
          >
            {trip.fare}
          </Typography>
          <Chip
            label={titleCase(trip.status)}
            size="small"
            sx={{
              background: chip.background,
              color: chip.color,
              fontFamily: 'Inter, sans-serif',
              fontWeight: 600,
              fontSize: pxToRem(10.5),
              height: '20px',
              borderRadius: '100px',
            }}
          />
        </RowStack>
      </RowStack>

      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 600,
          fontSize: pxToRem(12.5),
          color: '#111827',
        }}
      >
        {trip.rider}
      </Typography>

      <RowStack spacing={'8px'}>
        <Box
          sx={{
            width: 5,
            height: 5,
            borderRadius: '2.5px',
            border: '1.33px solid #6B7280',
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11.5),
            color: '#6B7280',
          }}
        >
          {trip.pickup}
        </Typography>
      </RowStack>

      <RowStack spacing={'8px'}>
        <Box
          sx={{
            width: 5,
            height: 5,
            borderRadius: '2.5px',
            background: '#2F6FED',
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(11.5),
            color: '#6B7280',
          }}
        >
          {trip.dropoff}
        </Typography>
      </RowStack>

      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(11),
          color: '#9CA3AF',
        }}
      >
        {trip.date}
      </Typography>
    </Stack>
  );
};

// ─── Schedule ───────────────────────────────────────────────────────────────

const ScheduleLabel = ({ text }: { text: string }) => (
  <Typography
    sx={{
      fontFamily: (theme) => theme.typography.fontFamily,
      fontWeight: 700,
      fontSize: pxToRem(10),
      letterSpacing: '0.08em',
      color: '#9CA3AF',
      textTransform: 'uppercase',
    }}
  >
    {text}
  </Typography>
);

export type DriverTripScheduleProps = {
  trips: TripCardData[];
  isLoading?: boolean;
  emptyText?: string;
};

/**
 * Groups a driver's assignments into previous / current / upcoming with a
 * count-bearing filter above. Shared by the fleet and all-drivers drawers.
 */
export const DriverTripSchedule = ({
  trips,
  isLoading = false,
  emptyText = 'No trips assigned to this driver yet.',
}: DriverTripScheduleProps) => {
  const [tripFilter, setTripFilter] = useState<'all' | TripBucket>('all');

  const groupedTrips = useMemo(() => {
    const groups: Record<TripBucket, TripCardData[]> = {
      current: [],
      upcoming: [],
      previous: [],
    };
    trips.forEach((trip) => groups[trip.bucket].push(trip));
    // Soonest first for what's ahead, most recent first for what's done.
    groups.current.sort((a, b) => a.sortValue - b.sortValue);
    groups.upcoming.sort((a, b) => a.sortValue - b.sortValue);
    groups.previous.sort((a, b) => b.sortValue - a.sortValue);
    return groups;
  }, [trips]);

  const visibleBuckets = useMemo<TripBucket[]>(
    () =>
      tripFilter === 'all'
        ? (['current', 'upcoming', 'previous'] as TripBucket[])
        : [tripFilter],
    [tripFilter]
  );

  return (
    <Stack spacing={'16px'}>
      {/* Bucket filter */}
      <RowStack
        spacing={'6px'}
        sx={{
          background: '#F3F5F8',
          borderRadius: '10px',
          padding: '4px',
        }}
      >
        {(['all', 'previous', 'current', 'upcoming'] as const).map((key) => {
          const isActive = tripFilter === key;
          const count = key === 'all' ? trips.length : groupedTrips[key].length;
          return (
            <Box
              key={key}
              onClick={() => setTripFilter(key)}
              sx={{
                flex: 1,
                height: '30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                borderRadius: '8px',
                cursor: 'pointer',
                background: isActive ? '#FFFFFF' : 'transparent',
                boxShadow: isActive
                  ? '0px 1px 3px rgba(16, 24, 40, 0.08)'
                  : 'none',
                transition: 'background 0.15s ease',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(12),
                  color: isActive ? '#111827' : '#6B7280',
                }}
              >
                {key === 'all' ? 'All' : BUCKET_META[key].label}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 600,
                  fontSize: pxToRem(10.5),
                  color: isActive ? '#2F6FED' : '#9CA3AF',
                }}
              >
                {count}
              </Typography>
            </Box>
          );
        })}
      </RowStack>

      {isLoading && !trips.length ? (
        <Stack alignItems="center" sx={{ py: '24px' }}>
          <CircularProgress size={20} sx={{ color: '#2F6FED' }} />
        </Stack>
      ) : trips.length ? (
        <Stack spacing={'20px'}>
          {visibleBuckets.map((bucket) => (
            <Stack key={bucket} spacing={'10px'}>
              <RowStack spacing={'8px'}>
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: '3px',
                    background: BUCKET_META[bucket].accent,
                  }}
                />
                <ScheduleLabel
                  text={`${BUCKET_META[bucket].label} · ${BUCKET_META[bucket].description}`}
                />
              </RowStack>
              {groupedTrips[bucket].length ? (
                <Stack spacing={'12px'}>
                  {groupedTrips[bucket].map((trip) => (
                    <TripCard key={trip.key} trip={trip} />
                  ))}
                </Stack>
              ) : (
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: '#9CA3AF',
                    py: '8px',
                  }}
                >
                  No {BUCKET_META[bucket].label.toLowerCase()} trips.
                </Typography>
              )}
            </Stack>
          ))}
        </Stack>
      ) : (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(12),
            color: '#9CA3AF',
            textAlign: 'center',
            py: '24px',
          }}
        >
          {emptyText}
        </Typography>
      )}
    </Stack>
  );
};
