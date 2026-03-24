'use client';

import { Box, Stack, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import { pxToRem } from '../../../common';
import { DriverRouteCard, DriverRoute } from './ui/components';

// ─── Sample Data ────────────────────────────────────────────────────────────

const driverRoutes: DriverRoute[] = [
  {
    id: '1',
    driverName: 'Marcus Johnson',
    driverInitials: 'MJ',
    driverColor: '#2F6FED',
    date: 'Mar 9, 2026',
    tripCount: 2,
    totalDistance: '7.7 mi',
    trips: [
      {
        tripId: 'TR-8801',
        origin: '120 King St W, Toronto',
        destination: 'Toronto General Hospital',
        timeRange: '09:04 AM → 09:22 AM',
        distanceDuration: '6.8 km · 18 min',
        riderName: 'Claire Beaumont',
      },
      {
        tripId: 'TR-8780',
        origin: '888 Burrard St, Vancouver',
        destination: 'BC Cancer - Vancouver Centre',
        timeRange: '10:30 AM → 11:05 AM',
        distanceDuration: '5.6 km · 35 min',
        riderName: 'Joseph Nguyen',
      },
    ],
  },
  {
    id: '2',
    driverName: 'Sarah Williams',
    driverInitials: 'SW',
    driverColor: '#6366F1',
    date: 'Mar 9, 2026',
    tripCount: 2,
    totalDistance: '5.9 mi',
    trips: [
      {
        tripId: 'TR-8800',
        origin: '455 Ste-Catherine St W',
        destination: 'Montreal General Hospital',
        timeRange: '08:30 AM → 08:52 AM',
        distanceDuration: '4.5 km · 22 min',
        riderName: 'Pierre Tremblay',
      },
      {
        tripId: 'TR-8785',
        origin: 'Rideau Place Care Home',
        destination: 'Ottawa Kidney Care Centre',
        timeRange: '11:00 AM → 11:28 AM',
        distanceDuration: '5.0 km · 28 min',
        riderName: 'Dorothy MacLeod',
      },
    ],
  },
  {
    id: '3',
    driverName: 'David Chen',
    driverInitials: 'DC',
    driverColor: '#F59E0B',
    date: 'Mar 9, 2026',
    tripCount: 1,
    totalDistance: '2.4 mi',
    trips: [
      {
        tripId: 'TR-8799',
        origin: '1150 12 Ave SW, Calgary',
        destination: 'Foothills Medical Centre',
        timeRange: '07:45 AM → 08:08 AM',
        distanceDuration: '3.9 km · 23 min',
        riderName: "Margaret O'Brien",
      },
    ],
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const DriverRouteHistoryPage = () => {
  const totalTrips = driverRoutes.reduce((acc, d) => acc + d.tripCount, 0);

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Title */}
        <DashboardTitleAndDesc
          title="Driver Route History"
          desc="Historical trip routes and completed journey logs for all drivers"
        />

        {/* Stat Cards */}
        <RowStack spacing={'16px'}>
          <StatCard value={String(totalTrips)} label="Routes Today" />
          <StatCard value="25 min" label="Avg. Trip Duration" />
          <StatCard value="19.3 mi" label="Total Distance" />
        </RowStack>

        {/* Driver Route Cards */}
        <Stack spacing={'20px'}>
          {driverRoutes.map((driver) => (
            <DriverRouteCard key={driver.id} driver={driver} />
          ))}
        </Stack>
      </Stack>
    </AppDashboardLayout>
  );
};

// ─── Stat Card ──────────────────────────────────────────────────────────────

const StatCard = ({ value, label }: { value: string; label: string }) => (
  <Stack
    spacing={'4px'}
    sx={{
      flex: 1,
      background: '#FFFFFF',
      borderRadius: '16px',
      border: '0.67px solid #F0F4F8',
      boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
      padding: '20px',
    }}
  >
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 800,
        fontSize: pxToRem(32),
        color: '#111827',
        lineHeight: '40px',
      }}
    >
      {value}
    </Typography>
    <Typography
      sx={{
        fontFamily: (theme) => theme.typography.fontFamily,
        fontWeight: 400,
        fontSize: pxToRem(13),
        color: '#6B7280',
      }}
    >
      {label}
    </Typography>
  </Stack>
);
