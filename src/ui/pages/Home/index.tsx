'use client';
import { useState } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppCardparent,
  AppTab,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { getTodayDate, pxToRem } from '../../../common';
import {
  BookingChannelItem,
  CardComponent,
  FacilityComponent,
  FleetPartnerComponent,
  HomeChart,
  RecentActivity,
  ServiceMetricCard,
  TransportDistribution,
} from './ui/components';
import { CardTitleAndDesc } from '../../modules/components/AppCardparent/ui/components';
import TripsIcon from './ui/assets/icons/trips.icon.svg';
import DriversIcon from './ui/assets/icons/drivers-icon.svg';
import PendingIcon from './ui/assets/icons/pending-icon.svg';
import RevenueIcon from './ui/assets/icons/revenue-icon.svg';
import TrendingUp from './ui/assets/icons/TrendingUp.svg';
import TrendingDown from './ui/assets/icons/TrendingDown.svg';
import RequestIcon from './ui/assets/icons/request-icon.svg';
import StartIcon from './ui/assets/icons/start-icon.svg';
import CompleteIcon from './ui/assets/icons/complete-icon.svg';
import CardIcon from './ui/assets/icons/card-icon.svg';
import NewDriverIcon from './ui/assets/icons/new-driver-icon.svg';
import SmartphoneOutlinedIcon from '@mui/icons-material/SmartphoneOutlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import LocalHospitalOutlinedIcon from '@mui/icons-material/LocalHospitalOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';

// ─── Stat Card Data ─────────────────────────────────────────────────────────

const cardData = [
  {
    top: {
      icon: TripsIcon,
      iconBg: '#EBF2FF',
      badgeIcon: TrendingUp,
      badgeBg: '#ECFDF5',
      volumeColor: '#10B981',
      volumeNum: '+12.5%',
    },
    bottom: {
      cardNum: '3,482',
      cardDesc: 'Total Bookings',
    },
  },
  {
    top: {
      icon: DriversIcon,
      iconBg: '#FFFBEB',
      badgeIcon: TrendingUp,
      badgeBg: '#ECFDF5',
      volumeColor: '#10B981',
      volumeNum: '+4.2%',
    },
    bottom: {
      cardNum: '148',
      cardDesc: 'Active Clients',
    },
  },
  {
    top: {
      icon: PendingIcon,
      iconBg: '#FEF2F2',
      badgeIcon: TrendingDown,
      badgeBg: '#FEF2F2',
      volumeColor: '#EF4444',
      volumeNum: '-8.1%',
    },
    bottom: {
      cardNum: '37',
      cardDesc: 'Registered Facilities',
    },
  },
  {
    top: {
      icon: RevenueIcon,
      iconBg: '#ECFDF5',
      badgeIcon: TrendingUp,
      badgeBg: '#ECFDF5',
      volumeColor: '#10B981',
      volumeNum: '+18.7%',
    },
    bottom: {
      cardNum: '$84,320',
      cardDesc: 'Revenue',
    },
  },
];

// ─── Booking Trends Data ────────────────────────────────────────────────────

const tripDataByPeriod = [
  [
    { day: 'Mon', trips: 38 },
    { day: 'Tue', trips: 55 },
    { day: 'Wed', trips: 49 },
    { day: 'Thu', trips: 63 },
    { day: 'Fri', trips: 72 },
    { day: 'Sat', trips: 41 },
    { day: 'Sun', trips: 36 },
  ],
  [
    { day: 'Week 1', trips: 245 },
    { day: 'Week 2', trips: 312 },
    { day: 'Week 3', trips: 287 },
    { day: 'Week 4', trips: 356 },
  ],
  [
    { day: 'Jan', trips: 820 },
    { day: 'Feb', trips: 932 },
    { day: 'Mar', trips: 1105 },
  ],
];

// ─── Transport Type Distribution Data ───────────────────────────────────────

const transportData = [
  {
    label: 'Wheelchair Accessible',
    trips: 1411,
    percent: 52,
    color: '#10B981',
  },
  { label: 'Stretcher Transport', trips: 975, percent: 28, color: '#6366F1' },
  { label: 'Ambulatory', trips: 696, percent: 20, color: '#2F6FED' },
];

// ─── Booking Channels Data ──────────────────────────────────────────────────

const bookingChannelsData = [
  {
    icon: <SmartphoneOutlinedIcon sx={{ fontSize: 16, color: '#2B7FFF' }} />,
    label: 'Mobile App',
    count: 1823,
    percent: 52,
    color: '#2B7FFF',
    iconBg: '#EFF6FF',
    trendValue: '+8%',
    trendPositive: true,
  },
  {
    icon: <LanguageOutlinedIcon sx={{ fontSize: 16, color: '#AD46FF' }} />,
    label: 'Website (Client)',
    count: 404,
    percent: 12,
    color: '#AD46FF',
    iconBg: '#FAF5FF',
    trendValue: '+3%',
    trendPositive: true,
  },
  {
    icon: <BusinessOutlinedIcon sx={{ fontSize: 16, color: '#FE9A00' }} />,
    label: 'Website (Facility)',
    count: 1255,
    percent: 36,
    color: '#FE9A00',
    iconBg: '#FFFBEB',
    trendValue: '+12%',
    trendPositive: true,
  },
];

// ─── Service Quality Metrics Data ───────────────────────────────────────────

const serviceMetrics = [
  {
    icon: <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: '#2B7FFF' }} />,
    iconBg: '#EFF6FF',
    value: '12.4 min',
    label: 'Avg. Pickup Time',
    sublabel: 'Within 15 min window',
  },
  {
    icon: <RouteOutlinedIcon sx={{ fontSize: 18, color: '#AD46FF' }} />,
    iconBg: '#FAF5FF',
    value: '18.2 mi',
    label: 'Avg. Trip Distance',
    sublabel: 'Round trip included',
  },
  {
    icon: <StarOutlinedIcon sx={{ fontSize: 18, color: '#FE9A00' }} />,
    iconBg: '#FFFBEB',
    value: '4.8/5.0',
    label: 'Service Rating',
    sublabel: 'Based on 2,847 reviews',
  },
  {
    icon: <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: '#00C950' }} />,
    iconBg: '#F0FDF4',
    value: '98.7%',
    label: 'Completion Rate',
    sublabel: 'Successfully completed',
  },
];

// ─── Top Performing Facilities Data ─────────────────────────────────────────

const facilityData = [
  {
    num: '1',
    name: 'Valley Medical Center',
    type: 'Hospital',
    bookings: 487,
    acceptanceRate: 98.2,
    iconBg: '#2B7FFF',
    icon: <LocalHospitalOutlinedIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />,
  },
  {
    num: '2',
    name: 'Sunrise Care Home',
    type: 'Care Home',
    bookings: 412,
    acceptanceRate: 96.8,
    iconBg: '#AD46FF',
    icon: <HomeWorkOutlinedIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />,
  },
  {
    num: '3',
    name: 'Memorial Rehabilitation Center',
    type: 'Rehabilitation',
    bookings: 358,
    acceptanceRate: 95.4,
    iconBg: '#FE9A00',
    icon: (
      <MedicalServicesOutlinedIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />
    ),
  },
  {
    num: '4',
    name: 'Evergreen Senior Living',
    type: 'Care Home',
    bookings: 294,
    acceptanceRate: 97,
    iconBg: '#F6339A',
    icon: <HomeWorkOutlinedIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />,
  },
  {
    num: '5',
    name: "St. Mary's Hospital",
    type: 'Hospital',
    bookings: 276,
    acceptanceRate: 94.6,
    iconBg: '#00C950',
    icon: <LocalHospitalOutlinedIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />,
  },
];

// ─── Top Fleet Partners Data ────────────────────────────────────────────────

const fleetPartnerData = [
  {
    num: '1',
    name: 'MediTransport Solutions',
    initials: 'MT',
    vehicles: 24,
    trips: 1342,
    rating: 4.9,
    avatarBg: '#2B7FFF',
  },
  {
    num: '2',
    name: 'CarePlus Fleet Services',
    initials: 'CP',
    vehicles: 18,
    trips: 1018,
    rating: 4.8,
    avatarBg: '#AD46FF',
  },
  {
    num: '3',
    name: 'AccessRide Transport',
    initials: 'AR',
    vehicles: 15,
    trips: 897,
    rating: 4.7,
    avatarBg: '#FE9A00',
  },
  {
    num: '4',
    name: 'HealthWheels Inc',
    initials: 'HW',
    vehicles: 12,
    trips: 284,
    rating: 4.9,
    avatarBg: '#F6339A',
  },
  {
    num: '5',
    name: 'SafeJourney Medical',
    initials: 'SJ',
    vehicles: 8,
    trips: 141,
    rating: 4.6,
    avatarBg: '#00C950',
  },
  {
    num: '6',
    name: 'Okay Medical',
    initials: 'SJ',
    vehicles: 8,
    trips: 141,
    rating: 4.6,
    avatarBg: '#00C950',
  },
];

// ─── Recent Activity Data ───────────────────────────────────────────────────

const recentData = [
  {
    icon: RequestIcon,
    iconBg: '#EFF6FF',
    activityTitle: 'New booking from facility',
    activityDesc: 'Sunrise Care Home \u00B7 Wheelchair transport requested',
    time: '2 min ago',
  },
  {
    icon: StartIcon,
    iconBg: '#F0FDF4',
    activityTitle: 'Client booked via mobile app',
    activityDesc: 'Sarah Johnson \u00B7 Dialysis appointment',
    time: '8 min ago',
  },
  {
    icon: CompleteIcon,
    iconBg: '#F0FDF4',
    activityTitle: 'Trip completed',
    activityDesc: 'Booking #BK-84731 \u00B7 Medi Transport Solutions',
    time: '12 min ago',
  },
  {
    icon: NewDriverIcon,
    iconBg: '#FAF5FF',
    activityTitle: 'New facility registered',
    activityDesc: 'Memorial Rehabilitation Center',
    time: '23 min ago',
  },
  {
    icon: CardIcon,
    iconBg: '#FFFBEB',
    activityTitle: 'New client signup',
    activityDesc: 'Robert Davis \u00B7 Via website',
    time: '1 hr ago',
  },
  {
    icon: RequestIcon,
    iconBg: '#EFF6FF',
    activityTitle: 'Recurring booking scheduled',
    activityDesc: '',
    time: '2 hrs ago',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const HomePage = () => {
  const today = getTodayDate();
  const [activeTripTab, setActiveTripTab] = useState(0);

  return (
    <AppDashboardLayout>
      <Stack spacing={3}>
        <DashboardTitleAndDesc
          title="Analytics Dashboard"
          desc={`Overview of operations as of today, ${today}`}
        />

        {/* Stat Cards */}
        <Grid container spacing={'20px'}>
          {cardData.map((card, index) => (
            <Grid size={{ sm: 6, lg: 3 }} key={index}>
              <CardComponent {...card} />
            </Grid>
          ))}
        </Grid>

        {/* Booking Trends + Transport Type Distribution */}
        <Grid container spacing={'20px'}>
          <Grid size={{ sm: 12, lg: 7 }}>
            <AppCardparent>
              <Stack spacing={'19.83px'}>
                <RowStack width="100%" justifyContent="space-between">
                  <CardTitleAndDesc
                    title="Booking Trends"
                    desc="Daily booking volume across all services"
                  />
                  <AppTab
                    tabs={[
                      { label: '7 Days' },
                      { label: '30 Days' },
                      { label: '90 Days' },
                    ]}
                    onChange={(index) => setActiveTripTab(index)}
                  />
                </RowStack>
                <HomeChart
                  data={tripDataByPeriod[activeTripTab]}
                  xKey="day"
                  yKey="trips"
                />
              </Stack>
            </AppCardparent>
          </Grid>
          <Grid size={{ sm: 12, lg: 5 }}>
            <AppCardparent>
              <Stack spacing={'19.83px'}>
                <CardTitleAndDesc
                  title="Transport Type Distribution"
                  desc="Last 30 days breakdown by vehicle type"
                />
                <TransportDistribution
                  data={transportData}
                  clientPercent={64}
                  facilityPercent={36}
                />
              </Stack>
            </AppCardparent>
          </Grid>
        </Grid>

        {/* Booking Channels + Service Quality Metrics */}
        <Grid container spacing={'20px'}>
          <Grid size={{ sm: 12, lg: 6 }}>
            <AppCardparent>
              <Stack spacing={'19.83px'}>
                <CardTitleAndDesc
                  title="Booking Channels"
                  desc="How clients are booking rides"
                />
                <Stack spacing={'20px'}>
                  {bookingChannelsData.map((channel) => (
                    <BookingChannelItem key={channel.label} {...channel} />
                  ))}
                </Stack>
              </Stack>
            </AppCardparent>
          </Grid>
          <Grid size={{ sm: 12, lg: 6 }}>
            <AppCardparent>
              <Stack spacing={'19.83px'}>
                <CardTitleAndDesc
                  title="Service Quality Metrics"
                  desc="Performance indicators for last 30 days"
                />
                <Grid container spacing={'16px'}>
                  {serviceMetrics.map((metric) => (
                    <Grid key={metric.label} size={{ xs: 6 }}>
                      <ServiceMetricCard {...metric} />
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </AppCardparent>
          </Grid>
        </Grid>

        {/* Top Performing Facilities + Top Fleet Partners */}
        <Grid container spacing={'20px'} alignItems="stretch">
          <Grid size={{ sm: 12, lg: 6 }}>
            <AppCardparent>
              <Stack spacing={'19.83px'}>
                <CardTitleAndDesc
                  title="Top Performing Facilities"
                  desc="Facilities ranked by booking volume and acceptance rate"
                />
                {facilityData.map((facility) => (
                  <FacilityComponent key={facility.num} {...facility} />
                ))}
                {/* Facility type counts */}
                <RowStack spacing={'24px'} sx={{ paddingTop: '4px' }}>
                  {[
                    { label: 'Hospitals', count: 12, color: '#155DFC' },
                    { label: 'Care Homes', count: 18, color: '#9810FA' },
                    { label: 'Rehab Centers', count: 7, color: '#E17100' },
                  ].map((type) => (
                    <Stack key={type.label} spacing={'2px'}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(12),
                          color: '#9CA3AF',
                        }}
                      >
                        {type.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 700,
                          fontSize: pxToRem(20),
                          color: type.color,
                        }}
                      >
                        {type.count}
                      </Typography>
                    </Stack>
                  ))}
                </RowStack>
              </Stack>
            </AppCardparent>
          </Grid>
          <Grid size={{ sm: 12, lg: 6 }}>
            <AppCardparent>
              <Stack spacing={'19.83px'}>
                <CardTitleAndDesc
                  title="Top Fleet Partners"
                  desc="Companies ranked by completed trips this month"
                />
                {fleetPartnerData.map((partner) => (
                  <FleetPartnerComponent key={partner.num} {...partner} />
                ))}
              </Stack>
            </AppCardparent>
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <AppCardparent>
          <Stack spacing={'19.83px'}>
            <CardTitleAndDesc
              title="Recent Activity"
              desc="Latest bookings and system events"
            />
            {recentData.map((recent, index) => (
              <RecentActivity key={index} {...recent} />
            ))}
          </Stack>
        </AppCardparent>
      </Stack>
    </AppDashboardLayout>
  );
};
