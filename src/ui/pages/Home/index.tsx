'use client';
import { useMemo, useState } from 'react';
import { Grid, Stack, Typography } from '@mui/material';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppCardparent,
  AppTab,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { EmptyState } from '../../modules/blocks';
import {
  DashboardKPIs,
  formatTotalNumber,
  getTodayDate,
  pxToRem,
  timeAgo,
  useGetBookingChannels,
  useGetDashboardOverview,
  useGetRecentActivity,
  useGetServiceQuality,
  useGetTopFacilities,
  useGetTopFleetPartners,
  useGetTransportDistribution,
  useGetTripVolumeTrend,
  useResolvedApiQuery,
} from '../../../common';
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

const statCardConfig = [
  {
    key: 'total_bookings' as const,
    icon: TripsIcon,
    iconBg: '#EBF2FF',
    label: 'Total Bookings',
    formatValue: (metric: DashboardKPIs['total_bookings']) =>
      formatTotalNumber(metric.value),
  },
  {
    key: 'active_clients' as const,
    icon: DriversIcon,
    iconBg: '#FFFBEB',
    label: 'Active Clients',
    formatValue: (metric: DashboardKPIs['active_clients']) =>
      formatTotalNumber(metric.value),
  },
  {
    key: 'registered_facilities' as const,
    icon: PendingIcon,
    iconBg: '#FEF2F2',
    label: 'Registered Facilities',
    formatValue: (metric: DashboardKPIs['registered_facilities']) =>
      formatTotalNumber(metric.value),
  },
  {
    key: 'revenue' as const,
    icon: RevenueIcon,
    iconBg: '#ECFDF5',
    label: 'Revenue',
    formatValue: (metric: DashboardKPIs['revenue']) =>
      `$${formatTotalNumber(metric.value)}`,
  },
];

const transportColorMap: Record<string, string> = {
  wheelchair: '#10B981',
  stretcher: '#6366F1',
  ambulatory: '#2F6FED',
  standard: '#2F6FED',
  dialysis: '#D97706',
};

const tripTabPeriodDays = [7, 30, 90] as const;

const activityIconMap: Record<
  string,
  { icon: typeof RequestIcon; iconBg: string }
> = {
  booking_created: { icon: RequestIcon, iconBg: '#EFF6FF' },
  status_change: { icon: StartIcon, iconBg: '#F0FDF4' },
  trip_completed: { icon: CompleteIcon, iconBg: '#F0FDF4' },
  facility_registered: { icon: NewDriverIcon, iconBg: '#FAF5FF' },
  client_signup: { icon: CardIcon, iconBg: '#FFFBEB' },
};

const defaultActivityIcon = { icon: RequestIcon, iconBg: '#EFF6FF' };

const avatarColors = ['#2B7FFF', '#AD46FF', '#FE9A00', '#F6339A', '#00C950'];

const channelConfig: Record<
  string,
  { icon: React.ReactNode; color: string; iconBg: string; label: string }
> = {
  mobile_app: {
    icon: <SmartphoneOutlinedIcon sx={{ fontSize: 16, color: '#2B7FFF' }} />,
    color: '#2B7FFF',
    iconBg: '#EFF6FF',
    label: 'Mobile App',
  },
  website_client: {
    icon: <LanguageOutlinedIcon sx={{ fontSize: 16, color: '#AD46FF' }} />,
    color: '#AD46FF',
    iconBg: '#FAF5FF',
    label: 'Website (Client)',
  },
  website_facility: {
    icon: <BusinessOutlinedIcon sx={{ fontSize: 16, color: '#FE9A00' }} />,
    color: '#FE9A00',
    iconBg: '#FFFBEB',
    label: 'Website (Facility)',
  },
};

const defaultChannelConfig = {
  icon: <SmartphoneOutlinedIcon sx={{ fontSize: 16, color: '#9CA3AF' }} />,
  color: '#9CA3AF',
  iconBg: '#F7F9FB',
};

const facilityTypeIconMap: Record<string, React.ReactNode> = {
  hospital: (
    <LocalHospitalOutlinedIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />
  ),
  care_home: <HomeWorkOutlinedIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />,
  rehabilitation: (
    <MedicalServicesOutlinedIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />
  ),
};

const defaultFacilityIcon = (
  <LocalHospitalOutlinedIcon sx={{ fontSize: 18, color: '#FFFFFF' }} />
);

const typeCountColors: Record<string, string> = {
  hospital: '#155DFC',
  care_home: '#9810FA',
  rehabilitation: '#E17100',
};

export const HomePage = () => {
  const today = getTodayDate();
  const [activeTripTab, setActiveTripTab] = useState(0);

  const { data: dashboardKPIs } = useResolvedApiQuery(
    useGetDashboardOverview,
    null
  );

  const { data: tripVolumeTrend } = useResolvedApiQuery(
    useGetTripVolumeTrend,
    null,
    { days: tripTabPeriodDays[activeTripTab] }
  );

  const { data: transportDistribution } = useResolvedApiQuery(
    useGetTransportDistribution,
    null
  );

  const { data: recentActivity } = useResolvedApiQuery(
    useGetRecentActivity,
    null
  );

  const { data: topFleetPartners } = useResolvedApiQuery(
    useGetTopFleetPartners,
    null
  );

  const { data: bookingChannels } = useResolvedApiQuery(
    useGetBookingChannels,
    null
  );

  const { data: serviceQuality } = useResolvedApiQuery(
    useGetServiceQuality,
    null
  );

  const { data: topFacilities } = useResolvedApiQuery(
    useGetTopFacilities,
    null
  );

  const cardData = useMemo(() => {
    return statCardConfig.map((config) => {
      const metric = dashboardKPIs?.[config.key];
      const changePercent = metric?.change_percent ?? 0;
      const isUp = (metric?.trend ?? 'up') !== 'down';

      return {
        top: {
          icon: config.icon,
          iconBg: config.iconBg,
          badgeIcon: isUp ? TrendingUp : TrendingDown,
          badgeBg: isUp ? '#ECFDF5' : '#FEF2F2',
          volumeColor: isUp ? '#10B981' : '#EF4444',
          volumeNum: `${isUp ? '+' : ''}${changePercent}%`,
        },
        bottom: {
          cardNum: metric ? config.formatValue(metric) : '--',
          cardDesc: config.label,
        },
      };
    });
  }, [dashboardKPIs]);

  const chartData = useMemo(() => {
    if (!tripVolumeTrend?.data?.length) return [];
    return tripVolumeTrend.data.map((point) => ({
      day: point.date,
      trips: point.count,
    }));
  }, [tripVolumeTrend]);

  const transportData = useMemo(() => {
    if (!transportDistribution?.distribution?.length) return [];
    return transportDistribution.distribution.map((item) => ({
      label: item.transport_type
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      trips: item.count,
      percent: item.percentage,
      color: transportColorMap[item.transport_type.toLowerCase()] ?? '#9CA3AF',
    }));
  }, [transportDistribution]);

  const bookingChannelsData = useMemo(() => {
    if (!bookingChannels?.channels?.length) return [];
    return bookingChannels.channels.map((item) => {
      const config = channelConfig[item.channel] ?? {
        ...defaultChannelConfig,
        label: item.channel
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      };
      return {
        icon: config.icon,
        label: config.label,
        count: item.count,
        percent: item.percentage,
        color: config.color,
        iconBg: config.iconBg,
        trendValue: `${item.growth_percent >= 0 ? '+' : ''}${item.growth_percent}%`,
        trendPositive: item.growth_percent >= 0,
      };
    });
  }, [bookingChannels]);

  const serviceMetricsData = useMemo(() => {
    if (!serviceQuality) return [];
    return [
      {
        icon: (
          <AccessTimeOutlinedIcon sx={{ fontSize: 18, color: '#2B7FFF' }} />
        ),
        iconBg: '#EFF6FF',
        value: `${serviceQuality.avg_pickup_time_minutes.toFixed(1)} min`,
        label: 'Avg. Pickup Time',
        sublabel: 'Within 15 min window',
      },
      {
        icon: <RouteOutlinedIcon sx={{ fontSize: 18, color: '#AD46FF' }} />,
        iconBg: '#FAF5FF',
        value: `${serviceQuality.avg_trip_distance_km.toFixed(1)} km`,
        label: 'Avg. Trip Distance',
        sublabel: 'Round trip included',
      },
      {
        icon: <StarOutlinedIcon sx={{ fontSize: 18, color: '#FE9A00' }} />,
        iconBg: '#FFFBEB',
        value: `${serviceQuality.service_rating.toFixed(1)}/5.0`,
        label: 'Service Rating',
        sublabel: 'Based on recent reviews',
      },
      {
        icon: (
          <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: '#00C950' }} />
        ),
        iconBg: '#F0FDF4',
        value: `${serviceQuality.completion_rate_percent.toFixed(1)}%`,
        label: 'Completion Rate',
        sublabel: 'Successfully completed',
      },
    ];
  }, [serviceQuality]);

  const facilityData = useMemo(() => {
    if (!topFacilities?.facilities?.length) return [];
    return topFacilities.facilities.map((item, index) => ({
      num: String(item.rank),
      name: item.facility_name,
      type: item.facility_type
        ? item.facility_type
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase())
        : 'Facility',
      bookings: item.total_bookings,
      acceptanceRate: item.acceptance_rate,
      iconBg: avatarColors[index % avatarColors.length],
      icon:
        facilityTypeIconMap[(item.facility_type ?? '').toLowerCase()] ??
        defaultFacilityIcon,
    }));
  }, [topFacilities]);

  const facilityTypeCounts = useMemo(() => {
    if (!topFacilities?.type_counts) return [];
    return Object.entries(topFacilities.type_counts).map(([key, count]) => ({
      label: key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      count,
      color: typeCountColors[key.toLowerCase()] ?? '#9CA3AF',
    }));
  }, [topFacilities]);

  const recentData = useMemo(() => {
    if (!recentActivity?.activities?.length) return [];
    return recentActivity.activities.map((item) => {
      const iconConfig =
        activityIconMap[item.event_type] ?? defaultActivityIcon;
      return {
        icon: iconConfig.icon,
        iconBg: iconConfig.iconBg,
        activityTitle: item.title,
        activityDesc: item.description ?? '',
        time: timeAgo(item.timestamp),
      };
    });
  }, [recentActivity]);

  const fleetPartnerData = useMemo(() => {
    if (!topFleetPartners?.partners?.length) return [];
    return topFleetPartners.partners.map((item, index) => ({
      num: String(item.rank),
      name: item.fleet_name,
      initials: item.fleet_name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase(),
      vehicles: item.vehicle_count,
      trips: item.total_trips,
      rating: item.average_rating,
      avatarBg: avatarColors[index % avatarColors.length],
    }));
  }, [topFleetPartners]);

  const emptyState = <EmptyState animationSrc="/empty.json" />;

  return (
    <AppDashboardLayout>
      <Stack spacing={3}>
        <DashboardTitleAndDesc
          title="Analytics Dashboard"
          desc={`Overview of operations as of today, ${today}`}
        />

        {/* Stat Cards */}
        <Grid container spacing={'20px'} alignItems="stretch">
          {cardData.map((card, index) => (
            <Grid size={{ sm: 6, lg: 3 }} key={index}>
              <CardComponent {...card} />
            </Grid>
          ))}
        </Grid>

        {/* Booking Trends + Transport Type Distribution */}
        <Grid container spacing={'20px'} alignItems="stretch">
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
                {chartData.length > 0 ? (
                  <HomeChart data={chartData} xKey="day" yKey="trips" />
                ) : (
                  emptyState
                )}
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
                {transportData.length > 0 ? (
                  <TransportDistribution
                    data={transportData}
                    clientPercent={
                      transportDistribution?.booking_source
                        ?.client_bookings_percent ?? 0
                    }
                    facilityPercent={
                      transportDistribution?.booking_source
                        ?.facility_bookings_percent ?? 0
                    }
                  />
                ) : (
                  emptyState
                )}
              </Stack>
            </AppCardparent>
          </Grid>
        </Grid>

        {/* Booking Channels + Service Quality Metrics */}
        <Grid container spacing={'20px'} alignItems="stretch">
          <Grid size={{ sm: 12, lg: 6 }}>
            <AppCardparent>
              <Stack spacing={'19.83px'}>
                <CardTitleAndDesc
                  title="Booking Channels"
                  desc="How clients are booking rides"
                />
                {bookingChannelsData.length > 0 ? (
                  <Stack spacing={'20px'}>
                    {bookingChannelsData.map((channel) => (
                      <BookingChannelItem key={channel.label} {...channel} />
                    ))}
                  </Stack>
                ) : (
                  emptyState
                )}
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
                {serviceMetricsData.length > 0 ? (
                  <Grid container spacing={'16px'}>
                    {serviceMetricsData.map((metric) => (
                      <Grid key={metric.label} size={{ xs: 6 }}>
                        <ServiceMetricCard {...metric} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  emptyState
                )}
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
                {facilityData.length > 0 ? (
                  <>
                    {facilityData.map((facility) => (
                      <FacilityComponent key={facility.num} {...facility} />
                    ))}
                    {facilityTypeCounts.length > 0 && (
                      <RowStack spacing={'24px'} sx={{ paddingTop: '4px' }}>
                        {facilityTypeCounts.map((type) => (
                          <Stack key={type.label} spacing={'2px'}>
                            <Typography
                              sx={{
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
                                fontWeight: 400,
                                fontSize: pxToRem(12),
                                color: '#9CA3AF',
                              }}
                            >
                              {type.label}
                            </Typography>
                            <Typography
                              sx={{
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
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
                    )}
                  </>
                ) : (
                  emptyState
                )}
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
                {fleetPartnerData.length > 0 ? (
                  fleetPartnerData.map((partner) => (
                    <FleetPartnerComponent key={partner.num} {...partner} />
                  ))
                ) : (
                  emptyState
                )}
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
            {recentData.length > 0 ? (
              recentData.map((recent, index) => (
                <RecentActivity key={index} {...recent} />
              ))
            ) : (
              emptyState
            )}
          </Stack>
        </AppCardparent>
      </Stack>
    </AppDashboardLayout>
  );
};
