'use client';

import { Stack } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import { PodiumCard, LeaderboardTable } from './ui/components';

// ─── Types ──────────────────────────────────────────────────────────────────

export type LeaderboardDriver = {
  id: string;
  rank: number;
  name: string;
  initials: string;
  avatarColor: string;
  fleet: string;
  trips: number;
  rating: number;
  acceptanceRate: number;
  completionRate: number;
  score: number;
};

// ─── Sample Data ────────────────────────────────────────────────────────────

const driversData: LeaderboardDriver[] = [
  {
    id: '1',
    rank: 1,
    name: 'Marcus Johnson',
    initials: 'MJ',
    avatarColor: '#2F6FED',
    fleet: 'MediGo',
    trips: 312,
    rating: 4.9,
    acceptanceRate: 98,
    completionRate: 99,
    score: 98.2,
  },
  {
    id: '2',
    rank: 2,
    name: 'Sarah Williams',
    initials: 'SW',
    avatarColor: '#6366F1',
    fleet: 'MedRide Express',
    trips: 287,
    rating: 4.8,
    acceptanceRate: 96,
    completionRate: 98,
    score: 96.8,
  },
  {
    id: '3',
    rank: 3,
    name: 'David Chen',
    initials: 'DC',
    avatarColor: '#F59E0B',
    fleet: 'MediGo',
    trips: 264,
    rating: 4.8,
    acceptanceRate: 95,
    completionRate: 97,
    score: 95.6,
  },
  {
    id: '4',
    rank: 4,
    name: 'Emily Rodriguez',
    initials: 'ER',
    avatarColor: '#EC4899',
    fleet: 'CareTransit Co.',
    trips: 241,
    rating: 4.7,
    acceptanceRate: 93,
    completionRate: 96,
    score: 93.4,
  },
  {
    id: '5',
    rank: 5,
    name: 'James Thompson',
    initials: 'JT',
    avatarColor: '#DC2626',
    fleet: 'HealthHaul LLC',
    trips: 218,
    rating: 4.7,
    acceptanceRate: 91,
    completionRate: 95,
    score: 91.8,
  },
  {
    id: '6',
    rank: 6,
    name: 'Anna Kim',
    initials: 'AK',
    avatarColor: '#0891B2',
    fleet: 'MediGo',
    trips: 195,
    rating: 4.6,
    acceptanceRate: 90,
    completionRate: 94,
    score: 90.2,
  },
  {
    id: '7',
    rank: 7,
    name: 'Grace Miller',
    initials: 'GM',
    avatarColor: '#059669',
    fleet: 'MobiCare Transport',
    trips: 156,
    rating: 4.4,
    acceptanceRate: 88,
    completionRate: 93,
    score: 88,
  },
  {
    id: '8',
    rank: 8,
    name: 'Tom Roberts',
    initials: 'TR',
    avatarColor: '#7C3AED',
    fleet: 'SafeRide Medical',
    trips: 178,
    rating: 4.5,
    acceptanceRate: 85,
    completionRate: 90,
    score: 85.6,
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const DriverLeaderboardPage = () => {
  const topThree = driversData.slice(0, 3);

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Driver Leaderboard"
          desc="Top performing drivers ranked by overall performance score"
        />

        {/* Podium Cards — Top 3 */}
        <RowStack spacing={'20px'}>
          {topThree.map((driver) => (
            <PodiumCard key={driver.id} driver={driver} />
          ))}
        </RowStack>

        {/* Full Rankings Table */}
        <LeaderboardTable drivers={driversData} />
      </Stack>
    </AppDashboardLayout>
  );
};
