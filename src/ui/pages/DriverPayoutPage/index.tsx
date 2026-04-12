'use client';

import { useState, useMemo } from 'react';
import {
  Avatar,
  Box,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import dayjs, { Dayjs } from 'dayjs';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import { AppDashboardLayout } from '../../modules/partials/AppDashboardLayout';
import {
  AppButton,
  AppGridtable,
  AppSearchField,
  AppDatePickerPopover,
  AppFilterPopover,
  DashboardTitleAndDesc,
  RowStack,
} from '../../modules/components';
import { GridColSpec } from '../../modules/components/GridTable';
import { FilterSection } from '../../modules/components/AppFilterPopover';
import {
  pxToRem,
  useGetPayoutKpis,
  useGetPayoutSchedule,
  useGetEarningsBreakdown,
  useGetMonthlyDistribution,
  useGetDriverEarningsList,
  useResolvedApiQuery,
} from '../../../common';
import { EarningDetailModal } from '../CaregiverPayoutPage/ui/components';
import { EmptyState } from '../../modules/blocks';

// ─── Types ──────────────────────────────────────────────────────────────────

type DriverStatus = 'Active' | 'Suspended';

type DriverRow = {
  id: string;
  driverId: string;
  name: string;
  initials: string;
  avatarBg: string;
  fleet: string;
  trips: number;
  gross: string;
  commission: string;
  netPayout: string;
  pending: string;
  pendingValue: number;
  schedule: string;
  status: DriverStatus;
};

// ─── Helper Functions ───────────────────────────────────────────────────────

const formatCurrency = (value?: number): string => {
  if (!value) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getStatusStyles = (status: string) => {
  const statusMap: Record<
    string,
    {
      bg: string;
      dot: string;
      color: string;
      cardBg: string;
      cardBorder: string;
      amountColor: string;
    }
  > = {
    completed: {
      bg: '#F0FDF7',
      dot: '#059669',
      color: '#059669',
      cardBg: '#F6FEF9',
      cardBorder: '#BBF7D0',
      amountColor: '#059669',
    },
    scheduled: {
      bg: '#DBEAFE',
      dot: '#2F6FED',
      color: '#2F6FED',
      cardBg: '#F8FAFF',
      cardBorder: '#BFDBFE',
      amountColor: '#2F6FED',
    },
    upcoming: {
      bg: '#F3F4F6',
      dot: '#D1D5DB',
      color: '#9CA3AF',
      cardBg: '#FAFAFA',
      cardBorder: '#F0F4F8',
      amountColor: '#6B7280',
    },
  };
  return statusMap[status.toLowerCase()] || statusMap.upcoming;
};

// ─── Custom Tooltip ─────────────────────────────────────────────────────────

const CustomPieTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: {
    name: string;
    value: number;
    payload: { amount: string; color: string };
  }[];
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <Box
      sx={{
        background: '#FFFFFF',
        border: '0.667px solid #F0F4F8',
        borderRadius: '12px',
        boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.12)',
        padding: '10px 14px',
      }}
    >
      <RowStack spacing={'8px'}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: d.payload.color,
            flexShrink: 0,
          }}
        />
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: pxToRem(12),
            color: '#111827',
          }}
        >
          {d.name}
        </Typography>
      </RowStack>
      <RowStack spacing={'12px'} sx={{ mt: '4px', pl: '16px' }}>
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 700,
            fontSize: pxToRem(14),
            color: '#111827',
          }}
        >
          {d.value}%
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 400,
            fontSize: pxToRem(12),
            color: '#9CA3AF',
          }}
        >
          {d.payload.amount}
        </Typography>
      </RowStack>
    </Box>
  );
};

// ─── Filter Sections ────────────────────────────────────────────────────────

const filterSections: FilterSection[] = [
  {
    label: 'Fleet',
    key: 'fleet',
    options: [
      'All',
      'MediGo',
      'MedRide Express',
      'CareTransit',
      'HealthHaul',
      'SafeRide Medical',
      'MobiCare',
      'Apex Medical',
    ],
  },
  {
    label: 'Status',
    key: 'status',
    options: ['All', 'Active', 'Suspended'],
  },
];

// ─── Table Data ─────────────────────────────────────────────────────────────

const driverData: DriverRow[] = [
  {
    id: '1',
    driverId: 'DRV-0101',
    name: 'Marcus Johnson',
    initials: 'MJ',
    avatarBg: '#2F6FED',
    fleet: 'MediGo',
    trips: 89,
    gross: '$4,095',
    commission: '−$819',
    netPayout: '$3,276',
    pending: '$327',
    pendingValue: 327,
    schedule: 'Weekly · Every Monday',
    status: 'Active',
  },
  {
    id: '2',
    driverId: 'DRV-0102',
    name: 'Sarah Williams',
    initials: 'SW',
    avatarBg: '#6366F1',
    fleet: 'MedRide Express',
    trips: 74,
    gross: '$3,404',
    commission: '−$681',
    netPayout: '$2,723',
    pending: '—',
    pendingValue: 0,
    schedule: 'Weekly · Every Monday',
    status: 'Active',
  },
  {
    id: '3',
    driverId: 'DRV-0103',
    name: 'David Chen',
    initials: 'DC',
    avatarBg: '#F59E0B',
    fleet: 'MediGo',
    trips: 68,
    gross: '$3,128',
    commission: '−$626',
    netPayout: '$2,502',
    pending: '$250',
    pendingValue: 250,
    schedule: 'Bi-weekly',
    status: 'Active',
  },
  {
    id: '4',
    driverId: 'DRV-0104',
    name: 'Emily Rodriguez',
    initials: 'ER',
    avatarBg: '#EC4899',
    fleet: 'CareTransit',
    trips: 61,
    gross: '$2,806',
    commission: '−$561',
    netPayout: '$2,245',
    pending: '—',
    pendingValue: 0,
    schedule: 'Weekly · Every Monday',
    status: 'Active',
  },
  {
    id: '5',
    driverId: 'DRV-0105',
    name: 'James Wilson',
    initials: 'JW',
    avatarBg: '#10B981',
    fleet: 'HealthHaul',
    trips: 55,
    gross: '$2,530',
    commission: '−$506',
    netPayout: '$2,024',
    pending: '$202',
    pendingValue: 202,
    schedule: 'Weekly · Every Monday',
    status: 'Active',
  },
  {
    id: '6',
    driverId: 'DRV-0106',
    name: 'Lisa Thompson',
    initials: 'LT',
    avatarBg: '#9CA3AF',
    fleet: 'MediGo',
    trips: 49,
    gross: '$2,254',
    commission: '−$451',
    netPayout: '$1,803',
    pending: '—',
    pendingValue: 0,
    schedule: 'Bi-weekly',
    status: 'Active',
  },
  {
    id: '7',
    driverId: 'DRV-0107',
    name: 'Robert Kim',
    initials: 'RK',
    avatarBg: '#EF4444',
    fleet: 'SafeRide Medical',
    trips: 43,
    gross: '$1,978',
    commission: '−$396',
    netPayout: '$1,582',
    pending: '$158',
    pendingValue: 158,
    schedule: 'Weekly · Every Monday',
    status: 'Suspended',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export const DriverPayoutPage = () => {
  // — All hooks first —
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    dayjs('2026-03-10')
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDriver, setSelectedDriver] = useState<DriverRow | null>(null);
  const [earningDetailOpen, setEarningDetailOpen] = useState(false);
  const [filters, setFilters] = useState<Record<string, string>>({
    fleet: 'All',
    status: 'All',
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // API Hooks
  const kpisQuery = useGetPayoutKpis();
  const { data: kpis } = useResolvedApiQuery(useGetPayoutKpis, null);
  const isFetchingKpis = kpisQuery.isFetching;

  const scheduleQuery = useGetPayoutSchedule();
  const { data: scheduleData } = useResolvedApiQuery(
    useGetPayoutSchedule,
    null
  );
  const isFetchingSchedule = scheduleQuery.isFetching;

  const breakdownQuery = useGetEarningsBreakdown();
  const { data: breakdownData } = useResolvedApiQuery(
    useGetEarningsBreakdown,
    null
  );
  const isFetchingBreakdown = breakdownQuery.isFetching;

  const distributionQuery = useGetMonthlyDistribution();
  // const { data: distributionData } = useResolvedApiQuery(
  //   useGetMonthlyDistribution,
  //   null
  // );
  // const isFetchingDistribution = distributionQuery.isFetching;

  const driversQuery = useGetDriverEarningsList({
    page,
    limit: pageSize,
    search: searchQuery.trim() || null,
    fleet_id: filters.fleet !== 'All' ? filters.fleet : null,
    status: filters.status !== 'All' ? filters.status : null,
  });
  const { data: driversData } = useResolvedApiQuery(
    useGetDriverEarningsList,
    null,
    {
      page,
      limit: pageSize,
      search: searchQuery.trim() || null,
      fleet_id: filters.fleet !== 'All' ? filters.fleet : null,
      status: filters.status !== 'All' ? filters.status : null,
    }
  );
  const isFetchingDrivers = driversQuery.isFetching;

  // — Derived state / handlers —
  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleFilterReset = () => {
    setFilters({ fleet: 'All', status: 'All' });
  };

  // Map KPI data
  const statCards = useMemo(
    () => [
      {
        icon: (
          <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: '#2F6FED' }} />
        ),
        iconBg: '#EBF2FF',
        value: formatCurrency(kpis?.total_earnings),
        label: 'Total Earnings',
        badge: '+16.2%',
        badgeBg: '#F0FDF7',
        badgeColor: '#059669',
        subtext: 'March 2026 · vs February',
      },
      {
        icon: <PeopleOutlineIcon sx={{ fontSize: 20, color: '#6366F1' }} />,
        iconBg: '#EEF2FF',
        value: String(kpis?.active_drivers ?? 0),
        label: 'Active Drivers',
        badge: '+4',
        badgeBg: '#F0FDF7',
        badgeColor: '#059669',
        subtext: 'Receiving payouts · vs last month',
      },
      {
        icon: <ScheduleOutlinedIcon sx={{ fontSize: 20, color: '#D97706' }} />,
        iconBg: '#FFFBEB',
        value: String(kpis?.payouts_pending_count ?? 0),
        label: 'Payouts Pending',
        badge: 'Mar 17',
        badgeBg: '#FEF9EC',
        badgeColor: '#D97706',
        subtext: 'Next payout · Scheduled Monday',
      },
      {
        icon: (
          <AttachMoneyOutlinedIcon sx={{ fontSize: 20, color: '#D97706' }} />
        ),
        iconBg: '#FFFBEB',
        value: formatCurrency(kpis?.payouts_pending_total),
        label: 'Pending Amount',
        badge: formatCurrency(kpis?.payouts_pending_total),
        badgeBg: '#FEF9EC',
        badgeColor: '#D97706',
        subtext: 'Total pending payouts',
      },
      {
        icon: (
          <CheckCircleOutlineIcon sx={{ fontSize: 20, color: '#059669' }} />
        ),
        iconBg: '#F0FDF7',
        value: formatCurrency(kpis?.payouts_completed_total),
        label: 'Payouts Completed',
        badge: '95.5%',
        badgeBg: '#F0FDF7',
        badgeColor: '#059669',
        subtext: 'This month · completion rate',
      },
    ],
    [kpis]
  );

  // Map schedule data
  const payoutSchedule = useMemo(() => {
    if (!scheduleData || !Array.isArray(scheduleData)) return [];
    return scheduleData.map((item) => {
      const styles = getStatusStyles(item.status);
      return {
        date: dayjs(item.date).format('MMM D, YYYY'),
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        statusBg: styles.bg,
        statusDot: styles.dot,
        statusColor: styles.color,
        desc: `Weekly Payout · ${item.driver_count} drivers`,
        amount: formatCurrency(item.amount),
        amountColor: styles.amountColor,
        cardBg: styles.cardBg,
        cardBorder: styles.cardBorder,
      };
    });
  }, [scheduleData]);

  // Map earnings breakdown
  const earningsBreakdown = useMemo(() => {
    if (!breakdownData) return [];
    return [
      {
        icon: (
          <MonetizationOnOutlinedIcon sx={{ fontSize: 18, color: '#2F6FED' }} />
        ),
        iconBg: '#EFF5FF',
        value: formatCurrency(breakdownData.gross_ride_revenue),
        label: 'Gross Ride Revenue',
        desc: 'Total collected from rides',
      },
      {
        icon: (
          <RemoveCircleOutlineIcon sx={{ fontSize: 18, color: '#EF4444' }} />
        ),
        iconBg: '#FFF1F2',
        value: formatCurrency(breakdownData.platform_commission),
        label: 'Platform Commission',
        desc: '20% platform fee deducted',
      },
      {
        icon: (
          <AccountBalanceWalletOutlinedIcon
            sx={{ fontSize: 18, color: '#059669' }}
          />
        ),
        iconBg: '#F0FDF7',
        value: formatCurrency(breakdownData.driver_payouts),
        label: 'Net Driver Pool',
        desc: 'Allocated to drivers',
      },
    ];
  }, [breakdownData]);

  // Map donut chart data
  const donutData = useMemo(() => {
    if (!breakdownData) return [];
    const total = breakdownData.gross_ride_revenue || 1;
    return [
      {
        name: 'Driver Payouts',
        value: Math.round((breakdownData.driver_payouts / total) * 100),
        amount: formatCurrency(breakdownData.driver_payouts),
        color: '#10B981',
      },
      {
        name: 'Platform Commission',
        value: Math.round((breakdownData.platform_commission / total) * 100),
        amount: formatCurrency(breakdownData.platform_commission),
        color: '#2F6FED',
      },
    ];
  }, [breakdownData]);

  // Map driver earnings list
  const driverRows = useMemo<DriverRow[]>(() => {
    if (!driversData?.items) return [];
    const avatarColors = [
      '#2F6FED',
      '#6366F1',
      '#F59E0B',
      '#EC4899',
      '#10B981',
      '#9CA3AF',
      '#EF4444',
    ];
    return driversData.items.map((item, index) => {
      const getInitials = (name: string) => {
        return name
          .split(' ')
          .map((w) => w[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
      };
      const commissionValue = item.total_earnings * 0.2;
      return {
        id: item.id,
        driverId: item.driver_id,
        name: item.driver_name,
        initials: getInitials(item.driver_name),
        avatarBg: avatarColors[index % avatarColors.length],
        fleet: item.fleet_name || 'N/A',
        trips: item.completed_rides,
        gross: formatCurrency(item.total_earnings),
        commission: `−${formatCurrency(commissionValue)}`,
        netPayout: formatCurrency(item.total_earnings - commissionValue),
        pending: formatCurrency(item.pending_payout),
        pendingValue: item.pending_payout,
        schedule: 'Weekly · Every Monday',
        status: (item.status === 'active'
          ? 'Active'
          : 'Suspended') as DriverStatus,
      };
    });
  }, [driversData]);

  const filteredDrivers = driverRows;

  const columns: GridColSpec<DriverRow>[] = [
    {
      field: 'name',
      headerName: 'Driver',
      flex: 1.3,
      minWidth: 180,
      renderCell: (params) => (
        <RowStack spacing={'10px'}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              fontSize: pxToRem(11),
              fontWeight: 700,
              background: params.row.avatarBg,
              color: '#FFFFFF',
              borderRadius: '14px',
            }}
          >
            {params.row.initials}
          </Avatar>
          <Stack spacing={0}>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 700,
                fontSize: pxToRem(14),
                color: '#111827',
                lineHeight: '1.4em',
              }}
            >
              {params.row.name}
            </Typography>
            <Typography
              sx={{
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 400,
                fontSize: pxToRem(12),
                color: '#9CA3AF',
                lineHeight: '1.4em',
              }}
            >
              {params.row.driverId}
            </Typography>
          </Stack>
        </RowStack>
      ),
    },
    {
      field: 'fleet',
      headerName: 'Fleet',
      flex: 0.9,
      minWidth: 110,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#6B7280',
          }}
        >
          {params.row.fleet}
        </Typography>
      ),
    },
    {
      field: 'trips',
      headerName: 'Trips',
      flex: 0.5,
      minWidth: 60,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(14),
            color: '#374151',
          }}
        >
          {params.row.trips}
        </Typography>
      ),
    },
    {
      field: 'gross',
      headerName: 'Gross Earned',
      flex: 0.9,
      minWidth: 100,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(14),
            color: '#111827',
          }}
        >
          {params.row.gross}
        </Typography>
      ),
    },
    {
      field: 'commission',
      headerName: 'Commission (20%)',
      flex: 1,
      minWidth: 120,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(14),
            color: '#EF4444',
          }}
        >
          {params.row.commission}
        </Typography>
      ),
    },
    {
      field: 'netPayout',
      headerName: 'Net Payout',
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(14),
            color: '#059669',
          }}
        >
          {params.row.netPayout}
        </Typography>
      ),
    },
    {
      field: 'pending',
      headerName: 'Pending',
      flex: 0.6,
      minWidth: 70,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 700,
            fontSize: pxToRem(14),
            color: params.row.pendingValue > 0 ? '#D97706' : '#D1D5DB',
          }}
        >
          {params.row.pending}
        </Typography>
      ),
    },
    {
      field: 'schedule',
      headerName: 'Schedule',
      flex: 1.2,
      minWidth: 150,
      renderCell: (params) => (
        <Typography
          sx={{
            fontFamily: (theme) => theme.typography.fontFamily,
            fontWeight: 400,
            fontSize: pxToRem(13),
            color: '#6B7280',
          }}
        >
          {params.row.schedule}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      flex: 0.6,
      minWidth: 80,
      renderCell: (params) => (
        <RowStack
          spacing={'5px'}
          sx={{
            padding: '3px 10px',
            borderRadius: '100px',
            background: params.row.status === 'Active' ? '#F0FDF7' : '#FEF2F2',
          }}
        >
          <Box
            sx={{
              width: 5,
              height: 5,
              borderRadius: '2.5px',
              background:
                params.row.status === 'Active' ? '#059669' : '#EF4444',
            }}
          />
          <Typography
            sx={{
              fontFamily: (theme) => theme.typography.fontFamily,
              fontWeight: 600,
              fontSize: pxToRem(11.5),
              color: params.row.status === 'Active' ? '#059669' : '#EF4444',
            }}
          >
            {params.row.status}
          </Typography>
        </RowStack>
      ),
    },
    {
      field: 'actions' as string,
      headerName: '',
      flex: 0.5,
      minWidth: 70,
      sortable: false,
      renderCell: (params) => (
        <RowStack spacing={'4px'}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedDriver(params.row);
              setEarningDetailOpen(true);
            }}
            sx={{
              width: 30,
              height: 30,
              color: '#9CA3AF',
              '&:hover': { color: '#2F6FED', background: '#EBF2FF' },
            }}
          >
            <VisibilityOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              width: 30,
              height: 30,
              color: '#9CA3AF',
              '&:hover': { color: '#6B7280', background: '#F3F4F6' },
            }}
          >
            <ChatOutlinedIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </RowStack>
      ),
    },
  ];

  return (
    <AppDashboardLayout>
      <Stack spacing={'24px'}>
        {/* ── Header ─────────────────────────────────────────────────── */}
        <RowStack justifyContent={'space-between'} alignItems={'flex-start'}>
          <DashboardTitleAndDesc
            title="Driver Payouts"
            desc="Driver payment earnings, commission breakdown, and payout schedules"
          />

          <RowStack spacing={'12px'} sx={{ flexShrink: 0 }}>
            {/* <AppDatePickerPopover
              value={selectedDate}
              onChange={setSelectedDate}
              buttonSx={{
                background: '#FFFFFF',
                border: 'none',
                boxShadow: '0px 1px 3px 0px rgba(0, 0, 0, 0.05)',
              }}
              iconSx={{ color: '#2F6FED' }}
              textSx={{ color: '#2F6FED' }}
            /> */}

            <AppButton
              startIcon={
                <DownloadOutlinedIcon sx={{ fontSize: 15, color: '#FFFFFF' }} />
              }
              sx={{
                height: 40,
                padding: '0 20px',
                background: '#2F6FED',
                borderRadius: '14px',
                boxShadow: '0px 2px 8px 0px rgba(47, 111, 237, 0.25)',
                fontFamily: (theme) => theme.typography.fontFamily,
                fontWeight: 600,
                fontSize: pxToRem(13),
                color: '#FFFFFF',
                textTransform: 'none',
                '&:hover': { background: '#2558C4' },
              }}
            >
              Export
            </AppButton>
          </RowStack>
        </RowStack>

        {/* ── Stat Cards ─────────────────────────────────────────────── */}
        <Grid container spacing={'20px'} alignItems="stretch">
          {isFetchingKpis
            ? Array.from({ length: 5 }).map((_, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, md: 2.4 }}>
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={140}
                    sx={{ borderRadius: '16px' }}
                  />
                </Grid>
              ))
            : statCards.map((card) => (
                <Grid key={card.label} size={{ xs: 12, sm: 6, md: 2.4 }}>
                  <Stack
                    sx={{
                      background: '#FFFFFF',
                      border: '0.67px solid #E8ECF0',
                      borderRadius: '16px',
                      boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.1)',
                      padding: '20px',
                      gap: '14px',
                      height: '100%',
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
                          padding: '3px 10px',
                          borderRadius: '100px',
                          background: card.badgeBg,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 700,
                            fontSize: pxToRem(13),
                            color: card.badgeColor,
                          }}
                        >
                          {card.badge}
                        </Typography>
                      </Box>
                    </RowStack>
                    <Stack spacing={'4px'}>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 700,
                          fontSize: pxToRem(30),
                          lineHeight: '1em',
                          letterSpacing: '-0.0167em',
                          color: '#111827',
                        }}
                      >
                        {card.value}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 500,
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

        {/* ── Middle Section: Schedule + Earnings Breakdown ─────────── */}
        <Grid container spacing={'20px'}>
          {/* Left Column: Payment Schedule (vertical list) */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack
              sx={{
                background: '#FFFFFF',
                border: '0.67px solid #F0F4F8',
                borderRadius: '16px',
                boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
                padding: '24px',
                height: '100%',
              }}
            >
              <RowStack spacing={'8px'} sx={{ mb: '20px' }}>
                <Typography
                  sx={{
                    fontFamily: (theme) => theme.typography.fontFamily,
                    fontWeight: 700,
                    fontSize: pxToRem(16),
                    color: '#111827',
                  }}
                >
                  Payment Schedule
                </Typography>
              </RowStack>

              {isFetchingSchedule ? (
                <Stack spacing={'12px'}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      variant="rectangular"
                      width="100%"
                      height={85}
                      sx={{ borderRadius: '14px' }}
                    />
                  ))}
                </Stack>
              ) : payoutSchedule.length > 0 ? (
                <Stack spacing={'12px'}>
                  {payoutSchedule.map((ps) => (
                    <Stack
                      key={ps.date}
                      spacing={'6px'}
                      sx={{
                        background: ps.cardBg,
                        border: `0.667px solid ${ps.cardBorder}`,
                        borderRadius: '14px',
                        padding: '14px 16px',
                      }}
                    >
                      <RowStack justifyContent={'space-between'}>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 700,
                            fontSize: pxToRem(13.5),
                            color: '#111827',
                          }}
                        >
                          {ps.date}
                        </Typography>
                        <RowStack
                          spacing={'5px'}
                          sx={{
                            padding: '2px 8px',
                            borderRadius: '100px',
                            background: ps.statusBg,
                          }}
                        >
                          <Box
                            sx={{
                              width: 5,
                              height: 5,
                              borderRadius: '2.5px',
                              background: ps.statusDot,
                            }}
                          />
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 600,
                              fontSize: pxToRem(11),
                              color: ps.statusColor,
                            }}
                          >
                            {ps.status}
                          </Typography>
                        </RowStack>
                      </RowStack>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 400,
                          fontSize: pxToRem(11.5),
                          color: '#9CA3AF',
                        }}
                      >
                        {ps.desc}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: (theme) => theme.typography.fontFamily,
                          fontWeight: 700,
                          fontSize: pxToRem(17),
                          color: ps.amountColor,
                        }}
                      >
                        {ps.amount}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              ) : (
                <EmptyState animationSrc="/empty.json" />
              )}
            </Stack>
          </Grid>

          {/* Right Column: Earnings Breakdown + Donut Chart */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack
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
                  fontWeight: 700,
                  fontSize: pxToRem(16),
                  color: '#111827',
                  mb: '16px',
                }}
              >
                Earnings Breakdown
              </Typography>

              {isFetchingBreakdown ? (
                <Stack spacing={'16px'}>
                  {/* 3 Stat Cards Skeleton */}
                  <Grid container spacing={'12px'}>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Grid key={index} size={{ xs: 12, md: 4 }}>
                        <Skeleton
                          variant="rectangular"
                          width="100%"
                          height={100}
                          sx={{ borderRadius: '14px' }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  {/* Chart Skeleton */}
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={300}
                    sx={{ borderRadius: '12px' }}
                  />
                </Stack>
              ) : earningsBreakdown.length > 0 && donutData.length > 0 ? (
                <>
                  {/* 3 Stat Cards Row */}
                  <Grid container spacing={'12px'} sx={{ mb: '24px' }}>
                    {earningsBreakdown.map((eb) => (
                      <Grid key={eb.label} size={{ xs: 12, md: 4 }}>
                        <Stack
                          spacing={'6px'}
                          sx={{
                            background: '#F7F9FB',
                            border: '0.67px solid #F0F4F8',
                            borderRadius: '14px',
                            padding: '14px',
                          }}
                        >
                          <RowStack spacing={'8px'}>
                            <Box
                              sx={{
                                width: 28,
                                height: 28,
                                borderRadius: '8px',
                                background: eb.iconBg,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {eb.icon}
                            </Box>
                            <Typography
                              sx={{
                                fontFamily: (theme) =>
                                  theme.typography.fontFamily,
                                fontWeight: 400,
                                fontSize: pxToRem(11.5),
                                color: '#9CA3AF',
                              }}
                            >
                              {eb.label}
                            </Typography>
                          </RowStack>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 700,
                              fontSize: pxToRem(22),
                              color: '#111827',
                              lineHeight: '1.2em',
                            }}
                          >
                            {eb.value}
                          </Typography>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 400,
                              fontSize: pxToRem(11),
                              color: '#9CA3AF',
                            }}
                          >
                            {eb.desc}
                          </Typography>
                        </Stack>
                      </Grid>
                    ))}
                  </Grid>

                  {/* Monthly Earnings Distribution */}
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 600,
                      fontSize: pxToRem(13),
                      color: '#6B7280',
                      mb: '16px',
                    }}
                  >
                    Monthly Earnings Distribution
                  </Typography>

                  <Stack alignItems={'center'} spacing={'24px'}>
                    {/* Donut Chart */}
                    <Box
                      sx={{
                        position: 'relative',
                        flexShrink: 0,
                      }}
                    >
                      <ResponsiveContainer width={220} height={220}>
                        <PieChart>
                          <Pie
                            data={donutData}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                            strokeWidth={0}
                          >
                            {donutData.map((entry, index) => (
                              <Cell
                                key={index}
                                fill={entry.color}
                                style={{ cursor: 'pointer', outline: 'none' }}
                              />
                            ))}
                          </Pie>
                          <Tooltip
                            content={<CustomPieTooltip />}
                            wrapperStyle={{ outline: 'none' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Center Label */}
                      <Stack
                        alignItems={'center'}
                        justifyContent={'center'}
                        sx={{
                          position: 'absolute',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 700,
                            fontSize: pxToRem(18),
                            color: '#111827',
                          }}
                        >
                          Earnings
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: (theme) => theme.typography.fontFamily,
                            fontWeight: 400,
                            fontSize: pxToRem(12),
                            color: '#9CA3AF',
                          }}
                        >
                          Distribution
                        </Typography>
                      </Stack>
                    </Box>

                    {/* Legend - Horizontal Row */}
                    <RowStack
                      spacing={'24px'}
                      justifyContent={'space-between'}
                      flexWrap={'wrap'}
                      width={'100%'}
                      sx={{
                        padding: '42px',
                      }}
                    >
                      {donutData.map((d) => (
                        <Stack
                          key={d.name}
                          alignItems={'center'}
                          spacing={'4px'}
                        >
                          <RowStack spacing={'6px'}>
                            <Box
                              sx={{
                                width: 10,
                                height: 10,
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
                                fontSize: pxToRem(12),
                                color: '#6B7280',
                              }}
                            >
                              {d.name}
                            </Typography>
                          </RowStack>
                          <Typography
                            sx={{
                              fontFamily: (theme) =>
                                theme.typography.fontFamily,
                              fontWeight: 700,
                              fontSize: pxToRem(16),
                              color: '#111827',
                            }}
                          >
                            {d.value}%
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
                            {d.amount}
                          </Typography>
                        </Stack>
                      ))}
                    </RowStack>
                  </Stack>
                </>
              ) : (
                <EmptyState animationSrc="/empty.json" />
              )}
            </Stack>
          </Grid>
        </Grid>

        {/* ── Table ──────────────────────────────────────────────────── */}
        {isFetchingDrivers ? (
          <Stack spacing={'12px'}>
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                width="100%"
                height={60}
                sx={{ borderRadius: '12px' }}
              />
            ))}
          </Stack>
        ) : (
          <AppGridtable
            columns={columns}
            data={filteredDrivers}
            initialPageSize={7}
            disableRowClick
            emptyState={<EmptyState animationSrc="/empty.json" />}
            sx={{ height: 'auto', width: '100%' }}
          >
            <Stack spacing={'12px'} width={'100%'}>
              <RowStack justifyContent={'space-between'}>
                <Stack spacing={'2px'}>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 700,
                      fontSize: pxToRem(16),
                      color: '#111827',
                    }}
                  >
                    Driver Earnings Detail
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: (theme) => theme.typography.fontFamily,
                      fontWeight: 400,
                      fontSize: pxToRem(11.5),
                      color: '#9CA3AF',
                    }}
                  >
                    Per-driver breakdown for March 2026
                  </Typography>
                </Stack>

                <RowStack spacing={'8px'}>
                  <AppSearchField
                    name="search"
                    placeholder="Search by name, fleet or ID…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    boxProps={{ sx: { width: '280px' } }}
                  />
                  <AppFilterPopover
                    sections={filterSections}
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onReset={handleFilterReset}
                  />
                </RowStack>
              </RowStack>
            </Stack>
          </AppGridtable>
        )}
      </Stack>

      {/* Earning Detail Modal */}
      <EarningDetailModal
        open={earningDetailOpen}
        onClose={() => {
          setEarningDetailOpen(false);
          setSelectedDriver(null);
        }}
        variant="driver"
        data={
          selectedDriver
            ? {
                name: selectedDriver.name,
                initials: selectedDriver.initials,
                avatarBg: selectedDriver.avatarBg,
                id: selectedDriver.driverId,
                org: selectedDriver.fleet,
                date: 'Mar 3, 2026',
                status: selectedDriver.status,
                netPayout: selectedDriver.netPayout,
                grossAmount: selectedDriver.gross,
                commissionAmount: selectedDriver.commission,
                pendingAmount: selectedDriver.pending,
                trips: selectedDriver.trips,
                earningsSplit: 80,
                schedule: selectedDriver.schedule,
                payoutMethod: 'Direct Deposit',
                bankAccount: '••••4821',
              }
            : null
        }
      />
    </AppDashboardLayout>
  );
};
