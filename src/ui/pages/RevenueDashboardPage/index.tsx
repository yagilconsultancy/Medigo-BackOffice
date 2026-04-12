'use client';

import { useMemo, useState } from 'react';
import {
  Box,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  Skeleton,
} from '@mui/material';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import dayjs, { Dayjs } from 'dayjs';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import ShowChartOutlinedIcon from '@mui/icons-material/ShowChartOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppDatePickerPopover,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import {
  pxToRem,
  useGetRevenueKpis,
  useGetRevenueTrend,
  useGetRevenueByRideType,
  useGetRevenueByCity,
  useGetRevenueDistribution,
  useResolvedApiQuery,
} from '../../../common';
import { EmptyState } from '../../modules/blocks';

// ─── Types ──────────────────────────────────────────────────────────────────

type PeriodTab = 'Daily' | 'Monthly' | 'Yearly';

// ─── Chart Data ─────────────────────────────────────────────────────────────

const dailyChartData = [
  { name: 'Mon', revenue: 14000 },
  { name: 'Tue', revenue: 16500 },
  { name: 'Wed', revenue: 15200 },
  { name: 'Thu', revenue: 18000 },
  { name: 'Fri', revenue: 21000 },
  { name: 'Sat', revenue: 19200 },
  { name: 'Sun', revenue: 12600 },
];

const monthlyChartData = [
  { name: 'Sep', revenue: 30000 },
  { name: 'Oct', revenue: 42000 },
  { name: 'Nov', revenue: 38000 },
  { name: 'Dec', revenue: 55000 },
  { name: 'Jan', revenue: 62000 },
  { name: 'Feb', revenue: 78000 },
  { name: 'Mar', revenue: 89000 },
];

const yearlyChartData = [
  { name: '2020', revenue: 520000 },
  { name: '2021', revenue: 720000 },
  { name: '2022', revenue: 980000 },
  { name: '2023', revenue: 1240000 },
  { name: '2024', revenue: 1680000 },
  { name: '2025', revenue: 2100000 },
  { name: '2026', revenue: 1200000 },
];

// ─── Tab-Specific Configs ───────────────────────────────────────────────────

const tabConfigs: Record<
  PeriodTab,
  {
    stats: {
      icon: React.ReactNode;
      iconBg: string;
      value: string;
      label: string;
      subtext: string;
    }[];
    chartTitle: string;
    chartSubtitle: string;
    growthRate: string;
    chartData: { name: string; revenue: number }[];
    chartType: 'bar' | 'area';
    yAxisTicks: number[];
    yAxisFormatter: (v: number) => string;
  }
> = {
  Daily: {
    stats: [
      {
        icon: (
          <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />
        ),
        iconBg: '#EBF2FF',
        value: '$118,400',
        label: 'Total Revenue',
        subtext: 'Daily view',
      },
      {
        icon: <ShowChartOutlinedIcon sx={{ fontSize: 20, color: '#6366F1' }} />,
        iconBg: '#EEF2FF',
        value: '$16,914 / day',
        label: 'Average Revenue',
        subtext: 'Per period',
      },
      {
        icon: (
          <CalendarTodayOutlinedIcon sx={{ fontSize: 20, color: '#10B981' }} />
        ),
        iconBg: '#ECFDF5',
        value: 'Friday',
        label: 'Peak Period',
        subtext: 'Highest revenue',
      },
      {
        icon: (
          <TrendingUpOutlinedIcon sx={{ fontSize: 20, color: '#F59E0B' }} />
        ),
        iconBg: '#FFFBEB',
        value: '+12.4%',
        label: 'Growth Rate',
        subtext: 'vs prior period',
      },
    ],
    chartTitle: 'Daily Revenue Trend',
    chartSubtitle: 'This week',
    growthRate: '+12.4%',
    chartData: dailyChartData,
    chartType: 'bar',
    yAxisTicks: [0, 5000, 11000, 16000, 21000],
    yAxisFormatter: (v: number) => `$${Math.round(v / 1000)}k`,
  },
  Monthly: {
    stats: [
      {
        icon: (
          <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />
        ),
        iconBg: '#EBF2FF',
        value: '$284,720',
        label: 'Total Revenue',
        subtext: 'Monthly view',
      },
      {
        icon: <ShowChartOutlinedIcon sx={{ fontSize: 20, color: '#6366F1' }} />,
        iconBg: '#EEF2FF',
        value: '$9,490 / month',
        label: 'Average Revenue',
        subtext: 'Per period',
      },
      {
        icon: (
          <CalendarTodayOutlinedIcon sx={{ fontSize: 20, color: '#10B981' }} />
        ),
        iconBg: '#ECFDF5',
        value: 'March',
        label: 'Peak Period',
        subtext: 'Highest revenue',
      },
      {
        icon: (
          <TrendingUpOutlinedIcon sx={{ fontSize: 20, color: '#F59E0B' }} />
        ),
        iconBg: '#FFFBEB',
        value: '+18.4%',
        label: 'Growth Rate',
        subtext: 'vs prior period',
      },
    ],
    chartTitle: 'Monthly Revenue Trend',
    chartSubtitle: 'Last 7 months',
    growthRate: '+18.4%',
    chartData: monthlyChartData,
    chartType: 'area',
    yAxisTicks: [0, 30000, 59000, 89000, 118000],
    yAxisFormatter: (v: number) => `$${Math.round(v / 1000)}k`,
  },
  Yearly: {
    stats: [
      {
        icon: (
          <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />
        ),
        iconBg: '#EBF2FF',
        value: '$1,740,000',
        label: 'Total Revenue',
        subtext: 'Yearly view',
      },
      {
        icon: <ShowChartOutlinedIcon sx={{ fontSize: 20, color: '#6366F1' }} />,
        iconBg: '#EEF2FF',
        value: '$145,000 / month',
        label: 'Average Revenue',
        subtext: 'Per period',
      },
      {
        icon: (
          <CalendarTodayOutlinedIcon sx={{ fontSize: 20, color: '#10B981' }} />
        ),
        iconBg: '#ECFDF5',
        value: '2025',
        label: 'Peak Period',
        subtext: 'Highest revenue',
      },
      {
        icon: (
          <TrendingUpOutlinedIcon sx={{ fontSize: 20, color: '#F59E0B' }} />
        ),
        iconBg: '#FFFBEB',
        value: '+26.1%',
        label: 'Growth Rate',
        subtext: 'vs prior period',
      },
    ],
    chartTitle: 'Yearly Revenue Trend',
    chartSubtitle: '2020 – 2026',
    growthRate: '+26.1%',
    chartData: yearlyChartData,
    chartType: 'bar',
    yAxisTicks: [0, 435000, 870000, 1305000, 1740000],
    yAxisFormatter: (v: number) => `$${Math.round(v / 1000)}k`,
  },
};

// ─── Revenue by Ride Type ───────────────────────────────────────────────────

const rideTypes = [
  {
    label: 'Standard Medical',
    revenue: '$128,400',
    percent: '45%',
    trips: '2840 trips',
    color: '#2F6FED',
    progress: 45,
  },
  {
    label: 'Wheelchair Accessible',
    revenue: '$74,320',
    percent: '26%',
    trips: '982 trips',
    color: '#6366F1',
    progress: 26,
  },
  {
    label: 'Assisted Ride',
    revenue: '$51,040',
    percent: '18%',
    trips: '724 trips',
    color: '#10B981',
    progress: 18,
  },
  {
    label: 'Stretcher Transport',
    revenue: '$28,640',
    percent: '10%',
    trips: '214 trips',
    color: '#F59E0B',
    progress: 10,
  },
  {
    label: 'Other',
    revenue: '$2,960',
    percent: '1%',
    trips: '61 trips',
    color: '#EC4899',
    progress: 1,
  },
];

// ─── Revenue by City ────────────────────────────────────────────────────────

const cities = [
  {
    rank: 1,
    city: 'New York, NY',
    trips: '1840 trips',
    revenue: '$84,210',
    growth: '+22%',
  },
  {
    rank: 2,
    city: 'Los Angeles, CA',
    trips: '1120 trips',
    revenue: '$48,640',
    growth: '+18%',
  },
  {
    rank: 3,
    city: 'Chicago, IL',
    trips: '740 trips',
    revenue: '$31,820',
    growth: '+14%',
  },
  {
    rank: 4,
    city: 'Houston, TX',
    trips: '580 trips',
    revenue: '$24,580',
    growth: '+11%',
  },
  {
    rank: 5,
    city: 'Miami, FL',
    trips: '420 trips',
    revenue: '$18,090',
    growth: '+9%',
  },
];

// ─── Revenue Distribution ───────────────────────────────────────────────────

const distribution = [
  {
    label: 'Gross Revenue',
    amount: '$284,720',
    color: '#2F6FED',
    progress: 100,
  },
  {
    label: 'Platform Commission (20%)',
    amount: '$56,944',
    color: '#6366F1',
    progress: 20,
  },
  {
    label: 'Driver Payouts (50%)',
    amount: '$142,360',
    color: '#10B981',
    progress: 50,
  },
  {
    label: 'Fleet Payouts (25%)',
    amount: '$71,180',
    color: '#F59E0B',
    progress: 25,
  },
  {
    label: 'Refunds Issued',
    amount: '-$3,840',
    color: '#EF4444',
    progress: 1.3,
    isNegative: true,
  },
];

// ─── Custom Tooltip ─────────────────────────────────────────────────────────

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;

  return (
    <Stack
      sx={{
        background: '#FFFFFF',
        border: '0.67px solid #E8ECF0',
        borderRadius: '12px',
        boxShadow: '0px 8px 28px 0px rgba(0, 0, 0, 0.12)',
        padding: '10px 14px',
        minWidth: '120px',
      }}
    >
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: pxToRem(11.5),
          color: '#6B7280',
          marginBottom: '4px',
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontFamily: 'Inter, sans-serif',
          fontWeight: 700,
          fontSize: pxToRem(13),
          color: '#111827',
        }}
      >
        ${(payload[0].value as number).toLocaleString()}
      </Typography>
    </Stack>
  );
};

// ─── Component ──────────────────────────────────────────────────────────────

export const RevenueDashboardPage = () => {
  const [activeTab, setActiveTab] = useState<PeriodTab>('Daily');
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs('2026-03-10')
  );

  // API Integration
  const { data: kpisData } = useResolvedApiQuery(useGetRevenueKpis, null);
  const { data: trendData } = useResolvedApiQuery(useGetRevenueTrend, null, {
    period: activeTab.toLowerCase(),
  });
  const { data: rideTypeData } = useResolvedApiQuery(
    useGetRevenueByRideType,
    null
  );
  const { data: cityData } = useResolvedApiQuery(useGetRevenueByCity, null);
  const { data: distributionData } = useResolvedApiQuery(
    useGetRevenueDistribution,
    null
  );

  const rideTypes = useMemo(() => {
    const items = rideTypeData || [];
    const colors = ['#2F6FED', '#6366F1', '#10B981', '#F59E0B', '#EC4899'];
    return items.map((rt: any, idx: number) => ({
      label: rt.ride_type || 'Unknown',
      revenue: `$${rt.revenue?.toLocaleString() || '0'}`,
      percent: `${rt.percentage || 0}%`,
      trips: `${rt.rides || rt.trip_count || 0} trips`,
      color: colors[idx % colors.length],
      progress: rt.percentage || 0,
    }));
  }, [rideTypeData]);

  const cities = useMemo(() => {
    const items = cityData || [];
    return items.map((c: any, idx: number) => ({
      rank: idx + 1,
      city: c.city || 'Unknown',
      trips: `${c.rides || c.trip_count || 0} trips`,
      revenue: `$${c.revenue?.toLocaleString() || '0'}`,
      growth: c.percentage ? `+${c.percentage}%` : '+0%',
    }));
  }, [cityData]);

  const distribution = useMemo(() => {
    if (!distributionData) return [];

    const total =
      (distributionData.driver_earnings || 0) +
      (distributionData.platform_fees || 0) +
      (distributionData.taxes || 0) +
      (distributionData.other || 0);

    return [
      {
        label: 'Driver Earnings',
        amount: `$${(distributionData.driver_earnings || 0).toLocaleString()}`,
        color: '#10B981',
        progress:
          total > 0
            ? ((distributionData.driver_earnings || 0) / total) * 100
            : 0,
        isNegative: false,
      },
      {
        label: 'Platform Fees',
        amount: `$${(distributionData.platform_fees || 0).toLocaleString()}`,
        color: '#6366F1',
        progress:
          total > 0 ? ((distributionData.platform_fees || 0) / total) * 100 : 0,
        isNegative: false,
      },
      {
        label: 'Taxes',
        amount: `$${(distributionData.taxes || 0).toLocaleString()}`,
        color: '#F59E0B',
        progress: total > 0 ? ((distributionData.taxes || 0) / total) * 100 : 0,
        isNegative: false,
      },
      {
        label: 'Other',
        amount: `$${(distributionData.other || 0).toLocaleString()}`,
        color: '#EC4899',
        progress: total > 0 ? ((distributionData.other || 0) / total) * 100 : 0,
        isNegative: false,
      },
    ];
  }, [distributionData]);

  const chartData = useMemo(() => {
    const items = trendData || [];
    return items.map((item: any) => ({
      name: item.period || '',
      revenue: item.revenue || 0,
    }));
  }, [trendData]);

  const statCards = useMemo(() => {
    const kpis = kpisData || {};
    return [
      {
        icon: (
          <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />
        ),
        iconBg: '#EBF2FF',
        value: `$${kpis.total_revenue?.toLocaleString() || '0'}`,
        label: 'Total Revenue',
        subtext: activeTab + ' view',
      },
      {
        icon: <ShowChartOutlinedIcon sx={{ fontSize: 20, color: '#6366F1' }} />,
        iconBg: '#EEF2FF',
        value: `$${kpis.average_transaction?.toLocaleString() || '0'}`,
        label: 'Average Revenue',
        subtext: 'Per period',
      },
      {
        icon: (
          <CalendarTodayOutlinedIcon sx={{ fontSize: 20, color: '#10B981' }} />
        ),
        iconBg: '#ECFDF5',
        value: kpis.total_rides?.toLocaleString() || '0',
        label: 'Total Rides',
        subtext: 'Completed rides',
      },
      {
        icon: (
          <TrendingUpOutlinedIcon sx={{ fontSize: 20, color: '#F59E0B' }} />
        ),
        iconBg: '#FFFBEB',
        value: kpis.growth_percentage ? `+${kpis.growth_percentage}%` : '+0%',
        label: 'Growth Rate',
        subtext: 'vs prior period',
      },
    ];
  }, [kpisData, activeTab]);

  const config = tabConfigs[activeTab];
  const tabs: PeriodTab[] = ['Daily', 'Monthly', 'Yearly'];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* Title + Tab Selector */}
        <RowStack justifyContent={'space-between'} alignItems={'flex-start'}>
          <DashboardTitleAndDesc
            title="Revenue Dashboard"
            desc="Daily, monthly, and yearly revenue analytics across all ride categories"
          />

          <RowStack spacing={'12px'} sx={{ flexShrink: 0 }}>
            <AppDatePickerPopover
              value={selectedDate}
              onChange={setSelectedDate}
            />

            {/* Period Tabs */}
            <RowStack
              spacing={'4px'}
              sx={{
                background: '#F7F9FB',
                border: '0.67px solid #E8ECF0',
                borderRadius: '14px',
                padding: '4px',
              }}
            >
              {tabs.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <Box
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    sx={{
                      padding: '6px 16px',
                      borderRadius: '9px',
                      background: isActive ? '#2F6FED' : 'transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      '&:hover': { opacity: 0.85 },
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: (theme) => theme.typography.fontFamily,
                        fontWeight: 600,
                        fontSize: pxToRem(13),
                        color: isActive ? '#FFFFFF' : '#6B7280',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {tab}
                    </Typography>
                  </Box>
                );
              })}
            </RowStack>
          </RowStack>
        </RowStack>

        {/* Stat Cards */}
        <Grid container spacing={'20px'}>
          {statCards.map((card) => (
            <Grid key={card.label} size={{ xs: 6, lg: 3 }}>
              <Stack
                sx={{
                  background: '#FFFFFF',
                  border: '0.67px solid #F0F4F8',
                  borderRadius: '16px',
                  boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                  padding: '20px',
                  gap: '16px',
                }}
              >
                <RowStack justifyContent={'space-between'}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '14px',
                      background: card.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 26,
                      height: 20,
                      borderRadius: '100px',
                      background: '#ECFDF5',
                    }}
                  >
                    <ArrowUpwardIcon sx={{ fontSize: 11, color: '#059669' }} />
                  </Box>
                </RowStack>
                <Stack spacing={'4px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(22),
                      lineHeight: '1em',
                      color: '#111827',
                    }}
                  >
                    {card.value}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(13),
                      color: '#374151',
                    }}
                  >
                    {card.label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(11.5),
                      color: '#9CA3AF',
                    }}
                  >
                    {card.subtext}
                  </Typography>
                </Stack>
              </Stack>
            </Grid>
          ))}
        </Grid>

        {/* Chart Row */}
        <Grid container spacing={'20px'}>
          {/* Main Chart */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Box
              sx={{
                background: '#FFFFFF',
                border: '0.67px solid #F0F4F8',
                borderRadius: '16px',
                boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                padding: '24px',
                height: '100%',
              }}
            >
              {/* Chart Header */}
              <RowStack justifyContent={'space-between'} sx={{ mb: '4px' }}>
                <Stack spacing={'4px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 500,
                      fontSize: pxToRem(18),
                      color: '#111827',
                    }}
                  >
                    {config.chartTitle}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(13),
                      color: '#6B7280',
                    }}
                  >
                    {config.chartSubtitle}
                  </Typography>
                </Stack>
                <RowStack
                  spacing={'4px'}
                  sx={{
                    padding: '4px 10px',
                    borderRadius: '100px',
                    background: '#ECFDF5',
                  }}
                >
                  <ArrowUpwardIcon sx={{ fontSize: 13, color: '#059669' }} />
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(12),
                      color: '#059669',
                    }}
                  >
                    {config.growthRate}
                  </Typography>
                </RowStack>
              </RowStack>

              {/* Chart */}
              <Box sx={{ mt: '20px' }}>
                <ResponsiveContainer width="100%" height={310}>
                  {config.chartType === 'bar' ? (
                    <BarChart
                      data={chartData}
                      margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#F0F4F8"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 11.5,
                          fill: '#9CA3AF',
                          fontWeight: 400,
                          fontFamily: 'Inter, sans-serif',
                        }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 11.5,
                          fill: '#9CA3AF',
                          fontWeight: 400,
                          fontFamily: 'Inter, sans-serif',
                        }}
                        dx={-5}
                        ticks={config.yAxisTicks}
                        tickFormatter={config.yAxisFormatter}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="#2F6FED"
                        fillOpacity={0.85}
                        radius={[4, 4, 0, 0]}
                        barSize={42}
                      />
                    </BarChart>
                  ) : (
                    <AreaChart
                      data={chartData}
                      margin={{ top: 5, right: 5, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="revenueGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#2F6FED"
                            stopOpacity={0.15}
                          />
                          <stop
                            offset="95%"
                            stopColor="#2F6FED"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#F0F4F8"
                      />
                      <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 11.5,
                          fill: '#9CA3AF',
                          fontWeight: 400,
                          fontFamily: 'Inter, sans-serif',
                        }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fontSize: 11.5,
                          fill: '#9CA3AF',
                          fontWeight: 400,
                          fontFamily: 'Inter, sans-serif',
                        }}
                        dx={-5}
                        ticks={config.yAxisTicks}
                        tickFormatter={config.yAxisFormatter}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#2F6FED"
                        strokeWidth={2.5}
                        fill="url(#revenueGradient)"
                        dot={{
                          r: 5,
                          fill: '#FFFFFF',
                          stroke: '#2F6FED',
                          strokeWidth: 2,
                        }}
                        activeDot={{
                          r: 6,
                          fill: '#FFFFFF',
                          stroke: '#2F6FED',
                          strokeWidth: 2.5,
                        }}
                      />
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              </Box>
            </Box>
          </Grid>

          {/* Revenue by Ride Type */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack
              spacing={'16px'}
              sx={{
                background: '#FFFFFF',
                border: '0.67px solid #F0F4F8',
                borderRadius: '16px',
                boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                padding: '24px',
                height: '100%',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(18),
                  color: '#111827',
                }}
              >
                Revenue by Ride Type
              </Typography>

              {rideTypes.length === 0 ? (
                <Stack
                  sx={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EmptyState emptyState="No Ride Type Data" />
                </Stack>
              ) : (
                <>
                  {rideTypes.map((rt) => (
                    <Stack key={rt.label} spacing={'6px'}>
                      <RowStack justifyContent={'space-between'}>
                        <RowStack spacing={'8px'}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              background: rt.color,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 400,
                              fontSize: pxToRem(12.5),
                              color: '#374151',
                            }}
                          >
                            {rt.label}
                          </Typography>
                        </RowStack>
                        <RowStack spacing={'6px'}>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 700,
                              fontSize: pxToRem(13),
                              color: '#111827',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {rt.revenue}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 400,
                              fontSize: pxToRem(12),
                              color: '#9CA3AF',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {rt.percent}
                          </Typography>
                        </RowStack>
                      </RowStack>

                      <LinearProgress
                        variant="determinate"
                        value={rt.progress}
                        sx={{
                          height: 5,
                          borderRadius: '100px',
                          backgroundColor: '#F0F4F8',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: '100px',
                            backgroundColor: rt.color,
                          },
                        }}
                      />

                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(11),
                          color: '#9CA3AF',
                        }}
                      >
                        {rt.trips}
                      </Typography>
                    </Stack>
                  ))}
                </>
              )}
            </Stack>
          </Grid>
        </Grid>

        {/* Bottom Row */}
        <Grid container spacing={'20px'}>
          {/* Revenue by City */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack
              spacing={'12px'}
              sx={{
                background: '#FFFFFF',
                border: '0.67px solid #F0F4F8',
                borderRadius: '16px',
                boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                padding: '24px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(18),
                  color: '#111827',
                  mb: '4px',
                }}
              >
                Revenue by City
              </Typography>

              {cities.length === 0 ? (
                <Stack
                  sx={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EmptyState emptyState="No City Data" />
                </Stack>
              ) : (
                <>
                  {cities.map((c) => (
                    <RowStack
                      key={c.rank}
                      justifyContent={'space-between'}
                      sx={{
                        padding: '8px 0',
                      }}
                    >
                      <RowStack spacing={'12px'}>
                        <Box
                          sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '14px',
                            background: '#F7F9FB',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 700,
                              fontSize: pxToRem(12),
                              color: '#6B7280',
                            }}
                          >
                            {c.rank}
                          </Typography>
                        </Box>
                        <Stack spacing={'2px'}>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 600,
                              fontSize: pxToRem(13),
                              color: '#111827',
                            }}
                          >
                            {c.city}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 400,
                              fontSize: pxToRem(11.5),
                              color: '#9CA3AF',
                            }}
                          >
                            {c.trips}
                          </Typography>
                        </Stack>
                      </RowStack>

                      <Stack alignItems={'flex-end'} spacing={'2px'}>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 700,
                            fontSize: pxToRem(14),
                            color: '#111827',
                          }}
                        >
                          {c.revenue}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 600,
                            fontSize: pxToRem(11.5),
                            color: '#059669',
                          }}
                        >
                          {c.growth}
                        </Typography>
                      </Stack>
                    </RowStack>
                  ))}
                </>
              )}
            </Stack>
          </Grid>

          {/* Revenue Distribution */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack
              spacing={'16px'}
              sx={{
                background: '#FFFFFF',
                border: '0.67px solid #F0F4F8',
                borderRadius: '16px',
                boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                padding: '24px',
              }}
            >
              <Typography
                sx={{
                  fontFamily: (theme) => theme.typography.fontFamily,
                  fontWeight: 500,
                  fontSize: pxToRem(18),
                  color: '#111827',
                }}
              >
                Revenue Distribution (March 2026)
              </Typography>

              {distribution.length === 0 ? (
                <Stack
                  sx={{
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <EmptyState emptyState="No Distribution Data" />
                </Stack>
              ) : (
                <>
                  {distribution.map((d) => (
                    <Stack key={d.label} spacing={'6px'}>
                      <RowStack justifyContent={'space-between'}>
                        <RowStack spacing={'8px'}>
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              background: d.color,
                              flexShrink: 0,
                            }}
                          />
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 400,
                              fontSize: pxToRem(12.5),
                              color: '#374151',
                            }}
                          >
                            {d.label}
                          </Typography>
                        </RowStack>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 700,
                            fontSize: pxToRem(13),
                            color: d.isNegative ? '#EF4444' : '#111827',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {d.amount}
                        </Typography>
                      </RowStack>

                      <LinearProgress
                        variant="determinate"
                        value={d.progress}
                        sx={{
                          height: 5,
                          borderRadius: '100px',
                          backgroundColor: '#F0F4F8',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: '100px',
                            backgroundColor: d.color,
                          },
                        }}
                      />
                    </Stack>
                  ))}
                </>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </AppDashboardLayout>
  );
};
