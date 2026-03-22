'use client';

import { Grid, Stack, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { RowStack } from '../../modules/components';
import { pxToRem } from '../../../common';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  UnassignedRideCard,
  UnassignedRide,
  RideDriverCard,
  RideDriver,
} from './ui/components';

// ─── Sample Data ────────────────────────────────────────────────────────────

const allRides: UnassignedRide[] = [
  {
    id: '1',
    bookingId: 'BK-20491',
    bookingIdColor: '#2F6FED',
    bookingIdBg: '#EBF2FF',
    patientName: 'Claire Beaumont',
    pickup: '120 King St W, Toronto, ON',
    destination: 'Toronto General Hospital',
    time: '09:00 AM',
    distance: '4.3 mi',
    specialNote: 'Wheelchair Accessible',
    specialNoteBg: '#FFFBEB',
    specialNoteColor: '#D97706',
  },
  {
    id: '2',
    bookingId: 'BK-20494',
    bookingIdColor: '#059669',
    bookingIdBg: '#ECFDF5',
    patientName: 'Pierre Tremblay',
    pickup: '455 Ste-Catherine St W, Montréal, QC',
    destination: 'Montreal General Hospital',
    time: '10:30 AM',
    distance: '4.5 mi',
    specialNote: 'Standard Ride',
    specialNoteBg: '#EBF2FF',
    specialNoteColor: '#2F6FED',
  },
  {
    id: '3',
    bookingId: 'BK-20483',
    bookingIdColor: '#8B5CF6',
    bookingIdBg: '#F3F0FF',
    patientName: 'Dorothy MacLeod',
    pickup: 'Rideau Place Care Home, Ottawa, ON',
    destination: 'Ottawa Kidney Care Centre',
    time: '08:00 AM',
    distance: '5.0 mi',
    specialNote: 'Assisted Ride',
    specialNoteBg: '#FEF3C7',
    specialNoteColor: '#92400E',
  },
];

const allDrivers: RideDriver[] = [
  {
    id: '1',
    initials: 'SW',
    initialsColor: '#8B5CF6',
    name: 'Sarah Williams',
    vehicle: 'Honda Odyssey · 2021',
    rating: 4.8,
    trips: 287,
    distance: '1.2 mi',
    eta: '4 min',
  },
  {
    id: '2',
    initials: 'DC',
    initialsColor: '#F59E0B',
    name: 'David Chen',
    vehicle: 'Ford Escape · 2023',
    rating: 4.8,
    trips: 264,
    distance: '1.2 mi',
    eta: '5 min',
  },
  {
    id: '3',
    initials: 'AK',
    initialsColor: '#0EA5E9',
    name: 'Anna Kim',
    vehicle: 'Toyota Camry · 2022',
    rating: 4.6,
    trips: 195,
    distance: '2.1 mi',
    eta: '8 min',
  },
  {
    id: '4',
    initials: 'GM',
    initialsColor: '#EF4444',
    name: 'Grace Miller',
    vehicle: 'Buick Enclave · 2021',
    rating: 4.6,
    trips: 210,
    distance: '1.6 mi',
    eta: '7 min',
  },
  {
    id: '5',
    initials: 'MJ',
    initialsColor: '#2F6FED',
    name: 'Marcus Johnson',
    vehicle: 'Toyota Sienna WAV · 2022',
    rating: 4.9,
    trips: 312,
    distance: '0.5 mi',
    eta: '3 min',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

type Assignment = {
  driverId: string;
  driverName: string;
};

export const RideAssignmentPage = () => {
  const [selectedRideId, setSelectedRideId] = useState<string | null>(null);
  const [assignments, setAssignments] = useState<Record<string, Assignment>>(
    {}
  );

  const assignedDriverIds = new Set(
    Object.values(assignments).map((a) => a.driverId)
  );
  const filteredDrivers = allDrivers.filter(
    (d) => !assignedDriverIds.has(d.id)
  );

  const handleAssign = (driverId: string) => {
    if (!selectedRideId) return;

    const driver = allDrivers.find((d) => d.id === driverId);
    const ride = allRides.find((r) => r.id === selectedRideId);
    if (!driver || !ride) return;

    setAssignments((prev) => ({
      ...prev,
      [selectedRideId]: { driverId, driverName: driver.name },
    }));
    setSelectedRideId(null);

    toast.success(
      `${driver.name} assigned to ${ride.bookingId} · ${ride.patientName}`
    );
  };

  const handleRideClick = (rideId: string) => {
    setSelectedRideId((prev) => (prev === rideId ? null : rideId));
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
            Ride Assignment
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
            Manually assign or reassign drivers to pending rides
          </Typography>
        </Stack>

        {/* Two-Column Layout */}
        <Grid container spacing={'20px'}>
          {/* Left: Unassigned Rides */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack
              spacing={'12px'}
              sx={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px',
                border: '0.67px solid #EAECF0',
              }}
            >
              <Stack spacing={'2px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(15),
                    color: (theme) => theme.color.deepBlue,
                  }}
                >
                  Unassigned Rides
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: (theme) => theme.color.lightGrey,
                  }}
                >
                  Select a booking to assign a driver
                </Typography>
              </Stack>

              {allRides.map((ride) => (
                <UnassignedRideCard
                  key={ride.id}
                  ride={{
                    ...ride,
                    assignedDriver: assignments[ride.id]?.driverName,
                  }}
                  isSelected={selectedRideId === ride.id}
                  onClick={() => handleRideClick(ride.id)}
                />
              ))}
            </Stack>
          </Grid>

          {/* Right: Available Drivers */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack
              spacing={'12px'}
              sx={{
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '20px',
                border: '0.67px solid #EAECF0',
              }}
            >
              <Stack spacing={'2px'}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 600,
                    fontSize: pxToRem(15),
                    color: (theme) => theme.color.deepBlue,
                  }}
                >
                  Available Drivers
                </Typography>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(12),
                    color: (theme) => theme.color.lightGrey,
                  }}
                >
                  Select a driver to assign
                </Typography>
              </Stack>

              {filteredDrivers.map((driver) => (
                <RideDriverCard
                  key={driver.id}
                  driver={driver}
                  isActive={!!selectedRideId}
                  onAssign={() => handleAssign(driver.id)}
                />
              ))}

              {filteredDrivers.length === 0 && (
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 400,
                    fontSize: pxToRem(13),
                    color: (theme) => theme.color.lightGrey,
                    textAlign: 'center',
                    padding: '40px 0',
                  }}
                >
                  All drivers have been assigned
                </Typography>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </AppDashboardLayout>
  );
};
