'use client';

import { Stack, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { RowStack } from '../../modules/components';
import { pxToRem } from '../../../common';
import { useState } from 'react';
import {
  PendingStatCard,
  PendingBookingCard,
  PendingBookingDetailModal,
  AssignDriverModal,
} from './ui/components';
import { PendingBooking } from './ui/components/PendingBookingCard';

const pendingBookings: PendingBooking[] = [
  {
    id: '1',
    bookingId: 'BK-20495',
    vehicleType: 'MediGo Wheelchair Van',
    vehicleTypeColor: '#059669',
    vehicleTypeBg: '#ECFDF5',
    serviceType: 'Transport + Care Assistant',
    serviceTypeColor: '#16A34A',
    serviceTypeBg: '#F0FDF4',
    waitTime: '24 min',
    patientName: 'Claire Beaumont',
    patientAge: 72,
    patientPhone: '+1 416 555 0123',
    pickup: '120 King St W, Toronto, ON',
    destination: 'Toronto General Hospital',
    dateTime: 'Mar 10, 2026 · 09:00 AM',
    specialNote: 'Requires lift-equipped vehicle',
  },
  {
    id: '2',
    bookingId: 'BK-20494',
    vehicleType: 'MediGo Standard Ride',
    vehicleTypeColor: '#2F6FED',
    vehicleTypeBg: '#EBF2FF',
    serviceType: 'Transport Only',
    serviceTypeColor: '#2F6FED',
    serviceTypeBg: '#EBF2FF',
    waitTime: '12 min',
    patientName: 'Pierre Tremblay',
    patientAge: 58,
    patientPhone: '+1 514 555 0198',
    pickup: '455 Ste-Catherine St W, Montréal, QC',
    destination: 'Montreal General Hospital',
    dateTime: 'Mar 10, 2026 · 10:30 AM',
  },
  {
    id: '3',
    bookingId: 'BK-20493',
    vehicleType: 'MediGo Stretcher Van',
    vehicleTypeColor: '#6366F1',
    vehicleTypeBg: '#EEF2FF',
    serviceType: 'Transport + Care Assistant',
    serviceTypeColor: '#16A34A',
    serviceTypeBg: '#F0FDF4',
    waitTime: '8 min',
    patientName: 'Dorothy MacLeod',
    patientAge: 81,
    patientPhone: '+1 613 555 0147',
    pickup: 'Rideau Place Care Home, Ottawa, ON',
    destination: 'Ottawa Kidney Care Centre',
    dateTime: 'Mar 10, 2026 · 08:00 AM',
    specialNote: 'Recurring – every Tuesday & Thursday',
  },
  {
    id: '4',
    bookingId: 'BK-20494',
    vehicleType: 'MediGo Standard Ride',
    vehicleTypeColor: '#2F6FED',
    vehicleTypeBg: '#EBF2FF',
    serviceType: 'Transport Only',
    serviceTypeColor: '#2F6FED',
    serviceTypeBg: '#EBF2FF',
    waitTime: '12 min',
    patientName: 'Joseph Nguyen',
    patientAge: 62,
    patientPhone: '+1 604 555 0132',
    pickup: '888 Burrard St, Vancouver, BC',
    destination: 'BC Cancer – Vancouver Centre',
    dateTime: 'Mar 10, 2026 · 11:00 AM',
  },
  {
    id: '5',
    bookingId: 'BK-20491',
    vehicleType: 'MediGo Stretcher Van',
    vehicleTypeColor: '#6366F1',
    vehicleTypeBg: '#EEF2FF',
    serviceType: 'Transport + Care Assistant',
    serviceTypeColor: '#16A34A',
    serviceTypeBg: '#F0FDF4',
    waitTime: '2 hr 15 min',
    patientName: "Margaret O'Brien",
    patientAge: 65,
    patientPhone: '+1 403 555 0189',
    pickup: '1150 12 Ave SW, Calgary, AB',
    destination: 'Foothills Medical Centre',
    dateTime: 'Mar 10, 2026 · 01:00 PM',
  },
];

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
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<PendingBooking | null>(
    null
  );

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
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 500,
              fontSize: pxToRem(24),
              lineHeight: '36px',
              color: (theme) => theme.color.deepBlue,
            }}
          >
            Pending Bookings
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
            New ride requests awaiting driver assignment
          </Typography>
        </Stack>

        {/* Stat Cards */}
        <RowStack spacing={'12px'} width="100%">
          <PendingStatCard value="5" label="Pending Now" />
          <PendingStatCard value="18 min" label="Avg. Wait Time" />
          <PendingStatCard value="0" label="Assigned" />
        </RowStack>

        {/* Booking Cards */}
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
