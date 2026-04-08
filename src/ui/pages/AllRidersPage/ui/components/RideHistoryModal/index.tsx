'use client';

import { useMemo } from 'react';
import dayjs from 'dayjs';
import { Box, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsCarOutlinedIcon from '@mui/icons-material/DirectionsCarOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import { AppModal, RowStack } from '../../../../../modules/components';
import {
  pxToRem,
  useGetRiderRides,
  useResolvedApiQuery,
} from '../../../../../../common';
import type { RiderRow } from '../../..';

// ─── Types ──────────────────────────────────────────────────────────────────

type RideHistoryModalProps = {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
  rider: RiderRow | null;
};

type RideStatus = 'Completed' | 'Cancelled' | 'In Progress';

type RideEntry = {
  id: string;
  status: RideStatus;
  date: string;
  amount: string;
  pickup: string;
  destination: string;
  driver: string;
  rawAmount: number;
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const normalizeStatus = (status?: string | null): RideStatus => {
  const s = (status ?? '').toLowerCase();
  if (s === 'completed') return 'Completed';
  if (s === 'cancelled' || s === 'canceled') return 'Cancelled';
  return 'In Progress';
};

const mapRide = (ride: any): RideEntry => {
  const amount = Number(
    ride?.fare_total ?? ride?.total_amount ?? ride?.amount ?? ride?.fare ?? 0
  );
  return {
    id:
      ride?.booking_id ??
      ride?.id ??
      ride?.ride_id ??
      ride?.booking_reference ??
      '—',
    status: normalizeStatus(ride?.status),
    date: ride?.created_at
      ? dayjs(ride.created_at).format('MMM D, YYYY')
      : ride?.scheduled_at
        ? dayjs(ride.scheduled_at).format('MMM D, YYYY')
        : '—',
    amount: formatCurrency(amount),
    rawAmount: amount,
    pickup: ride?.pickup_address ?? ride?.pickup_location ?? '—',
    destination:
      ride?.dropoff_address ??
      ride?.destination_address ??
      ride?.destination ??
      '—',
    driver:
      ride?.driver_name ||
      [ride?.driver_first_name, ride?.driver_last_name]
        .filter(Boolean)
        .join(' ') ||
      '—',
  };
};

const statusBadge: Record<RideStatus, { color: string; bg: string }> = {
  Completed: { color: '#059669', bg: '#ECFDF5' },
  Cancelled: { color: '#6B7280', bg: '#F3F4F6' },
  'In Progress': { color: '#2F6FED', bg: '#EBF2FF' },
};

// ─── Stat Card ──────────────────────────────────────────────────────────────

const StatCard = ({
  icon,
  value,
  label,
  hasBorder,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  hasBorder?: boolean;
}) => (
  <RowStack
    spacing={'12px'}
    sx={{
      flex: 1,
      padding: '0 20px',
      borderRight: hasBorder ? '0.67px solid #F0F4F8' : 'none',
    }}
  >
    {icon}
    <Stack spacing={'2px'}>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 800,
          fontSize: pxToRem(18),
          lineHeight: '1em',
          color: '#111827',
        }}
      >
        {value}
      </Typography>
      <Typography
        sx={{
          fontFamily: (theme) => theme.typography.fontFamily,
          fontWeight: 400,
          fontSize: pxToRem(11),
          color: '#9CA3AF',
        }}
      >
        {label}
      </Typography>
    </Stack>
  </RowStack>
);

// ─── Component ──────────────────────────────────────────────────────────────

export const RideHistoryModal = ({
  open,
  onClose,
  onBack,
  rider,
}: RideHistoryModalProps) => {
  const { data: ridesPayload } = useResolvedApiQuery(useGetRiderRides, null, {
    riderId: rider?.id ?? '',
    limit: 10,
  });

  const rides = useMemo<RideEntry[]>(() => {
    if (!ridesPayload) return [];
    const list = Array.isArray(ridesPayload)
      ? ridesPayload
      : (ridesPayload?.items ??
        ridesPayload?.rides ??
        ridesPayload?.results ??
        []);
    return (list as any[]).map(mapRide);
  }, [ridesPayload]);

  if (!rider) return null;

  const completedCount = rides.filter((r) => r.status === 'Completed').length;
  const totalPaid = rides
    .filter((r) => r.status === 'Completed')
    .reduce((sum, r) => sum + r.rawAmount, 0);

  const btnSx = {
    width: 30,
    height: 30,
    borderRadius: '8px',
    background: '#F3F4F6',
    border: '0.67px solid #E5E7EB',
  };

  return (
    <AppModal
      open={open}
      setOpen={() => onClose()}
      label="ride-history-modal"
      padding="0px"
      sx={{
        '& .MuiDialog-paper': {
          width: '580px',
          maxHeight: '90vh',
          borderRadius: '16px',
          boxShadow: '0px 24px 64px 0px rgba(0, 0, 0, 0.14)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Stack>
        {/* Header */}
        <RowStack
          spacing={'12px'}
          sx={{
            padding: '0 24px',
            height: 80,
            borderBottom: '0.67px solid #F0F4F8',
          }}
        >
          {/* Back Button */}
          <IconButton onClick={onBack} sx={btnSx}>
            <ArrowBackIcon sx={{ fontSize: 14, color: '#374151' }} />
          </IconButton>

          {/* Avatar */}
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: '17px',
              background: '#E5E7EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <PersonOutlinedIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />
          </Box>

          {/* Name + subtitle */}
          <Stack sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(15),
                color: '#111827',
              }}
            >
              {rider.client}
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(11.5),
                color: '#9CA3AF',
              }}
            >
              Ride History
            </Typography>
          </Stack>

          {/* Close Button */}
          <IconButton onClick={onClose} sx={btnSx}>
            <CloseIcon sx={{ fontSize: 14, color: '#6B7280' }} />
          </IconButton>
        </RowStack>

        {/* Stats Row */}
        <RowStack
          sx={{
            borderBottom: '0.67px solid #F0F4F8',
            py: '16px',
          }}
        >
          <StatCard
            icon={
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '10px',
                  background: 'rgba(47, 111, 237, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <DirectionsCarOutlinedIcon
                  sx={{ fontSize: 15, color: '#2F6FED' }}
                />
              </Box>
            }
            value={String(rides.length)}
            label="Total Trips"
            hasBorder
          />
          <StatCard
            icon={
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckCircleOutlinedIcon
                  sx={{ fontSize: 15, color: '#10B981' }}
                />
              </Box>
            }
            value={String(completedCount)}
            label="Completed"
            hasBorder
          />
          <StatCard
            icon={
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: '10px',
                  background: 'rgba(139, 92, 246, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AttachMoneyOutlinedIcon
                  sx={{ fontSize: 15, color: '#8B5CF6' }}
                />
              </Box>
            }
            value={formatCurrency(totalPaid)}
            label="Total Paid"
          />
        </RowStack>

        {/* Ride History List — scrollable */}
        <Stack
          spacing={'10px'}
          sx={{
            padding: '20px',
            paddingBottom: '30px',
            maxHeight: 400,
            overflowY: 'auto',
          }}
        >
          {rides.length === 0 && (
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(12.5),
                color: '#9CA3AF',
                textAlign: 'center',
                py: '24px',
              }}
            >
              No ride history available.
            </Typography>
          )}
          {rides.map((ride) => {
            const badge = statusBadge[ride.status];
            const isCancelled = ride.status === 'Cancelled';
            return (
              <Stack
                key={ride.id}
                sx={{
                  background: '#F7F9FB',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '14px',
                  padding: '14px 16px',
                }}
                spacing={'8px'}
              >
                {/* Row 1: Booking ID + Status | Date + Amount */}
                <RowStack justifyContent={'space-between'}>
                  <RowStack spacing={'8px'}>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(12),
                        color: '#374151',
                      }}
                    >
                      {ride.id}
                    </Typography>
                    <Box
                      sx={{
                        background: badge.bg,
                        borderRadius: '100px',
                        padding: '1px 10px',
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 600,
                          fontSize: pxToRem(10.5),
                          color: badge.color,
                        }}
                      >
                        {ride.status}
                      </Typography>
                    </Box>
                  </RowStack>
                  <RowStack spacing={'12px'}>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 400,
                        fontSize: pxToRem(12),
                        color: '#9CA3AF',
                      }}
                    >
                      {ride.date}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 700,
                        fontSize: pxToRem(13),
                        color: isCancelled ? '#9CA3AF' : '#111827',
                      }}
                    >
                      {ride.amount}
                    </Typography>
                  </RowStack>
                </RowStack>

                {/* Row 2: Pickup → Destination */}
                <RowStack spacing={'6px'}>
                  <FmdGoodOutlinedIcon
                    sx={{ fontSize: 11, color: '#9CA3AF' }}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(12),
                      color: '#6B7280',
                    }}
                  >
                    {ride.pickup}
                  </Typography>
                  <PlaceOutlinedIcon
                    sx={{ fontSize: 11, color: '#C4CAD4', ml: '6px' }}
                  />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 500,
                      fontSize: pxToRem(12),
                      color: '#374151',
                    }}
                  >
                    {ride.destination}
                  </Typography>
                </RowStack>

                {/* Row 3: Driver */}
                <RowStack spacing={'6px'}>
                  <PersonOutlinedIcon sx={{ fontSize: 10, color: '#9CA3AF' }} />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(11),
                      color: '#9CA3AF',
                    }}
                  >
                    Driver:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(11),
                      color: '#6B7280',
                    }}
                  >
                    {ride.driver}
                  </Typography>
                </RowStack>
              </Stack>
            );
          })}
        </Stack>
      </Stack>
    </AppModal>
  );
};
