'use client';

import { Grid, Stack, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import { DispatchStatCard } from '../DispatchPage/ui/components';
import { pxToRem } from '../../../common';
import { useState } from 'react';
import {
  MonthlyTripChart,
  DriverRankingsTable,
  DriverProfileCard,
} from './ui/components';

import totalDriversIcon from './ui/assets/icons/total-drivers-icon.svg';
import completionRateIcon from './ui/assets/icons/completion-rate-icon.svg';
import averageRatingIcon from './ui/assets/icons/average-rating-icon.svg';
import monthlyRevenueIcon from './ui/assets/icons/monthly-revenue-icon.svg';

// ─── Types ──────────────────────────────────────────────────────────────────

export type DriverData = {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  trips: number;
  rating: number;
  completionRate: number;
  onTimeRate: number;
  safetyScore: string;
  monthlyEarnings: string;
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const driversData: DriverData[] = [
  {
    id: '1',
    name: 'Marcus Johnson',
    initials: 'MJ',
    avatarColor: '#2F6FED',
    trips: 312,
    rating: 4.9,
    completionRate: 98,
    onTimeRate: 96,
    safetyScore: '99/100',
    monthlyEarnings: '$8,420',
  },
  {
    id: '2',
    name: 'Sarah Williams',
    initials: 'SW',
    avatarColor: '#7C3AED',
    trips: 287,
    rating: 4.8,
    completionRate: 96,
    onTimeRate: 94,
    safetyScore: '97/100',
    monthlyEarnings: '$7,850',
  },
  {
    id: '3',
    name: 'David Chen',
    initials: 'DC',
    avatarColor: '#059669',
    trips: 264,
    rating: 4.8,
    completionRate: 95,
    onTimeRate: 93,
    safetyScore: '96/100',
    monthlyEarnings: '$7,320',
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    initials: 'ER',
    avatarColor: '#D97706',
    trips: 241,
    rating: 4.7,
    completionRate: 94,
    onTimeRate: 91,
    safetyScore: '95/100',
    monthlyEarnings: '$6,790',
  },
  {
    id: '5',
    name: 'James Thompson',
    initials: 'JT',
    avatarColor: '#DC2626',
    trips: 218,
    rating: 4.7,
    completionRate: 93,
    onTimeRate: 90,
    safetyScore: '94/100',
    monthlyEarnings: '$6,250',
  },
  {
    id: '6',
    name: 'Anna Kim',
    initials: 'AK',
    avatarColor: '#0891B2',
    trips: 195,
    rating: 4.6,
    completionRate: 92,
    onTimeRate: 89,
    safetyScore: '93/100',
    monthlyEarnings: '$5,680',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const PerformanceMetricsPage = () => {
  const [selectedDriverId, setSelectedDriverId] = useState<string>('1');

  const selectedDriver =
    driversData.find((d) => d.id === selectedDriverId) || driversData[0];

  const totalDrivers = 148;
  const avgCompletionRate = '94.2%';
  const avgRating = '4.7';
  const monthlyRevenue = '$84,320';

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Performance Metrics"
          desc="Analyze individual and fleet-wide performance metrics"
        />

        {/* Stat Cards */}
        <RowStack spacing={'16px'}>
          <DispatchStatCard
            icon={totalDriversIcon}
            value={String(totalDrivers)}
            label="Total Drivers"
            subtitle="Active fleet members"
          />
          <DispatchStatCard
            icon={completionRateIcon}
            value={avgCompletionRate}
            label="Avg. Completion Rate"
            subtitle="Fleet-wide average"
          />
          <DispatchStatCard
            icon={averageRatingIcon}
            value={avgRating}
            label="Average Rating"
            subtitle="Overall driver rating"
          />
          <DispatchStatCard
            icon={monthlyRevenueIcon}
            value={monthlyRevenue}
            label="Monthly Revenue"
            subtitle="Total fleet revenue"
          />
        </RowStack>

        {/* Chart + Rankings + Profile */}
        <Grid container spacing={'16px'}>
          {/* Left Column: Chart + Rankings */}
          <Grid size={{ xs: 12, lg: 7.5 }}>
            <Stack spacing={'16px'}>
              <MonthlyTripChart />
              <DriverRankingsTable
                drivers={driversData}
                selectedDriverId={selectedDriverId}
                onSelectDriver={setSelectedDriverId}
              />
            </Stack>
          </Grid>

          {/* Right Column: Driver Profile */}
          <Grid size={{ xs: 12, lg: 4.5 }}>
            <DriverProfileCard driver={selectedDriver} />
          </Grid>
        </Grid>
      </Stack>
    </AppDashboardLayout>
  );
};
