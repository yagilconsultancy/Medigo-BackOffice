'use client';

import { Stack } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import { DashboardTitleAndDesc, RowStack } from '../../modules/components';
import { DispatchStatCard } from '../DispatchPage/ui/components';
import { DriverRatingCard, DriverRatingData } from './ui/components';

import fleetRatingIcon from './ui/assets/icons/fleet-rating-icon.svg';
import fiveStarIcon from './ui/assets/icons/five-star-icon.svg';
import totalReviewsIcon from './ui/assets/icons/total-reviews-icon.svg';
import safetyScoreIcon from './ui/assets/icons/safety-score-icon.svg';

// ─── Sample Data ────────────────────────────────────────────────────────────

const driversData: DriverRatingData[] = [
  {
    id: '1',
    rank: 1,
    name: 'Marcus Johnson',
    company: 'MediGo',
    rating: 4.9,
    reviews: 312,
    trend: { value: '+0.1 this month', direction: 'up' },
    badge: { text: 'Top Rated', color: '#D97706', bg: '#FFF9E6' },
    accentGradient:
      'linear-gradient(90deg, #2F6FED 0%, rgba(47,111,237,0.27) 100%)',
    avatarColor: '#2F6FED',
    initials: 'MJ',
    ratingDistribution: [
      { stars: 5, count: 243, pct: 78 },
      { stars: 4, count: 56, pct: 18 },
      { stars: 3, count: 9, pct: 3 },
      { stars: 2, count: 3, pct: 1 },
      { stars: 1, count: 1, pct: 0 },
    ],
    serviceAttributes: [
      {
        label: 'Punctuality',
        value: 98,
        gradient:
          'linear-gradient(90deg, rgba(47,111,237,0.53) 0%, rgba(47,111,237,1) 100%)',
      },
      {
        label: 'Helpfulness',
        value: 99,
        gradient:
          'linear-gradient(90deg, rgba(16,185,129,0.53) 0%, rgba(16,185,129,1) 100%)',
      },
      {
        label: 'Cleanliness',
        value: 97,
        gradient:
          'linear-gradient(90deg, rgba(99,102,241,0.53) 0%, rgba(99,102,241,1) 100%)',
      },
      {
        label: 'Safety',
        value: 99,
        gradient:
          'linear-gradient(90deg, rgba(245,158,11,0.53) 0%, rgba(245,158,11,1) 100%)',
      },
    ],
    recentFeedback: [
      {
        date: 'Mar 12',
        quote: 'Very professional — helped me get in and out safely.',
        reviewerName: 'Dorothy K.',
        reviewerInitials: 'DK',
        starCount: 5,
      },
      {
        date: 'Mar 10',
        quote: "Always on time. Best medical transport driver I've had.",
        reviewerName: 'Raymond S.',
        reviewerInitials: 'RS',
        starCount: 5,
      },
      {
        date: 'Mar 8',
        quote: 'Smooth ride, very calming. Highly recommend.',
        reviewerName: 'Loretta M.',
        reviewerInitials: 'LM',
        starCount: 5,
      },
    ],
  },
  {
    id: '2',
    rank: 2,
    name: 'Sarah Williams',
    company: 'MedRide Express',
    rating: 4.8,
    reviews: 287,
    trend: { value: '+0.2 this month', direction: 'up' },
    badge: { text: 'Most Consistent', color: '#4F46E5', bg: '#EEF2FF' },
    accentGradient:
      'linear-gradient(90deg, #6366F1 0%, rgba(99,102,241,0.27) 100%)',
    avatarColor: '#6366F1',
    initials: 'SW',
    ratingDistribution: [
      { stars: 5, count: 206, pct: 72 },
      { stars: 4, count: 63, pct: 22 },
      { stars: 3, count: 14, pct: 5 },
      { stars: 2, count: 3, pct: 1 },
      { stars: 1, count: 1, pct: 0 },
    ],
    serviceAttributes: [
      {
        label: 'Punctuality',
        value: 93,
        gradient:
          'linear-gradient(90deg, rgba(47,111,237,0.53) 0%, rgba(47,111,237,1) 100%)',
      },
      {
        label: 'Helpfulness',
        value: 97,
        gradient:
          'linear-gradient(90deg, rgba(16,185,129,0.53) 0%, rgba(16,185,129,1) 100%)',
      },
      {
        label: 'Cleanliness',
        value: 96,
        gradient:
          'linear-gradient(90deg, rgba(99,102,241,0.53) 0%, rgba(99,102,241,1) 100%)',
      },
      {
        label: 'Safety',
        value: 97,
        gradient:
          'linear-gradient(90deg, rgba(245,158,11,0.53) 0%, rgba(245,158,11,1) 100%)',
      },
    ],
    recentFeedback: [
      {
        date: 'Mar 13',
        quote: 'Always cheerful and so helpful with my wheelchair.',
        reviewerName: 'Harriet B.',
        reviewerInitials: 'HB',
        starCount: 5,
      },
      {
        date: 'Mar 11',
        quote: 'Great communication — texted me when she was nearby.',
        reviewerName: 'George W.',
        reviewerInitials: 'GW',
        starCount: 5,
      },
      {
        date: 'Mar 9',
        quote: 'Arrived exactly on time. Very professional.',
        reviewerName: 'Mabel T.',
        reviewerInitials: 'MT',
        starCount: 4,
      },
    ],
  },
  {
    id: '3',
    rank: 3,
    name: 'David Chen',
    company: 'MediGo',
    rating: 4.8,
    reviews: 264,
    trend: { value: 'Stable this month', direction: 'stable' },
    badge: { text: 'ADA Specialist', color: '#059669', bg: '#ECFDF5' },
    accentGradient:
      'linear-gradient(90deg, #F59E0B 0%, rgba(245,158,11,0.27) 100%)',
    avatarColor: '#F59E0B',
    initials: 'DC',
    ratingDistribution: [
      { stars: 5, count: 185, pct: 70 },
      { stars: 4, count: 63, pct: 24 },
      { stars: 3, count: 11, pct: 4 },
      { stars: 2, count: 5, pct: 2 },
      { stars: 1, count: 0, pct: 0 },
    ],
    serviceAttributes: [
      {
        label: 'Punctuality',
        value: 91,
        gradient:
          'linear-gradient(90deg, rgba(47,111,237,0.53) 0%, rgba(47,111,237,1) 100%)',
      },
      {
        label: 'Helpfulness',
        value: 96,
        gradient:
          'linear-gradient(90deg, rgba(16,185,129,0.53) 0%, rgba(16,185,129,1) 100%)',
      },
      {
        label: 'Cleanliness',
        value: 98,
        gradient:
          'linear-gradient(90deg, rgba(99,102,241,0.53) 0%, rgba(99,102,241,1) 100%)',
      },
      {
        label: 'Safety',
        value: 96,
        gradient:
          'linear-gradient(90deg, rgba(245,158,11,0.53) 0%, rgba(245,158,11,1) 100%)',
      },
    ],
    recentFeedback: [
      {
        date: 'Mar 12',
        quote: 'Very careful driver, took speed bumps so gently.',
        reviewerName: 'Eugene P.',
        reviewerInitials: 'EP',
        starCount: 5,
      },
      {
        date: 'Mar 10',
        quote: 'Knew exactly how to handle my walker. Very kind.',
        reviewerName: 'Florence N.',
        reviewerInitials: 'FN',
        starCount: 5,
      },
      {
        date: 'Mar 8',
        quote: 'Good experience overall. Clean van, pleasant ride.',
        reviewerName: 'Walter C.',
        reviewerInitials: 'WC',
        starCount: 4,
      },
    ],
  },
  {
    id: '4',
    rank: 4,
    name: 'Emily Rodriguez',
    company: 'CareTransit Co.',
    rating: 4.7,
    reviews: 241,
    trend: { value: '+0.1 this month', direction: 'up' },
    badge: { text: 'Rising Star', color: '#BE185D', bg: '#FDF2F8' },
    accentGradient:
      'linear-gradient(90deg, #EC4899 0%, rgba(236,72,153,0.27) 100%)',
    avatarColor: '#EC4899',
    initials: 'ER',
    ratingDistribution: [
      { stars: 5, count: 157, pct: 65 },
      { stars: 4, count: 63, pct: 26 },
      { stars: 3, count: 14, pct: 6 },
      { stars: 2, count: 5, pct: 2 },
      { stars: 1, count: 2, pct: 1 },
    ],
    serviceAttributes: [
      {
        label: 'Punctuality',
        value: 95,
        gradient:
          'linear-gradient(90deg, rgba(47,111,237,0.53) 0%, rgba(47,111,237,1) 100%)',
      },
      {
        label: 'Helpfulness',
        value: 96,
        gradient:
          'linear-gradient(90deg, rgba(16,185,129,0.53) 0%, rgba(16,185,129,1) 100%)',
      },
      {
        label: 'Cleanliness',
        value: 94,
        gradient:
          'linear-gradient(90deg, rgba(99,102,241,0.53) 0%, rgba(99,102,241,1) 100%)',
      },
      {
        label: 'Safety',
        value: 95,
        gradient:
          'linear-gradient(90deg, rgba(245,158,11,0.53) 0%, rgba(245,158,11,1) 100%)',
      },
    ],
    recentFeedback: [
      {
        date: 'Mar 13',
        quote: 'So patient and kind. Made my mom feel comfortable.',
        reviewerName: 'Linda P.',
        reviewerInitials: 'LP',
        starCount: 5,
      },
      {
        date: 'Mar 11',
        quote: 'Really friendly driver, kept us updated on ETA.',
        reviewerName: 'Harold J.',
        reviewerInitials: 'HJ',
        starCount: 5,
      },
      {
        date: 'Mar 9',
        quote: 'Clean vehicle, careful driving. Very satisfied.',
        reviewerName: 'Betty R.',
        reviewerInitials: 'BR',
        starCount: 4,
      },
    ],
  },
  {
    id: '5',
    rank: 5,
    name: 'James Thompson',
    company: 'MediGo',
    rating: 4.5,
    reviews: 218,
    trend: { value: '-0.1 this month', direction: 'down' },
    badge: { text: 'Experienced', color: '#6B7280', bg: '#F3F4F6' },
    accentGradient:
      'linear-gradient(90deg, #DC2626 0%, rgba(220,38,38,0.27) 100%)',
    avatarColor: '#DC2626',
    initials: 'JT',
    ratingDistribution: [
      { stars: 5, count: 137, pct: 63 },
      { stars: 4, count: 61, pct: 28 },
      { stars: 3, count: 13, pct: 6 },
      { stars: 2, count: 5, pct: 2 },
      { stars: 1, count: 2, pct: 1 },
    ],
    serviceAttributes: [
      {
        label: 'Punctuality',
        value: 90,
        gradient:
          'linear-gradient(90deg, rgba(47,111,237,0.53) 0%, rgba(47,111,237,1) 100%)',
      },
      {
        label: 'Helpfulness',
        value: 93,
        gradient:
          'linear-gradient(90deg, rgba(16,185,129,0.53) 0%, rgba(16,185,129,1) 100%)',
      },
      {
        label: 'Cleanliness',
        value: 91,
        gradient:
          'linear-gradient(90deg, rgba(99,102,241,0.53) 0%, rgba(99,102,241,1) 100%)',
      },
      {
        label: 'Safety',
        value: 92,
        gradient:
          'linear-gradient(90deg, rgba(245,158,11,0.53) 0%, rgba(245,158,11,1) 100%)',
      },
    ],
    recentFeedback: [
      {
        date: 'Mar 12',
        quote: 'Decent ride, arrived on time. No complaints.',
        reviewerName: 'Martha D.',
        reviewerInitials: 'MD',
        starCount: 4,
      },
      {
        date: 'Mar 10',
        quote: 'Professional and courteous. Good experience.',
        reviewerName: 'Frank H.',
        reviewerInitials: 'FH',
        starCount: 4,
      },
      {
        date: 'Mar 8',
        quote: 'Driver was quiet but efficient. Got there safely.',
        reviewerName: 'Irene K.',
        reviewerInitials: 'IK',
        starCount: 4,
      },
    ],
  },
  {
    id: '6',
    rank: 6,
    name: 'Anna Kim',
    company: 'MediGo',
    rating: 4.6,
    reviews: 195,
    trend: { value: '+0.1 this month', direction: 'up' },
    badge: { text: 'Reliable', color: '#0891B2', bg: '#ECFEFF' },
    accentGradient:
      'linear-gradient(90deg, #0891B2 0%, rgba(8,145,178,0.27) 100%)',
    avatarColor: '#0891B2',
    initials: 'AK',
    ratingDistribution: [
      { stars: 5, count: 127, pct: 65 },
      { stars: 4, count: 49, pct: 25 },
      { stars: 3, count: 12, pct: 6 },
      { stars: 2, count: 5, pct: 3 },
      { stars: 1, count: 2, pct: 1 },
    ],
    serviceAttributes: [
      {
        label: 'Punctuality',
        value: 94,
        gradient:
          'linear-gradient(90deg, rgba(47,111,237,0.53) 0%, rgba(47,111,237,1) 100%)',
      },
      {
        label: 'Helpfulness',
        value: 94,
        gradient:
          'linear-gradient(90deg, rgba(16,185,129,0.53) 0%, rgba(16,185,129,1) 100%)',
      },
      {
        label: 'Cleanliness',
        value: 96,
        gradient:
          'linear-gradient(90deg, rgba(99,102,241,0.53) 0%, rgba(99,102,241,1) 100%)',
      },
      {
        label: 'Safety',
        value: 93,
        gradient:
          'linear-gradient(90deg, rgba(245,158,11,0.53) 0%, rgba(245,158,11,1) 100%)',
      },
    ],
    recentFeedback: [
      {
        date: 'Mar 13',
        quote: 'Very nice driver. Helped with my bags too.',
        reviewerName: 'Carol W.',
        reviewerInitials: 'CW',
        starCount: 5,
      },
      {
        date: 'Mar 11',
        quote: 'Always punctual and friendly. Love the service.',
        reviewerName: 'Robert L.',
        reviewerInitials: 'RL',
        starCount: 5,
      },
      {
        date: 'Mar 9',
        quote: 'Comfortable ride, clean vehicle. Thank you!',
        reviewerName: 'Gloria S.',
        reviewerInitials: 'GS',
        starCount: 4,
      },
    ],
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const DriverRatingsPage = () => {
  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Header */}
        <DashboardTitleAndDesc
          title="Driver Ratings"
          desc="Passenger satisfaction scores, feedback, and service quality metrics"
        />

        {/* Stat Cards */}
        <RowStack spacing={'16px'}>
          <DispatchStatCard
            icon={fleetRatingIcon}
            value="4.78"
            label="Fleet Avg. Rating"
            subtitle="Across all drivers"
          />
          <DispatchStatCard
            icon={fiveStarIcon}
            value="69.6%"
            label="5-Star Trips"
            subtitle="Of all rated trips"
          />
          <DispatchStatCard
            icon={totalReviewsIcon}
            value="1,322"
            label="Total Reviews"
            subtitle="Customer feedbacks"
          />
          <DispatchStatCard
            icon={safetyScoreIcon}
            value="95.8"
            label="Avg. Safety Score"
            subtitle="Out of 100"
          />
        </RowStack>

        {/* Driver Rating Cards */}
        <Stack spacing={'16px'}>
          {driversData.map((driver) => (
            <DriverRatingCard key={driver.id} driver={driver} />
          ))}
        </Stack>
      </Stack>
    </AppDashboardLayout>
  );
};
