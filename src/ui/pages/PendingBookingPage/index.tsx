'use client';

import { useState, useMemo } from 'react';
import dayjs from 'dayjs';
import { Stack, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitle, RowStack } from '../../modules/components';
import {
  pxToRem,
  useGetPendingBookings,
  useGetPendingBookingsKpis,
  useResolvedApiQuery,
} from '../../../common';
import { EmptyState } from '../../modules/blocks';
import {
  PendingStatCard,
  PendingBookingCard,
  PendingBookingDetailModal,
} from './ui/components';
import { AssignDriverModal } from '../../modules/components';
import { PendingBooking } from './ui/components/PendingBookingCard';

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

export const PendingBookingPage = () => {
  // — All hooks first —
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<PendingBooking | null>(
    null
  );

  const { data: kpis } = useResolvedApiQuery(useGetPendingBookingsKpis, null);

  const pendingQuery = useGetPendingBookings({ page: 1, limit: 20 });

  const pendingBookings = useMemo(() => {
    const items = pendingQuery.data?.data;
    if (!items?.length) return [];
    return items.map((item) => ({
      id: item.id,
      bookingId: item.id.slice(0, 8).toUpperCase(),
      vehicleType:
        item.ride_type
          ?.replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Standard Ride',
      vehicleTypeColor: '#2F6FED',
      vehicleTypeBg: '#EBF2FF',
      serviceType:
        item.trip_type
          ?.replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()) || 'Transport Only',
      serviceTypeColor: '#2F6FED',
      serviceTypeBg: '#EBF2FF',
      waitTime: `${item.wait_minutes} min`,
      patientName: item.rider_name,
      patientAge: 0,
      patientPhone: item.rider_phone || '',
      pickup: item.pickup_address,
      destination: item.destination_address,
      dateTime: dayjs(item.scheduled_at).format('MMM D, YYYY · hh:mm A'),
      specialNote: item.special_instructions || undefined,
    }));
  }, [pendingQuery.data]);

  // — Derived state / handlers —
  const handleViewDetail = (booking: PendingBooking) => {
    setSelectedBooking(booking);
    setDetailModalOpen(true);
  };

  const handleOpenAssignDriver = (booking?: PendingBooking) => {
    if (booking) setSelectedBooking(booking);
    setAssignModalOpen(true);
  };

  const detailRows = selectedBooking
    ? [
        { label: 'Patient', value: selectedBooking.patientName },
        { label: 'Phone', value: selectedBooking.patientPhone },
        { label: 'Pickup', value: selectedBooking.pickup },
        { label: 'Destination', value: selectedBooking.destination },
        { label: 'Scheduled Time', value: selectedBooking.dateTime },
        { label: 'Wait Time', value: selectedBooking.waitTime },
        { label: 'Assigned Driver', value: 'Unassigned' },
      ]
    : [];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <Stack spacing={'4px'}>
          <DashboardTitle title="Pending Bookings" />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 400,
              fontSize: pxToRem(14),
              lineHeight: '21px',
              color: (theme) => theme.color.lightGrey,
            }}
          >
            New ride requests awaiting driver assignment
          </Typography>
        </Stack>

        {/* Stat Cards */}
        <RowStack spacing={'12px'} width="100%">
          <PendingStatCard
            value={String(kpis?.pending_now ?? 0)}
            label="Pending Now"
          />
          <PendingStatCard
            value={`${kpis?.avg_wait_minutes ?? 0} min`}
            label="Avg. Wait Time"
          />
          <PendingStatCard
            value={String(kpis?.assigned_count ?? 0)}
            label="Assigned"
          />
        </RowStack>

        {/* Booking Cards */}
        {pendingBookings.length > 0 ? (
          <Stack spacing={'12px'}>
            {pendingBookings.map((booking) => (
              <PendingBookingCard
                key={booking.id}
                booking={booking}
                onViewDetail={() => handleViewDetail(booking)}
                onAssignDriver={() => handleOpenAssignDriver(booking)}
              />
            ))}
          </Stack>
        ) : (
          <EmptyState animationSrc="/empty.json" />
        )}
      </Stack>

      {/* Detail Modal */}
      {selectedBooking && (
        <PendingBookingDetailModal
          open={detailModalOpen}
          handleClose={() => setDetailModalOpen(false)}
          bookingId={selectedBooking.bookingId}
          subtitle={selectedBooking.vehicleType}
          details={detailRows}
          specialNote={selectedBooking.specialNote}
          onAssignDriver={() => handleOpenAssignDriver()}
        />
      )}

      {/* Assign Driver Modal */}
      {selectedBooking && (
        <AssignDriverModal
          open={assignModalOpen}
          handleClose={() => setAssignModalOpen(false)}
          bookingId={selectedBooking.bookingId}
          patientName={selectedBooking.patientName}
          rideType={selectedBooking.serviceType}
          pickup={selectedBooking.pickup}
          destination={selectedBooking.destination}
          dateTime={selectedBooking.dateTime}
          drivers={availableDrivers}
        />
      )}
    </AppDashboardLayout>
  );
};
