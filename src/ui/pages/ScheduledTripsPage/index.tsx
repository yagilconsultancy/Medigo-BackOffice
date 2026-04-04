'use client';

import { Stack, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { AssignDriverModal, RowStack } from '../../modules/components';
import {
  pxToRem,
  useGetScheduledTrips,
  useGetScheduledTripsKpis,
  useResolvedApiQuery,
} from '../../../common';
import { ScheduledTripRow, ScheduledTrip } from './ui/components';
import { EmptyState } from '../../modules/blocks';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import { useState, useMemo } from 'react';
import dayjs from 'dayjs';

const availableDrivers = [
  {
    id: '1',
    initials: 'MJ',
    initialsColor: '#2F6FED',
    name: 'Marcus Johnson',
    vehicle: 'Toyota Sienna · 2022',
    rating: 4.9,
  },
  {
    id: '2',
    initials: 'DC',
    initialsColor: '#F59E0B',
    name: 'David Chen',
    vehicle: 'Ford Escape · 2023',
    rating: 4.8,
  },
  {
    id: '3',
    initials: 'AK',
    initialsColor: '#8B5CF6',
    name: 'Anna Kim',
    vehicle: 'Toyota Camry · 2022',
    rating: 4.6,
  },
  {
    id: '4',
    initials: 'KC',
    initialsColor: '#0EA5E9',
    name: 'Kevin Cho',
    vehicle: 'Ford Explorer · 2022',
    rating: 4.6,
  },
  {
    id: '5',
    initials: 'GM',
    initialsColor: '#D97706',
    name: 'Grace Miller',
    vehicle: 'Buick Enclave · 2021',
    rating: 4.4,
  },
];

export const ScheduledTripsPage = () => {
  // — All hooks first —
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<ScheduledTrip | null>(null);

  const { data: kpis } = useResolvedApiQuery(useGetScheduledTripsKpis, null);
  const scheduledQuery = useGetScheduledTrips({ page: 1, limit: 20 });

  const scheduledTrips = useMemo(() => {
    const items = scheduledQuery.data?.data;
    if (!items?.length) return [];
    return items.map((item) => ({
      id: item.id,
      patientName: item.rider_name,
      bookingId: item.id.slice(0, 8).toUpperCase(),
      vehicleType:
        item.ride_type
          ?.replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Standard Ride',
      vehicleTypeColor: '#2F6FED',
      vehicleTypeBg: '#EBF2FF',
      recurrence: item.recurring_frequency || undefined,
      dateTime: dayjs(item.scheduled_at).format('MMM D, YYYY · hh:mm A'),
      route: `${item.pickup_address} → ${item.destination_address}`,
      driverName: item.driver_name || null,
    }));
  }, [scheduledQuery.data]);

  // — Derived state —
  const statCards = [
    { value: String(kpis?.upcoming_count ?? 0), label: 'Upcoming Trips' },
    { value: String(kpis?.recurring_count ?? 0), label: 'Recurring' },
    {
      value: String(kpis?.needs_assignment_count ?? 0),
      label: 'Needs Assignment',
    },
  ];

  // — Handlers —
  const handleOpenAssignDriver = (trip: ScheduledTrip) => {
    setSelectedTrip(trip);
    setAssignModalOpen(true);
  };

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <Stack spacing={'4px'}>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(24),
              lineHeight: '36px',
              color: (theme) => theme.color.deepBlue,
            }}
          >
            Scheduled Trips
          </Typography>
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(14),
              lineHeight: '21px',
              color: (theme) => theme.color.lightGrey,
            }}
          >
            Future and recurring bookings scheduled in advance
          </Typography>
        </Stack>

        {/* Stat Cards */}
        <RowStack spacing={'12px'} width="100%">
          {statCards.map((card, index) => (
            <Stack
              key={index}
              spacing={'4px'}
              sx={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '21px',
                flex: 1,
                border: '0.67px solid #EAECF0',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 800,
                  fontSize: pxToRem(32),
                  lineHeight: '48px',
                  color: (theme) => theme.color.deepBlue,
                }}
              >
                {card.value}
              </Typography>
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 400,
                  fontSize: pxToRem(13),
                  lineHeight: '19.5px',
                  color: (theme) => theme.color.lightGrey,
                }}
              >
                {card.label}
              </Typography>
            </Stack>
          ))}
        </RowStack>

        {/* Upcoming Schedule Table */}
        <Stack
          sx={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '0.67px solid #EAECF0',
            overflow: 'hidden',
          }}
        >
          {/* Table Header */}
          <RowStack
            spacing={'8px'}
            sx={{
              padding: '18px 24px',
              borderBottom: '0.67px solid #F3F4F6',
            }}
          >
            <CalendarTodayOutlinedIcon
              sx={{ fontSize: 16, color: '#2F6FED' }}
            />
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 500,
                fontSize: pxToRem(18),
                color: (theme) => theme.color.deepBlue,
              }}
            >
              Upcoming Schedule
            </Typography>
          </RowStack>

          {/* Table Rows */}
          {scheduledTrips.length === 0 ? (
            <EmptyState animationSrc="/empty.json" />
          ) : (
            scheduledTrips.map((trip, index) => (
              <ScheduledTripRow
                key={trip.id}
                trip={{
                  ...trip,
                  onAssign: () => handleOpenAssignDriver(trip),
                }}
                isLast={index === scheduledTrips.length - 1}
              />
            ))
          )}
        </Stack>
      </Stack>

      {/* Assign Driver Modal */}
      {selectedTrip && (
        <AssignDriverModal
          open={assignModalOpen}
          handleClose={() => setAssignModalOpen(false)}
          bookingId={selectedTrip.bookingId}
          patientName={selectedTrip.patientName}
          rideType={selectedTrip.vehicleType}
          pickup={selectedTrip.route.split(' → ')[0] || selectedTrip.route}
          destination={selectedTrip.route.split(' → ')[1] || ''}
          dateTime={selectedTrip.dateTime}
          drivers={availableDrivers}
        />
      )}
    </AppDashboardLayout>
  );
};
